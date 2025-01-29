import { Draft } from 'immer';

export type Store<State> = {
  getState: () => State;
  getInitialState: () => State;
  setState: (nextState: State) => void;
  // TODO: How can I make this configurable so you can use
  // immer, mutative, something else, or nothing at all?
  update: (fn: (draft: Draft<State>) => void) => void;
  reset: () => void;
  subscribe: (fn: (state: State) => unknown) => void;
  equalityFn?: EqualityFn<unknown>;
};

export type EqualityFn<T> = (a: T, b: T) => boolean;
