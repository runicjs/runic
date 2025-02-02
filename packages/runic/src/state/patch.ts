import mergeDeep from 'lodash/merge';
import { RunicRune } from '../types';

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T | undefined;

const defaultMergeFn = <State>(a: State, b: DeepPartial<State>) => mergeDeep({}, a, b);

/**
 * Merge the given state with the current state.
 *
 * @param rune - The store to merge the state into.
 * @param partialState - The state to merge into the store.
 * @param mergeFn - The function to use to merge the state.
 */
export default function patch<State>(
  rune: RunicRune<State>,
  partialState: DeepPartial<State>,
  mergeFn: (a: State, b: DeepPartial<State>) => State = defaultMergeFn,
) {
  rune.set(mergeFn(rune.get(), partialState));
}
