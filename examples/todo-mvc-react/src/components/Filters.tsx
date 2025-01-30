import { useStore } from '@runicjs/runic-react';
import { memo } from 'react';
import { AppState, appStore } from '../stores';
import ClearCompleted from './ClearCompleted';
import FilterButtons from './FilterButtons';
import RemainingCount from './RemainingCount';

const selectHasTodos = (state: AppState) => state.todos.length > 0;

const Filters = memo(() => {
  const hasTodos = useStore(appStore, selectHasTodos);

  if (!hasTodos) {
    return null;
  }

  return (
    <footer className="footer">
      <RemainingCount />
      <FilterButtons />
      <ClearCompleted />
    </footer>
  );
});

export default Filters;
