import React, { useState, useEffect } from 'react';
import SoundPlayer from './SoundPlayer';

const TextHighlighter = ({ text, mappedScores }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = text.split('. ');

  const handleSoundPlayed = (index) => {
    setCurrentSentenceIndex(index);
  };

  return (
    <div>
      <SoundPlayer mappedScores={mappedScores} onSoundPlayed={handleSoundPlayed} />
      <textarea
        value={text}
        readOnly
        style={{ width: '100%', height: '200px', whiteSpace: 'pre-wrap' }}
      />
      <div>
        {sentences.map((sentence, index) => (
          <span
            key={index}
            style={{
              backgroundColor: index === currentSentenceIndex ? 'yellow' : 'transparent',
            }}
          >
            {sentence}.{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextHighlighter;