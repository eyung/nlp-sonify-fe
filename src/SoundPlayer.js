import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ scores, textualToAudioMapping }) => {
  useEffect(() => {
    // Function to map scores to sound parameters
    const mapScoreToFrequency = (score) => 440 + (score * 220); // Standard frequency A4 (440 Hz) ± 220 Hz
    const mapScoreToVolume = (score) => -30 + (score * 30); // Volume -30 dB to 0 dB
    const mapScoreToDuration = (score) => 0.5 + (score * 0.5); // Duration 0.5s to 1s
    const mapScoreToVibratoFrequency = (score) => 5 + (score * 5); // Vibrato frequency from 5Hz to 10Hz

    const synth = new Tone.Synth().toDestination();
    const vibrato = new Tone.Vibrato().toDestination();
    synth.connect(vibrato);

    // Function to get mapped audio property based on textual property
    const getMappedAudioProperty = (textualProp, score) => {
      const mapping = textualToAudioMapping.find(mapping => mapping.textual === textualProp);
      if (!mapping || !mapping.audio) return null;

      switch (mapping.audio) {
        case 'pitch':
          return mapScoreToFrequency(score);
        case 'volume':
          return mapScoreToVolume(score);
        case 'duration':
          return mapScoreToDuration(score);
        case 'vibrato':
          return mapScoreToVibratoFrequency(score); // Use vibrato frequency mapping
        default:
          return null;
      }
    };

    // Generate sounds based on scores and mappings
    scores.forEach(({ word, complexity, sentiment, concreteness, emotionalIntensity }, index) => {
      const frequency = getMappedAudioProperty('complexity', complexity);
      const volume = getMappedAudioProperty('emotionalIntensity', emotionalIntensity);
      const duration = getMappedAudioProperty('sentiment', sentiment);
      const vibratoFrequency = getMappedAudioProperty('vibrato', concreteness); 

      if (frequency !== null) synth.frequency.value = frequency;
      if (volume !== null) synth.volume.value = volume;
      if (vibratoFrequency !== null) vibrato.frequency.value = vibratoFrequency;

      synth.triggerAttackRelease(frequency || 440, duration || 1, Tone.now() + (index * 1.1));
    });

    // Clean up Tone.js context on unmount
    return () => {
      synth.dispose();
      vibrato.dispose();
    };
  }, [scores, textualToAudioMapping]);

  return <div>Playing sounds based on the text analysis scores.</div>;
};

export default SoundPlayer;
