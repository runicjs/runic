import { updateState } from '@runicjs/runic/integrations/mutative';
import { Draft } from 'mutative';
import { AppState, appStore } from '../stores';
import { Filter, Todo } from '../types';

const getTodoFromDraft = (draft: Draft<AppState>, id: number): Draft<Todo> => {
  const todo = draft.todos.find((todo) => todo.id === id);
  if (!todo) throw new Error(`Todo with id ${id} not found`);
  return todo;
};

export const setFilter = (filter: Filter) => {
  updateState(appStore, (state) => {
    state.filter = filter;
  });
};

export const addTodo = (text: string) => {
  updateState(appStore, (state) => {
    state.todos.push({
      id: state.nextId++,
      text,
      completed: false,
    });
  });
};

export const removeTodo = (id: number) => {
  updateState(appStore, (state) => {
    const index = state.todos.findIndex((todo) => todo.id === id);
    if (index === -1) throw new Error(`Todo with id ${id} not found`);
    state.todos.splice(index, 1);
  });
};

export const toggleTodo = (id: number) => {
  updateState(appStore, (state) => {
    const todo = getTodoFromDraft(state, id);
    todo.completed = !todo.completed;
  });
};

export const toggleAllTodos = () => {
  updateState(appStore, (state) => {
    state.todos.forEach((todo) => {
      todo.completed = !todo.completed;
    });
  });
};

export const setTodoText = (id: number, text: string) => {
  updateState(appStore, (state) => {
    const todo = getTodoFromDraft(state, id);
    todo.text = text;
  });
};

export const setTodoCompletionStatus = (id: number, completed: boolean) => {
  updateState(appStore, (state) => {
    const todo = getTodoFromDraft(state, id);
    todo.completed = completed;
  });
};

export const clearCompletedTodos = () => {
  updateState(appStore, (state) => {
    state.todos = state.todos.filter((todo) => !todo.completed);
  });
};
