import React from 'react';
import { useScores } from './ScoreContext';

// ScoreMapper component
const ScoreMapper = ({ mappings, children }) => {
  const { scoresData } = useScores();

  //console.log('Scores:', scoresData);

  // Check if scoresData is available
  if (!scoresData) {
    console.error('ScoreMapper: scoresData is not available');
    return null;
  }
  
  // Determine if scoresData contains sentences or is directly the array of sentences
  c//onst sentences = scoresData.sentences || scoresData;

  //console.log('Sentences:', sentences);

  //if (!Array.isArray(sentences)) {
  //  console.error('ScoreMapper: scoresData malformed');
  //  return null;
  //}

  // Extract and map scores to the desired parameters
  const mappedScores = scoresData.map(sentence => {
    const wordScores = sentence.word;
    const mappedScore = {};

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