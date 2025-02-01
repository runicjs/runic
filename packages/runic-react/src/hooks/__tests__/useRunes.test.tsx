import { createRune, patch } from '@runicjs/runic';
import { update } from '@runicjs/runic/integrations/immer';
import { act, render, renderHook } from '@testing-library/react';
import useRunes from '../useRunes';
import { Vector2State, Vector3State } from './types';
import { createRerenderTestComponent } from './utils';

describe('useRunes', () => {
  it('should return the current state', () => {
    const vector1 = createRune<Vector2State>({ x: 0, y: 1 });
    const vector2 = createRune<Vector2State>({ x: 2, y: 3 });
    const { result } = renderHook(() =>
      useRunes([vector1, vector2], ([v1, v2]) => ({
        x: v1.x + v2.x,
        y: v1.y + v2.y,
      })),
    );
    expect(result.current).toEqual({ x: 2, y: 4 });
  });

  it('should update when any passed store state changes', () => {
    const vector1 = createRune<Vector2State>({ x: 0, y: 1 });
    const vector2 = createRune<Vector2State>({ x: 2, y: 3 });
    const { result } = renderHook(() =>
      useRunes([vector1, vector2], ([v1, v2]) => ({
        x: v1.x + v2.x,
        y: v1.y + v2.y,
      })),
    );
    expect(result.current).toEqual({ x: 2, y: 4 });
    act(() => patch(vector1, { x: 1 }));
    expect(result.current).toEqual({ x: 3, y: 4 });
    act(() => patch(vector2, { y: 5 }));
    expect(result.current).toEqual({ x: 3, y: 6 });
  });

  it('should unsubscribe when the component unmounts', () => {
    const vector1 = createRune<Vector2State>({ x: 0, y: 1 });
    const vector2 = createRune<Vector2State>({ x: 2, y: 3 });
    const { result, unmount } = renderHook(() =>
      useRunes([vector1, vector2], ([v1, v2]) => ({
        x: v1.x + v2.x,
        y: v1.y + v2.y,
      })),
    );
    unmount();
    act(() => {
      patch(vector1, { x: 1 });
      patch(vector2, { y: 5 });
    });
    expect(result.current).toEqual({ x: 2, y: 4 });
  });

  it('should rerender when the selected state changes', () => {
    const vector1 = createRune<Vector2State>({ x: 0, y: 1 });
    const vector2 = createRune<Vector2State>({ x: 2, y: 3 });

    const renderSpy = vi.fn();
    const selectVectorAdd = ([v1, v2]: [Vector2State, Vector2State]): Vector2State => ({
      x: v1.x + v2.x,
      y: v1.y + v2.y,
    });
    const TestComponent = createRerenderTestComponent(() => useRunes([vector1, vector2], selectVectorAdd), renderSpy);
    render(<TestComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector1, { x: 1 }));
    expect(renderSpy).toHaveBeenCalledTimes(2);
    act(() => patch(vector2, { y: 5 }));
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('should not rerender when non-selected state changes', () => {
    const vector1 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const vector2 = createRune<Vector3State>({ x: 3, y: 4, z: 5 });

    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () => useRunes([vector1, vector2], ([v1, v2]) => v1.x + v2.x),
      renderSpy,
    );
    render(<TestComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector1, { z: 6 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector2, { z: 7 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the selected state does not change', () => {
    const vector1 = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const vector2 = createRune<Vector3State>({ x: 3, y: 4, z: 5 });

    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () => useRunes([vector1, vector2], ([v1, v2]) => v1.x + v2.x),
      renderSpy,
    );
    render(<TestComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector1, { x: 0 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => patch(vector2, { y: 4 }));
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender when the update callback changes selected data in the draft', () => {
    const vec1Store = createRune<Vector2State>({ x: 0, y: 1 });
    const vec2Store = createRune<Vector2State>({ x: 2, y: 3 });

    const renderSpy = vi.fn();
    const selectVectorAdd = ([vec1, vec2]: [Vector2State, Vector2State]): Vector2State => ({
      x: vec1.x + vec2.x,
      y: vec1.y + vec2.y,
    });
    const TestComponent = createRerenderTestComponent(
      () => useRunes([vec1Store, vec2Store], selectVectorAdd),
      renderSpy,
    );
    render(<TestComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vec1Store, (draft) => {
        draft.x = 1;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(2);
    act(() => {
      update(vec2Store, (draft) => {
        draft.y = 5;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(3);
  });

  it('should not rerender when the update callback does not change selected data in the draft', () => {
    const vec1Store = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const vec2Store = createRune<Vector3State>({ x: 3, y: 4, z: 5 });

    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useRunes([vec1Store, vec2Store], ([vec1, vec2]) => ({
          x: vec1.x + vec2.x,
          y: vec1.y + vec2.y,
        })),
      renderSpy,
    );
    render(<TestComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vec1Store, (draft) => {
        draft.x = 0;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vec2Store, (draft) => {
        draft.y = 4;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the update callback changes unselected data in the draft', () => {
    const vec1Store = createRune<Vector3State>({ x: 0, y: 1, z: 2 });
    const vec2Store = createRune<Vector3State>({ x: 3, y: 4, z: 5 });

    const renderSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useRunes([vec1Store, vec2Store], ([vec1, vec2]) => ({
          x: vec1.x + vec2.x,
          y: vec1.y + vec2.y,
        })),
      renderSpy,
    );
    render(<TestComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vec1Store, (draft) => {
        draft.z = 6;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
    act(() => {
      update(vec2Store, (draft) => {
        draft.z = 7;
      });
    });
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
