import React, { useState } from 'react';

const TestAPI = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
  
    const handleButtonClick = () => {
        const requestBody = {
           
            "word" : "jumped"
          
        };
    
        // URL of Vercel BE
        fetch('https://nlp-sonify-app.vercel.be/api/stem', {
        //fetch('/api/stem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          
          .then((data) => {
            // Handle successful response
            setResponse(data);
          })
          .catch((error) => {
            // Handle error
            setError(error.message);
          });
    };
  
      return (
        <div>
          <button onClick={handleButtonClick}>Make API Request</button>
          {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
          {error && <p>Error: {error}</p>}
        </div>
      );
  };

export default TestAPI;