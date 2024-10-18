import React, { useState } from 'react';
import './App.css';
import { useForm } from 'react-hook-form';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable';
import Draggable from './Draggable';
import SoundPlayer from './SoundPlayer';
import ScoreMapper from './ScoreMapper';
import ScoreGraph from './ScoreGraph';
import StatusBar from './StatusBar';
import { useAppState } from '../hooks/useAppState';
import { useFetchScores } from './useFetchScores';
import TextForm from './TextForm.tsx';

const App = () => {
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

      //setShowScoreMapper(true);
      //setShowScoreGraph(true);
  
      return newMappings;
    });
  };

  return (
      <div className="flex justify-center">
        <div className="main-content w-full max-w-screen-lg p-4">
          
          <TextForm handleFormSubmitWrapper={handleFormSubmitWrapper} /> 

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
