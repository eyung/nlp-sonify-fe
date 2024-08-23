import React from 'react';
import ScoreGraph from './ScoreGraph';

// ScoreMapper component
const ScoreMapper = ({ scores, mappings, children }) => {

    // Map scores to the desired parameters
    const mappedScores = scores.map(score => {
      const mappedScore = {};

      // Map each score 
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
  
    return (
      <>
        {typeof children === 'function' ? children(mappedScores) : children}
        <ScoreGraph mappedScores={mappedScores} />
      </>
    );
  };
  export default ScoreMapper;