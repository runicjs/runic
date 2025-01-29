import './index.css';

import { useStore } from '../runic-react';
import './App.css';
import { countStore, decrement, increment } from './stores/count';

function App() {
  const count = useStore(countStore, (state) => state.count);

  return (
    <>
      <h1>runic</h1>

      <div className="card">
        <button onClick={decrement}>-</button>
        <span>{count}</span>
        <button onClick={increment}>+</button>
      </div>
    </>
  );
}

export default App;
