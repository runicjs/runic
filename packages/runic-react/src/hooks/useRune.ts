import type { RunicEqualityFn, RunicRune, RunicSelector } from '@runicjs/runic';
import { useEffect, useState } from 'react';
import { defaultEqualityFn } from '../utils';

export default function useRune<State>(rune: RunicRune<State>): State;
export default function useRune<State, Value>(rune: RunicRune<State>, selector: RunicSelector<State, Value>): Value;
export default function useRune<State, Value>(
  rune: RunicRune<State>,
  selector: RunicSelector<State, Value>,
  equalityFn: RunicEqualityFn<Value>,
): Value;

export default function useRune<State, Value>(
  rune: RunicRune<State>,
  // It's unfortunate that I have to resort to casting here.
  selector: (state: State) => Value = (v) => v as unknown as Value,
  equalityFn: RunicEqualityFn<Value> = defaultEqualityFn,
): Value {
  const [value, setValue] = useState<Value>(selector(rune.get()));

  useEffect(() => {
    return rune.subscribe((state) => {
      setValue((last) => {
        const next = selector(state);
        if (equalityFn(last, next)) return last;
        return next;
      });
    });
  }, [rune, selector, equalityFn]);

  return value;
}
