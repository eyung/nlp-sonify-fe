import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import WaveSurfer from 'wavesurfer.js';

const SoundPlayer = ({ mappedScores, onSoundPlayed }) => {

  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    const playSound = async () => {
      await Tone.start(); // Start the audio context

      //const waveforms = ['sine', 'square', 'triangle', 'sawtooth'];

      // Clean up previous Tone.js context
      const context = new Tone.Context();
      Tone.setContext(context);

      //const synth = new Tone.Synth().toDestination();

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

      // Create a buffer to store the audio
      const buffer = new Tone.Buffer();

      // Render the audio to the buffer
      await Tone.Offline(() => {
        mappedScores.forEach((scoreObj, index) => {
          const { frequency, duration, detune, volume } = scoreObj;

          console.log(`Playing sound for word: ${scoreObj.word}`);
          console.log(`Mapped values -> Frequency: ${frequency}, Volume: ${volume}, Duration: ${duration}, Detune: ${detune}`);

          synth.triggerAttackRelease(frequency, duration, index * 1.1, volume);
        });
      }, mappedScores.length * 1.1).then((renderedBuffer) => {
        buffer.set(renderedBuffer);
      });

      // Check if waveformRef.current is not null before initializing WaveSurfer
      if (waveformRef.current) {
        // Initialize WaveSurfer
        waveSurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: 'violet',
          progressColor: 'purple',
          backend: 'MediaElement',
        });

        // Load the buffer into WaveSurfer
        waveSurferRef.current.loadDecodedBuffer(buffer.get());

        // Play the sound
        waveSurferRef.current.on('ready', () => {
          waveSurferRef.current.play();
        });
      } else {
        console.error('waveformRef.current is null');
      }

      // Clean up Tone.js context on unmount
      return () => {
        synth.dispose();
        reverb.dispose();
        delay.dispose();
        chorus.dispose();
        phaser.dispose();
        distortion.dispose();
        if (waveSurferRef.current) {
          waveSurferRef.current.destroy();
        }
      };
    };

    // Call playSound when component mounts
    playSound();

    // Notify parent component that the sound has been played
    onSoundPlayed();

  }, [mappedScores, onSoundPlayed]);

  return <div ref={waveformRef} className="waveform" />;
};

export default SoundPlayer;