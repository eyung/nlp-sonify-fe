import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import { useScores } from './ScoreContext';
import { MappedScoresProvider, useMappedScores } from './MappedScoresContext';
import SoundPlayer from './SoundPlayer';
import ScoreMapper from './ScoreMapper';
import ScoreGraph from './ScoreGraph';
import SoundGraph from './SoundGraph';
import StatusBar from './StatusBar';
import { useAppState } from './hooks/useAppState';
import { useAppStateContext } from './AppStateContext';
import { useFetchScores } from './useFetchScores';

const App = ({ setIsLoading }) => {
  const {
    shouldPlaySound,
    setShouldPlaySound,
    showScoreMapper,
    setShowScoreMapper,
    showScoreGraph,
    setShowScoreGraph,
    mappings,
    setMappings,
    mappingFunctions,
    handleFormSubmit,
  } = useAppState();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const fetchScores = useFetchScores();

  const handleFormSubmitWrapper = async (data) => {
    await fetchScores(data);
    handleFormSubmit();
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

      setShowScoreMapper(true);
      setShowScoreGraph(true);
  
      return newMappings;
    });
  };

  return (
      <div className="flex justify-center">
        <div className="w-full max-w-screen-lg p-4">
          <form onSubmit={handleSubmit(handleFormSubmitWrapper)} className="mb-4">
            <textarea {...register('inputText', { required: true })} placeholder="" className="w-full h-96 p-2 mb-4 border rounded" />
            {errors.inputText && <p className="text-red-500">This field is required</p>}
            <button type="submit" className={"p-4 rounded-full bg-blue-500 focus:outline-none btn"}>
              <i className="fa fa-play fa-2x text-white" id="play-btn"></i>
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

          {showScoreMapper && (
            <ScoreMapper mappings={mappings} />
          )}

          {showScoreGraph && (
            <ScoreGraph />
          )}

          {shouldPlaySound && (
            <SoundPlayer onSoundPlayed={() => setShouldPlaySound(false)} />
          )}

          <div className="grid grid-cols-4 gap-4 m-10"></div>

          
        </div>
        <StatusBar />
      </div>
  );
};

export default App;
