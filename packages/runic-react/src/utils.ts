import { EqualityFn } from '@runicjs/runic';
import { shallowEqual } from 'shallow-equal';

const shallowEqualEqualityFn = shallowEqual as EqualityFn<unknown>;

export const defaultEqualityFn: EqualityFn<unknown> = <T>(a: T, b: T): boolean => {
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;
  return shallowEqualEqualityFn(a, b);
};
