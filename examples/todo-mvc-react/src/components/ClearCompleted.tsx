import { useStore } from '@runicjs/runic-react';
import { clearCompletedTodos } from '../actions';
import { appStore } from '../stores';

export default function Filters() {
  const hasAnyCompletedTodos = useStore(appStore, (state) => state.todos.some((todo) => todo.completed));

  if (!hasAnyCompletedTodos) {
    return null;
  }

  return (
    <button className="clear-completed" onClick={clearCompletedTodos}>
      Clear completed
    </button>
  );
}
