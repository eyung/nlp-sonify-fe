import { useCallback } from 'react';
import { useAppStateContext } from './AppStateContext';
//import { useAppState } from './hooks/useAppState';
import { useScores } from './ScoreContext';

export const useFetchScores = () => {
    const webURL = 'https://nlp-sonify-be.vercel.app'; 
    //const { setIsLoading } = useAppStateContext();
    const { setScoresData } = useScores();
    //const { setShowScoreMapper, setShowScoreGraph, setShouldPlaySound } = useAppState();
    const { setIsLoading, setShowScoreMapper, setShowScoreGraph, setShouldPlaySound } = useAppStateContext();

    const fetchScores = useCallback(async (data) => {
        setIsLoading(true);

        try {
            // Fetch scores data from the API
            const response = await fetch(`${webURL}/api/v4/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: data.inputText }),
            });
        
            // Check if the response is ok
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            // Parse the response body as JSON and set the scores data
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let result = '';
        
            // Read the response stream to completion and concatenate the chunks
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }
        
            // Decode any remaining bytes and parse the JSON
            result += decoder.decode(); // Decode any remaining bytes
            const jsonResponse = JSON.parse(result);
    
            // Extract and combine choices.message.content from all objects in the response
            // Assuming the schema requires combining objects
            const scores = jsonResponse
            .flatMap(responseObj => responseObj.choices)
            .map(choice => JSON.parse(choice.message.content))
            .reduce((acc, curr) => {
            // Schema requires combining objects
            for (const key in curr) {
                if (curr.hasOwnProperty(key)) {
                    if (Array.isArray(curr[key])) {
                        acc[key] = (acc[key] || []).concat(curr[key]);
                    } else {
                        acc[key] = curr[key];
                    }
                }
            }
            return acc;
            }, {});
    
            console.log('Scores:', scores);
    
            setScoresData(scores);
            //setShowScoreMapper(true);
            setShowScoreGraph(true);
            setShouldPlaySound(true);
    
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
  }, [setScoresData, setIsLoading]);

  return fetchScores;
};