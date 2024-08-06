import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

const Draggable = ({ id, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    onDragEnd: ({ delta }) => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + delta.x,
        y: prevPosition.y + delta.y,
      }));
    },
  });

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    backgroundColor: isDragging ? 'lightgreen' : 'transparent', // Change background color when dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default Draggable;