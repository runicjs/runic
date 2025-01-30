import { Draft, produce } from 'immer';
import { ListenerFn, Store, UnsubscribeFn } from './types';

export default function createStore<State>(initialState: State): Store<State> {
  let state = initialState;

  // I did some minor benchmarking and arrays beat sets by a slim margin.
  //   Set x 177,651 ops/sec
  // Array x 190,497 ops/sec
  const listeners: Array<ListenerFn<State>> = [];

  // Return the current state.
  const getState = () => state;

  // Return the initial state.
  const getInitialState = () => initialState;

  // Merges the given state with the current state.
  // TODO: Consider making this a deep merge. Needs a recursive partial type.
  const setPartialState = (partialState: Partial<State>) => setState({ ...state, ...partialState });

  // Lets you update the state using an immutable data structure.
  const update = (fn: (draft: Draft<State>) => void) => setState(produce(state, fn));

  // Change the state back to the initial state.
  const reset = () => setState(initialState);

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
    const listener = (state: State) => fn(state);
    listeners.push(listener);
    return () => listeners.splice(listeners.indexOf(listener), 1);
  };

  return {
    getState,
    getInitialState,
    setState,
    setPartialState,
    update,
    reset,
    subscribe,
  };
}
