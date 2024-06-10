import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores, textualToAudioMapping }) => {
  useEffect(() => {
    // Function to map scores to sound parameters
    const waveforms = ['sine', 'square', 'triangle', 'sawtooth'];
    const mapScoreToWaveform = (score) => waveforms[Math.floor((score + 1) * waveforms.length / 2)]; // Select a waveform
    const mapScoreToFrequency = (score) => 440 + (score * 220); // Standard frequency A4 (440 Hz) ± 220 Hz
    const mapScoreToVolume = (score) => -30 + (score * 30); // Volume -30 dB to 0 dB
    const mapScoreToDuration = (score) => 0.5 + (score * 0.5); // Duration 0.5s to 1s

    const synth = new Tone.Synth().toDestination();

    const getMappedAudioProperty = (textualProp, score) => {
      const mapping = textualToAudioMapping.find(mapping => mapping.textual === textualProp);
      if (!mapping || !mapping.audio) return null;
      
      switch (mapping.audio) {
        case 'waveform':
          return mapScoreToWaveform(score);
        case 'pitch':
          return mapScoreToFrequency(score);
        case 'volume':
          return mapScoreToVolume(score);
        case 'duration':
          return mapScoreToDuration(score);
        default:
          return null;
      }
    };

    scores.forEach(({ word, complexity, sentiment, concreteness, emotionalIntensity }, index) => {
      const frequency = getMappedAudioProperty('complexity', complexity);
      const volume = getMappedAudioProperty('emotionalIntensity', emotionalIntensity);
      const duration = getMappedAudioProperty('sentiment', sentiment);
      const waveform = getMappedAudioProperty('concreteness', concreteness);

      if (frequency !== null) synth.oscillator.type = waveform;
      if (waveform !== null) synth.oscillator.type = waveform;

      synth.triggerAttackRelease(frequency || 440, duration || 1, Tone.now() + (index * 1.1), volume || -12);
    });

    // Clean up Tone.js context on unmount
    return () => {
      synth.dispose();
    };
  }, [scores, textualToAudioMapping]);

  return <div>Playing sounds based on the text analysis scores.</div>;
};

export default SoundPlayer;
