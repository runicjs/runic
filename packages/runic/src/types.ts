import { Draft } from 'immer';

export type Store<State> = {
  // Getters
  getState: () => State;
  getInitialState: () => State;

  // Setters
  setState: (nextState: State) => void;
  setPartialState: (partialState: Partial<State>) => void;
  update: (fn: (draft: Draft<State>) => void) => void;
  reset: () => void;

  // Subscriptions
  subscribe: (fn: (state: State) => unknown) => void;
};

export type EqualityFn<T> = (a: T, b: T) => boolean;
