import React from 'react';
import { useScores } from './ScoreContext';

// ScoreMapper component
const ScoreMapper = ({ mappings, children }) => {
  const { scoresData } = useScores();

  console.log('ScoreMapper: scoresData:', scoresData);

  // Extract and map scores to the desired parameters
  const mappedScores = scoresData.sentences.map(sentence => {
    const { word, ...wordScores } = sentence;
    const mappedScore = { word };

    //console.log('wordScores keys:', Object.keys(wordScores));
    //console.log('mappings keys:', Object.keys(mappings));

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

return children(mappedScores);
};

export default ScoreMapper;