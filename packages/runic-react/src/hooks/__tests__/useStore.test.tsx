import { createStore, mergeState } from '@runicjs/runic';
import { updateState } from '@runicjs/runic/integrations/immer';
import { act, render, renderHook } from '@testing-library/react';
import deepEqual from 'fast-deep-equal';
import useStore from '../useStore';
import { SimpleState, Vector3 } from './types';
import { createRerenderTestComponent } from './utils';

describe.concurrent('useStore', () => {
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
    act(() => store.setState({ x: 3 }));
    expect(result.current).toEqual(0);
  });

  it('should rerender when the selected state changes', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const selectX = (state: Vector3) => state.x;
    const TestComponent = createRerenderTestComponent(() => useStore(store, selectX), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(store, { x: 1 }));
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should not rerender when non-selected state changes', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(store, { y: 1 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when non-selected state changes using an equalityFn', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useStore(
          store,
          (state) => ({
            x: state.x * 2,
            y: state.y * 2,
          }),
          deepEqual,
        ),
      renderSpy,
    );
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(store, { z: 3 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the selected state does not change', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(store, { x: 0 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender when the update callback changes selected data in the draft', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const selectX = (state: Vector3) => state.x;
    const TestComponent = createRerenderTestComponent(() => useStore(store, selectX), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(store, (draft) => {
        draft.x = 1;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should not rerender when the update callback does not change selected data in the draft', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(store, (draft) => {
        draft.x = 0;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the update callback changes unselected data in the draft', () => {
    const store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useStore(store, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(store, (draft) => {
        draft.y = 3;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
