import createRune from '../../createRune';
import reset from '../reset';
import { SimpleState } from './types';

describe('reset', () => {
  it('should reset the state back to the initial state', () => {
    const store = createRune<SimpleState>({ x: 0 });
    store.set({ x: 1 });
    expect(store.get()).toEqual({ x: 1 });
    reset(store);
    expect(store.get()).toEqual({ x: 0 });
  });

  it('should notify listeners of changes', () => {
    const store = createRune<SimpleState>({ x: 0 });
    const listener = vi.fn();
    store.set({ x: 1 });
    store.subscribe(listener);
    reset(store);
    expect(listener).toHaveBeenCalledWith({ x: 0 }, { x: 1 });
  });
});
