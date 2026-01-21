import React, { useCallback, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { InputField, Label } from './dragdrop/FormElements';

const ItemType = 'ITEM';

//eslint-disable-next-line
const DraggableItem = ({ item, from, onDropItem }) => {
  const [, dragRef] = useDrag({
    type: ItemType,
    item: { item, from },
  });

  return (
    <div ref={dragRef} className="dragDrop__item">
      {item.label}
    </div>
  );
};

const DropZone = ({ children, onDrop, zoneType }) => {
  const [, dropRef] = useDrop({
    accept: ItemType,
    drop: (dragged) => {
      onDrop(dragged.item, dragged.from, zoneType);
    },
  });

  return (
    <div ref={dropRef} className="dragDrop">
      {children}
    </div>
  );
};

const DnDContainer = ({
  items,
  dragDropTitle,
  rightItems,
  setRightItems,
  setPreviewVisibility,
}) => {
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');
  const [leftItems, setLeftItems] = useState(items);

  const handleChange = useCallback((left, right) => {
    setLeftItems(left);
    setRightItems(right);
    setPreviewVisibility(false);
  }, []);

  const handleDrop = useCallback(
    (item, from, to) => {
      if (from === to) return;

      const sourceList = from === 'left' ? leftItems : rightItems;
      const targetList = to === 'left' ? leftItems : rightItems;
      const setSource = from === 'left' ? setLeftItems : setRightItems;
      const setTarget = to === 'left' ? setLeftItems : setRightItems;

      const updatedSource = sourceList.filter((i) => i.id !== item.id);
      const updatedTarget = [...targetList, item];

      setSource(updatedSource);
      setTarget(updatedTarget);

      handleChange?.(
        to === 'left' ? updatedTarget : updatedSource,
        to === 'right' ? updatedTarget : updatedSource
      );
    },
    [leftItems, rightItems, handleChange]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="dragDrop__container--lable">
        <Label labelText={dragDropTitle} />
      </div>
      <div className="dragDrop__container">
        <div className="dragDrop__container--item">
          <InputField
            label={false}
            value={leftSearch}
            fieldType={'text'}
            onChange={(e) => setLeftSearch(e.target.value)}
            placeholder={'Search Here..'}
          />
          <DropZone zoneType="left" onDrop={handleDrop}>
            {leftItems
              .filter((item) =>
                item.label.toLowerCase().includes(leftSearch.toLowerCase())
              )
              .map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  from="left"
                  onDropItem={handleDrop}
                />
              ))}
          </DropZone>
        </div>
        <div className="dragDrop__container--item">
          <InputField
            label={false}
            fieldType={'text'}
            value={rightSearch}
            onChange={(e) => setRightSearch(e.target.value)}
            placeholder={'Search Here..'}
          />
          <DropZone zoneType="right" onDrop={handleDrop}>
            {rightItems
              .filter((item) =>
                item.label.toLowerCase().includes(rightSearch.toLowerCase())
              )
              .map((item) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  from="right"
                  onDropItem={handleDrop}
                />
              ))}
          </DropZone>
        </div>
      </div>
    </DndProvider>
  );
};

export default DnDContainer;
