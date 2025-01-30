export const createRerenderTestComponent = <State>(hook: () => State, renderSpy: ReturnType<typeof vi.fn>) => {
  return function TestComponent() {
    const value = hook();
    renderSpy(value);
    return null;
  };
};
