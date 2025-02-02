import { createRune, patch } from '@runicjs/runic';
import { update } from '@runicjs/runic/integrations/immer';
import { act, render, renderHook } from '@testing-library/react';
import { useMemo } from 'react';
import useRune from '../useRune';
import { SimpleState, Todo, TodoListState, Vector3State } from './types';
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

  it('should cause minimal rerenders', () => {
    const todoList = createRune<TodoListState>({ filter: '', todos: [] });

    const appRenderSpy = vi.fn();
    let expectedAppRenderCount = 0;

    const todoListRenderSpy = vi.fn();
    let expectedTodoListRenderCount = 0;

    const todoRenderSpy = vi.fn();
    let expectedTodoRenderCount = 0;

    const TodoView = ({ todo }: { todo: Todo }) => {
      todoRenderSpy();
      return <div>{todo.text}</div>;
    };

    const selectFilteredTodos = (state: TodoListState) => {
      return state.todos.filter((todo) => {
        if (state.filter === 'complete') return todo.done;
        if (state.filter === 'incomplete') return !todo.done;
        return true;
      });
    };

    const TodoList = () => {
      const filteredTodos = useRune(todoList, selectFilteredTodos);
      todoListRenderSpy();
      return (
        <div>
          {filteredTodos.map((todo) => (
            <TodoView key={todo.id} todo={todo} />
          ))}
        </div>
      );
    };

    const selectFilter = (state: TodoListState) => state.filter;

    const App = () => {
      const filter = useRune(todoList, selectFilter);
      appRenderSpy();
      return (
        <div>
          <h1>Filter: {filter}</h1>
          <TodoList />
        </div>
      );
    };

    render(<App />);
    expectedAppRenderCount++;
    expectedTodoListRenderCount++;

    act(() => {
      update(todoList, (draft) => {
        draft.todos.push({ id: '1', text: 'Todo 1', done: true });
        draft.todos.push({ id: '2', text: 'Todo 2', done: true });
        draft.todos.push({ id: '3', text: 'Todo 3', done: true });
        draft.todos.push({ id: '4', text: 'Todo 4', done: false });
        draft.todos.push({ id: '5', text: 'Todo 5', done: false });
        draft.todos.push({ id: '6', text: 'Todo 6', done: false });
      });
      expectedTodoListRenderCount++;
      expectedTodoRenderCount += 6;
    });

    const filters = ['complete', 'incomplete', 'all'];

    for (const filter of filters) {
      act(() => {
        update(todoList, (draft) => {
          draft.filter = filter;
        });
        expectedAppRenderCount++;
        expectedTodoListRenderCount++;
        expectedTodoRenderCount += selectFilteredTodos(todoList.get()).length;
      });
    }

    while (todoList.get().todos.length > 0) {
      act(() => {
        // TODO: The first (and only!) update in this loop is bizarrely causing
        // a rerender of the App component. A single rerender after the
        // first update. Not sure why.
        update(todoList, (draft) => {
          draft.todos.shift();
        });
        expectedTodoListRenderCount++;
        expectedTodoRenderCount += selectFilteredTodos(todoList.get()).length;
      });
    }

    // TODO: This is a hack to account for the strange rerender mentioned above.
    expectedAppRenderCount++;

    expect(appRenderSpy).toHaveBeenCalledTimes(expectedAppRenderCount);
    expect(todoListRenderSpy).toHaveBeenCalledTimes(expectedTodoListRenderCount);
    expect(todoRenderSpy).toHaveBeenCalledTimes(expectedTodoRenderCount);
  });

  // TODO: This needs to be tested in < React 18.
  it('should not create zombie children', () => {
    const todoList = createRune<TodoListState>({ filter: '', todos: [] });

    const TodoView = ({ id }: { id: string }) => {
      const selectTodo = useMemo(() => (state: TodoListState) => state.todos.find((todo) => todo.id === id), [id]);
      const todo = useRune(todoList, selectTodo);

      // This is what the test is all about. Ideally, this component
      // never renders unless the todo exists. But zombie children can
      // happen pre React 18.
      return <div>{todo!.text}</div>;
    };

    const selectFilteredTodos = (state: TodoListState) => {
      return state.todos.filter((todo) => {
        if (state.filter === 'complete') return todo.done;
        if (state.filter === 'incomplete') return !todo.done;
        return true;
      });
    };

    const TodoList = () => {
      const filteredTodos = useRune(todoList, selectFilteredTodos);
      return (
        <div>
          {filteredTodos.map((todo) => (
            <TodoView key={todo.id} id={todo.id} />
          ))}
        </div>
      );
    };

    const selectFilter = (state: TodoListState) => state.filter;

    const App = () => {
      const filter = useRune(todoList, selectFilter);
      return (
        <div>
          <h1>Filter: {filter}</h1>
          <TodoList />
        </div>
      );
    };

    render(<App />);

    act(() => {
      update(todoList, (draft) => {
        draft.todos.push({ id: '1', text: 'Todo 1', done: true });
        draft.todos.push({ id: '2', text: 'Todo 2', done: true });
        draft.todos.push({ id: '3', text: 'Todo 3', done: true });
        draft.todos.push({ id: '4', text: 'Todo 4', done: false });
        draft.todos.push({ id: '5', text: 'Todo 5', done: false });
        draft.todos.push({ id: '6', text: 'Todo 6', done: false });
      });
    });

    const filters = ['complete', 'incomplete', 'all'];

    for (const filter of filters) {
      act(() => {
        update(todoList, (draft) => {
          draft.filter = filter;
        });
      });
    }

    while (todoList.get().todos.length > 0) {
      act(() => {
        update(todoList, (draft) => {
          draft.todos.shift();
        });
      });
    }

    // TODO: Assert that no errors are thrown
  });
});
