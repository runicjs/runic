import Filters from './components/Filters';
import Footer from './components/Footer';
import Header from './components/Header';
import Todos from './components/Todos';

function App() {
  return (
    <div className="margin-auto">
      <section className="todoapp">
        <Header />
        <Todos />
        <Filters />
      </section>

      <Footer />
    </div>
  );
}

export default App;
