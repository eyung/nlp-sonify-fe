import React, { useEffect, useState } from 'react';
import { useScores } from './ScoreContext';

const StatusBar = () => {
  const { scoresData } = useScores();
  const [currentSentence, setCurrentSentence] = useState('');

  useEffect(() => {
    if (scoresData.sentences && scoresData.sentences.length > 0) {
      // Assuming the first sentence is the one being played
      setCurrentSentence(scoresData.sentences[0].word);
    }
  }, [scoresData]);

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white text-center p-2">
      {currentSentence ? `Playing: ${currentSentence}` : 'No sentence is being played'}
    </div>
  );
};

export default StatusBar;