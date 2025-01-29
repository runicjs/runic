import { Draft, produce } from 'immer';
import { Store } from './types';

export default function createStore<State>(initialState: State): Store<State> {
  let state = initialState;
  const listeners = new Set<(state: State) => void>();

  const getState = () => state;
  const getInitialState = () => initialState;

  // TODO: Consider making this a deep merge. Needs a recursive partial type.
  const setPartialState = (partialState: Partial<State>) => setState({ ...state, ...partialState });

  // TODO: It would be nice if this function could be configured so you could
  // use a different library than immer, or a different update strategy altogether.
  const update = (fn: (draft: Draft<State>) => void) => setState(produce(state, fn));
  const reset = () => setState(initialState);

  const setState = (nextState: State) => {
    state = nextState;
    notify();
  };

  const subscribe = (fn: (state: State) => unknown): (() => void) => {
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
