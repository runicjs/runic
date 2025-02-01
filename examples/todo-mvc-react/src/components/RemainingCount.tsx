import { useRune } from '@runicjs/runic-react';
import * as app from '../stores/app';

// TODO: Why does this need to be outside of the component?
const selectIncompleteCount = (state: app.State) => app.selectIncompleteTodos(state).length;

export default function RemainingCount() {
  const incompleteCount = useRune(app.rune, selectIncompleteCount);

  return (
    <span className="todo-count">
      <strong>{incompleteCount}</strong> {incompleteCount === 1 ? 'item' : 'items'} left
    </span>
  );
}
