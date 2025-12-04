import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

/**
 * Custom hook for drag and drop functionality
 * Provides DnD context, sensors, and handlers
 */
const useDragDrop = (items, onReorder) => {
  const [activeId, setActiveId] = useState(null);

  // Configure sensors for mouse and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag start
   */
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Find indices
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Call the reorder callback with old and new indices
      if (onReorder) {
        onReorder(oldIndex, newIndex, active.id);
      }
    }

    setActiveId(null);
  };

  /**
   * Handle drag cancel
   */
  const handleDragCancel = () => {
    setActiveId(null);
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    DndContext,
    SortableContext,
    verticalListSortingStrategy,
    closestCenter,
  };
};

export default useDragDrop;
