import { RunicRune } from '../types';

/**
 * Change the state back to the initial state.
 * @param store - The store to reset.
 */
export default function reset<State>(rune: RunicRune<State>) {
  rune.set(rune.initial());
}
