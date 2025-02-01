export type RunicListener<State> = (state: State, lastState: State) => void;
export type RunicUnsubscribe = () => void;

export type RunicRune<State> = {
  get: () => Readonly<State>;
  last: () => Readonly<State>;
  initial: () => Readonly<State>;
  set: (next: State) => void;
  subscribe: (fn: RunicListener<State>) => RunicUnsubscribe;
  destroy: () => void;
};

export type RunicSelector<State, Value> = (state: State) => Value;

export type RunicEqualityFn<T> = (a: T, b: T) => boolean;

export type RunicRunes<T extends unknown[]> = { [K in keyof T]: RunicRune<T[K]> };
