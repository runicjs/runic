import { Store } from '../types';

/**
 * Change the state back to the initial state.
 * @param store - The store to reset.
 */
export default function resetState<State>(store: Store<State>) {
  store.setState(store.getInitialState());
}
