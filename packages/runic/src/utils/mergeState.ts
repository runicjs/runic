import merge from 'lodash/merge';
import { Store } from '../types';

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T | undefined;

/**
 * Merge the given state with the current state.
 * @param store - The store to merge the state into.
 * @param partialState - The state to merge into the store.
 * @param mergeFn - The function to use to merge the state.
 */
export default function mergeState<State>(
  store: Store<State>,
  partialState: DeepPartial<State>,
  mergeFn: (a: State, b: DeepPartial<State>) => State = merge,
) {
  store.setState(mergeFn(store.getState(), partialState));
}
