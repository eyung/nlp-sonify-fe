import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SoundPlayer from './SoundPlayer';

// Component to display the score card with a tooltip
const ScoreCard = ({ title, scores, tooltiptext }) => (
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

// Component for sortable items using dnd-kit
const SortableItem = ({ id, content }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card">
      {content}
    </div>
  );
};

// Initial state for textual and audio properties
const initialTextualProperties = [
  { id: 'complexity', content: 'Complexity Score' },
  { id: 'sentiment', content: 'Sentiment Score' },
  { id: 'concreteness', content: 'Concreteness Score' },
  { id: 'emotionalIntensity', content: 'Emotional Intensity Score' },
];

const initialAudioProperties = [
  { id: 'volume', content: 'Volume' },
  { id: 'pitch', content: 'Pitch' },
  { id: 'duration', content: 'Duration' },
  { id: 'vibrato', content: 'Vibrato Frequency' }, // Changed to Vibrato Frequency
];

const App = () => {
  const webURL = 'https://nlp-sonify-be.vercel.app';

  // Set up react-hook-form for handling form inputs
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // State variables for scores and properties
  const [complexityScores, setComplexityScores] = useState(null);
  const [sentimentScores, setSentimentScores] = useState(null);
  const [concretenessScores, setConcretenessScores] = useState(null);
  const [emotionalIntensityScores, setEmotionalIntensityScores] = useState(null);
  const [textualProperties, setTextualProperties] = useState(initialTextualProperties);
  const [audioProperties, setAudioProperties] = useState(initialAudioProperties);

  // Set up sensors for drag-and-drop interactions
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      // Endpoints for the backend API calls
      const endpoints = [
        `${webURL}/api/v2/complexity-scores`,
        `${webURL}/api/v2/sentiment-scores`,
        `${webURL}/api/v2/concreteness-scores`,
        `${webURL}/api/v2/emotional-intensity-scores`
      ];

      // Make all API calls concurrently
      const promises = endpoints.map(endpoint => axios.post(endpoint, { text: data.inputText }));
      const responses = await Promise.all(promises);

      // Parse responses and update state
      const [complexity, sentiment, concreteness, emotionalIntensity] = responses.map(response => JSON.parse(response.data.choices[0].message.content));

      setComplexityScores(complexity);
      setSentimentScores(sentiment);
      setConcretenessScores(concreteness);
      setEmotionalIntensityScores(emotionalIntensity);

      reset(); // Reset form after submission

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  };

  // Function to handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    // Check if the item was dragged within the same droppable area
    if (active.id !== over.id) {
      if (textualProperties.some(item => item.id === active.id)) {
        // Reorder textual properties
        setTextualProperties((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        // Reorder audio properties
        setAudioProperties((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };

  // Check if scores are valid for displaying the SoundPlayer component
  const isScoresValid = complexityScores && Object.keys(complexityScores).length > 0 &&
                        sentimentScores && Object.keys(sentimentScores).length > 0 &&
                        concretenessScores && Object.keys(concretenessScores).length > 0 &&
                        emotionalIntensityScores && Object.keys(emotionalIntensityScores).length > 0 &&
                        JSON.stringify(Object.keys(complexityScores)) === JSON.stringify(Object.keys(sentimentScores)) &&
                        JSON.stringify(Object.keys(concretenessScores)) === JSON.stringify(Object.keys(emotionalIntensityScores));

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-lg p-4">
        {/* Form for text input */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <textarea {...register('inputText', { required: true })} className="w-full h-48 p-2 mb-4 border rounded" />
          {errors.inputText && <p className="text-red-500">This field is required</p>}
          <button type="submit" className="p-4 bg-blue-500 text-white rounded mx-auto block">Go!</button>
        </form>

        {/* Display score cards */}
        <div className="grid grid-cols-2 gap-4">
          <ScoreCard title="Complexity Scores" scores={complexityScores} tooltiptext={"tooltip"} />
          <ScoreCard title="Sentiment Scores" scores={sentimentScores} tooltiptext={"tooltip"} />
          <ScoreCard title="Concreteness Scores" scores={concretenessScores} tooltiptext={"tooltip"} />
          <ScoreCard title="Emotional Intensity Scores" scores={emotionalIntensityScores} tooltiptext={"tooltip"} />
        </div>

        {/* Drag and Drop context */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="columns">
            {/* Sortable context for textual properties */}
            <SortableContext items={textualProperties} strategy={verticalListSortingStrategy}>
              <div className="column">
                <h2>Textual Properties</h2>
                {textualProperties.map(({ id, content }) => (
                  <SortableItem key={id} id={id} content={content} />
                ))}
              </div>
            </SortableContext>

            {/* Sortable context for audio properties */}
            <SortableContext items={audioProperties} strategy={verticalListSortingStrategy}>
              <div className="column">
                <h2>Audio Properties</h2>
                {audioProperties.map(({ id, content }) => (
                  <SortableItem key={id} id={id} content={content} />
                ))}
              </div>
            </SortableContext>
          </div>
        </DndContext>

        {/* Render SoundPlayer if scores are valid */}
        {isScoresValid && (
          <SoundPlayer
            scores={Object.keys(complexityScores).map((word) => ({
              word,
              complexity: complexityScores[word],
              sentiment: sentimentScores[word],
              concreteness: concretenessScores[word],
              emotionalIntensity: emotionalIntensityScores[word],
            }))}
            textualToAudioMapping={textualProperties.map((prop, index) => ({
              textual: prop.id,
              audio: audioProperties[index] ? audioProperties[index].id : null
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default App;
