import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import useLoader from '../hooks/useLoader';
import { executeParamSQL } from '../Api/parameterMaster';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import Droppable from './dragdrop/FlexiLayoutDnD/Dropabble';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { setDraggable } from '../Features/Drag&Drop/DnDSlice';
import DraggableEditableText from './dashboardMasters/widgetMaster/widgetPreview/DraggableEditableText';
import KPIControlPanel from './KPIComponents/KpiControlPanel';
import useDebounce from '../hooks/useDebounce';
import { setKPIData } from '../Features/WidgitEngine/WidgitViewerSlice';

const initialStyles = {
  height: 300,
  width: 500,
  borderRadius: 0,
  backgroundImage:
    'linear-gradient(135deg,rgba(59, 0, 102, 1) 0%, rgb(92, 11, 124) 50%, rgba(97, 43, 198, 0.96) 100%)',
  textColor: 'white',
  fontFamily: "'Roboto', sans-serif",
  fontWeight: '500',
  descColor: 'white',
  descFontWeight: '500',
  logoSize: { height: 40, width: 40 },
};

const initialKPIColorState = {
  isHovered: false,
  color1: '#612bc6',
  color2: '#3b0066',
  hoverActive: 'inactive',
  hoverColor1: '#612bc6',
  hoverColor2: '#3b0066',
  direction: '135deg',
};

export default function KpiEngine({ widgitSQL }) {
  const { showLoader, hideLoader } = useLoader();

  function styleReducer(state, action) {
    switch (action.type) {
      case 'UPDATE_STYLE':
        return {
          ...state,
          [action.payload.key]: action.payload.value,
        };

      case 'UPDATE_LOGO_SIZE':
        return {
          ...state,
          logoSize: {
            ...state.logoSize,
            ...action.payload,
          },
        };

      case 'BULK_UPDATE':
        return {
          ...state,
          ...action.payload,
        };

      default:
        return state;
    }
  }

  function kpiColorReducer(state, action) {
    switch (action.type) {
      case 'SET_IS_HOVERED':
        return { ...state, isHovered: action.payload };
      case 'SET_COLOR1':
        return { ...state, color1: action.payload };
      case 'SET_COLOR2':
        return { ...state, color2: action.payload };
      case 'SET_HOVER_ACTIVE':
        return { ...state, hoverActive: action.payload };
      case 'SET_HOVER_COLOR1':
        return { ...state, hoverColor1: action.payload };
      case 'SET_HOVER_COLOR2':
        return { ...state, hoverColor2: action.payload };
      case 'SET_DIRECTION':
        return { ...state, direction: action.payload };
      default:
        return state;
    }
  }

  //redux states
  const draggable = useSelector((state) => state.dnd.draggable);
  const dispatcher = useDispatch();

  //reducer states
  const [styles, dispatch] = useReducer(styleReducer, initialStyles);
  const [kpiState, kpiDispatch] = useReducer(
    kpiColorReducer,
    initialKPIColorState
  );

  //local states
  const [droppedItems, setDroppedItems] = useState([]);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 }); // Track mouse positions on drag
  const [widgitData, setWidgitData] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState({});

  // refs
  const resizingRef = useRef(false);
  const containerRef = useRef(null);
  const prevSelectedIconRef = useRef(selectedIcon); // Use a ref to track the previous selectedIcon
  const lastExecutedSQL = useRef(null);

  //hooks
  const debouncedWidgitSQL = useDebounce(widgitSQL, 500);

  // Mouse down on handle - start resizing
  const onMouseDown = (e) => {
    e.preventDefault();
    resizingRef.current = true;
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  // Mouse move - calculate delta & update styles
  function onMouseMove(e) {
    if (!resizingRef.current) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;

    // Get parent width
    const parentWidth =
      containerRef.current?.parentElement?.clientWidth || window.innerWidth;

    // Calculate new width but do not exceed parent width
    let newWidth = styles.width + dx;
    if (newWidth > parentWidth) {
      newWidth = parentWidth;
    }

    // Apply min width 100px
    newWidth = Math.max(100, newWidth);

    // For height, you can clamp if you want or keep free
    let newHeight = Math.max(100, styles.height + dy);

    dispatch({
      type: 'UPDATE_STYLE',
      payload: { key: 'width', value: newWidth },
    });
    dispatch({
      type: 'UPDATE_STYLE',
      payload: { key: 'height', value: newHeight },
    });

    setLastPos({ x: e.clientX, y: e.clientY });
  }

  // Mouse up - stop resizing
  const onMouseUp = () => {
    resizingRef.current = false;
  };

  // Fetch data
  const fetchWidgitData = useCallback(
    async (sql) => {
      if (!sql) return;

      showLoader('Getting data from DB');
      try {
        const data = await executeParamSQL(sql);
        if (!data?.data?.length) return;


        // ✅ Collect all items first before setting state once
        const newItems = data.data.flatMap((item) =>
          Object.entries(item).map(([key, value]) => ({
            id: uuidv4(),
            type: 'sqlData',
            value,
            text: String(value),
            x: 20,
            y: 20,
            fontSize: 24,
            color: '#fff',
          }))
        );

        // ✅ Set all items in one go
        setDroppedItems((prev) => [...prev, ...newItems]);
        setWidgitData(data.data);
      } catch (error) {
        console.error('Error fetching Widgit data:', error);
      } finally {
        hideLoader();
      }
    },
    [] // ⚠️ empty deps => stable reference
  );

  // Attach and cleanup event listeners on window for smooth dragging
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  //Sync KPI background
  useEffect(() => {
    const gradient = `linear-gradient(${kpiState.direction}, ${kpiState.color1} 0%, ${kpiState.color2} 100%)`;
    dispatch({
      type: 'UPDATE_STYLE',
      payload: { key: 'backgroundImage', value: gradient },
    });
  }, [kpiState.color1, kpiState.color2, kpiState.direction]);

  //listen for icon changes
  useEffect(() => {
    if (selectedIcon && selectedIcon !== prevSelectedIconRef.current) {
      prevSelectedIconRef.current = selectedIcon;

      // Create a new icon item object only when selectedIcon changes
      const newIconItem = {
        id: `item-${Date.now()}`, // unique ID based on timestamp
        type: 'icon',
        iconName: selectedIcon,
        x: 50, // default X position
        y: 50, // default Y position
        size: 32, // default icon size
        color: '#fff', // default icon color
      };

      setDroppedItems((prevItems) => [...prevItems, newIconItem]);
    }
  }, [selectedIcon]);

  //fetch widgit data
  useEffect(() => {
    if (!debouncedWidgitSQL || lastExecutedSQL.current === debouncedWidgitSQL)
      return;

    lastExecutedSQL.current = debouncedWidgitSQL;
    fetchWidgitData(debouncedWidgitSQL);
  }, [debouncedWidgitSQL]);

  //run when dropped items change
  useEffect(() => {
    if (droppedItems.length < 1) return;
    //update global redux state
    const refinedData = droppedItems.map((item) =>
      item.type === 'sqlData' ? { ...item, value: '', text: '' } : { ...item }
    );

    const kpiData = {
      kpiProperties: styles,
      kpiColorProperties: kpiState,
      kpiItems: refinedData,
    };

    dispatcher(setKPIData(kpiData));
  }, [droppedItems, kpiState, styles]);

  function handleDragStart(event) {
    const { active } = event;
    const label = active?.data?.current;
    if (label) {
      dispatcher(setDraggable({ id: active.id, label }));
    }
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;

    const dataType = active?.data?.current;

    let text = '';

    switch (dataType) {
      case 'heading':
        text = 'New Heading';
        break;
      case 'desc':
        text = 'New Description';
        break;
      default:
        text = String(dataType);
        break;
    }

    // Use UUID for a truly unique key
    const uniqueId = uuidv4();

    const newItem = {
      id: `item-${uniqueId}`, // unique id per dropped item
      type: dataType,
      text,
      x: 20,
      y: 20,
      fontSize: dataType === 'heading' ? 24 : 16,
      color: '#fff',
    };

    setDroppedItems((prev) => [...prev, newItem]);
  }

  return (
    <div className="Kpi__container">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable id="droppable">
          <DragOverlay>
            {draggable ? (
              <div className="accordian__content">{draggable.id}</div>
            ) : null}
          </DragOverlay>
          <motion.div
            ref={containerRef}
            style={{
              position: 'relative',
              height: styles.height + 'px',
              width: styles.width + 'px',
              borderRadius: styles.borderRadius,
              userSelect: resizingRef.current ? 'none' : 'auto',
            }}
            animate={{
              backgroundImage:
                kpiState.isHovered && kpiState.hoverActive === 'active'
                  ? `linear-gradient(${kpiState.direction}, ${kpiState.hoverColor1} 0%, ${kpiState.hoverColor2} 100%)`
                  : `linear-gradient(${kpiState.direction}, ${kpiState.color1} 0%, ${kpiState.color2} 100%)`,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onMouseEnter={() =>
              kpiDispatch({ type: 'SET_IS_HOVERED', payload: true })
            }
            onMouseLeave={() =>
              kpiDispatch({ type: 'SET_IS_HOVERED', payload: false })
            }
            className="Kpi__container-kpi"
          >
            {/* Resize handle */}
            <div
              onMouseDown={onMouseDown}
              className="Kpi__container-resize"
              title="Resize"
            />

            {/* Render dropped items */}
            {droppedItems.map((item) => (
              <DraggableEditableText
                key={item.id}
                item={item}
                containerRef={containerRef}
                updateItem={(updatedItem, action) => {
                  if (action === 'delete') {
                    setDroppedItems((prev) =>
                      prev.filter((i) => i.id !== item.id)
                    );
                  } else if (updatedItem) {
                    setDroppedItems((prev) =>
                      prev.map((i) =>
                        i.id === updatedItem.id ? updatedItem : i
                      )
                    );
                  }
                }}
                setSelectedComponent={setSelectedComponent}
              />
            ))}
          </motion.div>

          <KPIControlPanel
            dispatch={dispatch}
            styles={styles}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            widgitData={widgitData}
            setDroppedItems={setDroppedItems}
            kpiState={kpiState}
            kpiDispatch={kpiDispatch}
            setSelectedIcon={setSelectedIcon}
            droppedItems={droppedItems}
          />
        </Droppable>
      </DndContext>
    </div>
  );
}

export function SavedKPIViewer({ dataSet, isEditing }) {
  const { kpiItems, kpiProperties, kpiColorProperties } =
    dataSet.lt_json.kpiData;

  const widgitSQL =
    dataSet?.dataSet?.lt_json?.widgitQuery || dataSet?.lt_json?.widgitQuery;

  const widgitParams = dataSet?.lt_json?.bindedParameters || {};

  // Redux
  const draggable = useSelector((state) => state.dnd.draggable);
  const dispatchRedux = useDispatch();

  // Local states
  const [localKPIData, setLocalKPIData] = useState([]);
  const [widgitData, setWidgitData] = useState([]);
  const { showLoader, hideLoader } = useLoader();
  const [hovered, setIsHovered] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState({});
  const [selectedIcon, setSelectedIcon] = useState(null);

  // Refs
  const resizingRef = useRef(false);
  const containerRef = useRef(null);
  const prevSelectedIconRef = useRef(selectedIcon); // Use a ref to track the previous selectedIcon

  /** -------------------- Reducers -------------------- **/
  function styleReducer(state, action) {
    switch (action.type) {
      case 'UPDATE_STYLE':
        return { ...state, [action.payload.key]: action.payload.value };
      case 'UPDATE_LOGO_SIZE':
        return { ...state, logoSize: { ...state.logoSize, ...action.payload } };
      case 'BULK_UPDATE':
        return { ...state, ...action.payload };
      default:
        return state;
    }
  }

  function kpiColorReducer(state, action) {
    switch (action.type) {
      case 'SET_IS_HOVERED':
        return { ...state, isHovered: action.payload };
      case 'SET_COLOR1':
        return { ...state, color1: action.payload };
      case 'SET_COLOR2':
        return { ...state, color2: action.payload };
      case 'SET_HOVER_ACTIVE':
        return { ...state, hoverActive: action.payload };
      case 'SET_HOVER_COLOR1':
        return { ...state, hoverColor1: action.payload };
      case 'SET_HOVER_COLOR2':
        return { ...state, hoverColor2: action.payload };
      case 'SET_DIRECTION':
        return { ...state, direction: action.payload };
      case 'BULK_UPDATE':
        return { ...state, ...action.payload };
      default:
        return state;
    }
  }

  // Initialize reducers directly from props (no need for extra local mirror)
  const [styles, dispatchStyles] = useReducer(styleReducer, kpiProperties);
  const [kpiState, dispatchKpiColor] = useReducer(
    kpiColorReducer,
    kpiColorProperties
  );

  /** -------------------- Drag & Drop -------------------- **/
  function handleDragStart(event) {
    const { active } = event;
    const label = active?.data?.current;
    if (label) {
      dispatchRedux(setDraggable({ id: active.id, label }));
    }
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;

    const dataType = active?.data?.current;
    const uniqueId = uuidv4();

    const textMap = { heading: 'New Heading', desc: 'New Description' };
    const text = textMap[dataType] || String(dataType);

    const newItem = {
      id: `item-${uniqueId}`,
      type: dataType,
      text,
      x: 20,
      y: 20,
      fontSize: dataType === 'heading' ? 24 : 16,
      color: '#fff',
    };

    setLocalKPIData((prev) => [...prev, newItem]);
  }

  /** -------------------- Resize Handlers -------------------- **/
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;

    // capture initial position and size
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startSizeRef.current = { width: styles.width, height: styles.height };
  };

  const onMouseMove = (e) => {
    if (!resizingRef.current) return;

    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;

    const parentWidth =
      containerRef.current?.parentElement?.clientWidth || window.innerWidth;

    const newWidth = Math.min(
      Math.max(100, startSizeRef.current.width + dx),
      parentWidth
    );
    const newHeight = Math.max(100, startSizeRef.current.height + dy);

    dispatchStyles({
      type: 'BULK_UPDATE',
      payload: { width: newWidth, height: newHeight },
    });
  };

  const onMouseUp = () => {
    resizingRef.current = false;
  };

  /** -------------------- Fetch Widget Data -------------------- **/
  const fetchWidgitData = async (sqlToBeExecuted) => {
    showLoader('Getting data from DB');
    try {
      const data = await executeParamSQL(sqlToBeExecuted);
      if (!data?.data) return;

      const sqlResult = data.data.at(0);
      const refined = kpiItems.map((item, idx) =>
        item.type === 'sqlData'
          ? {
              ...item,
              value: Object.values(sqlResult).at(idx),
              text: Object.values(sqlResult).at(idx),
            }
          : item
      );

      setLocalKPIData(refined);
      setWidgitData(data.data);
    } catch (err) {
      console.error('Error fetching Widgit data:', err);
    } finally {
      hideLoader();
    }
  };

  /** -------------------- Lifecycle -------------------- **/
  useEffect(() => {
    const noParams = Object.keys(widgitParams).length === 0;
    if (noParams && widgitSQL.includes('Para')) return;

    const finalSQL = noParams
      ? widgitSQL
      : Object.keys(widgitParams).reduce(
          (acc, key) => acc.replaceAll(key, widgitParams[key]),
          widgitSQL
        );

    fetchWidgitData(finalSQL);
  }, [widgitParams]);

  // Attach and cleanup event listeners on window for smooth dragging
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  });

  useEffect(() => {
    if (dataSet?.lt_json?.kpiData) {
      const { kpiProperties, kpiColorProperties } = dataSet.lt_json.kpiData;
      dispatchStyles({ type: 'BULK_UPDATE', payload: kpiProperties });
      dispatchKpiColor({ type: 'BULK_UPDATE', payload: kpiColorProperties });
    }
  }, [dataSet]);

  //listen for icon changes
  useEffect(() => {
    if (selectedIcon && selectedIcon !== prevSelectedIconRef.current) {
      prevSelectedIconRef.current = selectedIcon;

      // Create a new icon item object only when selectedIcon changes
      const newIconItem = {
        id: `item-${Date.now()}`, // unique ID based on timestamp
        type: 'icon',
        iconName: selectedIcon,
        x: 50, // default X position
        y: 50, // default Y position
        size: 32, // default icon size
        color: '#fff', // default icon color
      };

      setLocalKPIData((prevItems) => [...prevItems, newIconItem]);
    }
  }, [selectedIcon]);

  //only run when dropped items/ property changes
  useEffect(() => {
    if (localKPIData.length < 1) return;
    //update global redux state
    const refinedData = localKPIData.map((item) =>
      item.type === 'sqlData' ? { ...item, value: '', text: '' } : { ...item }
    );

    const kpiData = {
      kpiProperties: styles,
      kpiColorProperties: kpiState,
      kpiItems: refinedData,
    };

    dispatchRedux(setKPIData(kpiData));
  }, [localKPIData, kpiState, styles]);

  /** -------------------- Render -------------------- **/
  if (!localKPIData.length) return null;

  return (
    <div
      className="Kpi__container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable id="droppable">
          <DragOverlay>
            {draggable ? (
              <div className="accordian__content">{draggable.id}</div>
            ) : null}
          </DragOverlay>

          <motion.div
            ref={containerRef}
            style={{ ...styles, cursor: 'pointer' }}
            animate={{
              backgroundImage:
                hovered && kpiState?.hoverActive === 'active'
                  ? `linear-gradient(${kpiState.direction}, ${kpiState.hoverColor1} 0%, ${kpiState.hoverColor2} 100%)`
                  : `linear-gradient(${kpiState.direction}, ${kpiState.color1} 0%, ${kpiState.color2} 100%)`,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="Kpi__container-kpi"
          >
            {isEditing && (
              <div
                onMouseDown={onMouseDown}
                className="Kpi__container-resize"
                title="Resize"
              />
            )}

            {localKPIData.map((item) => (
              <DraggableEditableText
                key={item.id}
                item={item}
                containerRef={containerRef}
                updateItem={(updatedItem, action) => {
                  if (action === 'delete')
                    setLocalKPIData((prev) =>
                      prev.filter((i) => i.id !== item.id)
                    );
                  else if (updatedItem)
                    setLocalKPIData((prev) =>
                      prev.map((i) =>
                        i.id === updatedItem.id ? updatedItem : i
                      )
                    );
                }}
                setSelectedComponent={setSelectedComponent}
                isEditable={isEditing}
              />
            ))}
          </motion.div>

          {isEditing && (
            <KPIControlPanel
              dispatch={dispatchStyles}
              styles={styles}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              widgitData={widgitData}
              setDroppedItems={setLocalKPIData}
              kpiState={kpiState}
              kpiDispatch={dispatchKpiColor}
              droppedItems={localKPIData}
              setSelectedIcon={setSelectedIcon}
            />
          )}
        </Droppable>
      </DndContext>
    </div>
  );
}
