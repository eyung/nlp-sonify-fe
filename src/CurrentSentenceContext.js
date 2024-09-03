import React, { createContext, useState, useContext } from 'react';

const CurrentSentenceContext = createContext();

export const useCurrentSentence = () => useContext(CurrentSentenceContext);

export const CurrentSentenceProvider = ({ children }) => {
  const [currentSentence, setCurrentSentence] = useState('');

  return (
    <CurrentSentenceContext.Provider value={{ currentSentence, setCurrentSentence }}>
      {children}
    </CurrentSentenceContext.Provider>
  );
};