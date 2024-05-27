import React, { useEffect } from 'react';
import * as Tone from 'tone';

const SoundPlayer = ({ mappings, scores }) => {
  useEffect(() => {
    const mapScoreToFrequency = (score) => 440 + (score * 220);
    const mapScoreToVolume = (score) => -30 + (score * 30);
    const mapScoreToDuration = (score) => 0.5 + (score * 0.5);
    const mapScoreToPan = (score) => score;

    const synth = new Tone.Synth().toDestination();

    scores.forEach((scoreObj, index) => {
      const { word, complexity, sentiment, concreteness, emotionalIntensity } = scoreObj;
      
      const frequency = mappings['Frequency'] === 'Complexity' ? mapScoreToFrequency(complexity || 0) :
                        mappings['Frequency'] === 'Sentiment' ? mapScoreToFrequency(sentiment || 0) :
                        mappings['Frequency'] === 'Concreteness' ? mapScoreToFrequency(concreteness || 0) :
                        mapScoreToFrequency(emotionalIntensity);

      const volume = mappings['Volume'] === 'Complexity' ? mapScoreToVolume(complexity) :
                     mappings['Volume'] === 'Sentiment' ? mapScoreToVolume(sentiment) :
                     mappings['Volume'] === 'Concreteness' ? mapScoreToVolume(concreteness) :
                     mapScoreToVolume(emotionalIntensity);

      const duration = mappings['Duration'] === 'Complexity' ? mapScoreToDuration(complexity) :
                       mappings['Duration'] === 'Sentiment' ? mapScoreToDuration(sentiment) :
                       mappings['Duration'] === 'Concreteness' ? mapScoreToDuration(concreteness) :
                       mapScoreToDuration(emotionalIntensity);

      const pan = mappings['Pan'] === 'Complexity' ? mapScoreToPan(complexity) :
                  mappings['Pan'] === 'Sentiment' ? mapScoreToPan(sentiment) :
                  mappings['Pan'] === 'Concreteness' ? mapScoreToPan(concreteness) :
                  mapScoreToPan(emotionalIntensity);

      synth.volume.value = 0;
      synth.pan.value = 1;
      
      synth.triggerAttackRelease(440, 1, Tone.now() + (index * 1.1));
    });

    return () => {
      synth.dispose();
    };
  }, [scores, mappings]);

  return <div>Playing sounds based on the text analysis scores.</div>;
};

export default SoundPlayer;
