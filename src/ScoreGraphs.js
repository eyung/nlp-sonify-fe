import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScoreGraph = ({ mappedScores }) => {
  // Prepare data for the graph
  const data = mappedScores.map((score, index) => ({
    name: score.word,
    Frequency: score.frequency,
    Volume: score.volume,
    Duration: score.duration,
    Detune: score.detune,
  }));

  return (
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
  );
};

export default ScoreGraph;