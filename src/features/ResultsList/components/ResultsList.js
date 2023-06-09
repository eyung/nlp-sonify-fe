import React from 'react';

function ResultsList({ results }) {
  return (
    <div>
      <h1>API Results</h1>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result.word} - {result.lexFilenum} - {results.lexname}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResultsList;