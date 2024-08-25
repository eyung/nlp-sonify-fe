import React from 'react';
import './App.css';

// Process the scores from the API response
// and return an object with the scores separated by type
// e.g. { complexityScores: { word: score }, sentimentScores: { word: score }, ... }
// To be used in the ScoreCard components
const processScores = (data) => {
  // Ensure the data has the "sentences" root schema
  const root = data.sentences ? data : { sentences: [data] };

  const complexityScores = {};
  const sentimentScores = {};
  const concretenessScores = {};
  const emotionalIntensityScores = {};

 // console.log('Root:', root);

  root.sentences.forEach(sentence => {
    for (const [word, scores] of Object.entries(sentence)) {
      complexityScores[word] = scores["Complexity Score"];
      sentimentScores[word] = scores["Sentiment Analysis Score"];
      concretenessScores[word] = scores["Concreteness Score"];
      emotionalIntensityScores[word] = scores["Emotional-Intensity Score"];
    }
  });

  return {
    complexityScores,
    sentimentScores,
    concretenessScores,
    emotionalIntensityScores
  };  
};

// ScoreCard component
const ScoreCard = ({ title, scores, tooltiptext }) => (
  <div className="relative card p-2 bg-white shadow-sm rounded-lg">
    <div className="absolute top-0 right-0 p-1">
      <div className="tooltip">
        <i className="fas fa-question-circle text-gray-400"></i>
        <span className="tooltiptext bg-gray-100 text-gray-700 p-2 rounded-md shadow-lg">{tooltiptext}</span>
      </div>
    </div>
    <div className="card-body p-6">
      <h2 className="text-l font-semibold text-gray-800">{title}</h2>
      {scores && Object.entries(scores).map(([word, score]) => (
        <p key={word} className="mt-2 text-sm text-gray-600">{`${word}: ${score}`}</p>
      ))}
    </div>
  </div>
);

export { processScores };
export default ScoreCard;