import './index.css';

import { createStore } from '../runic';
import { useStore } from '../runic-react';
import './App.css';

type State = {
  count: number;
};

const store = createStore<State>({
  count: 0,
});

const increment = () => {
  store.setState((draft) => {
    draft.count++;
  });
};

function App() {
  const count = useStore(store, (state) => state.count);

  return (
    <>
      <h1>runic</h1>

      <div className="card">
        <button onClick={increment}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
