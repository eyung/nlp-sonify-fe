import React from 'react';

const ScoreMapper = ({ scores, mappings }) => {
  const mappedScores = scores.map(scoreObj => {
    const mappedValues = {};

    for (const [scoreName, scoreValue] of Object.entries(scoreObj)) {
      if (mappings[scoreName]) {
        const { mapFunction, parameter } = mappings[scoreName];
        mappedValues[parameter] = mapFunction(scoreValue);
      }
    }

    return { ...scoreObj, ...mappedValues };
  });

  return mappedScores;
};

export default ScoreMapper;