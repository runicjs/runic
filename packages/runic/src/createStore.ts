import { ListenerFn, Store, UnsubscribeFn } from './types';

export default function createStore<State>(initialState: State): Store<State> {
  let state = initialState;

  // I did some minor benchmarking and arrays beat sets by a slim margin.
  //   Set x 177,651 ops/sec
  // Array x 190,497 ops/sec
  let listeners: Array<{ id: object; fn: ListenerFn<State> }> = [];

  // Return the current state.
  const getState = () => state;

  // Return the initial state.
  const getInitialState = () => initialState;

  // Replace the entire state and notify listeners.
  const setState = (nextState: State) => {
    state = nextState;
    for (const listener of listeners) {
      listener.fn(state);
    }
  };

  // Subscribe for updates to the state.
  const subscribe = (fn: ListenerFn<State>): UnsubscribeFn => {
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

    // TODO: Maybe there's a better way?
    const id = {};
    const listener = { id, fn };
    listeners.push(listener);

    return () => {
      const index = listeners.findIndex((l) => l.id === id);
      if (index === -1) return;
      listeners.splice(index, 1);
    };
  };

  // Clean up the store if it's no longer needed.
  const destroy = () => {
    listeners = [];
  };

  return {
    getState,
    getInitialState,
    setState,
    subscribe,
    destroy,
  };
}
