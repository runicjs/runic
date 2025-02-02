import { RunicListener, RunicRune } from '../types';

/**
 * Subscribe to a rune and unsubscribe after the first update.
 *
 * TODO: Test this.
 *
 * @param rune - The rune to subscribe to.
 * @param fn - The listener to call when the rune updates.
 *
 * Example:
 *
 * const rune = createRune({ x: 0, y: 1, z: 2 });
 * once(rune, (state, lastState) => {
 *   console.log(state);
 * });
 *
 * rune.set({ x: 1, y: 2, z: 3 }); // => { x: 1, y: 2, z: 3 }
 * rune.set({ x: 4, y: 5, z: 6 }); // => nothing
 */
export default function once<State>(rune: RunicRune<State>, fn: RunicListener<State>): void {
  const unsubscribe = rune.subscribe((...args) => {
    fn(...args);
    unsubscribe();
  });
}
