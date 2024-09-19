import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMappedScores } from '../contexts/MappedScoresContext';

const ScoreGraph = React.memo(() => {
  const { mappedScores } = useMappedScores();

  //console.log('ScoreGraph received mappedScores:', mappedScores);

  // Prepare data for the graph
  const data = mappedScores.map((score) => {
    const trimmedName = score.word.split(' ').slice(0, 3).join(' ') + '...';
    return {
      name: trimmedName,
      Frequency: score.frequency,
      Volume: score.volume * 10, // Multiply by 10 to make it more visible
      Duration: score.duration * 100, // Multiply by 100 to make it more visible
      Detune: score.detune,
    };
  });

  console.log('ScoreGraph data:', data);

  // Check if data is empty
  if (data.length === 0) {
    return <div className="mt-20"><span>No data available to display.</span></div>;
  }

  return (
    <div className="mt-20">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Frequency" stroke="#8884d8" />
          <Line type="monotone" dataKey="Volume" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Duration" stroke="#ffc658" />
          <Line type="monotone" dataKey="Detune" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default ScoreGraph;