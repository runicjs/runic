import { useStore } from '@runicjs/runic-react';
import { AppState, appStore, selectIncompleteTodos } from '../stores';

const selectIncompleteCount = (state: AppState) => selectIncompleteTodos(state).length;

export default function RemainingCount() {
  const incompleteCount = useStore(appStore, selectIncompleteCount);

  return (
    <span className="todo-count">
      <strong>{incompleteCount}</strong> {incompleteCount === 1 ? 'item' : 'items'} left
    </span>
  );
}
