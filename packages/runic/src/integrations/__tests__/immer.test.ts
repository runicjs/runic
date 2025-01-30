import createStore from '../../createStore';
import { updateState, updateStates } from '../immer';

type SimpleState = {
  x: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

describe('immer', () => {
  describe('updateState', () => {
    it('should call the given function with a draft of the current state and apply any changes synchronously', () => {
      const store = createStore<SimpleState>({ x: 0 });

      updateState(store, (draft) => {
        draft.x = 1;
      });

      expect(store.getState()).toEqual({ x: 1 });
    });

    it('should notify listeners of changes', () => {
      const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
      const listener = vi.fn();
      store.subscribe(listener);
      updateState(store, (draft) => {
        draft.x = 3;
      });
      expect(listener).toHaveBeenCalledWith({ x: 3, y: 1, z: 2 });
    });
  });

  describe('updateStates', () => {
    it('should call the given function with a draft of the current state and apply any changes synchronously', () => {
      const simpleStateStore = createStore<SimpleState>({ x: 0 });
      const vector3Store = createStore<Vector3>({ x: 1, y: 2, z: 3 });

      updateStates([simpleStateStore, vector3Store], ([simpleState, vector3]) => {
        simpleState.x = 1;
        vector3.x = 4;
      });

      expect(simpleStateStore.getState()).toEqual({ x: 1 });
      expect(vector3Store.getState()).toEqual({ x: 4, y: 2, z: 3 });
    });
  });
});
