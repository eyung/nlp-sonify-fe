import React, { useState } from 'react';
import OpenAI from "openai";

const OpenAIAPI = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleButtonClick = async () => {
        try {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_TEST_KEY,
            });

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "system",
                        "content": "Calculate the user's age expressed in number of days, based on the birthday that they have entered. Assume the current date is 20 December 2023."
                      },
                      {
                        "role": "user",
                        "content": "My birthday is 1986, January 24"
                      }
                ],
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            setResponse(response);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Make API Request</button>
            {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default OpenAIAPI;