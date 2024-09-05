import React from 'react';
import { useCurrentSentence } from './CurrentSentenceContext';

const StatusBar = () => {
  const { currentSentence } = useCurrentSentence();

  console.log('Rendering StatusBar with currentSentence:', currentSentence);

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white text-center p-2">
      {currentSentence ? `Playing: ${currentSentence}` : 'No sentence is being played'}
    </div>
  );
};

export default StatusBar;