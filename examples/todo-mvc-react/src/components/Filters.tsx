import { useRune } from '@runicjs/runic-react';
import { memo } from 'react';
import * as app from '../stores/app';
import ClearCompleted from './ClearCompleted';
import FilterButtons from './FilterButtons';
import RemainingCount from './RemainingCount';

// TODO: Why does this need to be outside of the component?
const selectHasTodos = (state: app.State) => state.todos.length > 0;

const Filters = memo(() => {
  const hasTodos = useRune(app.rune, selectHasTodos);

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
