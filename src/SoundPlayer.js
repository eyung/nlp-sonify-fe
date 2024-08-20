import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ mappedScores, onSoundPlayed }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const synthRef = useRef(null);
  const effectsRef = useRef({});

  useEffect(() => {
    const createSound = async () => {
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

      // Store references
      synthRef.current = synth;
      effectsRef.current = { reverb, delay, chorus, phaser, distortion };

      // Function to calculate chord frequencies
      const calculateChordFrequencies = (rootFrequency) => {
        const semitoneRatio = Math.pow(2, 1/12);

        // Helper function to calculate frequency for a given number of semitones from the root
        const getFrequency = (semitones) => {
          const frequency = rootFrequency * Math.pow(semitoneRatio, semitones);
          return Math.max(20, Math.min(frequency, 2000)); // Limit frequency range between 20Hz and 2000Hz
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

      // Play sound based on mappedScores
      mappedScores.forEach((scoreObj, index) => {
        const { frequency, duration, detune, volume } = scoreObj;

        console.log(`Playing sound for word: ${scoreObj.word}`);
        console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Detune: ${detune}`);

        // Calculate chord frequencies based on the root frequency
        const chords = calculateChordFrequencies(frequency);

        // Play the chords in the progression
        //synth.triggerAttackRelease(frequency, duration, Tone.now() + (index * 1.1), volume, detune);
        const progression = [chords.IVM7, chords.V7, chords.iii7, chords.vi];
        progression.forEach((chord, chordIndex) => {
          synth.triggerAttackRelease(chord, duration, Tone.now() + (index * 1.1) + (chordIndex * duration), volume, detune);
        });

      });

    };

    if (isPlaying) {
      createSound();

      const totalDuration = mappedScores.length * 1.1; // Assuming each score takes 1.1 seconds
      const startTime = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        setProgress((elapsedTime / totalDuration) * 100);

        if (elapsedTime >= totalDuration) {
          handleStop();
        }
      }, 100);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, mappedScores]);

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
    clearInterval(intervalRef.current);
    if (synthRef.current) {
      synthRef.current.releaseAll();
      synthRef.current.dispose();
    }
    if (effectsRef.current) {
      Object.values(effectsRef.current).forEach(effect => effect.dispose());
    }
    if (onSoundPlayed) {
      onSoundPlayed();
    }
  };

  return (
    <div>
      <button onClick={isPlaying ? handleStop : handleStart}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
      <div className="progress-bar" style={{ width: `${progress}%`, height: '10px', background: 'blue' }}></div>
      {isPlaying && <div>Playing...</div>}
    </div>
  );
};

export default SoundPlayer;