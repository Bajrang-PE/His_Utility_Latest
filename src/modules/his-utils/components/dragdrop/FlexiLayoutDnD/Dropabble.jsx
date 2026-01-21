// Components/FlexiLayoutDnD/Dropabble.js
import { useDroppable } from '@dnd-kit/core';

export default function Dropabble({ id, children, className = 'dndZone' }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
}
