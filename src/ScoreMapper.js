import React from 'react';
import { useScores } from './ScoreContext';

// ScoreMapper component
const ScoreMapper = ({ mappings, children }) => {
  const { scoresData } = useScores();

  // Check if scoresData is available
  if (!scoresData || !Array.isArray(scoresData)) {
    console.error('ScoreMapper: scoresData is not available or not an array');
    return null;
  }

  // Map scores to the desired parameters
  const mappedScores = scoresData.map(score => {
    const mappedScore = {};

    // Map each score 
    for (const [key, value] of Object.entries(score)) {
      if (mappings[key]) {
          console.log(`Mapping key: ${key}, value: ${value}`);
          console.log(`Mapping function: ${mappings[key].mapFunction}`);
        mappedScore[mappings[key].parameter] = mappings[key].mapFunction(value);
      } else {
        mappedScore[key] = value;
      }
    }
    return mappedScore;
  });

return children(mappedScores);
};

export default ScoreMapper;