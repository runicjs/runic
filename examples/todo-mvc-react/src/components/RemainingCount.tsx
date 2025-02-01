import { useRune } from '@runicjs/runic-react';
import * as app from '../stores/app';

const selectIncompleteCount = (state: app.State) => {
  return state.todos.reduce((acc, todo) => {
    return acc + (!todo.completed ? 1 : 0);
  }, 0);
};

export default function RemainingCount() {
  const incompleteCount = useRune(app.rune, selectIncompleteCount);

  return (
    <span className="todo-count">
      <strong>{incompleteCount}</strong> {incompleteCount === 1 ? 'item' : 'items'} left
    </span>
  );
}
