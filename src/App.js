import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import { useScores } from './ScoreContext';
import SoundPlayer from './SoundPlayer';
import ScoreMapper from './ScoreMapper';
import ScoreGraph from './ScoreGraph';

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

const App = ({ setIsLoading }) => {
  const webURL = 'https://nlp-sonify-be.vercel.app';

  // Form state
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Use context for scores data
  const { scoresData, setScoresData } = useScores();

  // State to control sound playback
  const [shouldPlaySound, setShouldPlaySound] = useState(false);
  
  // Default mappings of text parameters to audio parameters when loading app for first time
  const [mappings, setMappings] = useState({
    'Complexity Score': {
      parameter: 'frequency',
      mapFunction: mappingFunctions.frequency
    },
    'Sentiment Analysis Score': {
      parameter: 'duration',
      mapFunction: mappingFunctions.duration
    },
    'Concreteness Score': {
      parameter: 'detune',
      mapFunction: mappingFunctions.detune
    },
    'Emotional-Intensity Score': {
      parameter: 'volume',
      mapFunction: mappingFunctions.volume
    }
  });

  const handlePlaySound = () => {
    setShouldPlaySound(true);
  };

  const handleStopSound = () => {
    setShouldPlaySound(false);
  };

  // Scores data
  const handleFormSubmit = async (data) => {

    setIsLoading(true); // Set loading to true when starting the request

    try {
      const response = await axios.post(`${webURL}/api/v2/scores`, { text: data.inputText });
      //const combinedScores = response.data;
      //const combinedScores = response.data.choices[0].message.content;
      //responses.map(response => JSON.parse(response.data.choices[0].message.content));
      const scores = JSON.parse(response.data.choices[0].message.content);

      setScoresData(scores);

      setShouldPlaySound(true); // Set shouldPlaySound to true when form is submitted

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle DND drop events
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
      
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4">
          <textarea {...register('inputText', { required: true })} className="w-full h-96 p-2 mb-4 border rounded" />
          {errors.inputText && <p className="text-red-500">This field is required</p>}
          <button 
            type="submit" 
            className={"p-4 rounded-full bg-blue-500 focus:outline-none btn"} 
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
            {Object.keys(mappings).map((textParam) => (
                <Droppable key={textParam} id={textParam}>
                  <div className="p-4 border rounded">
                    <h3 className="text-lg font-semibold">{textParam}</h3>
                    <p>Mapped to: {mappings[textParam].parameter}</p>
                  </div>
                </Droppable>
              ))}
            </div>
            <div className="flex justify-around mt-4">
              {Object.keys(mappingFunctions).map((audioParam) => (
                <Draggable key={audioParam} id={audioParam}>
                  <div className="p-4 bg-gray-200 rounded">
                    <p>{audioParam}</p>
                  </div>
                </Draggable>
              ))}
          </div>
        </DndContext>

        <div className="flex justify-around mt-4">
          {shouldPlaySound && (
            <ScoreMapper mappings={mappings}>
              {(mappedScores) => (
                <>
                  
                  {shouldPlaySound && <SoundPlayer mappedScores={mappedScores} onSoundPlayed={() => setShouldPlaySound(false)} />}
                  
                  <ScoreGraph mappedScores={mappedScores} />
    
                </>
              )}
            </ScoreMapper>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 m-10">
        </div>

      </div>
    </div>
  );
};

export default App;
