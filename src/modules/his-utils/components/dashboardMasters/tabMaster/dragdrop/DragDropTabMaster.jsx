//eslint-disable-next-line
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import TabLayoutWrapper from '../../../dragdrop/tabMaster/TabLayoutWrapper';
import ComponentList from '../../../dragdrop/tabMaster/ComponentList';
import Droppable from '../../../dragdrop/FlexiLayoutDnD/Dropabble';
import ParameterGrid from '../../../dragdrop/WidgetMaster/ParameterGrid';
import { setDraggable } from '../../../../Features/Drag&Drop/DnDSlice';
import { setSQL, setWidgitStyle, setWidgitType } from '../../../../Features/WidgitEngine/WidgitViewerSlice';
import { removePopupData, resetDefaultState, setPopupData, togglePopup } from '../../../../Features/Popup/popupSlice';
import { themeClasses } from '../../../dragdrop/dashboardSettings';


export default function DragDropTabMaster({ setTablayout, tabLayout }) {

    //Redux state
    const droppedComponents = useSelector(
        (state) => state.popupData.parametersData
    );
    const dispatch = useDispatch();
    const draggable = useSelector((state) => state.dnd.draggable);

    //local states
    const [selectedStyle, setSelectedStyle] = useState('minimalistic');
    const [activeWidget, setActiveWidget] = useState(null);
    const [currentStyle, setCurrentStyle] = useState(themeClasses.minimalistic);
    const [paramState, setParamState] = useState('visible');
    const [layout, setLayout] = useState([]);
    //Derived state
    const currentLayout = useMemo(
        () => droppedComponents.map((widget) => widget.layout),
        [droppedComponents]
    );

    const paramWidgets = useMemo(() => {
        return droppedComponents.filter((data) => data.type === 'Parameter');
    }, [droppedComponents]);

    function handleDragStart(event) {
        const { active } = event;
        const label = active?.data?.current;
        if (label) {
            dispatch(setDraggable({ id: active.id, label }));
        }
    }

    function handleDragEnd({ active, over }) {
        if (over) {
            const dataSet = active?.data?.current;

            //Avoid Adding Duplicates
            if (
                droppedComponents.some(
                    (object) => object.dataSet?.str_id === dataSet?.str_id
                )
            ) {
                return;
            }
            if (dataSet) {
                const id = dataSet?.str_id;
                const newWidget = {
                    itemId: dataSet?.str_id,
                    id: id?.toString(),
                    type: dataSet?.str_type,
                    dataSet,
                    layout: { x: 0, y: 0, w: 4, h: 3, i: dataSet?.str_id?.toString(), static: false },
                };

                dispatch(setPopupData([newWidget]));

                if (dataSet.str_type === 'Widgit') {
                    setActiveWidget(dataSet);
                }
            }
        }

        dispatch(setDraggable(null));
    }

    function handleWidgitClose(id) {
        dispatch(removePopupData(id));
    }

    function handleParameterFilterState() {
        dispatch(togglePopup(true));
    }

    useEffect(() => {
        if (layout?.length > 0) {
            setTablayout(layout);
        }
    }, [layout,handleWidgitClose])


    useEffect(() => {
        if (!activeWidget) return;

        const widgetType = activeWidget?.lt_json?.widgitType;
        const widgetQuery = activeWidget?.lt_json?.widgitQuery;

        dispatch(setWidgitType(widgetType));
        dispatch(setSQL(widgetQuery));
        dispatch(setWidgitStyle([currentStyle.at(3), currentStyle.at(4)]));
    }, [activeWidget]);


    return (
        <div className="tabMaster">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="tabMaster__Wrapper">
                    <Droppable id="droppable">
                        <h2 className="dndZone__placeholder">Drop Your Components Here</h2>
                        <DragOverlay>
                            {draggable ? (
                                <div className="accordian__content">{draggable.id}</div>
                            ) : null}
                        </DragOverlay>
                        {/* <Popup /> */}
                        <TabLayoutWrapper
                            addOnStyles={currentStyle?.at(2)}
                            layout={currentLayout}
                            // onLayoutChange={(newLayout) => setLayout(newLayout)}

                            onLayoutSave={(newLayout) => {
                                const updatedComponents = droppedComponents.map((comp) => {
                                    const updatedLayout = newLayout.find(
                                        (l) => l.i?.toString() === comp.id?.toString()
                                    );

                                    return updatedLayout
                                        ? {
                                            ...comp,
                                            layout: { ...updatedLayout, i: comp.id?.toString() },
                                        }
                                        : comp;
                                });
                                dispatch(resetDefaultState());
                                dispatch(setPopupData(updatedComponents));
                                setLayout(newLayout);
                            }}
                        >
                            {paramState === 'collapsed' && paramWidgets.length > 0 && (
                                <div
                                    style={{
                                        transition: 'all 0.4s ease',
                                    }}
                                    className={`tabMaster__Wrapper-paramfilter ${currentStyle?.at(7)}`}
                                    data-grid={{ x: 0, y: 0, w: 1, h: 1, i: 'filter' }}
                                    key={'filter'}
                                    onClick={handleParameterFilterState}
                                >
                                    <img
                                        className={`tabMaster__Wrapper-paramfilter--img ${currentStyle?.at(7)}-icon`}
                                        src="/filter.png"
                                        alt="parameter filter"
                                    />
                                </div>
                            )}
                            {droppedComponents?.length > 0 && droppedComponents.map((widget) => {
                                if (widget.type === 'Parameter' && paramState !== 'collapsed') {
                                    return (
                                        <div
                                            key={widget.id}
                                            data-grid={widget.layout}
                                            // data-grid={{ ...widget.layout, i: widget.id }}
                                            className="layoutWrapper"
                                        >
                                            <span
                                                onClick={() => handleWidgitClose(widget.id)}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                className="layoutWrapper__close"
                                                style={
                                                    selectedStyle === 'blackGold'
                                                        ? { color: 'white' }
                                                        : { color: '#db3030' }
                                                }
                                            >
                                                &times;
                                            </span>

                                            <ParameterGrid
                                                paramData={[widget?.dataSet]}
                                                containerClass={currentStyle?.at(0)}
                                                childClass={currentStyle?.at(1)}
                                            />
                                        </div>
                                    );
                                } else if (widget.type === 'Widgit') {
                                    return (
                                        <div
                                            key={widget.id}
                                            data-grid={widget.layout}
                                            // data-grid={{ ...widget.layout, i: widget.id }}
                                            className="layoutWrapper bgbgbbg"
                                            style={{ overflow: 'scroll', border: "1px solid gray", borderRadius: "10px" }}
                                            id={widget.id}
                                        >
                                            <span
                                                onClick={() => handleWidgitClose(widget.id)}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                className="layoutWrapper__close"
                                                style={
                                                    selectedStyle === 'blackGold'
                                                        ? { color: 'white' }
                                                        : { color: '#db3030' }
                                                }
                                            >
                                                &times;
                                            </span>

                                            {/* <WidgitEngine /> */}
                                            <h1>{widget?.dataSet?.str_name || 'Widget'}</h1>
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </TabLayoutWrapper>
                    </Droppable>
                </div>

                <div className="tabMaster__options">
                    <ComponentList />
                </div>
            </DndContext>
        </div>
    );
}
