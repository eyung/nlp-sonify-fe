import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Droppable = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? 'lightblue' : undefined,
    alignItems: 'center',
    height: '100px', // Adjust height as needed
    padding: '10px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default Droppable;