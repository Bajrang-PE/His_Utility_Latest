import { useDispatch, useSelector } from 'react-redux';
import { setDraggable } from '../../Features/Drag&Drop/DnDSlice';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Droppable from '../dragdrop/FlexiLayoutDnD/Dropabble';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { DraggableItem } from '../dragdrop/FlexiLayoutDnD/DraggableItem';
import { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { Dropdown } from '../dragdrop/FormElements';
import { highChartOptions } from '../../Api/graphLibraries';
import { HexColorPicker } from 'react-colorful';
import { setGraphComposition } from '../../Features/WidgitEngine/WidgitViewerSlice';
import { WarningAlert } from '../../App/commonFunction';
import { v4 as uuidv4 } from 'uuid';
import {
  setPKColsData,
  setWidgitToExecute,
} from '../../Features/Drilldown/drilldownSlice';
import { HISContext } from '../../contextApi/HISContext';

export default function HighchartGraphEngine({ data }) {
  const dispatch = useDispatch();
  const draggable = useSelector((state) => state.dnd.draggable);

  const { widgetGraphPreviewData, setWidgetGraphPreviewData } = useContext(HISContext);

  const [containers, setContainers] = useState({
    data: [],
    xAxis: widgetGraphPreviewData?.selectedXAxisPreview || [],
    yAxis: widgetGraphPreviewData?.selectedYAxisPreview || [],
  });


  const [chartTypes, setChartTypes] = useState(widgetGraphPreviewData?.chartTypesPreview);
  const [chartColors, setChartColors] = useState(widgetGraphPreviewData?.chartColorsPreview);
  const [showColorPickers, setShowColorPickers] = useState({});
  const selectedXAxis = containers.xAxis[0];
  const selectedYAxes = containers.yAxis;
  const categories = selectedXAxis ? data?.map((row) => row[selectedXAxis]) : [];

  // Sync columns from data prop
  useEffect(() => {
    if (data && data.length > 0) {
      let initialColumns = Object.keys(data[0]);

      const filteredColumns = initialColumns.filter(
        (col) =>
          !containers?.xAxis?.includes(col) &&
          !containers?.yAxis?.includes(col)
      );

      setContainers({
        data: filteredColumns,
        xAxis: widgetGraphPreviewData?.selectedXAxisPreview || [],
        yAxis: widgetGraphPreviewData?.selectedYAxisPreview || [],
      });
    }
  }, [data]);

  useEffect(() => {
    setWidgetGraphPreviewData((prev) => ({
      ...prev, 'selectedXAxisPreview': containers?.xAxis || [], 'selectedYAxisPreview': containers?.yAxis || [],
    }));
  }, [containers])

  function handleDragStart(event) {
    const { active } = event;
    const label = active?.data?.current;
    if (label) {
      dispatch(setDraggable({ id: active.id, label }));
    }
  }

  function handleDragEnd({ active, over }) {
    if (!over) {
      dispatch(setDraggable(null));
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const droppableMap = {
      'droppable-1': 'xAxis',
      'droppable-2': 'yAxis',
      'droppable-3': 'data',
    };

    const toContainer = droppableMap[overId];

    let fromContainer;
    for (const container in containers) {
      if (containers[container].includes(activeId)) {
        fromContainer = container;
        break;
      }
    }

    if (!toContainer || fromContainer === toContainer) {
      dispatch(setDraggable(null));
      return;
    }

    if (toContainer === 'xAxis' && containers.xAxis.length >= 1) {
      WarningAlert('Warning', 'X-axis cannot have more than 1 columns');
      dispatch(setDraggable(null));
      return;
    }

    setContainers((prev) => ({
      ...prev,
      [fromContainer]: prev[fromContainer].filter((id) => id !== activeId),
      [toContainer]: [...prev[toContainer], activeId],
    }));

    const composition = {
      selectedXAxis: containers.xAxis[0],
      selectedYAxes: containers.yAxis,
      chartTypes,
      chartColors,
    };

    dispatch(setGraphComposition(composition));
    dispatch(setDraggable(null));
  }

  const series = selectedYAxes?.map((col) => ({
    name: col,
    data: data?.map((row) => row[col]),
    type: chartTypes[col] || 'column',
    color: chartColors[col] || undefined,
  }));

  const options = {
    title: {
      text: '',
    },
    xAxis: {
      categories,
      labels: {
        rotation: 0,
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },
        formatter: function () {
          return this.value;
        },
      },
    },
    series,
    tooltip: {
      style: {
        fontSize: '15px',
        fontFamily: "'Roboto', sans-serif",
        padding: '12px',
        pointerEvents: 'none',
      },
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 0,
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '15px',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '500',
        color: '#1e1e1e',
      },
      itemMarginTop: 10,
      itemMarginBottom: 10,
    },
  };

  function handleChartCustomization(column, selectedType) {
    setChartTypes((prev) => ({
      ...prev,
      [column]: selectedType,
    }));

    setWidgetGraphPreviewData((prev) => ({
      ...prev, "chartTypesPreview": { ...prev?.chartTypesPreview, [column]: selectedType },
    }));

    const composition = {
      selectedXAxis,
      selectedYAxes,
      chartTypes,
      chartColors,
    };

    dispatch(setGraphComposition(composition));
  }

  function handleColorChange(column, selectedColor) {
    setChartColors((prev) => ({
      ...prev,
      [column]: selectedColor,
    }));

    setWidgetGraphPreviewData((prev) => ({
      ...prev, "chartColorsPreview": { ...prev?.chartColorsPreview, [column]: selectedColor },
    }));

    const composition = {
      selectedXAxis,
      selectedYAxes,
      chartTypes,
      chartColors,
    };

    dispatch(setGraphComposition(composition));
  }

  function toggleColorPicker(column) {
    setShowColorPickers((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  }

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="graphConfig" id="data">
          {/* Column Pool */}
          <Droppable id="droppable-3" className="graphConfig__data">
            <h2 className="graphConfig__data--placeholder">Columns</h2>
            {containers.data.map((col) => (
              <DraggableItem key={col} id={col} label={col} data={col} />
            ))}
          </Droppable>

          {/* X-Axis */}
          <Droppable id="droppable-1" className="graphConfig__dnd-zone">
            <h2 className="graphConfig__data--placeholder">X-Axis</h2>
            {containers.xAxis.map((col) => (
              <DraggableItem key={col} id={col} label={col} data={col} />
            ))}
          </Droppable>

          {/* Y-Axis */}
          <Droppable id="droppable-2" className="graphConfig__dnd-zone">
            <h2 className="graphConfig__data--placeholder">Y-Axis</h2>
            {containers.yAxis.map((col) => (
              <DraggableItem key={col} id={col} label={col} data={col} />
            ))}
          </Droppable>
        </div>

        {/* DragOverlay */}
        <DragOverlay>
          {draggable ? (
            <div className="accordian__content">{draggable.label}</div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {containers.yAxis.length > 0 && (
        <div className="graphConfig__data--types">
          {containers.yAxis.map((item, index) => (
            <div key={index} style={{ marginBottom: '1.5rem' }}>
              <Dropdown
                label={`Select Graph Type For ${item}`}
                options={highChartOptions}
                onChange={(e) => handleChartCustomization(item, e.target.value)}
                value={chartTypes[item] || 'column'}
              />

              <div style={{ marginTop: '0.5rem' }}>
                <button
                  onClick={() => toggleColorPicker(item)}
                  className="colorPickerToggler"
                >
                  {showColorPickers[item] ? 'Hide' : 'Pick'} Color for {item}
                </button>

                {showColorPickers[item] && (
                  <div style={{ maxWidth: '200px' }}>
                    <HexColorPicker
                      color={chartColors[item] || '#000000'}
                      onChange={(color) => handleColorChange(item, color)}
                    />
                    <div
                      style={{
                        marginTop: '0.5rem',
                        height: '24px',
                        backgroundColor: chartColors[item] || '#000000',
                        border: '1px solid #ccc',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

export function HighchartGraphs({ sql, widgitProp }) {
  const { selectedXAxis, selectedYAxes, chartTypes, chartColors } =
    widgitProp?.dataSet?.lt_json?.graphData ||
    widgitProp?.lt_json?.graphData ||
    '';

  const categories = selectedXAxis ? sql.map((row) => row[selectedXAxis]) : [];

  const series = selectedYAxes.map((col) => ({
    name: col,
    data: sql.map((row) => row[col]),
    type: chartTypes[col] || 'column',
    color: chartColors[col] || undefined,
  }));

  const options = {
    title: {
      text: '',
    },
    xAxis: {
      categories,
      labels: {
        rotation: 0, // Force no rotation
        style: {
          whiteSpace: 'nowrap', // Optional: prevent label wrapping
          textOverflow: 'ellipsis', // Optional: ellipsis if too long
        },
        formatter: function () {
          return this.value; // Just show raw label text
        },
      },
    },
    series,
    tooltip: {
      style: {
        fontSize: '15px',
        fontFamily: "'Roboto', sans-serif",
        padding: '12px',
        pointerEvents: 'none',
      },
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 0,
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '15px',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '500',
        color: '#1e1e1e', // or any color you want
      },
      itemMarginTop: 10, // Add space between legend items vertically if needed
      itemMarginBottom: 10,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

export function InteractiveHighchartGraphs({ sql, widgitProp }) {
  //derived state
  const { selectedXAxis, selectedYAxes, chartTypes, chartColors } =
    widgitProp?.dataSet?.lt_json?.graphData ||
    widgitProp?.lt_json?.graphData ||
    {};

  const pkCol =
    widgitProp?.dataSet?.lt_json?.pkCol ||
    widgitProp?.lt_json?.pkCol ||
    widgitProp?.lt_json?.pkCols ||
    {};

  const drilldown_ids =
    widgitProp?.dataSet?.drilldown_ids || widgitProp?.drilldown_ids || {};

  //redux state
  const allWidgits = useSelector((state) => state.drilldownConfig.allWidgits);
  const dispatch = useDispatch();

  const selectedColumn = useRef();

  // Assign a random ID to each SQL row (memoized for stability)
  const sqlWithIds = useMemo(() => {
    return sql.map((row) => ({
      ...row,
      __uid: uuidv4(),
    }));
  }, [sql]);

  const categories = selectedXAxis
    ? sqlWithIds.map((row) => row[selectedXAxis])
    : [];

  const [popup, setPopup] = useState({
    visible: false,
    content: '',
  });

  function handleDrilldown(itemID, clickedRecord) {

    setPopup({ visible: false, content: null });

    const nextWidgit = allWidgits.find((item) => item.id === itemID);
    const nextWidgitPKValues = pkCol[itemID] || pkCol;

    let pkColumnValues = {};

    Object.keys(nextWidgitPKValues).forEach((key) => {
      const pkColFromChart = nextWidgitPKValues[key];
      pkColumnValues[key] = clickedRecord[pkColFromChart];
    });


    //setting up next widgit data
    dispatch(setWidgitToExecute(nextWidgit));
    dispatch(setPKColsData({ [String(itemID)]: pkColumnValues }));
  }

  //Generate series with each point carrying its unique row ID
  const series = selectedYAxes.map((col) => ({
    name: col,
    data: sqlWithIds.map((row) => ({
      y: row[col],
      __uid: row.__uid, // attach ID to the data point
      category: row[selectedXAxis],
    })),
    type: chartTypes?.[col] || 'column',
    color: chartColors?.[col] || undefined,
    point: {
      events: {
        click: function () {
          // Find the clicked record using the unique ID
          const clickedRecord = sqlWithIds.find((r) => r.__uid === this.__uid);

          selectedColumn.current = clickedRecord;

          const listOfAvailableDrilldowns = Object.keys(drilldown_ids);

          setPopup({
            visible: true,
            content: (
              <div className="drilldownMaster__popup--content">
                <h3 className="drilldownMaster__popup--content-heading">
                  Drilldown To
                </h3>
                {allWidgits
                  .filter((item) =>
                    listOfAvailableDrilldowns.includes(String(item.id))
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="drilldownMaster__popup--content-options"
                      onClick={() => handleDrilldown(item.id, clickedRecord)}
                    >
                      {item.str_name}
                    </div>
                  ))}
              </div>
            ),
          });
        },
      },
    },
  }));

  const options = {
    chart: {
      events: {
        click: function (event) {
          if (!event.point) setPopup({ visible: false, content: '' });
        },
      },
    },
    title: { text: '' },
    xAxis: {
      categories,
      labels: {
        rotation: 0,
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontSize: '13px',
        },
      },
    },
    tooltip: {
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 0,
      style: {
        fontSize: '15px',
        fontFamily: "'Roboto', sans-serif",
        padding: '12px',
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '15px',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: '500',
        color: '#1e1e1e',
      },
      itemMarginTop: 10,
      itemMarginBottom: 10,
    },
    series,
  };

  return (
    <div style={{ position: 'relative' }}>
      <HighchartsReact highcharts={Highcharts} options={options} />

      {popup.visible && (
        <>
          <div
            onClick={() => setPopup({ visible: false, content: null })}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999,
            }}
          ></div>

          <div className="drilldownMaster__popup">{popup.content}</div>
        </>
      )}
    </div>
  );
}
