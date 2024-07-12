// KanbanBoard.js
import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const DraggableItem = ({ id, content, color }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color,
    padding: '8px',
    margin: '4px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
};

const DroppableColumn = ({ id, items, onDragEnd, color }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} style={{ margin: '16px', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
      <SortableContext id={id} items={items} strategy={closestCenter}>
        {items.map((item) => (
          <DraggableItem key={item.id} id={item.id} content={item.content} color={color} />
        ))}
      </SortableContext>
    </div>
  );
};

const KanbanBoard = ({ scores, soundParameters }) => {
  const [scoreItems, setScoreItems] = useState(scores);
  const [soundItems, setSoundItems] = useState(soundParameters);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current.sortable.containerId === over.data.current.sortable.containerId) {
      // Reorder items within the same column
      if (active.data.current.sortable.containerId === 'scores') {
        setScoreItems((items) => arrayMove(items, active.data.current.sortable.index, over.data.current.sortable.index));
      } else {
        setSoundItems((items) => arrayMove(items, active.data.current.sortable.index, over.data.current.sortable.index));
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DroppableColumn id="scores" items={scoreItems} onDragEnd={handleDragEnd} />
        <DroppableColumn id="soundParameters" items={soundItems} onDragEnd={handleDragEnd} />
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
