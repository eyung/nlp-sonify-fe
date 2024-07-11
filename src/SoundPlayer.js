import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores, onSoundPlayed }) => {
  useEffect(() => {

    const playSound = async () => {

      await Tone.start(); // Start the audio context

      // Function to map scores to sound parameters
      const waveforms = ['sine', 'square', 'triangle', 'sawtooth'];
      const mapScoreToWaveform = (score) => {
        const index = Math.floor((score + 1) * waveforms.length / 2);
        return waveforms[Math.max(0, Math.min(waveforms.length - 1, index))];
      };
      const mapScoreToFrequency = (score) => 440 + (score * 220); // Standard frequency A4 (440 Hz) ± 220 Hz
      const mapScoreToVolume = (score) => -30 + (score * 30); // Volume -60 dB to 0 dB
      const mapScoreToDuration = (score) => 0.5 + (score * 0.5); // Duration 0s to 1s

      // Clean up previous Tone.js context
      const context = new Tone.Context();
      Tone.setContext(context);

      const synth = new Tone.Synth().toDestination();

      scores.forEach(({ word, complexity, sentiment, concreteness, emotionalIntensity }, index) => {
        const frequency = mapScoreToFrequency(complexity);
        const volume = mapScoreToVolume(emotionalIntensity);
        const duration = mapScoreToDuration(sentiment);
        const waveform = mapScoreToWaveform(concreteness);

        console.log(`Playing sound for word: ${word}`);
        console.log(`Complexity: ${complexity}, Sentiment: ${sentiment}, Concreteness: ${concreteness}, Emotional Intensity: ${emotionalIntensity}`);
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
