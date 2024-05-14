import './App.css';
import '@fortawesome/fontawesome-free/css/all.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ScoreCard = ({ title, score, tooltiptext }) => (
  <div className="relative card p-2 bg-white shadow-sm rounded-lg">
    <div className="absolute top-0 right-0 p-1">
      <div className="tooltip">
        <i className="fas fa-question-circle text-gray-400"></i>
        <span className="tooltiptext bg-gray-100 text-gray-700 p-2 rounded-md shadow-lg">{tooltiptext}</span>
      </div>
    </div>
    <div className="card-body p-6">
      <h2 className="text-l font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{score}</p>
    </div>
  </div>
);


const ScoreCard2 = ({ title, scores, tooltiptext }) => (
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
      const endpoints = [webURL + '/api/v2/complexity-scores',
        webURL + '/api/v2/sentiment-scores', 
        webURL + '/api/concreteness-scores', 
        webURL + '/api/emotional-intensity-scores'];
      const promises = endpoints.map(endpoint => axios.post(endpoint, { text: data.inputText }));
      const responses = await Promise.all(promises);
      const [concreteness, emotionalIntensity] = responses.map(response => response.data.choices[0].message.content);

      const [complexity, sentiment] = responses.map(response => JSON.parse(response.data.choices[0].message.content));
      

      setComplexityScores(complexity);
      setSentimentScores(sentiment);
      setConcretenessScores(concreteness);
      setEmotionalIntensityScores(emotionalIntensity);
      reset();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }

    console.log(sentimentScores);
  };

  // Map scores to colors
  const gradientColors = {
    complexity: complexityScores ? `rgba(${complexityScores * 255}, 0, 0, 0.5)` : 'transparent',
    sentiment: sentimentScores ? `rgba(0, ${sentimentScores[0] * 255}, 0, 0.5)` : 'transparent',
    concreteness: concretenessScores ? `rgba(0, 0, ${concretenessScores * 255}, 0.5)` : 'transparent',
    emotionalIntensity: emotionalIntensityScores ? `rgba(${emotionalIntensityScores * 255}, ${emotionalIntensityScores * 255}, 0, 0.5)` : 'transparent',
  };

  // style = {{background: `linear-gradient(45deg, ${gradientColors.complexity}, ${gradientColors.sentiment}, ${gradientColors.concreteness}, ${gradientColors.emotionalIntensity})`}}
  return (
    <div className="w-3/4 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <textarea {...register('inputText', { required: true })} className="w-full h-48 p-2 mb-4 border rounded" />
        {errors.inputText && <p className="text-red-500">This field is required</p>}
        <button type="submit" className="p-4 bg-blue-500 text-white rounded mx-auto block">Go!</button>
      </form>

      <div className="grid grid-cols-2 gap-4">
        <ScoreCard2 title="Complexity Scores" score={complexityScores} tooltiptext={"tooltip"}/>
        <ScoreCard2 title="Sentiment Scores" score={sentimentScores} tooltiptext={"tooltip"}/>
        <ScoreCard title="Concreteness Scores" score={concretenessScores} tooltiptext={"tooltip"}/>
        <ScoreCard title="Emotional Intensity Scores" score={emotionalIntensityScores} tooltiptext={"tooltip"}/>
      </div>
    </div>
  );

};

export default App;