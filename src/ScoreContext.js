import React, { createContext, useState, useContext } from 'react';

const ScoreContext = createContext();

export const useScores = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }) => {
  const [scoresData, setScoresData] = useState(null);

  return (
    <ScoreContext.Provider value={{ scoresData, setScoresData }}>
      {children}
    </ScoreContext.Provider>
  );
};