import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores }) => {
  useEffect(() => {
    // Define the mappings from scores to sound parameters
    const frequency = (scores.complexityScores + 1) * 440; // Map complexity scores to frequency
    const waveform = scores.sentimentScores > 0 ? 'sine' : 'square'; // Map sentiment scores to waveform
    const duration = (scores.concretenessScores + 1) * 0.5; // Map concreteness scores to duration
    const volume = (scores.emotionalIntensityScores + 1) * -6; // Map emotional intensity scores to volume

    // Create a synth and connect it to the master output (your speakers)
    const synth = new Tone.Synth({
      oscillator: { type: waveform },
      volume: volume
    }).toDestination();

    // Play a note for the duration based on concreteness score
    synth.triggerAttackRelease(frequency, duration);

    // Cleanup the synth when the component unmounts
    return () => {
      synth.dispose();
    };
  }, [scores]);

  return null; // This component doesn't render anything
};

export default SoundPlayer;
