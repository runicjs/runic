import type { EqualityFn } from '@runicjs/runic';
import { RunicStateHolders } from '@runicjs/runic';
import { useEffect, useState } from 'react';
import { defaultEqualityFn } from '../utils';

export type States<T extends unknown[]> = { [K in keyof T]: T[K] };

const getStates = <T extends unknown[]>(stores: RunicStateHolders<T>): States<T> => {
  return stores.map((store) => store.getState()) as States<T>;
};

export default function useStores<T extends unknown[], Value>(
  stores: RunicStateHolders<T>,
  selector: (states: States<T>) => Value,
  equalityFn: EqualityFn<Value> = defaultEqualityFn,
): Value {
  const [value, setValue] = useState<Value>(() => selector(getStates(stores)));

  useEffect(() => {
    const unsubscribes = stores.map((store) =>
      store.subscribe(() => {
        setValue((last) => {
          const next = selector(getStates(stores));
          if (equalityFn(last, next)) return last;
          return next;
        });
      }),
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [...stores, selector, equalityFn]);

  return value;
}
