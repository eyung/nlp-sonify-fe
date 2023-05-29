import React, { useState } from 'react';

const TextBox = () => {
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleInputChange} />
      <p>Value: {text}</p>
    </div>
  );
};

export default TextBox;