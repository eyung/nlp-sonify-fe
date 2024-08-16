import React from 'react';

const ScoreMapper = ({ scores, mappings, children }) => {
    const mappedScores = scores.map(score => {
      const mappedScore = {};
      for (const [key, value] of Object.entries(score)) {
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
  
    return children(mappedScores);
  };
  export default ScoreMapper;