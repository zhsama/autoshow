import { useAtom } from 'jotai'
import { walletAddressAtom, mnemonicAtom, dashBalanceAtom } from '../wallet'
import { isLoadingAtom, errorAtom, currentStepAtom } from '../ui'

export function useWalletStep() {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom)
  const [mnemonic, setMnemonic] = useAtom(mnemonicAtom)
  const [dashBalance, setDashBalance] = useAtom(dashBalanceAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const [error, setError] = useAtom(errorAtom)
  const [, setCurrentStep] = useAtom(currentStepAtom)

  return {
    walletAddress,
    mnemonic,
    dashBalance,
    isLoading,
    error,
    setWalletAddress,
    setMnemonic,
    setDashBalance,
    setIsLoading,
    setError,
    setCurrentStep,
  }
}
