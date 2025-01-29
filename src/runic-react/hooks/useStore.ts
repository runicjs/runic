import { EqualityFn, Store } from '@/runic';
import { useEffect, useState } from 'react';

export default function useStore<State, Value>(
  store: Store<State>,
  fn: (state: State) => Value,
  equalityFn?: EqualityFn<Value>,
): Value {
  const [value, setValue] = useState<Value>(fn(store.getState()));

  useEffect(() => {
    return store.subscribe((state) => {
      setValue((last) => {
        const next = fn(state);
        if (equalityFn && !equalityFn(last, next)) return last;
        if (store.equalityFn && !store.equalityFn(last, next)) return last;
        return next;
      });
    });
  }, [store, fn, equalityFn]);

  return value;
}
