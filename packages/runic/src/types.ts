export type ListenerFn<State> = (state: State) => void;
export type UnsubscribeFn = () => void;

export type Store<State> = {
  getState: () => State;
  getInitialState: () => State;
  setState: (nextState: State) => void;
  subscribe: (fn: ListenerFn<State>) => UnsubscribeFn;
};

export type EqualityFn<T> = (a: T, b: T) => boolean;
