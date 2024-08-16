import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MappingChart = ({ mappings }) => {
  const data = Object.keys(mappings).map(key => ({
    textParam: key,
    audioParam: mappings[key].parameter,
    mapFunction: mappings[key].mapFunction.toString()
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" />
        <YAxis type="category" dataKey="textParam" />
        <Tooltip />
        <Legend />
        <Bar dataKey="audioParam" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MappingChart;