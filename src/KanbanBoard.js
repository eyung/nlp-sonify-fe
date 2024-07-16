// KanbanBoard.js
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const DroppableColumn = ({ id, items, colorMapping, onDragEnd }) => {
  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div
        style={{
          margin: '16px',
          padding: '8px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            content={item.content}
            color={colorMapping[item.id] || '#fff'}
          />
        ))}
      </div>
    </SortableContext>
  );
};

const KanbanBoard = ({ scores, soundParameters, onMappingsUpdated }) => {
  const [scoreItems, setScoreItems] = useState(scores);
  const [soundItems, setSoundItems] = useState(soundParameters);
  const [colorMapping, setColorMapping] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Update color mapping based on items' positions
    const newColorMapping = {};
    scoreItems.forEach((score, index) => {
      const sound = soundItems[index];
      if (sound) {
        const color = `hsl(${(index / scoreItems.length) * 360}, 100%, 75%)`; // Generate a unique color
        newColorMapping[score.id] = color;
        newColorMapping[sound.id] = color;
      }
    });
    setColorMapping(newColorMapping);

    // Call the callback function to pass mappings back to App.js
    this.props.onMappingsUpdated(updatedMappings);
  }, [scoreItems, soundItems, onMappingsUpdated]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      // Reorder items within the same column
      if (scoreItems.map(item => item.id).includes(active.id)) {
        setScoreItems((items) => arrayMove(items, items.findIndex(item => item.id === active.id), items.findIndex(item => item.id === over.id)));
      } else if (soundItems.map(item => item.id).includes(active.id)) {
        setSoundItems((items) => arrayMove(items, items.findIndex(item => item.id === active.id), items.findIndex(item => item.id === over.id)));
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DroppableColumn id="scores" items={scoreItems} colorMapping={colorMapping} />
        <DroppableColumn id="soundParameters" items={soundItems} colorMapping={colorMapping} />
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
