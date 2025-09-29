// Components/FlexiLayoutDnD/Dropabble.js
import { useDroppable } from '@dnd-kit/core';

export default function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="dndZone">
      {children}
    </div>
  );
}
