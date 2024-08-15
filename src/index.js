import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';

const Root = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className={`App ${isLoading ? 'gradient-animation' : ''}`}>
      <App setIsLoading={setIsLoading} />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(sendToVercelAnalytics);