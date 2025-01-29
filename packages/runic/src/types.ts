import { Draft } from 'immer';

export type Store<State> = {
  getState: () => State;
  getInitialState: () => State;
  setState: (nextState: State) => void;
  update: (fn: (draft: Draft<State>) => void) => void;
  reset: () => void;
  subscribe: (fn: (state: State) => unknown) => void;
};

export type EqualityFn<T> = (a: T, b: T) => boolean;
