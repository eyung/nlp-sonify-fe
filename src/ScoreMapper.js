import React from 'react';
import { useScores } from './ScoreContext';

// ScoreMapper component
const ScoreMapper = ({ mappings, children }) => {
  const { scoresData } = useScores();

  //console.log('ScoreMapper: scoresData:', scoresData);

  // Check if scoresData is available
  if (!scoresData) {
    console.error('ScoreMapper: scoresData is not available');
    return null;
  }

  // Create an array from the JSON object
  let sentences;
  try {
    sentences = Object.entries(scoresData).map(([word, scores]) => ({ word, ...scores }));
  } catch (error) {
    console.error('ScoreMapper: Failed to convert scoresData to array', error);
    return null;
  }

  // Log the structure of sentences
  console.log('ScoreMapper: sentences:', sentences);

  // Extract and map scores to the desired parameters
  const mappedScores = sentences.map(sentence => {
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