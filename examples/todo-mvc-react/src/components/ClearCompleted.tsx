import { useStore } from '@runicjs/runic-react';
import { clearCompletedTodos } from '../actions';
import { AppState, appStore } from '../stores';

const selectHasCompletedTodos = (state: AppState) => state.todos.some((todo) => todo.completed);

export default function Filters() {
  const hasCompletedTodos = useStore(appStore, selectHasCompletedTodos);

  if (!hasCompletedTodos) {
    return null;
  }

  return (
    <button className="clear-completed" onClick={clearCompletedTodos}>
      Clear completed
    </button>
  );
}
