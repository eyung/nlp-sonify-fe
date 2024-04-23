import './App.css';
import React, { useState } from 'react';
import ResultsListAPI from './features/ResultsList/components/ResultsListAPI';
import TestAPI from './features/ResultsList/components/TestAPI';

/* function App() {
  return (
    <div className="App">
      4/23/2024
      <ResultsListAPI />
      <TestAPI />
    </div>

  );
} */

function App() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    // Make API call to your Node.js backend with inputText
    const response = await fetch('/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();
    setAnalysisResult(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text App</h1>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text..."
        />
        <button onClick={handleSubmit}>Analyze</button>
        {analysisResult && (
          <div>
            <h2>Result:</h2>
            {/* Render the analysis result here */}
            {/* Example: <p>{analysisResult}</p> */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
