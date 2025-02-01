import type { RunicEqualityFn, RunicRune, RunicSelector } from '@runicjs/runic';
import { useEffect, useState } from 'react';
import { defaultEqualityFn } from '../utils';

export default function useRune<State>(store: RunicRune<State>): State;
export default function useRune<State, Value>(store: RunicRune<State>, selector: RunicSelector<State, Value>): Value;
export default function useRune<State, Value>(
  store: RunicRune<State>,
  selector: RunicSelector<State, Value>,
  equalityFn: RunicEqualityFn<Value>,
): Value;

export default function useRune<State, Value>(
  store: RunicRune<State>,
  // It's unfortunate that I have to resort to casting here.
  selector: (state: State) => Value = (v) => v as unknown as Value,
  equalityFn: RunicEqualityFn<Value> = defaultEqualityFn,
): Value {
  const [value, setValue] = useState<Value>(selector(store.get()));

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
