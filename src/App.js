import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ScoreCard = ({ title, score }) => (
  <div className="p-4 border rounded">
    <h2 className="text-xl font-bold">{title}</h2>
    <p className="mt-2">{score}</p>
  </div>
);

const App = () => {

  const webURL = 'https://nlp-sonify-be.vercel.app';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [complexityScores, setComplexityScores] = useState(null);
  const [sentimentScores, setSentimentScores] = useState(null);
  const [concretenessScores, setConcretenessScores] = useState(null);
  const [emotionalIntensityScores, setEmotionalIntensityScores] = useState(null);
  
  const onSubmit = async (data) => {
    try {
      const endpoints = ['/complexity-scores', '/sentiment-scores', '/concreteness-scores', '/emotional-intensity-scores'];
      const promises = endpoints.map(endpoint => axios.post(endpoint, { text: data.inputText }));
      const responses = await Promise.all(promises);
      const [complexity, sentiment, concreteness, emotionalIntensity] = responses.map(response => response.data.choices[0].message.content);
      setComplexityScores(complexity);
      setSentimentScores(sentiment);
      setConcretenessScores(concreteness);
      setEmotionalIntensityScores(emotionalIntensity);
      reset();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <textarea {...register('inputText', { required: true })} className="w-full p-2 mb-4 border rounded" />
        {errors.inputText && <p className="text-red-500">This field is required</p>}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Analyze</button>
      </form>
      <div className="grid grid-cols-2 gap-4">
        <ScoreCard title="Complexity Scores" score={complexityScores} />
        <ScoreCard title="Sentiment Scores" score={sentimentScores} />
        <ScoreCard title="Concreteness Scores" score={concretenessScores} />
        <ScoreCard title="Emotional Intensity Scores" score={emotionalIntensityScores} />
      </div>
    </div>
  );

};

export default App;