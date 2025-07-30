'use client'

import { useWalletStep } from '@/hooks/use-form-steps'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'

export function WalletStep() {
  const {
    walletAddress,
    mnemonic,
    dashBalance,
    isLoading,
    setWalletAddress,
    setMnemonic,
    setDashBalance,
    setIsLoading,
    setError,
    setCurrentStep,
  } = useWalletStep()
  
  const handleGetBalance = async () => {
    logger.log('[WalletStep] Getting Dash balance')
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/dash-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, mnemonic }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get balance')
      }
      
      const data = await response.json()
      setDashBalance(data.balance)
      logger.log('[WalletStep] Balance received:', data.balance)
    } catch (error) {
      logger.error('[WalletStep] Error getting balance:', error)
      setError(error instanceof Error ? error.message : 'Failed to get balance')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleNext = () => {
    if (dashBalance !== null) {
      setCurrentStep(1)
    }
  }
  
  return (
    <>
      <CardHeader>
        <CardTitle>Wallet Configuration</CardTitle>
        <CardDescription>
          Connect your Dash wallet to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wallet-address">Wallet Address</Label>
          <Input
            id="wallet-address"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your wallet address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
          <Textarea
            id="mnemonic"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            rows={3}
            placeholder="Enter your mnemonic phrase"
          />
        </div>
        
        {dashBalance !== null && (
          <div className="p-4 bg-secondary/20 rounded-md">
            <p className="text-sm font-medium">
              Balance: <span className="text-lg">{dashBalance} DASH</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleGetBalance}
          disabled={isLoading || !walletAddress || !mnemonic}
        >
          {isLoading ? 'Loading...' : 'Get Balance'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={dashBalance === null}
        >
          Next
        </Button>
      </CardFooter>
    </>
  )
}