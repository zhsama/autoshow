'use client'

const l = console.log
const err = console.error

interface WalletStepProps {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  setError: (value: string | null) => void
  walletAddress: string
  setWalletAddress: (value: string) => void
  mnemonic: string
  setMnemonic: (value: string) => void
  dashBalance: number | null
  setDashBalance: (value: number | null) => void
  setCurrentStep: (value: number) => void
}

export const WalletStep = (props: WalletStepProps) => {
  const handleCheckBalance = async (): Promise<void> => {
    l(`[WalletStep] Checking balance for wallet: ${props.walletAddress}`)
    props.setIsLoading(true)
    props.setError(null)
    try {
      if (!props.walletAddress || !props.mnemonic) throw new Error('Please enter wallet address and mnemonic')
      const balanceRes = await fetch('http://localhost:4321/api/dash-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mnemonic: props.mnemonic, walletAddress: props.walletAddress })
      })
      if (!balanceRes.ok) {
        err(`[WalletStep] Error checking balance: ${balanceRes.statusText}`)
        throw new Error('Error getting balance')
      }
      const data = await balanceRes.json()
      l(`[WalletStep] Successfully retrieved balance: ${data.balance} duff`)
      props.setDashBalance(data.balance)
    } catch (error) {
      err(`[WalletStep] Error in handleCheckBalance:`, error)
      if (error instanceof Error) props.setError(error.message)
      else props.setError('An unknown error occurred.')
    } finally {
      props.setIsLoading(false)
    }
  }
  l('[WalletStep] Rendering wallet step component')
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="walletAddress" className="block text-sm font-medium text-foreground">Wallet Address</label>
        <input 
          type="text" 
          id="walletAddress" 
          value={props.walletAddress} 
          onChange={e => props.setWalletAddress(e.target.value)} 
          className="form__input w-full py-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="mnemonic" className="block text-sm font-medium text-foreground">Mnemonic</label>
        <input 
          type="text" 
          id="mnemonic" 
          value={props.mnemonic} 
          onChange={e => props.setMnemonic(e.target.value)} 
          className="form__input w-full py-2"
        />
      </div>
      <div className="flex gap-4">
        <button 
          disabled={props.isLoading} 
          onClick={handleCheckBalance}
          className="button button--primary"
        >
          {props.isLoading ? 'Checking...' : 'Check Balance'}
        </button>
        <button 
          onClick={() => props.setCurrentStep(1)}
          className="button button--secondary"
        >
          Next Step
        </button>
      </div>
      {props.dashBalance !== null && (
        <div className="bg-base-800 p-4 rounded-md mt-4">
          <p className="text-primary-300">Balance: {props.dashBalance} duff</p>
          <p className="text-primary-300">Credits: {(props.dashBalance / 500).toFixed(0)}</p>
        </div>
      )}
    </div>
  )
}