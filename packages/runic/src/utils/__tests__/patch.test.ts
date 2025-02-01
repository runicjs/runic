import rune from '../../rune';
import patch from '../patch';
import { User, Vector3 } from './types';

describe('patch', () => {
  it('should merge the given partial state with the current state', () => {
    const store = rune<Vector3>({ x: 0, y: 1, z: 2 });
    patch(store, { x: 3 });
    expect(store.get()).toEqual({ x: 3, y: 1, z: 2 });
  });

  it('should deeply merge states', () => {
    const store = rune<User>({
      name: 'John',
      address: { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
    });
    patch(store, {
      address: { state: 'TX', zip: '67890' },
    });
    expect(store.get()).toEqual({
      name: 'John',
      address: { street: '123 Main St', city: 'Anytown', state: 'TX', zip: '67890' },
    });
  });

  it('should notify listeners of changes', () => {
    const store = rune<Vector3>({ x: 0, y: 1, z: 2 });
    const listener = vi.fn();
    store.subscribe(listener);
    patch(store, { x: 3 });
    expect(listener).toHaveBeenNthCalledWith(2, { x: 3, y: 1, z: 2 }, { x: 0, y: 1, z: 2 });
  });
});
