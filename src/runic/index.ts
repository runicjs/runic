import { Draft, produce } from 'immer';

export type Store<State> = {
  getState: () => State;
  getInitialState: () => State;
  setState: (fn: (draft: Draft<State>) => void) => void;
  reset: () => void;
  subscribe: (fn: (state: State) => unknown) => void;
  equalityFn?: EqualityFn<unknown>;
};

export type EqualityFn<T> = (a: T, b: T) => boolean;

export const createStore = <T>(initialState: T): Store<T> => {
  let state = initialState;
  const listeners = new Set<(state: T) => void>();

  const getState = () => state;
  const getInitialState = () => initialState;

  const setState = (fn: (draft: Draft<T>) => void) => {
    state = produce(state, fn);
    notify();
  };

  const reset = () => {
    state = initialState;
    notify();
  };

  const subscribe = (fn: (state: T) => unknown): (() => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
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
    reset,
    subscribe,
  };
};
