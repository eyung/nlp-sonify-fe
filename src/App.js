//import './App.css';
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
  
  // Set scores from API results
  const onSubmit = async (data) => {
    try {
      const endpoints = [webURL + '/api/complexity-scores',
        webURL + '/api/sentiment-scores', 
        webURL + '/api/concreteness-scores', 
        webURL + '/api/emotional-intensity-scores'];
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

  // Map scores to colors
  const gradientColors = {
    complexity: complexityScores ? `rgba(${complexityScores}, 0, 0, 0.5)` : 'transparent',
    sentiment: sentimentScores ? `rgba(0, ${sentimentScores}, 0, 0.5)` : 'transparent',
    concreteness: concretenessScores ? `rgba(0, 0, ${concretenessScores}, 0.5)` : 'transparent',
    emotionalIntensity: emotionalIntensityScores ? `rgba(${emotionalIntensityScores}, ${emotionalIntensityScores}, 0, 0.5)` : 'transparent',
  };


  return (
    <div className="h-screen flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-auto">
        <textarea {...register('inputText', { required: true })} className="w-full h-full resize-none" />
        {errors.inputText && <p className="text-red-500">This field is required</p>}
        <button type="submit" className="self-center mb-4 bg-blue-500 text-white rounded">Go</button>
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