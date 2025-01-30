import { ListenerFn, Store, UnsubscribeFn } from './types';

export default function createStore<State>(initialState: State): Store<State> {
  let state = initialState;

  // I did some minor benchmarking and arrays beat sets by a slim margin.
  //   Set x 177,651 ops/sec
  // Array x 190,497 ops/sec
  let listeners: Array<ListenerFn<State>> = [];

  // Return the current state.
  const getState = () => state;

  // Return the initial state.
  const getInitialState = () => initialState;

  // Replace the entire state and notify listeners.
  const setState = (nextState: State) => {
    state = nextState;
    for (const listener of listeners) {
      listener(state);
    }
  };

  // Subscribe for updates to the state.
  const subscribe = (fn: ListenerFn<State>): UnsubscribeFn => {
    // This gives a unique identity to the given function. If the same
    // function is subscribed multiple times, this makes sure that we
    // don't unsubscribe all of them at once.
    // TODO: Maybe this could be slightly faster with:
    // listener = { id: Symbol(), callback: fn }
    // so we don't incur the cost of a second function call on every change.
    const listener = (state: State) => fn(state);
    listeners.push(listener);
    return () => listeners.splice(listeners.indexOf(listener), 1);
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
