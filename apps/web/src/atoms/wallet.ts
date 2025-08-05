import { atom } from 'jotai'

// 钱包相关atoms
export const walletAddressAtom = atom('yhGfbjKDuTnJyx8wzje7n9wsoWC51WH7Y5')
export const mnemonicAtom = atom(
  'tip punch promote click scheme guitar skirt lucky hamster clip denial ecology'
)
export const dashBalanceAtom = atom<number | null>(null)
