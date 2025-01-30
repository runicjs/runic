import { createStore, mergeState } from '@runicjs/runic';
import { updateState } from '@runicjs/runic/integrations/immer';
import { act, render, renderHook } from '@testing-library/react';
import deepEqual from 'fast-deep-equal';
import useStores from '../useStores';
import { Vector2, Vector3 } from './types';
import { createRerenderTestComponent } from './utils';

describe('useStores', () => {
  it('should return the current state', () => {
    const vec1Store = createStore<Vector2>({ x: 0, y: 1 });
    const vec2Store = createStore<Vector2>({ x: 2, y: 3 });
    const { result } = renderHook(() =>
      useStores(
        [vec1Store, vec2Store],
        ([vec1, vec2]) => ({
          x: vec1.x + vec2.x,
          y: vec1.y + vec2.y,
        }),
        deepEqual,
      ),
    );
    expect(result.current).toEqual({ x: 2, y: 4 });
  });

  it('should update when any passed store state changes', () => {
    const vec1Store = createStore<Vector2>({ x: 0, y: 1 });
    const vec2Store = createStore<Vector2>({ x: 2, y: 3 });
    const { result } = renderHook(() =>
      useStores(
        [vec1Store, vec2Store],
        ([vec1, vec2]) => ({
          x: vec1.x + vec2.x,
          y: vec1.y + vec2.y,
        }),
        deepEqual,
      ),
    );
    expect(result.current).toEqual({ x: 2, y: 4 });
    act(() => mergeState(vec1Store, { x: 1 }));
    expect(result.current).toEqual({ x: 3, y: 4 });
    act(() => mergeState(vec2Store, { y: 5 }));
    expect(result.current).toEqual({ x: 3, y: 6 });
  });

  it('should unsubscribe when the component unmounts', () => {
    const vec1Store = createStore<Vector2>({ x: 0, y: 1 });
    const vec2Store = createStore<Vector2>({ x: 2, y: 3 });
    const { result, unmount } = renderHook(() =>
      useStores(
        [vec1Store, vec2Store],
        ([vec1, vec2]) => ({
          x: vec1.x + vec2.x,
          y: vec1.y + vec2.y,
        }),
        deepEqual,
      ),
    );
    unmount();
    act(() => {
      mergeState(vec1Store, { x: 1 });
      mergeState(vec2Store, { y: 5 });
    });
    expect(result.current).toEqual({ x: 2, y: 4 });
  });

  it('should rerender when the selected state changes', () => {
    const vec1Store = createStore<Vector2>({ x: 0, y: 1 });
    const vec2Store = createStore<Vector2>({ x: 2, y: 3 });

    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useStores(
          [vec1Store, vec2Store],
          ([vec1, vec2]) => ({
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
          }),
          deepEqual,
        ),
      renderCountSpy,
    );
    render(<TestComponent />);

    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(vec1Store, { x: 1 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(2);
    act(() => mergeState(vec2Store, { y: 5 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(3);
  });

  it('should not rerender when non-selected state changes', () => {
    const vec1Store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const vec2Store = createStore<Vector3>({ x: 3, y: 4, z: 5 });

    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useStores(
          [vec1Store, vec2Store],
          ([vec1, vec2]) => ({
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
          }),
          deepEqual,
        ),
      renderCountSpy,
    );
    render(<TestComponent />);

    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(vec1Store, { z: 6 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(vec2Store, { z: 7 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the selected state does not change', () => {
    const vec1Store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const vec2Store = createStore<Vector3>({ x: 3, y: 4, z: 5 });

    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () => useStores([vec1Store, vec2Store], ([vec1, vec2]) => vec1.x + vec2.x),
      renderCountSpy,
    );
    render(<TestComponent />);

    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(vec1Store, { x: 0 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => mergeState(vec2Store, { y: 4 }));
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender when the update callback changes selected data in the draft', () => {
    const vec1Store = createStore<Vector2>({ x: 0, y: 1 });
    const vec2Store = createStore<Vector2>({ x: 2, y: 3 });

    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useStores(
          [vec1Store, vec2Store],
          ([vec1, vec2]) => ({
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
          }),
          deepEqual,
        ),
      renderCountSpy,
    );
    render(<TestComponent />);

    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(vec1Store, (draft) => {
        draft.x = 1;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(2);
    act(() => {
      updateState(vec2Store, (draft) => {
        draft.y = 5;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(3);
  });

  it('should not rerender when the update callback does not change selected data in the draft', () => {
    const vec1Store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const vec2Store = createStore<Vector3>({ x: 3, y: 4, z: 5 });

    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useStores(
          [vec1Store, vec2Store],
          ([vec1, vec2]) => ({
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
          }),
          deepEqual,
        ),
      renderCountSpy,
    );
    render(<TestComponent />);

    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(vec1Store, (draft) => {
        draft.x = 0;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(vec2Store, (draft) => {
        draft.y = 4;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should not rerender when the update callback changes unselected data in the draft', () => {
    const vec1Store = createStore<Vector3>({ x: 0, y: 1, z: 2 });
    const vec2Store = createStore<Vector3>({ x: 3, y: 4, z: 5 });

    const renderCountSpy = vi.fn();
    const TestComponent = createRerenderTestComponent(
      () =>
        useStores(
          [vec1Store, vec2Store],
          ([vec1, vec2]) => ({
            x: vec1.x + vec2.x,
            y: vec1.y + vec2.y,
          }),
          deepEqual,
        ),
      renderCountSpy,
    );
    render(<TestComponent />);

    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(vec1Store, (draft) => {
        draft.z = 6;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
    act(() => {
      updateState(vec2Store, (draft) => {
        draft.z = 7;
      });
    });
    expect(renderCountSpy).toHaveBeenCalledTimes(1);
  });
});
