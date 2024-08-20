import React, { useState, useEffect, useRef } from 'react';
import SoundPlayer from './SoundPlayer';

const AudioController = ({ mappedScores }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isPlaying) {
      const totalDuration = mappedScores.length * 1.1; // Assuming each score takes 1.1 seconds
      const startTime = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        setProgress((elapsedTime / totalDuration) * 100);

        if (elapsedTime >= totalDuration) {
          handleStop();
        }
      }, 100);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, mappedScores]);

  return (
    <div>
      <button onClick={isPlaying ? handleStop : handleStart}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
      <div className="progress-bar" style={{ width: `${progress}%`, height: '10px', background: 'blue' }}></div>
      {isPlaying && <SoundPlayer mappedScores={mappedScores} onSoundPlayed={handleStop} />}
    </div>
  );
};

export default AudioController;