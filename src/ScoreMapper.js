const ScoreMapper = ({ scores, mappings, children }) => {
    const mappedScores = scores.map(score => {
      // Apply mappings to each score
      const mappedScore = {};
      for (const [key, value] of Object.entries(score)) {
        if (mappings[key]) {
          mappedScore[key] = mappings[key].mapFunction(value);
        } else {
          mappedScore[key] = value;
        }
      }
      return mappedScore;
    });
  
    return children(mappedScores);
  };