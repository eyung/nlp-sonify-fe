import React from 'react';
import { useCurrentSentence } from './CurrentSentenceContext';

const StatusBar = () => {
  const { currentSentence } = useCurrentSentence();

  //console.log('Rendering StatusBar with currentSentence:', currentSentence);

  return (
    <div className="fixed bottom-0 w-full bg-gray-500 text-white text-center p-2">
      {currentSentence ? `Playing: ${currentSentence}` : ' '}
    </div>
  );
};

export default StatusBar;