#!/bin/bash

# AutoShow Local AI Setup Script
# This script helps set up and manage local AI services for AutoShow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Python
    if ! command_exists python3; then
        log_error "Python 3 is required but not installed"
        exit 1
    fi
    
    # Check pip
    if ! command_exists pip || ! command_exists pip3; then
        log_error "pip is required but not installed"
        exit 1
    fi
    
    # Check FFmpeg
    if ! command_exists ffmpeg; then
        log_warning "FFmpeg not found. Installing..."
        if command_exists brew; then
            brew install ffmpeg
        elif command_exists apt; then
            sudo apt update && sudo apt install -y ffmpeg
        elif command_exists yum; then
            sudo yum install -y ffmpeg
        else
            log_error "Please install FFmpeg manually"
            exit 1
        fi
    fi
    
    # Check Docker (optional)
    if command_exists docker; then
        log_success "Docker found"
    else
        log_warning "Docker not found. Local installation will be used."
    fi
    
    log_success "System requirements check completed"
}

# Install WhisperX
install_whisperx() {
    log_info "Installing WhisperX..."
    
    # Check if already installed
    if python3 -c "import whisperx" 2>/dev/null; then
        log_success "WhisperX already installed"
        return
    fi
    
    # Install PyTorch first (with CUDA support if available)
    if command_exists nvidia-smi; then
        log_info "NVIDIA GPU detected, installing PyTorch with CUDA support..."
        pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    else
        log_info "No NVIDIA GPU detected, installing CPU-only PyTorch..."
        pip3 install torch torchvision torchaudio
    fi
    
    # Install WhisperX
    pip3 install whisperx
    
    log_success "WhisperX installed successfully"
}

# Install Ollama
install_ollama() {
    log_info "Installing Ollama..."
    
    if command_exists ollama; then
        log_success "Ollama already installed"
        return
    fi
    
    # Install based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install ollama
        else
            curl -fsSL https://ollama.ai/install.sh | sh
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        log_error "Unsupported OS. Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
    
    log_success "Ollama installed successfully"
}

# Start Ollama service
start_ollama() {
    log_info "Starting Ollama service..."
    
    if pgrep -f "ollama serve" > /dev/null; then
        log_success "Ollama is already running"
        return
    fi
    
    # Start Ollama in background
    ollama serve &
    
    # Wait for service to start
    sleep 5
    
    # Check if service is running
    if curl -s http://localhost:11434/api/tags > /dev/null; then
        log_success "Ollama service started successfully"
    else
        log_error "Failed to start Ollama service"
        exit 1
    fi
}

# Pull recommended Ollama models
pull_ollama_models() {
    log_info "Pulling recommended Ollama models..."
    
    # Check available RAM to determine model size
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        total_ram=$(sysctl -n hw.memsize)
        ram_gb=$((total_ram / 1024 / 1024 / 1024))
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        ram_gb=$(free -g | awk '/^Mem:/{print $2}')
    else
        ram_gb=8  # Default assumption
    fi
    
    log_info "Detected ${ram_gb}GB RAM"
    
    # Pull models based on available RAM
    if [ "$ram_gb" -ge 32 ]; then
        log_info "Pulling large models for high-RAM system..."
        ollama pull llama3.3:70b
        ollama pull qwen2.5:32b
    elif [ "$ram_gb" -ge 16 ]; then
        log_info "Pulling medium models for 16GB+ RAM system..."
        ollama pull qwen2.5:14b
        ollama pull mistral:7b
    else
        log_info "Pulling small models for 8GB RAM system..."
        ollama pull llama3.2:3b
        ollama pull qwen2.5:7b
    fi
    
    # Always pull a small fast model
    ollama pull gemma2:2b
    
    log_success "Ollama models pulled successfully"
}

