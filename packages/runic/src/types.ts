export type ListenerFn<State> = (state: State) => void;
export type UnsubscribeFn = () => void;

export type Store<State> = {
  getState: () => State;
  getInitialState: () => State;
  setState: (nextState: State) => void;
  subscribe: (fn: ListenerFn<State>) => UnsubscribeFn;
  destroy: () => void;
};

export type Selector<State, Value> = (state: State) => Value;

export type Stores<T extends unknown[]> = { [K in keyof T]: Store<T[K]> };

export type EqualityFn<T> = (a: T, b: T) => boolean;
