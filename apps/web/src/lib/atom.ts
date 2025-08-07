import type { Atom } from 'jotai'
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'

export const createAtomSelector = <T>(atom: Atom<T>) => {
  const useAtomSelector = <R>(selector: (a: T) => R) => {
    return useAtomValue(selectAtom(atom, selector))
  }

  useAtomSelector.__atom = atom
  return useAtomSelector
}
