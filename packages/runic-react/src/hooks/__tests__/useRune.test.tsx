import { createRune, patch } from '@runicjs/runic';
import { update } from '@runicjs/runic/integrations/immer';
import { act, render, renderHook } from '@testing-library/react';
import useRune from '../useRune';
import { SimpleState, Vector3State } from './types';
import { createRerenderTestComponent } from './utils';

describe('useRune', () => {
  it('should return the current state', () => {
    const simple = createRune<SimpleState>({ x: 0 });
    const { result } = renderHook(() => useRune(simple, (state) => state.x));
    expect(result.current).toEqual(0);
  });

  it('should update when the store state changes', () => {
    const simple = createRune<SimpleState>({ x: 0 });
    const { result } = renderHook(() => useRune(simple, (state) => state.x));
    act(() => simple.set({ x: 3 }));
    expect(result.current).toEqual(3);
  });

  it('should unsubscribe when the component unmounts', () => {
    const simple = createRune<SimpleState>({ x: 0 });
    const { result, unmount } = renderHook(() => useRune(simple, (state) => state.x));
    unmount();
    act(() => simple.set({ x: 3 }));
    expect(result.current).toEqual(0);
  });

  it('should rerender when the selected state changes', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const selectX = (state: Vector3State) => state.x;
    const TestComponent = createRerenderTestComponent(() => useRune(vector3, selectX), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector3, { x: 1 }));
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should not rerender when non-selected state changes', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useRune(vector3, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector3, { y: 1 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when non-selected state changes using an equalityFn', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useRune(vector3, (state) => ({
          x: state.x * 2,
          y: state.y * 2,
        })),
      renderSpy,
    );
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector3, { z: 3 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the selected state does not change', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useRune(vector3, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector3, { x: 0 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender when the update callback changes selected data in the draft', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const selectX = (state: Vector3State) => state.x;
    const TestComponent = createRerenderTestComponent(() => useRune(vector3, selectX), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vector3, (vector3Draft) => {
        vector3Draft.x = 1;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should not rerender when the update callback does not change selected data in the draft', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useRune(vector3, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vector3, (vector3Draft) => {
        vector3Draft.x = 0;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the update callback changes unselected data in the draft', () => {
    const vector3 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(() => useRune(vector3, (state) => state.x), renderSpy);
    render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vector3, (vector3Draft) => {
        vector3Draft.y = 3;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
