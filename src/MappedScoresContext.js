import React, { createContext, useContext, useState } from 'react';

const MappedScoresContext = createContext();

export const useMappedScores = () => useContext(MappedScoresContext);

export const MappedScoresProvider = ({ children }) => {
  const [mappedScores, setMappedScores] = useState([]);

  return (
    <MappedScoresContext.Provider value={{ mappedScores, setMappedScores }}>
      {children}
    </MappedScoresContext.Provider>
  );
};