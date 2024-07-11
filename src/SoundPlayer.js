import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores, onSoundPlayed }) => {
  useEffect(() => {

    const playSound = async () => {

      await Tone.start(); // Start the audio context

      // Function to map scores to sound parameters
      const waveforms = ['sine', 'square', 'triangle', 'sawtooth'];

      // Mapping configuration
      const mappings = {
        complexity: {
          mapFunction: (score) => 440 + (score * 220), // Frequency
          parameter: 'frequency'
        },
        sentiment: {
          mapFunction: (score) => 0.5 + (score * 0.5), // Duration
          parameter: 'duration'
        },
        concreteness: {
          mapFunction: (score) => {
            const index = Math.floor((score + 1) * waveforms.length / 2);
            return waveforms[Math.max(0, Math.min(waveforms.length - 1, index))];
          }, // Waveform
          parameter: 'waveform'
        },
        emotionalIntensity: {
          mapFunction: (score) => -30 + (score * 30), // Volume
          parameter: 'volume'
        }
      };

      // Clean up previous Tone.js context
      const context = new Tone.Context();
      Tone.setContext(context);

      const synth = new Tone.Synth().toDestination();

      scores.forEach((scoreObj, index) => {
        const soundParameters = {};

        // Map each score to a sound parameter
        for (const [scoreName, scoreValue] of Object.entries(scoreObj)) {
          if (mappings[scoreName]) {
            const { mapFunction, parameter } = mappings[scoreName];
            soundParameters[parameter] = mapFunction(scoreValue);
          }
        }

        const { frequency, duration, waveform, volume } = soundParameters;

        console.log(`Playing sound for word: ${scoreObj.word}`);
        console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Waveform: ${waveform}`);

        if (waveforms.includes(waveform)) {
          synth.oscillator.type = waveform;
          synth.triggerAttackRelease(frequency, duration, Tone.now() + (index * 1.1), volume);
        } else {
          console.error(`Invalid waveform: ${waveform}`);
        }
      });

      // Clean up Tone.js context on unmount
      return () => {
        synth.dispose();
        //context.dispose();
      };
    };

    // Call playSound when component mounts
    playSound();

    // Notify parent component that the sound has been played
    onSoundPlayed();

  }, [scores, onSoundPlayed]);

  return <div>Playing sounds based on the text analysis scores.</div>;
};

export default SoundPlayer;
