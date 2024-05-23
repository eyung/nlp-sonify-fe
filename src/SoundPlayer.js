import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores }) => {
  useEffect(() => {
    // Create a synth and connect it to the master output (your speakers)
    const synth = new Tone.Synth().toDestination();

    // Define the mappings from scores to sound parameters
    scores.forEach((scoreSet, index) => {
      const frequency = (scoreSet.complexity + 1) * 220; // Map complexity scores to frequency
      const waveform = scoreSet.sentiment > 0 ? 'sine' : 'square'; // Map sentiment scores to waveform
      const duration = (scoreSet.concreteness + 1) * 0.5; // Map concreteness scores to duration
      const volume = (scoreSet.emotionalIntensity + 1) * -6; // Map emotional intensity scores to volume

      // Update the synth settings for each note
      synth.oscillator.type = waveform;
      synth.volume.value = volume;

      // Play a note for the duration based on concreteness score
      synth.triggerAttackRelease(frequency, duration, Tone.now() + index * (duration + 0.1)); // Add a small delay between notes
    });

    // Cleanup the synth when the component unmounts
    return () => {
      synth.dispose();
    };
  }, [scores]);

  return null; // This component doesn't render anything
};

export default SoundPlayer;
