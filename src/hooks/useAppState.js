import { useState, useCallback, useMemo } from 'react';

export const useAppState = () => {
    const [shouldPlaySound, setShouldPlaySound] = useState(false);
    const [showScoreMapper, setShowScoreMapper] = useState(false);
    const [showScoreGraph, setShowScoreGraph] = useState(false);

    const [scoresData, setScoresData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = useCallback(() => {
        setShowScoreMapper(true);
        setShowScoreGraph(true);
        setShouldPlaySound(true);
    }, []);

    // Mapping functions for audio parameters
    const [mappingFunctions, setMappingFunctions] = useState({
        frequency: (score) => 220 + (score * 420), // (score) => 440 + (score * 220)
        duration: (score) => 0.5 + (score * 0.5),
        //waveform: (score) => ['sine', 'square', 'triangle', 'sawtooth'][Math.floor(score * 4)],
        detune: (score) => -1200 + (score * 1200),
        volume: (score) => -30 + (score * 50)
    });

    // Default mappings of text parameters to audio parameters when loading app for first time
    const [mappings, setMappings] = useState({
        'Complexity Score': {
            parameter: 'frequency',
            mapFunction: mappingFunctions.frequency
        },
        'Sentiment Analysis Score': {
            parameter: 'duration',
            mapFunction: mappingFunctions.duration
        },
        'Concreteness Score': {
            parameter: 'detune',
            mapFunction: mappingFunctions.detune
        },
        'Emotional-Intensity Score': {
            parameter: 'volume',
            mapFunction: mappingFunctions.volume
        }
    });

    const memoizedMappings = useMemo(() => mappings, [mappings]);
    const memoizedMappingFunctions = useMemo(() => mappingFunctions, [mappingFunctions]);

    return {
        shouldPlaySound,
        setShouldPlaySound,
        showScoreMapper,
        setShowScoreMapper,
        showScoreGraph,
        setShowScoreGraph,
        mappings: memoizedMappings,
        setMappings,
        mappingFunctions: memoizedMappingFunctions,
        setMappingFunctions,
        scoresData,
        setScoresData,
        isLoading,
        setIsLoading,
        handleFormSubmit,
    };
};