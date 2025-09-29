import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(Responsive);

export default function TabLayoutWrapper({
  children,
  addOnStyles = 'tab__wrapper',
  layout,
  // onLayoutChange,
  onLayoutSave
}) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [localLayout, setLocalLayout] = useState(layout);
  return (
    <div className={addOnStyles} style={{ width: '100%' }}>
      <ReactGridLayout
        className="layout"
        breakpoints={{ lg: 1000, md: 800, sm: 700 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={40}
        width={1400}
        isDraggable
        isResizable
        useCSSTransforms
        // layouts={{ lg: layout, md: layout, sm: layout }}
        layouts={{ lg: localLayout, md: localLayout, sm: localLayout }}
        onBreakpointChange={(newBreakpoint) => {
          setCurrentBreakpoint(newBreakpoint);
        }}
        onLayoutChange={(currentLayout, allLayouts) => {
          // onLayoutChange(allLayouts[currentBreakpoint]);
          setLocalLayout(allLayouts[currentBreakpoint]);
          // onLayoutChange(currentLayout);
        }}
        onDragStop={(currentLayout) => onLayoutSave(currentLayout)}
        onResizeStop={(currentLayout) => onLayoutSave(currentLayout)}
      >
        {/* {React.Children.toArray(children).filter(Boolean)} */}
        {children}
      </ReactGridLayout>
    </div>
  );
}

export function TabLayoutGrid({
  children,
  addOnStyles = 'tab__wrapper',
  layout,
  onLayoutChange,
}) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  return (
    <div className={addOnStyles} style={{ width: '100%' }}>
      <ReactGridLayout
        className="layout"
        breakpoints={{ lg: 1000, md: 800, sm: 700 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={40}
        width={1400}
        useCSSTransforms
        layouts={{ lg: layout, md: layout, sm: layout }}
        // Disable drag & resize here:
        isDraggable={false}
        isResizable={false}
        onBreakpointChange={(newBreakpoint) => {
          setCurrentBreakpoint(newBreakpoint);
        }}
        onLayoutChange={(currentLayout, allLayouts) => {
          onLayoutChange(allLayouts[currentBreakpoint]);
        }}
      >
        {children}
      </ReactGridLayout>
    </div>
  );
}

export function CustomGrid({ layout, children, cssClass }) {
  const GRID_COLS = 12;
  const GRID_ROW_HEIGHT = 40;

  const maxRow = layout.reduce(
    (max, item) => Math.max(max, item.y + item.h),
    0
  );

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
    gridTemplateRows: `repeat(${maxRow}, ${GRID_ROW_HEIGHT}px)`,
    gap: '8px',
    width: '100%',
    height: '100%',
  };

  // Create a map from child keys to child elements for quick lookup
  const childrenMap = {};
  React.Children.forEach(children, (child) => {
    if (child.key) {
      childrenMap[child.key] = child;
    }
  });



  return (
    <div style={gridStyle} className={cssClass?.at(0)}>
      {layout.map(({ i, x, y, w, h }) => (
        <div
          key={i}
          style={{
            gridColumnStart: x + 1,
            gridColumnEnd: x + 1 + w,
            gridRowStart: y + 1,
            gridRowEnd: y + 1 + h,
          }}
          className={cssClass?.at(1)}
        >
          {childrenMap[i] || <div>Missing component for {i}</div>}
        </div>
      ))}
    </div>
  );
}
