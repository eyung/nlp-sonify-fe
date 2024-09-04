import React, { useEffect } from 'react';
import { useScores } from './ScoreContext';
import { useMappedScores } from './MappedScoresContext';

const ScoreMapper = React.memo(({ mappings }) => {
  const { scoresData } = useScores();
  const { setMappedScores } = useMappedScores();

  useEffect(() => {
    let mappedScores = [];
    try {
      mappedScores = scoresData.sentences.map(sentence => {
        const { word, ...wordScores } = sentence;
        const mappedScore = { word };

        for (const [key, value] of Object.entries(wordScores)) {
          if (mappings[key]) {
            mappedScore[mappings[key].parameter] = mappings[key].mapFunction(value);
          } else {
            mappedScore[key] = value;
          }
        }
        return mappedScore;
      });
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('r.sentences is undefined')) {
        // Ignore error with undefined sentences that are thrown in Firefox
      } else if (error instanceof TypeError && error.message.includes('Cannot read properties of undefined')) {
        // Ignore error with undefined sentences that are thrown in Chrome
      } else {
        throw error;
      }
    }

    setMappedScores(mappedScores);
  }, [scoresData, mappings, setMappedScores]);

  return null;
});

export default ScoreMapper;