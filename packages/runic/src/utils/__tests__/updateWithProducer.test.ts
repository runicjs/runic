import cloneDeep from 'lodash/cloneDeep';
import rune from '../../rune';
import updateWithProducer from '../updateWithProducer';
import { SimpleState, Vector3 } from './types';

describe('updateWithProducer', () => {
  it('should call the callback with drafts created by the producer', () => {
    const simpleState = rune<SimpleState>({ x: 0 });
    const vector3 = rune<Vector3>({ x: 1, y: 2, z: 3 });

    const producer = vi.fn((state: unknown, fn: (draft: unknown) => void) => {
      const draft = cloneDeep(state);
      fn(draft);
      return draft;
    });

    const callback = vi.fn(([simpleState, vector3]) => {
      simpleState.x = 1;
      vector3.x = 4;
    });

    updateWithProducer([simpleState, vector3], producer, callback);

    expect(producer).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(simpleState.get()).toEqual({ x: 1 });
    expect(vector3.get()).toEqual({ x: 4, y: 2, z: 3 });
  });
});
