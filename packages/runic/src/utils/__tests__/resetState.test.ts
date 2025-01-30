import createStore from '../../createStore';
import resetState from '../resetState';
import { SimpleState } from './types';

describe('reset', () => {
  it('should reset the state back to the initial state', () => {
    const store = createStore<SimpleState>({ x: 0 });
    store.setState({ x: 1 });
    expect(store.getState()).toEqual({ x: 1 });
    resetState(store);
    expect(store.getState()).toEqual({ x: 0 });
  });

  it('should notify listeners of changes', () => {
    const store = createStore<SimpleState>({ x: 0 });
    const listener = vi.fn();
    store.setState({ x: 1 });
    store.subscribe(listener);
    resetState(store);
    expect(listener).toHaveBeenCalledWith({ x: 0 });
  });
});
