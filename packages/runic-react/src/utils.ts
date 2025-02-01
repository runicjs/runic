import type { RunicEqualityFn } from '@runicjs/runic';
import { shallowEqual } from 'shallow-equal';

const shallowEqualEqualityFn = shallowEqual as RunicEqualityFn<unknown>;

export const defaultEqualityFn: RunicEqualityFn<unknown> = <T>(a: T, b: T): boolean => {
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;
  return shallowEqualEqualityFn(a, b);
};
