import { createStore } from '@runicjs/runic';
import { act, render, renderHook } from '@testing-library/react';
import useStore from '../useStore';

type SimpleState = {
  x: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

const createRerenderTestComponent = <State,>(hook: () => State, renderSpy: ReturnType<typeof vi.fn>) => {
  return function TestComponent() {
    renderSpy(hook());
    return null;
  };
};

describe('useStore', () => {
  it('should return the current state', () => {
    const store = createStore<SimpleState>({ x: 0 });
    const { result } = renderHook(() => useStore(store, (state) => state.x));
    expect(result.current).toEqual(0);
  });

  it('should update when the store state changes', () => {
    const store = createStore<SimpleState>({ x: 0 });
    const { result } = renderHook(() => useStore(store, (state) => state.x));
    act(() => store.setState({ x: 3 }));
    expect(result.current).toEqual(3);
  });

  it('should unsubscribe when the component unmounts', () => {
    const store = createStore<SimpleState>({ x: 0 });
    const { result, unmount } = renderHook(() => useStore(store, (state) => state.x));
    unmount();
    store.setState({ x: 3 });
    expect(result.current).toEqual(0);
  });

  it('should not update when the store state does not change', () => {
    const store = createStore<SimpleState>({ x: 0 });
    const { result } = renderHook(() => useStore(store, (state) => state.x));
    store.setState({ x: 0 });
    expect(result.current).toEqual(0);
  });

  it('should cause a rerender when the selected state changes', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderCountSpy);
    render(<TestComponent />);
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => store.setPartialState({ x: 1 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(2);
  });

  it('should not cause a rerender when non-selected state changes', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderCountSpy);
    render(<TestComponent />);
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => store.setPartialState({ y: 1 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should not cause a rerender when the selected state does not change', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderCountSpy);
    render(<TestComponent />);
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => store.setPartialState({ x: 0 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender when the update callback changes selected data in the draft', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderCountSpy);
    render(<TestComponent />);
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      store.update((draft) => {
        draft.x = 1;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(2);
  });

  it('should not rerender when the update callback does not change selected data in the draft', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderCountSpy);
    render(<TestComponent />);
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      store.update((draft) => {
        draft.x = 0;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the update callback changes unselected data in the draft', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderCountSpy);
    render(<TestComponent />);
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      store.update((draft) => {
        draft.y = 3;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });
});