# Test WhisperX installation
test_whisperx() {
    log_info "Testing WhisperX installation..."
    
    python3 -c "
import whisperx
import torch
print(f'WhisperX version: {whisperx.__version__ if hasattr(whisperx, \"__version__\") else \"unknown\"}')
print(f'PyTorch version: {torch.__version__}')
print(f'CUDA available: {torch.cuda.is_available()}')
if torch.cuda.is_available():
    print(f'CUDA devices: {torch.cuda.device_count()}')
"
    
    log_success "WhisperX test completed"
}

# Test Ollama installation
test_ollama() {
    log_info "Testing Ollama installation..."
    
    # Check if service is running
    if ! curl -s http://localhost:11434/api/tags > /dev/null; then
        log_error "Ollama service is not running"
        return 1
    fi
    
    # List available models
    models=$(curl -s http://localhost:11434/api/tags | python3 -c "
import json, sys
data = json.load(sys.stdin)
models = [model['name'] for model in data.get('models', [])]
print('Available models:', ', '.join(models) if models else 'None')
")
    
    log_info "$models"
    log_success "Ollama test completed"
}

# Start Docker services
start_docker() {
    log_info "Starting Docker services..."
    
    if ! command_exists docker; then
        log_error "Docker not found. Please install Docker first."
        return 1
    fi
    
    if ! command_exists docker-compose; then
        log_error "Docker Compose not found. Please install Docker Compose first."
        return 1
    fi
    
    # Start services
    docker-compose -f docker-compose.local-ai.yml up -d
    
    log_success "Docker services started"
}

# Stop Docker services
stop_docker() {
    log_info "Stopping Docker services..."
    
    if [ -f "docker-compose.local-ai.yml" ]; then
        docker-compose -f docker-compose.local-ai.yml down
        log_success "Docker services stopped"
    else
        log_warning "Docker compose file not found"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "=== AutoShow Local AI Setup ==="
    echo "1. Install all dependencies"
    echo "2. Install WhisperX only"
    echo "3. Install Ollama only"
    echo "4. Start services"
    echo "5. Test installations"
    echo "6. Pull Ollama models"
    echo "7. Start Docker services"
    echo "8. Stop Docker services"
    echo "9. Show status"
    echo "0. Exit"
    echo ""
}

# Show current status
show_status() {
    log_info "=== Current Status ==="
    
    # WhisperX status
    if python3 -c "import whisperx" 2>/dev/null; then
        echo -e "WhisperX: ${GREEN}Installed${NC}"
    else
        echo -e "WhisperX: ${RED}Not installed${NC}"
    fi
    
    # Ollama status
    if command_exists ollama; then
        echo -e "Ollama: ${GREEN}Installed${NC}"
        if pgrep -f "ollama serve" > /dev/null; then
            echo -e "Ollama Service: ${GREEN}Running${NC}"
        else
            echo -e "Ollama Service: ${RED}Not running${NC}"
        fi
    else
        echo -e "Ollama: ${RED}Not installed${NC}"
    fi
    
    # Docker status
    if command_exists docker; then
        echo -e "Docker: ${GREEN}Available${NC}"
    else
        echo -e "Docker: ${YELLOW}Not available${NC}"
    fi
    
    echo ""
}

# Main script
main() {
    log_info "AutoShow Local AI Setup Script"
    
    while true; do
        show_status
        show_menu
        read -p "Select an option: " choice
        
        case $choice in
            1)
                check_requirements
                install_whisperx
                install_ollama
                start_ollama
                pull_ollama_models
                ;;
            2)
                check_requirements
                install_whisperx
                ;;
            3)
                install_ollama
                ;;
            4)
                start_ollama
                ;;
            5)
                test_whisperx
                test_ollama
                ;;
            6)
                pull_ollama_models
                ;;
            7)
                start_docker
                ;;
            8)
                stop_docker
                ;;
            9)
                show_status
                ;;
            0)
                log_info "Goodbye!"
                exit 0
                ;;
            *)
                log_error "Invalid option. Please try again."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main "$@"