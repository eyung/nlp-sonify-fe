import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useScores } from './contexts/ScoreContext';

const SoundGraph = ({ mappings }) => {
  const { scoresData } = useScores();

  // Prepare data for the graph
  const data = scoresData.sentences.map(sentence => {
    const { word, ...wordScores } = sentence;
    const mappedScore = { name: word };

    // Map each score
    for (const [key, value] of Object.entries(wordScores)) {
      if (mappings[key]) {
        mappedScore[mappings[key].parameter] = mappings[key].mapFunction(value);
      } else {
        mappedScore[key] = value;
      }
    }
    return mappedScore;
  });

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
          {Object.keys(mappings).map((key, index) => (
            <Line key={index} type="monotone" dataKey={mappings[key].parameter} stroke="#8884d8" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SoundGraph;