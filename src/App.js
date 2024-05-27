import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import ScoreCard from './ScoreCard';
import SoundPlayer from './SoundPlayer';

const ItemTypes = {
  CARD: 'card',
};

const DraggableCard = ({ property }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { property, dropped: false };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} className={`draggable-card ${isDragging ? 'dragging' : ''}`}>
      {property}
    </div>
  );
};


const DroppableArea = ({ type, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      onDrop(type, item);
      monitor.getItem().dropped = true;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`droppable-area ${isOver ? 'highlight' : ''}`}>
      {children}
    </div>
  );
};

const App = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [complexityScores, setComplexityScores] = useState(null);
  const [sentimentScores, setSentimentScores] = useState(null);
  const [concretenessScores, setConcretenessScores] = useState(null);
  const [emotionalIntensityScores, setEmotionalIntensityScores] = useState(null);
  const [scores, setScores] = useState([]);
  const [mappings, setMappings] = useState({});

  const webURL = 'https://nlp-sonify-be.vercel.app';

  const onSubmit = async (data) => {
    try {
      const endpoints = [
        webURL + '/api/v2/complexity-scores',
        webURL + '/api/v2/sentiment-scores',
        webURL + '/api/v2/concreteness-scores',
        webURL + '/api/v2/emotional-intensity-scores'
      ];
      const promises = endpoints.map(endpoint => axios.post(endpoint, { text: data.inputText }));
      const responses = await Promise.all(promises);

      const [complexity, sentiment, concreteness, emotionalIntensity] = responses.map(response => JSON.parse(response.data.choices[0].message.content));
      
      setComplexityScores(complexity);
      setSentimentScores(sentiment);
      setConcretenessScores(concreteness);
      setEmotionalIntensityScores(emotionalIntensity);

      setScores([
        { word: 'Complexity', score: complexity },
        { word: 'Sentiment', score: sentiment },
        { word: 'Concreteness', score: concreteness },
        { word: 'Emotional Intensity', score: emotionalIntensity }
      ]);

      reset();

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  };

  const handleDrop = (audioType, item) => {
    if (!item.dropped) {
      setMappings((prevMappings) => ({
        ...prevMappings,
        [item.property]: audioType,
      }));
      item.dropped = true;
    }
  };

  const textProperties = ['Complexity', 'Sentiment', 'Concreteness', 'Emotional Intensity'];
  const audioProperties = ['Frequency', 'Volume', 'Duration', 'Pan'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center">
        <div className="w-full max-w-screen-lg p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <textarea {...register('inputText', { required: true })} className="w-full h-48 p-2 mb-4 border rounded" />
            {errors.inputText && <p className="text-red-500">This field is required</p>}
            <button type="submit" className="p-4 bg-blue-500 text-white rounded mx-auto block">Go!</button>
          </form>

          <div className="text-properties mb-4">
            {textProperties.map((prop) => (
              <DraggableCard key={prop} property={prop} />
            ))}
          </div>

          <div className="audio-properties mb-4">
            {audioProperties.map((prop) => (
              <DroppableArea key={prop} type={prop} onDrop={handleDrop}>
                <div className="audio-card">{prop}</div>
              </DroppableArea>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ScoreCard title="Complexity Scores" scores={complexityScores} tooltiptext={"tooltip"} />
            <ScoreCard title="Sentiment Scores" scores={sentimentScores} tooltiptext={"tooltip"} />
            <ScoreCard title="Concreteness Scores" scores={concretenessScores} tooltiptext={"tooltip"} />
            <ScoreCard title="Emotional Intensity Scores" scores={emotionalIntensityScores} tooltiptext={"tooltip"} />
          </div>

          <SoundPlayer mappings={mappings} scores={scores} />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
