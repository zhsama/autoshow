#!/usr/bin/env python3
"""
WhisperX FastAPI Server
Provides HTTP API for WhisperX transcription with speaker diarization
"""

import os
import tempfile
import json
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any

import whisperx
import torch
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="WhisperX Transcription API",
    description="Local WhisperX transcription service with speaker diarization",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model cache
model_cache: Dict[str, Any] = {}
align_model_cache: Dict[str, Any] = {}
diarize_model = None

# Device configuration
device = "cuda" if torch.cuda.is_available() else "cpu"
compute_type = "float16" if device == "cuda" else "int8"

logger.info(f"Using device: {device} with compute_type: {compute_type}")

def get_model(model_name: str):
    """Load and cache WhisperX model"""
    if model_name not in model_cache:
        logger.info(f"Loading WhisperX model: {model_name}")
        model_cache[model_name] = whisperx.load_model(
            model_name, 
            device, 
            compute_type=compute_type
        )
    return model_cache[model_name]

def get_align_model(language_code: str):
    """Load and cache alignment model"""
    if language_code not in align_model_cache:
        logger.info(f"Loading alignment model for language: {language_code}")
        model_a, metadata = whisperx.load_align_model(
            language_code=language_code, 
            device=device
        )
        align_model_cache[language_code] = (model_a, metadata)
    return align_model_cache[language_code]

def get_diarize_model():
    """Load and cache diarization model"""
    global diarize_model
    if diarize_model is None:
        logger.info("Loading diarization model")
        diarize_model = whisperx.DiarizationPipeline(
            use_auth_token=None, 
            device=device
        )
    return diarize_model

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "device": device,
        "compute_type": compute_type,
        "cuda_available": torch.cuda.is_available(),
        "gpu_count": torch.cuda.device_count() if torch.cuda.is_available() else 0
    }

@app.get("/models")
async def list_models():
    """List available WhisperX models"""
    return {
        "available_models": [
            "large-v3", "large-v2", "large", 
            "medium", "small", "base", "tiny"
        ],
        "loaded_models": list(model_cache.keys()),
        "device": device
    }

@app.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    model: str = Form("large-v3"),
    language: Optional[str] = Form("en"),
    diarize: bool = Form(True),
    align: bool = Form(True),
    batch_size: int = Form(16),
    min_speakers: Optional[int] = Form(1),
    max_speakers: Optional[int] = Form(10)
):
    """
    Transcribe audio file with optional speaker diarization
    """
    try:
        # Validate model
        available_models = ["large-v3", "large-v2", "large", "medium", "small", "base", "tiny"]
        if model not in available_models:
            raise HTTPException(
                status_code=400, 
                detail=f"Model {model} not supported. Available: {available_models}"
            )
        
        # Save uploaded file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            logger.info(f"Transcribing {file.filename} with model {model}")
            
            # Load model
            whisper_model = get_model(model)
            
            # Transcribe
            result = whisper_model.transcribe(
                tmp_file_path, 
                batch_size=batch_size,
                language=language
            )
            
            logger.info(f"Initial transcription complete, {len(result['segments'])} segments")
            
            # Align whisper output if requested
            if align and result.get("language"):
                try:
                    model_a, metadata = get_align_model(result["language"])
                    result = whisperx.align(
                        result["segments"], 
                        model_a, 
                        metadata, 
                        tmp_file_path, 
                        device
                    )
                    logger.info("Alignment complete")
                except Exception as e:
                    logger.warning(f"Alignment failed: {e}")
            
            # Speaker diarization if requested
            if diarize:
                try:
                    diarize_model = get_diarize_model()
                    diarize_segments = diarize_model(
                        tmp_file_path,
                        min_speakers=min_speakers,
                        max_speakers=max_speakers
                    )
                    result = whisperx.assign_word_speakers(diarize_segments, result)
                    logger.info("Diarization complete")
                except Exception as e:
                    logger.warning(f"Diarization failed: {e}")
            
            # Format response
            response = {
                "segments": result.get("segments", []),
                "language": result.get("language", language),
                "model_used": model,
                "device": device,
                "diarization_enabled": diarize,
                "alignment_enabled": align,
                "word_segments": result.get("word_segments", [])
            }
            
            return response
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(tmp_file_path)
            except Exception as e:
                logger.warning(f"Failed to cleanup temp file: {e}")
                
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe-batch")
async def transcribe_batch(
    files: List[UploadFile] = File(...),
    model: str = Form("large-v3"),
    language: Optional[str] = Form("en"),
    diarize: bool = Form(True)
):
    """
    Transcribe multiple audio files
    """
    results = []
    
    for file in files:
        try:
            # Process each file individually
            result = await transcribe_audio(
                file=file,
                model=model,
                language=language,
                diarize=diarize
            )
            results.append({
                "filename": file.filename,
                "success": True,
                "result": result
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {"results": results}

if __name__ == "__main__":
    uvicorn.run(
        "whisperx_server:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )