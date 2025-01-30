import { useStore } from '@runicjs/runic-react';
import { appStore } from '../stores';
import ClearCompleted from './ClearCompleted';
import FilterButtons from './FilterButtons';
import RemainingCount from './RemainingCount';

export default function Filters() {
  const total = useStore(appStore, (state) => state.todos.length);

  if (total === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <RemainingCount />
      <FilterButtons />
      <ClearCompleted />
    </footer>
  );
}
