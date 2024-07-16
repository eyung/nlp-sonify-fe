import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores, mappings, onSoundPlayed }) => {
  useEffect(() => {

    const playSound = async () => {

      // Start the audio context
      await Tone.start();

      // Clean up previous Tone.js context
      // Create a new Tone.js context and synth
      const context = new Tone.Context();
      Tone.setContext(context);
      const synth = new Tone.Synth().toDestination();

      // Play sounds based on scores
      scores.forEach((scoreObj, index) => {
        const soundParameters = {};

        // Map each score to a sound parameter using the dynamic mappings
        for (const [scoreName, scoreValue] of Object.entries(scoreObj)) {
          if (mappings[scoreName]) {
            const { mapFunction, parameter } = mappings[scoreName];
            soundParameters[parameter] = mapFunction(scoreValue);
          }
        }

        const { frequency, duration, waveform, volume } = soundParameters;

        console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Waveform: ${waveform}`);

        if (['sine', 'square', 'triangle', 'sawtooth'].includes(waveform)) {
          synth.oscillator.type = waveform;
          synth.triggerAttackRelease(frequency, duration, Tone.now() + (index * 1.1), volume);
        } else {
          console.error(`Invalid waveform: ${waveform}`);
        }
      });

      // Notify parent component that the sound has been played
      onSoundPlayed();

      // Clean up Tone.js context on unmount
      return () => {
        synth.dispose();
        context.dispose();
      };
    };

    // Call playSound when component mounts
    playSound();

  }, [scores, mappings, onSoundPlayed]); // Include mappings in the dependency array

  // Existing component return statement...
};

export default SoundPlayer;
