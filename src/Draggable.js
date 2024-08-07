import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

const Draggable = ({ id, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    onDragMove: ({ delta }) => {
      setPosition((prevPosition) => {
        const newPosition = {
          x: prevPosition.x + delta.x,
          y: prevPosition.y + delta.y,
        };
        console.log('New Position:', newPosition);
        return newPosition;
      });
    },
  });

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    backgroundColor: isDragging ? 'lightgreen' : 'transparent', // Change background color when dragging
  };

  console.log('Render Draggable:', { position, isDragging });

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default Draggable;