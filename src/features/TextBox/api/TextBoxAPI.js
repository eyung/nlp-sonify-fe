import 'isomorphic-fetch';

const Tokenize = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tokenize');
      if (response.ok) {
        const data = await response.json();
        // Process the response data here
        console.log(data);
      } else {
        // Handle error response
        console.error('Request failed with status:', response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Request failed:', error.message);
    }
  };