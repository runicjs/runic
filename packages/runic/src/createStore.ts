import { Draft, produce } from 'immer';
import { Store } from './types';

export default function createStore<T>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();

  const getState = () => state;
  const getInitialState = () => initialState;
  const update = (fn: (draft: Draft<T>) => void) => setState(produce(state, fn));
  const reset = () => setState(initialState);

  const setState = (nextState: T) => {
    state = nextState;
    notify();
  };

  const subscribe = (fn: (state: T) => unknown): (() => void) => {
    // This gives a unique identity to the given function. If the same
    // function is subscribed multiple times, this makes sure that we
    // don't unsubscribe all of them at once.
    const listener = (state: T) => fn(state);
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
    update,
    reset,
    subscribe,
  };
}
