import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { ScoreProvider } from './contexts/ScoreContext';
import { MappedScoresProvider } from './contexts/MappedScoresContext';
import { CurrentSentenceProvider } from './contexts/CurrentSentenceContext';
import { AppStateProvider, useAppStateContext } from './contexts/AppStateContext';
import { useAppState } from './hooks/useAppState';
import { sendToVercelAnalytics } from './vitals';

const Root = () => {
  const appState = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  //const { isLoading, setIsLoading } = useAppStateContext();
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
    <AppStateProvider value={{ appState, isLoading, setIsLoading }}>
      <ScoreProvider>
        <MappedScoresProvider>
          <CurrentSentenceProvider>
            <div className={`App ${isLoading ? 'gradient-animation' : ''}`} style={backgroundStyle}>
              <App setIsLoading={setIsLoading} />
            </div>
          </CurrentSentenceProvider>
        </MappedScoresProvider>
      </ScoreProvider>
    </AppStateProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(sendToVercelAnalytics);