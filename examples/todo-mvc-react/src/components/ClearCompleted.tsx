import { useRune } from '@runicjs/runic-react';
import * as app from '../stores/app';

// TODO: Why does this need to be outside of the component?
const selectHasCompletedTodos = (state: app.State) => state.todos.some((todo) => todo.completed);

export default function Filters() {
  const hasCompletedTodos = useRune(app.rune, selectHasCompletedTodos);

  if (!hasCompletedTodos) {
    return null;
  }

  return (
    <button className="clear-completed" onClick={app.clearCompletedTodos}>
      Clear completed
    </button>
  );
}
