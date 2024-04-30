import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import ResultsListAPI from './features/ResultsList/components/ResultsListAPI';
import TestAPI from './features/ResultsList/components/TestAPI';

/* function App() {
  return (
    <div className="App">
      4/23/2024
      <ResultsListAPI />
      <TestAPI />
    </div>

  );
} */

const App = () => {
  //const [inputText, setInputText] = useState('');
  //const [result, setResults] = useState(null);

  //const handleInputChange = (event) => {
  //  setInputText(event.target.value);
  //};
  const webURL = 'https://nlp-sonify-be.vercel.app';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(webURL + '/api/analyze', { text: data.inputText });
      console.log(response.data);
      reset();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text App</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('inputText', { required: true })} />
            {errors.inputText && <p>This field is required</p>}
            <button type="submit">Ok</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
