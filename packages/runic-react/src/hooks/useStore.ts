import type { EqualityFn, Selector, Store } from '@runicjs/runic';
import { useEffect, useState } from 'react';
import { defaultEqualityFn } from '../utils';

export default function useStore<State>(store: Store<State>): State;
export default function useStore<State, Value>(store: Store<State>, selector: Selector<State, Value>): Value;
export default function useStore<State, Value>(
  store: Store<State>,
  selector: Selector<State, Value>,
  equalityFn: EqualityFn<Value>,
): Value;

export default function useStore<State, Value>(
  store: Store<State>,
  // It's unfortunate that I have to resort to casting here.
  selector: (state: State) => Value = (v) => v as unknown as Value,
  equalityFn: EqualityFn<Value> = defaultEqualityFn,
): Value {
  const [value, setValue] = useState<Value>(selector(store.getState()));

  useEffect(() => {
    return store.subscribe((state) => {
      setValue((last) => {
        const next = selector(state);
        if (equalityFn(last, next)) return last;
        return next;
      });
    });
  }, [store, selector, equalityFn]);

  return value;
}
