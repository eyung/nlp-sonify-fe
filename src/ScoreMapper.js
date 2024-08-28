import React from 'react';
import { useScores } from './ScoreContext';

// ScoreMapper component
const ScoreMapper = ({ mappings, children }) => {
  const { scoresData } = useScores();

  console.log('ScoreMapper: scoresData:', scoresData);

  let mappedScores = [];
  try {
    // Extract and map scores to the desired parameters
    mappedScores = scoresData.sentences.map(sentence => {
      const { word, ...wordScores } = sentence;
      const mappedScore = { word };

      // Map each score 
      for (const [key, value] of Object.entries(wordScores)) {
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
  } catch (error) {
    console.error('Error mapping scores:', error);
    // Optionally, you can set a fallback state or show an error message to the user
  }

return children(mappedScores);
};

export default ScoreMapper;