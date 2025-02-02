import type { RunicEqualityFn, RunicRunes } from '@runicjs/runic';
import { useEffect, useState } from 'react';
import { defaultEqualityFn } from '../utils';

export type States<T extends unknown[]> = { [K in keyof T]: T[K] };

const getStates = <T extends unknown[]>(runes: RunicRunes<T>): States<T> => {
  return runes.map((rune) => rune.get()) as States<T>;
};

export default function useRunes<T extends unknown[], Value>(
  runes: RunicRunes<T>,
  selector: (states: States<T>) => Value,
  equalityFn: RunicEqualityFn<Value> = defaultEqualityFn,
): Value {
  const [value, setValue] = useState<Value>(() => selector(getStates(runes)));

  useEffect(() => {
    const callback = () => {
      // TODO: Fix zombie children pre React 18.
      // unstable_batchedUpdates(() => { setValue(...) });

      setValue((last) => {
        const next = selector(getStates(runes));
        if (equalityFn(last, next)) return last;
        return next;
      });
    };

    const unsubscribeFns = runes.map((rune) => {
      // TODO: This will call the callback immediately, once for
      // every rune. This is probably not what we want.
      return rune.subscribe(callback);
    });

    return () => {
      unsubscribeFns.forEach((unsubscribe) => unsubscribe());
    };
  }, [
    // The runes have to be spread here because most people won't memoize
    // the array, but the runes themselves shouldn't change.
    ...runes,
    selector,
    equalityFn,
  ]);

  return value;
}
