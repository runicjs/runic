import cloneDeep from 'lodash/cloneDeep';
import { updateStatesWithProducer } from '../..';
import createStore from '../../createStore';

type SimpleState = {
  x: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

describe('updateStatesWithProducer', () => {
  it('should call the callback with drafts created by the producer', () => {
    const simpleStateStore = createStore<SimpleState>({ x: 0 });
    const vector3Store = createStore<Vector3>({ x: 1, y: 2, z: 3 });

    const producer = vi.fn((state: unknown, fn: (draft: unknown) => void) => {
      const draft = cloneDeep(state);
      fn(draft);
      return draft;
    });

    const callback = vi.fn(([simpleState, vector3]) => {
      simpleState.x = 1;
      vector3.x = 4;
    });

    updateStatesWithProducer([simpleStateStore, vector3Store], producer, callback);

    expect(producer).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(simpleStateStore.getState()).toEqual({ x: 1 });
    expect(vector3Store.getState()).toEqual({ x: 4, y: 2, z: 3 });
  });
});
