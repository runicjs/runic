import cloneDeep from 'lodash/cloneDeep';
import createRune from '../../createRune';
import updateWithProducer from '../updateWithProducer';
import { SimpleState, Vector3State } from './types';

describe('updateWithProducer', () => {
  it('should call the callback with drafts created by the producer', () => {
    const simple = createRune<SimpleState>({ x: 0 });
    const vector3 = createRune<Vector3State>({ x: 1, y: 2, z: 3 });

    // This is a producer function that deeply clones the full state,
    // instead of creating e.g. an Immer draft. This is called once
    // for each rune state. Also note that this implementation will
    // cause the state to change every time, even if no values are
    // changed. This is only for testing purposes.
    const producer = vi.fn((state: unknown, fn: (draft: unknown) => void) => {
      const draft = cloneDeep(state);
      fn(draft);
      return draft;
    });

    const callback = vi.fn(([simpleState, vector3]) => {
      simpleState.x = 1;
      vector3.x = 4;
    });

    updateWithProducer([simple, vector3], producer, callback);

    expect(producer).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(simple.get()).toEqual({ x: 1 });
    expect(vector3.get()).toEqual({ x: 4, y: 2, z: 3 });
  });
});
