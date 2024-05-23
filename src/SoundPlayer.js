import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores }) => {
  useEffect(() => {
    // Function to map scores to sound parameters
    const mapScoreToFrequency = (score) => 440 + (score * 220); // A4 (440 Hz) ± 220 Hz
    const mapScoreToVolume = (score) => -30 + (score * 30); // -30 dB to 0 dB
    const mapScoreToDuration = (score) => 0.5 + (score * 0.5); // 0.5s to 1s

    const synth = new Tone.Synth().toDestination();

    scores.forEach(({ word, complexity, sentiment, concreteness, emotionalIntensity }, index) => {
      const frequency = mapScoreToFrequency(complexity);
      const volume = mapScoreToVolume(emotionalIntensity);
      const duration = mapScoreToDuration(sentiment);

      synth.triggerAttackRelease(frequency, duration, Tone.now() + (index * 1.1), volume);
    });

    // Clean up Tone.js context on unmount
    return () => {
      synth.dispose();
    };
  }, [scores]);

  return <div>Playing sounds based on the text analysis scores.</div>;
};

export default SoundPlayer;
