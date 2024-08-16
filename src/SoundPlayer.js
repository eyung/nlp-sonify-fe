import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ mappedScores, onSoundPlayed }) => {
  useEffect(() => {
    const playSound = async () => {
      await Tone.start(); // Start the audio context

      //const waveforms = ['sine', 'square', 'triangle', 'sawtooth'];

      // Clean up previous Tone.js context
      const context = new Tone.Context();
      Tone.setContext(context);

      const synth = new Tone.Synth().toDestination();

      

      mappedScores.forEach((scoreObj, index) => {
        const { frequency, duration, detune, volume } = scoreObj;

        console.log(`Playing sound for word: ${scoreObj.word}`);
        console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Detune: ${detune}`);

        //if (waveforms.includes(waveform)) {
          //synth.oscillator.type = waveform; // Set waveform
        synth.oscillator.detune.value = detune; // Set the detune value
        synth.triggerAttackRelease(frequency, duration, Tone.now() + (index * 1.1), volume);
        //} else {
          //console.error(`Invalid waveform: ${waveform}`);
        //}
      });

      // Clean up Tone.js context on unmount
      return () => {
        synth.dispose();
        reverb.dispose();
        delay.dispose();
      };
    };

    // Call playSound when component mounts
    playSound();

    // Notify parent component that the sound has been played
    onSoundPlayed();

  }, [mappedScores, onSoundPlayed]);

  return <div>Playing...</div>;
};

export default SoundPlayer;