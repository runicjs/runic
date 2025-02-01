import createRune from '../../createRune';
import { update } from '../immer';
import { SimpleState, Vector3 } from './types';

describe('immer', () => {
  describe('update', () => {
    it('should call the given function with a draft of the current state and apply any changes synchronously', () => {
      const store = createRune<SimpleState>({ x: 0 });

      update(store, (draft) => {
        draft.x = 1;
      });

      expect(store.get()).toEqual({ x: 1 });
    });

    it('should notify listeners of changes', () => {
      const store = createRune<Vector3>({ x: 0, y: 1, z: 2 });
      const listener = vi.fn();
      store.subscribe(listener);
      update(store, (draft) => {
        draft.x = 3;
      });
      expect(listener).toHaveBeenCalledWith({ x: 3, y: 1, z: 2 }, { x: 0, y: 1, z: 2 });
    });

    it('should call the given function with drafts of all current states and apply any changes synchronously', () => {
      const simpleStateStore = createRune<SimpleState>({ x: 0 });
      const vector3Store = createRune<Vector3>({ x: 1, y: 2, z: 3 });

      update([simpleStateStore, vector3Store], ([simpleState, vector3]) => {
        simpleState.x = 1;
        vector3.x = 4;
      });

      expect(simpleStateStore.get()).toEqual({ x: 1 });
      expect(vector3Store.get()).toEqual({ x: 4, y: 2, z: 3 });
    });
  });
});
