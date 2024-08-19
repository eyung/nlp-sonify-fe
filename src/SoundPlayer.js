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
          type: 'sine', // change this to 'triangle', 'square', etc.
        },
        envelope: {
          attack: 0.5,
          decay: 0.1,
          sustain: 0.3,
          release: 0.5,
        },
      }).toDestination();

      // Add effects
      const reverb = new Tone.Reverb({
        decay: 1,
        preDelay: 0.01,
      }).toDestination();

      const delay = new Tone.FeedbackDelay({
        delayTime: '8n',
        feedback: 0.2,
      }).toDestination();

      const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();

      const phaser = new Tone.Phaser({
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 350,
      }).toDestination();
      const distortion = new Tone.Distortion(0.4).toDestination();

      // Connect synth to effects
      synth.chain(reverb, delay, chorus, phaser, distortion);

      // Define chord progressions
      const chords = {
        C: ['C4', 'E4', 'G4'],
        G: ['G3', 'B3', 'D4'],
        Am: ['A3', 'C4', 'E4'],
        F: ['F3', 'A3', 'C4'],
      };

      // Define the royal road chord progression
      const chordRoyalRoad = [
        ['F3', 'A3', 'C4', 'E4'], // IVM7
        ['G3', 'B3', 'D4', 'F4'], // V7
        ['E3', 'G3', 'B3', 'D4'], // iii7
        ['A3', 'C4', 'E4', 'G4'], // vi
      ];

      // Function to map scores to chords
      const mapScoreToChord = (score) => {
        const index = Math.floor(score * chordRoyalRoad.length);
        return chordRoyalRoad[index];
      };

      mappedScores.forEach((scoreObj, index) => {
        const { frequency, duration, detune, volume, score } = scoreObj;

        console.log(`Playing sound for word: ${scoreObj.word}`);
        console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Detune: ${detune}`);

        // Choose a chord based on some logic
        //const chord = chords.C;
        const chord = mapScoreToChord(score);

        //synth.triggerAttackRelease(chord, duration, Tone.now() + (index * 1.1), volume);
        synth.triggerAttackRelease(chord, duration, Tone.now() + (index * 1.1), volume, detune);

      });

      // Clean up Tone.js context on unmount
      return () => {
        synth.dispose();
        reverb.dispose();
        delay.dispose();
        chorus.dispose();
        phaser.dispose();
        distortion.dispose();
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