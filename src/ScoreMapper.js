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
          //console.log(`Mapping key: ${key}, value: ${value}`);
          //console.log(`Mapping function: ${mappings[key].mapFunction}`);
          mappedScore[mappings[key].parameter] = mappings[key].mapFunction(value);
        } else {
          mappedScore[key] = value;
        }
      }
      return mappedScore;
    });

  // scoresData is empty because app is loading for the first time
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('r.sentences is undefined')) {
      // Ignore error with undefined sentences that are thrown in Firefox
    } else if (error instanceof TypeError && error.message.includes('Cannot read properties of undefined')) {
      // Ignore error with undefined sentences that are thrown in Chrome
    } else {
      throw error; // Re-throw other errors
    }
  }

return children(mappedScores);
};

export default ScoreMapper;