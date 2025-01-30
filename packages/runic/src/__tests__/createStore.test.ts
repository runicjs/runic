import { createStore } from '..';

type SimpleState = {
  x: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

describe('createStore', () => {
  describe('getState', () => {
    it('should return the initial state before updates', () => {
      const store = createStore<SimpleState>({ x: 0 });
      expect(store.getState()).toEqual({ x: 0 });
    });

    it('should return the new state after updates', () => {
      const store = createStore<SimpleState>({ x: 0 });
      store.setState({ x: 1 });
      expect(store.getState()).toEqual({ x: 1 });
    });
  });

  describe('getInitialState', () => {
    it('should return the initial state when first created', () => {
      const store = createStore<SimpleState>({ x: 0 });
      expect(store.getInitialState()).toEqual({ x: 0 });
    });

    it('should return the initial state even after updates', () => {
      const store = createStore<SimpleState>({ x: 0 });
      store.setState({ x: 1 });
      expect(store.getInitialState()).toEqual({ x: 0 });
    });
  });

  describe('setState', () => {
    it('should overwrite the entire state', () => {
      const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
      store.setState({ x: 3, y: 4, z: 5 });
      expect(store.getState()).toEqual({ x: 3, y: 4, z: 5 });
    });
  });

  describe('subscribe', () => {
    it('should notify listeners of changes', () => {
      const store = createStore<SimpleState>({ x: 0 });
      const listener = vi.fn();
      store.subscribe(listener);
      store.setState({ x: 1 });
      expect(listener).toHaveBeenCalledWith({ x: 1 });
    });
  });
});
