import type { EqualityFn, Store } from '@runicjs/runic';
import { useEffect, useState } from 'react';

export default function useStore<State, Value>(
  store: Store<State>,
  selector: (state: State) => Value,
  equalityFn?: EqualityFn<Value>,
): Value {
  const [value, setValue] = useState<Value>(selector(store.getState()));

  useEffect(() => {
    return store.subscribe((state) => {
      setValue((last) => {
        const next = selector(state);
        if (equalityFn && equalityFn(last, next)) return last;
        return next;
      });
    });
  }, [store, selector, equalityFn]);

  return value;
}
