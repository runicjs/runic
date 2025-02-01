import { RunicListener, RunicRune, RunicUnsubscribe } from './types';

export default function rune<State>(initialState: State): RunicRune<State> {
  type Self = RunicRune<State>;
  type Listener = { id: object; fn: RunicListener<State> };

  let lastState: State = initialState;
  let state: State = initialState;

  // Arrays beat sets by a slim margin.
  // Set   x 177,651 ops/sec
  // Array x 190,497 ops/sec
  let listeners: Array<Listener> = [];

  const get: Self['get'] = () => state;
  const last: Self['last'] = () => lastState;
  const initial: Self['initial'] = () => initialState;

  // Replace the entire state and notify listeners.
  const set: Self['set'] = (next: State) => {
    lastState = state;
    state = next;

    // forEach is significantly faster than for-of at 10,000 listeners,
    // but evens out around 100,000 listeners. 10,000 listeners should be
    // plenty for most use cases.

    // 10,000 listeners:
    // for of  x 126,030 ops/sec ±0.45% (96 runs sampled)
    // forEach x 175,745 ops/sec ±9.31% (96 runs sampled)

    // 100,000 listeners:
    // for of  x 8,823 ops/sec ±0.52% (92 runs sampled)
    // forEach x 7,277 ops/sec ±13.65% (89 runs sampled)
    listeners.forEach((listener) => listener.fn(state, lastState));
  };

  // Subscribe for updates to the state.
  const subscribe: Self['subscribe'] = (fn: RunicListener<State>): RunicUnsubscribe => {
    // First things first, let's give the listener the current state.
    fn(state, lastState);

    // Object IDs beat Symbols and wrapper functions in speed until
    // you reach over 1,000 listeners, then it's about even. This
    // implementation should be fast enough for most use cases.
    // Each benchmark creates N listeners, emits them all 10 times,
    // and then unsubscribes them.

    // 100 listeners:
    // Array + Wrapper   x 30,400 ops/sec ±0.60% (93 runs sampled)
    // Array + Symbol ID x 89,852 ops/sec ±1.03% (92 runs sampled)
    // Array + Object ID x 98,569 ops/sec ±0.85% (91 runs sampled)

    // 1,000 listeners:
    // Array + Wrapper   x 2,596 ops/sec ±0.52% (96 runs sampled)
    // Array + Symbol ID x 2,826 ops/sec ±0.52% (93 runs sampled)
    // Array + Object ID x 2,741 ops/sec ±0.44% (96 runs sampled)

    // 10,000 listeners:
    // Array + Wrapper   x 22.74 ops/sec ±0.40% (42 runs sampled)
    // Array + Symbol ID x 16.02 ops/sec ±0.97% (44 runs sampled)
    // Array + Object ID x 15.17 ops/sec ±1.29% (29 runs sampled)

    // TODO: Maybe there's an even faster way to do listeners?
    const id = {};
    listeners.push({ id, fn });

    return () => {
      const index = listeners.findIndex((l) => l.id === id);
      if (index === -1) return;
      listeners.splice(index, 1);
    };
  };

  // Clean up the store if it's no longer needed.
  // TODO: Is this function really necessary?
  const destroy: Self['destroy'] = () => {
    listeners = [];
  };

  return {
    get,
    last,
    initial,
    set,
    subscribe,
    destroy,
  };
}
