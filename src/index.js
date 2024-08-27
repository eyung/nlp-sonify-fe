import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ScoreProvider } from './ScoreContext';
import { sendToVercelAnalytics } from './vitals';

const Root = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState({});

  useEffect(() => {
    if (isLoading) {
      setBackgroundStyle({
        background: 'linear-gradient(45deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))',
        backgroundSize: '200% 200%',
        animation: 'gradientMove 3s ease infinite',
      });
    } else {
      setBackgroundStyle({
        background: 'linear-gradient(45deg, var(--gradient-middle), var(--gradient-end))',
      });
    }
  }, [isLoading]);

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