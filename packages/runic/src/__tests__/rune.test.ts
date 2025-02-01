import { rune } from '..';

type SimpleState = {
  x: number;
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

describe('rune', () => {
  describe('get', () => {
    it('should return the initial state before updates', () => {
      const simple = rune<SimpleState>({ x: 0 });
      expect(simple.get()).toEqual({ x: 0 });
    });

    it('should return the new state after updates', () => {
      const simple = rune<SimpleState>({ x: 0 });
      simple.set({ x: 1 });
      expect(simple.get()).toEqual({ x: 1 });
    });
  });

  describe('initial', () => {
    it('should return the initial state when first created', () => {
      const simple = rune<SimpleState>({ x: 0 });
      expect(simple.initial()).toEqual({ x: 0 });
    });

    it('should return the initial state even after updates', () => {
      const simple = rune<SimpleState>({ x: 0 });
      simple.set({ x: 1 });
      expect(simple.initial()).toEqual({ x: 0 });
    });
  });

  describe('set', () => {
    it('should overwrite the entire state', () => {
      const simple = rune<Vector3>({ x: 0, y: 1, z: 2 });
      simple.set({ x: 3, y: 4, z: 5 });
      expect(simple.get()).toEqual({ x: 3, y: 4, z: 5 });
    });
  });

  describe('subscribe', () => {
    it('should notify listener immediately on subscription', () => {
      const simple = rune<SimpleState>({ x: 0 });
      const listener = vi.fn();
      simple.subscribe(listener);
      expect(listener).toHaveBeenCalledWith({ x: 0 }, { x: 0 });
    });

    it('should notify listener immediately on subscription with the last state as the second argument', () => {
      const simple = rune<SimpleState>({ x: 0 });
      simple.set({ x: 1 });
      const listener = vi.fn();
      simple.subscribe(listener);
      expect(listener).toHaveBeenCalledWith({ x: 1 }, { x: 0 });
    });

    it('should notify listeners of changes', () => {
      const simple = rune<SimpleState>({ x: 0 });
      const listener = vi.fn();
      simple.subscribe(listener);
      simple.set({ x: 1 });
      expect(listener).toHaveBeenCalledWith({ x: 1 }, { x: 0 });
    });
  });
});
