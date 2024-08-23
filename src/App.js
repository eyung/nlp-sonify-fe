import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import SoundPlayer from './SoundPlayer';
import ScoreMapper from './ScoreMapper';
import ScoreCard from './ScoreCard';
import ScoreGraph from './ScoreGraph';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// For testing purposes only
const staticData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const mappingFunctions = {
  frequency: (score) => 220 + (score * 420), // (score) => 440 + (score * 220)
  duration: (score) => 0.5 + (score * 0.5),
  //waveform: (score) => ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(score * 4)],
  detune: (score) => -1200 + (score * 1200),
  volume: (score) => -30 + (score * 50)
};

//
// JSON schema for scores
// {
//  "sentences": [
//   {
//    "word": {
//      "Complexity Score": [-1.0 , 1.0],
//      "Sentiment Analysis Score": [-1.0 , 1.0],
//      "Concreteness Score": [-1.0 , 1.0],
//      "Emotional-Intensity Score": [-1.0 , 1.0],
//    }
//   },
//   ...
//

const processScores = (data) => {
  // Ensure the data has the "sentences" root schema
  const root = data.sentences ? data : { sentences: [data] };

  const complexityScores = {};
  const sentimentScores = {};
  const concretenessScores = {};
  const emotionalIntensityScores = {};

  console.log('Root:', root);

  root.sentences.forEach(sentence => {
    for (const [word, scores] of Object.entries(sentence)) {
      complexityScores[word] = scores["Complexity Score"];
      sentimentScores[word] = scores["Sentiment Analysis Score"];
      concretenessScores[word] = scores["Concreteness Score"];
      emotionalIntensityScores[word] = scores["Emotional-Intensity Score"];
    }
  });

  return {
    complexityScores,
    sentimentScores,
    concretenessScores,
    emotionalIntensityScores
  };  
};

const App = ({ setIsLoading, isLoading }) => {
  const webURL = 'https://nlp-sonify-be.vercel.app';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [complexityScores, setComplexityScores] = useState(null);
  const [sentimentScores, setSentimentScores] = useState(null);
  const [concretenessScores, setConcretenessScores] = useState(null);
  const [emotionalIntensityScores, setEmotionalIntensityScores] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [shouldPlaySound, setShouldPlaySound] = useState(false);
  
  // Default mappings of text parameters to audio parameters
  const [mappings, setMappings] = useState({
    complexity: {
      parameter: 'frequency',
      mapFunction: mappingFunctions.frequency
    },
    sentiment: {
      parameter: 'duration',
      mapFunction: mappingFunctions.duration
    },
    concreteness: {
      parameter: 'detune',
      mapFunction: mappingFunctions.detune
    },
    emotionalIntensity: {
      parameter: 'volume',
      mapFunction: mappingFunctions.volume
    },
  });
  //const [isLoading, setIsLoading] = useState(false); // state for loading

  const onSubmit = async (data) => {

    setIsLoading(true); // Set loading to true when starting the request

    try {
      const response = await axios.post(`${webURL}/api/v2/scores`, { text: data.inputText });
      //const combinedScores = response.data;
      //const combinedScores = response.data.choices[0].message.content;
      //responses.map(response => JSON.parse(response.data.choices[0].message.content));
      const combinedScores = JSON.parse(response.data.choices[0].message.content);

      const scores = processScores(combinedScores);

      setComplexityScores(scores.complexityScores);
      setSentimentScores(scores.sentimentScores);
      setConcretenessScores(scores.concretenessScores);
      setEmotionalIntensityScores(scores.emotionalIntensityScores);

      setSoundPlayed(true);
      setShouldPlaySound(true); // Set shouldPlaySound to true when form is submitted
      //reset();

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Set loading to false when the request is complete
    }
  };

  const handleDrop = (textParam, audioParam) => {
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
          <textarea {...register('inputText', { required: true })} className="w-full h-96 p-2 mb-4 border rounded" />
          {errors.inputText && <p className="text-red-500">This field is required</p>}
          <button 
            type="submit" 
            className={`p-4 rounded-full bg-blue-500 focus:outline-none btn ${isLoading ? 'btn-disabled' : ''}`} 
            onclick="play();"
            disabled={isLoading}
          >
            <i class="fa fa-play fa-2x text-white" id="play-btn"></i>
          </button>
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
              //console.log('Mapped Scores:', mappedScores); 

              return (
                <>
                  <SoundPlayer
                    mappedScores={Array.isArray(mappedScores) ? mappedScores : []}
                    onSoundPlayed={() => {
                      setSoundPlayed(false);
                      setShouldPlaySound(false);
                    }}
                  />
                </>
              );
            }}
          </ScoreMapper>
        )}

        <div className="grid grid-cols-4 gap-4 m-10">
          <ScoreCard title="Complexity Scores" scores={complexityScores} tooltiptext={"tooltip"} />
          <ScoreCard title="Sentiment Scores" scores={sentimentScores} tooltiptext={"tooltip"} />
          <ScoreCard title="Concreteness Scores" scores={concretenessScores} tooltiptext={"tooltip"} />
          <ScoreCard title="Emotional Intensity Scores" scores={emotionalIntensityScores} tooltiptext={"tooltip"} />
        </div>

        <div className="mb-4">
          <h1>Simple Line Chart</h1>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={staticData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default App;
