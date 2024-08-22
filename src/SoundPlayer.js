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

      // Create a PolySynth for polyphonic sound
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
          type: 'sine', // change this to 'sine', 'triangle', 'square', etc.
        },
        envelope: {
          attack: 0.1,
          decay: 0.1,
          sustain: 0.3,
          release: 0.8,
        },
      }).toDestination();

      // Add effects
      const reverb = new Tone.Reverb({
        decay: 2,
        preDelay: 0.01,
      }).toDestination();

      const delay = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.1,
      }).toDestination();

      const chorus = new Tone.Chorus(4, 1.5, 0.5).toDestination();

      const phaser = new Tone.Phaser({
        frequency: 0.5,
        octaves: 2,
        baseFrequency: 500,
      }).toDestination();

      const distortion = new Tone.Distortion(0.1).toDestination();

      const stereoWidener = new Tone.StereoWidener(0.3).toDestination();

      // Connect synth to effects
      synth.chain(reverb, delay, chorus, phaser, distortion, stereoWidener);

      // Function to calculate chord frequencies
      const calculateChordFrequencies = (rootFrequency) => {
        const semitoneRatio = Math.pow(2, 1/12);

        // Helper function to calculate frequency for a given number of semitones from the root
        const getFrequency = (semitones) => {
          const frequency = rootFrequency * Math.pow(semitoneRatio, semitones);
          return Math.max(20, Math.min(frequency, 1000)); // Limit frequency range between 20Hz and 2000Hz
        };

        // IVM7 (Major 7th chord)
        const IVM7 = [getFrequency(5), getFrequency(9), getFrequency(12), getFrequency(16)];

        // V7 (Dominant 7th chord)
        const V7 = [getFrequency(7), getFrequency(11), getFrequency(14), getFrequency(17)];

        // iii7 (Minor 7th chord)
        const iii7 = [getFrequency(4), getFrequency(7), getFrequency(11), getFrequency(14)];

        // vi (Minor chord)
        const vi = [getFrequency(9), getFrequency(12), getFrequency(16)];

        return { IVM7, V7, iii7, vi };
      };

      mappedScores.forEach((scoreObj, index) => {
        const { frequency, duration, detune, volume } = scoreObj;

        console.log(`Playing sound for word: ${scoreObj.word}`);
        console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Detune: ${detune}`);

        // Calculate chord frequencies based on the root frequency
        const chords = calculateChordFrequencies(frequency);

        

        // Play the chords in the progression
        //synth.triggerAttackRelease(frequency, duration, Tone.now() + (index * 1.1), volume, detune);
        const progression = [chords.IVM7, chords.V7, chords.iii7, chords.vi];

        const chordSpacing = 0; // Increase this value for wider spacing between chords

        progression.forEach((chord, chordIndex) => {
          synth.triggerAttackRelease(
            chord, 
            duration, 
            Tone.now() + (index * 1.1) + (chordIndex * duration * chordSpacing), 
            volume, 
            detune
          );
        });

      });

      // Clean up Tone.js context on unmount
      return () => {
        synth.dispose();
        reverb.dispose();
        delay.dispose();
        chorus.dispose();
        phaser.dispose();
        distortion.dispose();
        stereoWidener.dispose();
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