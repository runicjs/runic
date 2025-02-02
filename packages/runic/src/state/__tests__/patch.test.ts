import createRune from '../../createRune';
import patch from '../patch';
import { UserState, Vector3State } from './types';

describe('patch', () => {
  it('should merge the given partial state with the current state', () => {
    const store = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    patch(store, { x: 3 });
    expect(store.get()).toEqual({ x: 3, y: 1, z: 2 });
  });

  it('should deeply merge states', () => {
    const store = createRune<UserState>({
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
    const store = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const listener = vi.fn();
    store.subscribe(listener);
    patch(store, { x: 3 });
    expect(listener).toHaveBeenNthCalledWith(2, { x: 3, y: 1, z: 2 }, { x: 0, y: 1, z: 2 });
  });
});
