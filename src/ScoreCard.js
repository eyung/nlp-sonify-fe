import React from 'react';

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

export default ScoreCard;
