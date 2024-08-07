import React from 'react';
import { useDraggable } from '@dnd-kit/core';

const Draggable = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    backgroundColor: isDragging ? 'lightgreen' : 'transparent', // Change background color when dragging
  };

  console.log('Render Draggable:', { transform, isDragging });

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

export default Draggable;