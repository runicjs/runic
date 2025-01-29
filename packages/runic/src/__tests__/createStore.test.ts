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

  describe('setPartialState', () => {
    it('should merge the given partial state with the current state', () => {
      const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
      store.setPartialState({ x: 3 });
      expect(store.getState()).toEqual({ x: 3, y: 1, z: 2 });
    });
  });

  describe('update', () => {
    it('should call the given function with a draft of the current state and apply any changes synchronously', () => {
      const store = createStore<SimpleState>({ x: 0 });
      store.update((draft) => {
        draft.x = 1;
      });
      expect(store.getState()).toEqual({ x: 1 });
    });
  });

  describe('reset', () => {
    it('should reset the state back to the initial state', () => {
      const store = createStore<SimpleState>({ x: 0 });
      store.setState({ x: 1 });
      expect(store.getState()).toEqual({ x: 1 });
      store.reset();
      expect(store.getState()).toEqual({ x: 0 });
    });
  });

  describe('subscribe', () => {
    it('should be notified of changes from setState', () => {
      const store = createStore<SimpleState>({ x: 0 });
      const listener = vi.fn();
      store.subscribe(listener);
      store.setState({ x: 1 });
      expect(listener).toHaveBeenCalledWith({ x: 1 });
    });

    it('should be notified of changes from setPartialState', () => {
      const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
      const listener = vi.fn();
      store.subscribe(listener);
      store.setPartialState({ x: 3 });
      expect(listener).toHaveBeenCalledWith({ x: 3, y: 1, z: 2 });
    });

    it('should be notified of changes from update', () => {
      const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
      const listener = vi.fn();
      store.subscribe(listener);
      store.update((draft) => {
        draft.x = 3;
      });
      expect(listener).toHaveBeenCalledWith({ x: 3, y: 1, z: 2 });
    });

    it('should be notified of changes from reset', () => {
      const store = createStore<SimpleState>({ x: 0 });
      const listener = vi.fn();
      store.setState({ x: 1 });
      store.subscribe(listener);
      store.reset();
      expect(listener).toHaveBeenCalledWith({ x: 0 });
    });
  });
});
