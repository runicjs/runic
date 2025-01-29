import { Draft, produce } from 'immer';
import { ListenerFn, Store, UnsubscribeFn } from './types';

export default function createStore<State>(initialState: State): Store<State> {
  let state = initialState;
  // TODO: Is this performant enough?
  const listeners = new Set<(state: State) => void>();

  // Return the current state.
  const getState = () => state;

  // Return the initial state.
  const getInitialState = () => initialState;

  // Merges the given state with the current state.
  // TODO: Consider making this a deep merge. Needs a recursive partial type.
  const setPartialState = (partialState: Partial<State>) => setState({ ...state, ...partialState });

  // Lets you update the state using an immutable data structure.
  // TODO: It would be nice if this function could be configured so you could
  // use a different library than immer, or a different update strategy altogether.
  const update = (fn: (draft: Draft<State>) => void) => setState(produce(state, fn));

  // Change the state back to the initial state.
  const reset = () => setState(initialState);

  const setState = (nextState: State) => {
    state = nextState;
    notify();
  };

  const subscribe = (fn: ListenerFn<State>): UnsubscribeFn => {
    // This gives a unique identity to the given function. If the same
    // function is subscribed multiple times, this makes sure that we
    // don't unsubscribe all of them at once.
    const listener = (state: State) => fn(state);
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const notify = () => {
    for (const listener of listeners) {
      listener(state);
    }
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
