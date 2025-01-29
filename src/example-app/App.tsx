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

function App() {
  const count = useStore(store, (state) => state.count);

  const increment = () => {
    store.setState((draft) => {
      draft.count++;
    });
  };

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
