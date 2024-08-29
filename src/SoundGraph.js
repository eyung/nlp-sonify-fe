import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useScores } from './ScoreContext';

const SoundGraph = ({ mappings }) => {
  
    const { scoresData } = useScores();
  
    try {


        // Create a new array and assign the contents of scoresData to it
        const dataArray = [...scoresData];

        
        // Prepare data for the graph using the new array
        const data = dataArray.map(sentence => {
            const { word, ...wordScores } = sentence;
            return { name: word, ...wordScores };
        });

        // Check if data is empty
        if (data.length === 0) {
            return <div className="mt-20"><span>No data available to display.</span></div>;
        }

        // Get all unique keys from wordScores to create lines dynamically
        const keys = Object.keys(data[0]).filter(key => key !== 'name');

        return (
            <div className="mt-20">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {keys.map((key, index) => (
                    <Line key={index} type="monotone" dataKey={key} stroke="#8884d8" />
                ))}
                </LineChart>
            </ResponsiveContainer>
            </div>
        );

    } catch (error) {
        if (error instanceof TypeError && error.message.includes('.sentences is undefined')) {
        // Ignore error with undefined sentences that are thrown 
        // when the scoresData is empty because app is loading for the first time
        } else {
        throw error; // Re-throw other errors
        }
    }
};

export default SoundGraph;