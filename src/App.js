import './App.css';
import ResultsListAPI from './features/ResultsList/components/ResultsListAPI';
import TestAPI from './features/ResultsList/components/TestAPI';

function App() {
  return (
    <div className="App">
      Refugee Camp for Lost Languages
      <ResultsListAPI />
      <TestAPI />
    </div>

  );
}

export default App;
