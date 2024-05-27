import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores }) => {
  useEffect(() => {
    // Function to map scores to sound parameters
    const waveforms = ['sine', 'square', 'triangle', 'sawtooth'];
    const mapScoreToWaveform = (score) => waveforms[Math.floor((score + 1) * waveforms.length / 2)]; // Select a waveform
    const mapScoreToFrequency = (score) => 440 + (score * 220); // Standard frequency A4 (440 Hz) ± 220 Hz
    const mapScoreToVolume = (score) => -30 + (score * 30); // Volume -60 dB to 0 dB
    const mapScoreToDuration = (score) => 0.5 + (score * 0.5); // Duration 0s to 1s

    const synth = new Tone.Synth().toDestination();

    scores.forEach(({ word, complexity, sentiment, concreteness, emotionalIntensity }, index) => {
      const frequency = mapScoreToFrequency(complexity);
      const volume = mapScoreToVolume(emotionalIntensity);
      const duration = mapScoreToDuration(sentiment);
      const waveform = mapScoreToWaveform(concreteness);

      synth.oscillator.type = waveform;
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
