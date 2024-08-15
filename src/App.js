import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import SoundPlayer from './SoundPlayer';
import ScoreMapper from './ScoreMapper';

const ScoreCard = ({ title, scores, tooltiptext }) => {
  //console.log('Rendering ScoreCard with scores:', scores);
  return (
    <div className="relative card p-2 bg-white shadow-sm rounded-lg">
      <div className="absolute top-0 right-0 p-1">
        <div className="tooltip">
          <i className="fas fa-question-circle text-gray-400"></i>
          <span className="tooltiptext bg-gray-100 text-gray-700 p-2 rounded-md shadow-lg">{tooltiptext}</span>
        </div>
      </div>
      <div className="card-body p-6">
        <h2 className="text-l font-semibold text-gray-800">{title}</h2>
        {scores && Object.entries(scores).map(([word, score]) => (
          <p key={word} className="mt-2 text-sm text-gray-600">{`${word}: ${score}`}</p>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const webURL = 'https://nlp-sonify-be.vercel.app';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [complexityScores, setComplexityScores] = useState(null);
  const [sentimentScores, setSentimentScores] = useState(null);
  const [concretenessScores, setConcretenessScores] = useState(null);
  const [emotionalIntensityScores, setEmotionalIntensityScores] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [shouldPlaySound, setShouldPlaySound] = useState(false);
  const [mappings, setMappings] = useState({
    complexity: null,
    sentiment: null,
    concreteness: null,
    emotionalIntensity: null,
  });
  const [isLoading, setIsLoading] = useState(false); // state for loading

  const onSubmit = async (data) => {

    setIsLoading(true); // Set loading to true when starting the request

    try {
      const response = await axios.post(`${webURL}/api/v1/scores`, { text: data.inputText });
      //const combinedScores = response.data;
      //const combinedScores = response.data.choices[0].message.content;
      //responses.map(response => JSON.parse(response.data.choices[0].message.content));
      const combinedScores = JSON.parse(response.data.choices[0].message.content);

      const complexity = {};
      const sentiment = {};
      const concreteness = {};
      const emotionalIntensity = {};

      Object.entries(combinedScores).forEach(([word, scores]) => {
        complexity[word] = scores['Complexity Score'];
        sentiment[word] = scores['Sentiment Analysis Score'];
        concreteness[word] = scores['Concreteness Score'];
        emotionalIntensity[word] = scores['Emotional-Intensity Score'];
      });

      setComplexityScores(complexity);
      setSentimentScores(sentiment);
      setConcretenessScores(concreteness);
      setEmotionalIntensityScores(emotionalIntensity);

      setSoundPlayed(true);
      setShouldPlaySound(true); // Set shouldPlaySound to true when form is submitted
      reset();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    } finally {
      setIsLoading(false); // Set loading to false when the request is complete
    }
  };

  const handleDrop = (textParam, audioParam) => {
    const mappingFunctions = {
      frequency: (score) => 440 + (score * 220),
      duration: (score) => 0.5 + (score * 0.5),
      //waveform: (score) => ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(score * 4)],
      detune: (score) => -1200 + (score * 1200),
      volume: (score) => -30 + (score * 30)
    };
  
    setMappings(prevMappings => {
      const newMappings = { ...prevMappings };
  
      // Find if the audioParam is already mapped to another textParam
      const existingTextParam = Object.keys(newMappings).find(key => newMappings[key]?.parameter === audioParam);
  
      if (existingTextParam) {
        // Swap the mappings
        const temp = newMappings[textParam];
        newMappings[textParam] = newMappings[existingTextParam];
        newMappings[existingTextParam] = temp;
      } else {
        // Set the new mapping
        newMappings[textParam] = {
          parameter: audioParam,
          mapFunction: mappingFunctions[audioParam] || ((value) => value) // Default to identity function if no mapping function is found
        };
      }
  
      return newMappings;
    });
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <textarea {...register('inputText', { required: true })} className="w-full h-48 p-2 mb-4 border rounded" />
          {errors.inputText && <p className="text-red-500">This field is required</p>}
          <button type="submit" className="p-4 bg-blue-500 text-white rounded mx-auto block">Go!</button>
        </form>

        <DndContext onDragEnd={({ active, over }) => {
          if (over) {
            handleDrop(over.id, active.id);
          }
        }}>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {['complexity', 'sentiment', 'concreteness', 'emotionalIntensity'].map(param => (
              <Droppable key={param} id={param}>
                <div className="p-4 border rounded">
                  <h3 className="text-lg font-semibold">{param}</h3>
                  {mappings[param] && <p>Mapped to: {mappings[param].parameter}</p>}
                </div>
              </Droppable>
            ))}
          </div>

          <div className="flex justify-around mt-4">
            {['frequency', 'duration', 'detune', 'volume'].map(param => (
              <Draggable key={param} id={param}>
                <div className="p-4 bg-gray-200 rounded">
                  <p>{param}</p>
                </div>
              </Draggable>
            ))}
          </div>
        </DndContext>

        {shouldPlaySound && (
          <ScoreMapper
            scores={Object.keys(complexityScores).map((word) => ({
              word,
              complexity: complexityScores[word],
              sentiment: sentimentScores[word],
              concreteness: concretenessScores[word],
              emotionalIntensity: emotionalIntensityScores[word],
            }))}
            mappings={mappings}
          >
            {(mappedScores) => {
              console.log('Mapped Scores:', mappedScores);
              return (
                <SoundPlayer
                  mappedScores={Array.isArray(mappedScores) ? mappedScores : []}
                  onSoundPlayed={() => {
                    setSoundPlayed(false);
                    setShouldPlaySound(false); // Reset shouldPlaySound after playing sound
                  }}
                />
              );
            }}
          </ScoreMapper>
        )}

      <div className="grid grid-cols-2 gap-4">
        <ScoreCard title="Complexity Scores" scores={complexityScores} tooltiptext={"tooltip"} />
        <ScoreCard title="Sentiment Scores" scores={sentimentScores} tooltiptext={"tooltip"} />
        <ScoreCard title="Concreteness Scores" scores={concretenessScores} tooltiptext={"tooltip"} />
        <ScoreCard title="Emotional Intensity Scores" scores={emotionalIntensityScores} tooltiptext={"tooltip"} />
      </div>

      </div>
    </div>
  );
};

export default App;
