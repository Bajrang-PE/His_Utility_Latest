import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';

export default function DraggableEditableText({
  item,
  containerRef,
  updateItem,
  setSelectedComponent,
  isEditable = true,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const divRef = useRef(null);

  const isIcon = item.type === 'icon';

  // === Position tracking ===
  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    x: item.x,
    y: item.y,
  });

  /** -------------------- Drag Handlers -------------------- **/
  const handleMouseDown = (e) => {
    if (!isEditable || isEditing) return;
    e.stopPropagation();

    setSelectedComponent(item);
    setIsDragging(true);

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: item.x,
      y: item.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isEditable) return;

    const deltaX = e.clientX - dragStart.current.mouseX;
    const deltaY = e.clientY - dragStart.current.mouseY;

    const containerRect = containerRef.current.getBoundingClientRect();
    const elemRect = divRef.current.getBoundingClientRect();

    let newX = dragStart.current.x + deltaX;
    let newY = dragStart.current.y + deltaY;

    // Clamp within container boundaries
    newX = Math.max(0, Math.min(newX, containerRect.width - elemRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - elemRect.height));

    updateItem({ ...item, x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Attach listeners only while dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  /** -------------------- Edit Handlers -------------------- **/
  const handleDoubleClick = (e) => {
    if (!isEditable) return; // <-- disable editing if not allowed
    e.stopPropagation();

    setIsEditing(true);
    setSelectedComponent(item);

    // Place cursor at the end of text
    const range = document.createRange();
    range.selectNodeContents(divRef.current);
    range.collapse(false);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleBlur = (e) => {
    setIsEditing(false);
    updateItem({ ...item, text: e.target.innerText });
  };

  /** -------------------- Styles -------------------- **/
  const commonStyle = {
    position: 'absolute',
    top: item.y,
    left: item.x,
    color: item.color || '#fff',
    fontSize: `${item.fontSize}px`,
    fontFamily: "'Roboto', sans-serif",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    width: 'fit-content',
    display: 'inline-block',
    cursor: isEditable ? (isEditing ? 'text' : 'grab') : 'default',
    border: isEditing ? '1px solid white' : '1px solid transparent',
    padding: '2px 4px',
    background: 'transparent',
    outline: 'none',
    userSelect: isEditable && isEditing ? 'text' : 'none',
  };

  /** -------------------- Icon Mode -------------------- **/
  if (isIcon) {
    const icon = SolidIcons[item.iconName] || SolidIcons.faQuestionCircle;
    return (
      <div
        ref={divRef}
        onMouseDown={handleMouseDown}
        style={{ ...commonStyle, fontSize: item.size || 24 }}
        title={item.iconName}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
    );
  }

  /** -------------------- Text Mode -------------------- **/
  return (
    <div
      ref={divRef}
      contentEditable={isEditable && isEditing}
      suppressContentEditableWarning
      spellCheck={false}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      style={{
        ...commonStyle,
        border:
          isEditing || item.text === ''
            ? '1px solid white'
            : '1px solid transparent',
        minWidth: '20px',
        minHeight: '24px',
      }}
    >
      {item.text || ''}
    </div>
  );
}
