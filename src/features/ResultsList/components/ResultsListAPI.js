import React, { useState } from 'react';
import ResultsList from './ResultsList';
import Button from './Button';
import Textbox from './TextBox';

function ResultsListAPI() {
  const webURL = 'https://nlp-sonify-be.vercel.app';

  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(webURL + '/api/wordnet/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: inputText }),
      });
      //if (!response.ok) {
      //  throw new Error('API request failed');
      //}
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Textbox value={inputText} onChange={setInputText} />
      <Button onClick={fetchData} />
      <ResultsList results={results} />
    </div>
  );
}

export default ResultsListAPI;