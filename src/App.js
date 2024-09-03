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
import SoundGraph from './SoundGraph';

const mappingFunctions = {
  frequency: (score) => 220 + (score * 420), // (score) => 440 + (score * 220)
  duration: (score) => 0.5 + (score * 0.5),
  //waveform: (score) => ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(score * 4)],
  detune: (score) => -1200 + (score * 1200),
  volume: (score) => -30 + (score * 50)
};

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
      // Fetch scores data from the API
      const response = await fetch(`${webURL}/api/v4/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.inputText }),
      });
  
      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse the response body as JSON and set the scores data
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
  
      // Read the response stream to completion and concatenate the chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
  
      // Decode any remaining bytes and parse the JSON
      result += decoder.decode(); // Decode any remaining bytes
      const jsonResponse = JSON.parse(result);

      // Extract choices.message.content from the response
      //const scores = jsonResponse[0].choices.map(choice => JSON.parse(choice.message.content))[0];

      // Extract and combine choices.message.content from all objects in the response
      // Assuming the schema requires combining objects
      const scores = jsonResponse
      .flatMap(responseObj => responseObj.choices)
      .map(choice => JSON.parse(choice.message.content))
      .reduce((acc, curr) => {
        // Assuming the schema requires combining objects
        for (const key in curr) {
          if (curr.hasOwnProperty(key)) {
            if (Array.isArray(curr[key])) {
              acc[key] = (acc[key] || []).concat(curr[key]);
            } else {
              acc[key] = curr[key];
            }
          }
        }
        return acc;
      }, {});

      console.log('Scores:', scores);

      setScoresData(scores);

      setShouldPlaySound(true);

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle DND events
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
                    <h3 className="text-lg font-semibold">{textParam.replace(' Score', '')}</h3>
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


        <ScoreMapper mappings={mappings}>
          {(mappedScores) => (
            <>
              <ScoreGraph mappedScores={mappedScores} />
              {shouldPlaySound && (
                <SoundPlayer mappedScores={mappedScores} onSoundPlayed={() => setShouldPlaySound(false)} />
              )}
            </>
          )}
        </ScoreMapper>
      

        <div className="grid grid-cols-4 gap-4 m-10">
        </div>

      </div>
    </div>
  );
};

export default App;
