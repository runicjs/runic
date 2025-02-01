import { createRune } from '@runicjs/runic';
import { update } from '@runicjs/runic/integrations/mutative';
import { Draft } from 'mutative';
import { Filter, Todo } from '../types';

export type State = {
  nextId: number;
  filter: Filter;
  todos: Todo[];
};

// const SampleState: State = {
//   nextId: 11,
//   filter: 'all',
//   todos: [
//     { id: 5, text: 'Build Runic', completed: true },
//     { id: 6, text: 'Build Runic React', completed: true },
//     { id: 7, text: 'Build a counter app with Runic', completed: true },
//     { id: 8, text: 'Build TodoMVC with Runic React', completed: false },
//     { id: 9, text: 'Test rerenders in TodoMVC', completed: false },
//     { id: 10, text: 'MVP implementation of middleware', completed: false },
//   ],
// };

const InitialState: State = {
  nextId: 0,
  filter: 'all',
  todos: [],
};

const StorageKey = 'app-state';

const loadState = () => {
  const state = localStorage.getItem(StorageKey);
  return state ? JSON.parse(state) : InitialState;
};

const saveState = (state: State) => {
  localStorage.setItem(StorageKey, JSON.stringify(state));
};

export const rune = createRune<State>(loadState());
rune.subscribe(saveState);

export const selectFilter = (state: State) => state.filter;
export const selectTodos = (state: State) => state.todos;
export const selectCompleteTodos = (state: State) => state.todos.filter((todo) => todo.completed);
export const selectIncompleteTodos = (state: State) => state.todos.filter((todo) => !todo.completed);

export const selectFilteredTodos = (state: State) => {
  const filter = selectFilter(state);
  return state.todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    return todo.completed;
  });
};

const getTodoFromDraft = (draft: Draft<State>, id: number): Draft<Todo> => {
  const todo = draft.todos.find((todo) => todo.id === id);
  if (!todo) throw new Error(`Todo with id ${id} not found`);
  return todo;
};

export const setFilter = (filter: Filter) => {
  update(rune, (state) => {
    state.filter = filter;
  });
};

export const addTodo = (text: string) => {
  update(rune, (state) => {
    state.todos.push({
      id: state.nextId++,
      text,
      completed: false,
    });
  });
};

export const removeTodo = (id: number) => {
  update(rune, (state) => {
    const index = state.todos.findIndex((todo) => todo.id === id);
    if (index === -1) throw new Error(`Todo with id ${id} not found`);
    state.todos.splice(index, 1);
  });
};

export const toggleTodo = (id: number) => {
  update(rune, (state) => {
    const todo = getTodoFromDraft(state, id);
    todo.completed = !todo.completed;
  });
};

export const toggleAllTodos = () => {
  update(rune, (state) => {
    state.todos.forEach((todo) => {
      todo.completed = !todo.completed;
    });
  });
};

export const setTodoText = (id: number, text: string) => {
  update(rune, (state) => {
    const todo = getTodoFromDraft(state, id);
    todo.text = text;
  });
};

export const setTodoCompletionStatus = (id: number, completed: boolean) => {
  update(rune, (state) => {
    const todo = getTodoFromDraft(state, id);
    todo.completed = completed;
  });
};

export const clearCompletedTodos = () => {
  update(rune, (state) => {
    state.todos = state.todos.filter((todo) => !todo.completed);
  });
};
