import createStore from '../../createStore';
import mergeState from '../mergeState';

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type User = {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
};

describe('mergeState', () => {
  it('should merge the given partial state with the current state', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    mergeState(store, { x: 3 });
    expect(store.getState()).toEqual({ x: 3, y: 1, z: 2 });
  });

  it('should deeply merge states', () => {
    const store = createStore<User>({
      name: 'John',
      address: { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
    });
    mergeState(store, {
      address: { state: 'TX', zip: '67890' },
    });
    expect(store.getState()).toEqual({
      name: 'John',
      address: { street: '123 Main St', city: 'Anytown', state: 'TX', zip: '67890' },
    });
  });

  it('should notify listeners of changes', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const listener = vi.fn();
    store.subscribe(listener);
    mergeState(store, { x: 3 });
    expect(listener).toHaveBeenCalledWith({ x: 3, y: 1, z: 2 });
  });
});
