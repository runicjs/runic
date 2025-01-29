import './index.css';

import { countStore, decrement, increment } from '@/example-app/stores/count';
import { useStore } from '@/runic-react';
import './App.css';

function App() {
  const count = useStore(countStore, (state) => state.count);

  return (
    <>
      <h1>runic</h1>

      <div className="card">
        <button onClick={decrement}>-</button>
        <span className="count">{count}</span>
        <button onClick={increment}>+</button>
      </div>
    </>
  );
}

export default App;
