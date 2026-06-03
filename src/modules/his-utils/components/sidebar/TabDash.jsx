import React, { lazy, Suspense, useContext, useEffect, useRef, useState } from 'react';
import WidgetDash from './WidgetDash';
import { HISContext } from '../../contextApi/HISContext';
import FooterText from '../commons/FooterText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';
import { fetchPostData } from '../../../../utils/HisApiHooks';
import { useDispatch } from 'react-redux';
import { setWidgitStyle } from '../../Features/WidgitEngine/WidgitViewerSlice';
import { themeClasses } from '../dragdrop/dashboardSettings';
// import SessionClock from '../commons/SessionClock';

const PdfDownload = lazy(() => import('../commons/PdfDownload'));
const Parameters = lazy(() => import('./Parameters'));

const TabDash = React.memo(() => {
    const { activeTab, setParamsValues, presentWidgets, setPresentWidgets, prevKpiTab, setActiveTab, setPrevKpiTab, setParamsValuesPro, dt, setTabParams, tabParams, setPkColumn } = useContext(HISContext);
    const [presentTabs, setPresentTabs] = useState([]);
    const [widWithoutLinked, setWidWithoutLinked] = useState([]);
    const [allWidgetData, setAllWidgetData] = useState([]);
    const [tabLoading, setTabloading] = useState(false);
    const [paramsForPreview, setParamsForPriview] = useState('');

    const [searchParams] = useSearchParams();

    const groupId = atob(searchParams.get("groupId"));
    const dashboardFor = atob(searchParams.get("dashboardFor"));
    const isGlobal = searchParams.get("isGlobal") || 0;

    // const abortControllerRef = useRef(null);


    const footerText = activeTab?.jsonData?.footerText || "";

    const getAllAvailableWidgets = (idArr, dashFor) => {

        // if (abortControllerRef.current) {
        //     abortControllerRef.current.abort();
        // }

        // abortControllerRef.current = new AbortController();

        try {
            const val = {
                ids: idArr || [],
                dashboardFor: dashFor || 'CENTRAL DASHBOARD',
                masterName: "DashboardWidgetMst"
            };
            return fetchPostData(`/hisutils/getWdgtMultipleData?isGlobal=${isGlobal || 0}`, val,
            ).then((data) => {
                if (data?.status === 1) {
                    setAllWidgetData(data?.data);
                    return data?.data;
                } else {
                    setAllWidgetData([]);
                    return [];
                }
            }).catch((error) => {
                console.error("Error fetching tabs data", error);
                setAllWidgetData([]);
                return [];
            })

        } catch (error) {
            console.error("Error fetching tabs data", error);
            return [];
        }
    };

    useEffect(() => {
        let isCurrent = true;
        const loadWidgets = async () => {
            setTabloading(true);
            if (activeTab?.jsonData?.lstDashboardWidgetMapping?.length > 0 || (activeTab?.jsonData?.isLayoutWithPreview === "Yes" && activeTab?.jsonData?.droppedComponents?.length > 0)) {
                setParamsValues({
                    tabParams: {},
                    widgetParams: {},
                })
                setParamsValuesPro({
                    tabParams: {},
                    widgetParams: {},
                })

                let widgetIds = [];
                let sortedWidgets = [];

                if (activeTab?.jsonData?.isLayoutWithPreview !== "Yes") {
                    widgetIds = activeTab?.jsonData?.lstDashboardWidgetMapping;
                    sortedWidgets = [...widgetIds].sort((a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder));
                } else {
                    const idw = activeTab?.jsonData?.droppedComponents?.length > 0 && activeTab?.jsonData?.droppedComponents?.filter(dt => dt?.type === "Widgit")
                        .map(item => item.id);

                    const idp = activeTab?.jsonData?.droppedComponents?.length > 0
                        ? activeTab.jsonData.droppedComponents
                            .filter(dt => dt?.type === "Parameter")
                            .map(item => item.id)
                        // .join(",")
                        : [];
                    widgetIds = idw;
                    sortedWidgets = widgetIds?.map((dt) => ({
                        rptId: dt
                    }));
                    setParamsForPriview(idp);
                }

                const availableWidgets = await getAllAvailableWidgets(sortedWidgets?.map(dt => dt?.rptId), dashboardFor);


                let finalWidgets = [];

                sortedWidgets?.forEach(wid => {
                    const parentWidget = availableWidgets?.find(widget => widget?.jsonData?.rptId == wid?.rptId)?.jsonData;
                    if (parentWidget) {
                        finalWidgets?.push(parentWidget);
                        if (parentWidget?.linkedWidgetRptId) {
                            const linkedWidgetIds = parentWidget.linkedWidgetRptId?.split(',');
                            linkedWidgetIds?.forEach(linkedId => {
                                const linkedWidget = availableWidgets?.find(widget => widget?.jsonData?.rptId == linkedId);
                                if (linkedWidget) {
                                    finalWidgets?.push(linkedWidget?.jsonData);
                                }
                            });
                        }
                    }
                });
                let seen = new Set();
                let uniqueWidgets = finalWidgets?.filter(widget => {
                    if (!seen.has(widget.rptId)) {
                        seen.add(widget.rptId);
                        return true;
                    }
                    return false;
                });

                uniqueWidgets?.forEach((parent) => {
                    parent.children = uniqueWidgets
                        .filter((child) => child.parentReport == parent.rptId)
                        .map((child) => child.rptId);
                });

                const childWidgetIds = new Set(
                    uniqueWidgets
                        .filter(widget => uniqueWidgets.some(parent => widget.parentReport == parent.rptId))
                        .map(widget => widget.rptId)
                );

                const allLinkedRptIds = new Set(
                    uniqueWidgets
                        .flatMap(widget => widget?.linkedWidgetRptId?.split(',') || [])
                        ?.map(id => id?.trim())
                        ?.filter(Boolean)
                );

                const standaloneAndParentsOnly = uniqueWidgets?.filter(
                    widget => !childWidgetIds.has(widget.rptId)
                        && !allLinkedRptIds.has(widget.rptId)
                        && widget.widgetType !== "singleQueryChild"
                );
                if (activeTab?.jsonData?.isLayoutWithPreview === "Yes") {
                    setWidWithoutLinked(uniqueWidgets);
                } else {
                    setWidWithoutLinked(standaloneAndParentsOnly);
                }
                setPresentWidgets(uniqueWidgets);
                setPresentTabs(sortedWidgets);
                if (isCurrent) {
                    setTabloading(false);
                }
            } else {
                setPresentWidgets([]);
                setWidWithoutLinked([]);
                setParamsValues({
                    tabParams: {},
                    widgetParams: {},
                })
                setParamsValuesPro({
                    tabParams: {},
                    widgetParams: {},
                })
                if (isCurrent) {
                    setTabloading(false);
                }
            }
        };

        loadWidgets();

        return () => {
            isCurrent = false;
        };
    }, [activeTab, dashboardFor]);

    // const onPrevClick = () => {
    //     setActiveTab(prevKpiTab[0])
    //     setPrevKpiTab([])
    // }

    const onPrevClick = () => {
        if (prevKpiTab.length > 0) {
            const previous = prevKpiTab[prevKpiTab.length - 1];
            setActiveTab(previous);
            setPkColumn(previous?.pkVal || "")
            setPrevKpiTab(prev => prev.slice(0, -1));
        }
    };

    const onPrevSelect = (index) => {
        const selectedTab = prevKpiTab[index];
        setActiveTab(selectedTab);
        // Keep only tabs before the selected one (like real navigation)
        setPkColumn(selectedTab?.pkVal || "")
        setPrevKpiTab(prev => prev.slice(0, index));
    };

    const dispatch = useDispatch();
    const gridStyles = useRef(themeClasses.minimalistic);
    const selectedStyle = 'minimalistic';
    let theme = [];

    switch (selectedStyle) {
        case 'minimalistic':
            theme = [
                'minimalistic__grid-item',
                'minimalistic__background',
                'minimalistic__grid',
            ];
            dispatch(
                setWidgitStyle([
                    'minimalistic__grid-widgit-wrapper',
                    'minimalistic__grid-widgit-wrapper--table',
                ])
            );
            gridStyles.current = themeClasses.minimalistic;
            break;
        case 'frostWhite':
            theme = [
                'frostWhite__grid-item',
                'frostWhite__background',
                'frostWhite__grid',
            ];
            dispatch(
                setWidgitStyle([
                    'frostWhite__grid-widgit-wrapper',
                    'frostWhite__grid-widgit-wrapper--table',
                ])
            );
            gridStyles.current = themeClasses.frostWhite;
            break;
        case 'blackGold':
            theme = [
                'blackGold__grid-item',
                'blackGold__background',
                'blackGold__grid',
            ];
            dispatch(
                setWidgitStyle([
                    'blackGold__grid-widgit-wrapper',
                    'blackGold__grid-widgit-wrapper--table',
                ])
            );
            gridStyles.current = themeClasses.blackGold;
            break;
        case 'emeraldGreen':
            theme = [
                'emeraldGreen__grid-item',
                'emeraldGreen__background',
                'emeraldGreen__grid',
            ];
            dispatch(
                setWidgitStyle([
                    'emeraldGreen__grid-widgit-wrapper',
                    'emeraldGreen__grid-widgit-wrapper--table',
                ])
            );
            gridStyles.current = themeClasses.emeraldGreen;
            break;
    }


    const bgclr = activeTab?.jsonData?.tabBackgroundColor || "#ffffff";
    const titleclr = activeTab?.jsonData?.tabTitleFontColor || "#000000";
    const tabNameReq = activeTab?.jsonData?.tabNameInReportRequired || "Yes";
    const tabNameFontWeight = activeTab?.jsonData?.tabnameFontWeight || "500";
    const tabTopPadding = activeTab?.jsonData?.tabTopPadding || "10";
    const tabNameMarginBottom = activeTab?.jsonData?.marginBottom || "5";
    const tabNameFontSize = activeTab?.jsonData?.tabnameFontSize || "150";
    const tabNameDecoration = activeTab?.jsonData?.tabnameDecoration || "none";



    return (
        <>
            {tabLoading ?
                <div className="text-center">
                    <p className="text-center">{'Fetching Widgets data...'}</p>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div> : (
                    <div
                        style={{
                            height: "100%",
                            background: bgclr,
                            padding: `${tabTopPadding}px 20px`
                        }}
                    >

                        {prevKpiTab?.length > 0 && (
                            <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                                <button className='btn btn-sm back-button-kpi' onClick={onPrevClick}>
                                    <FontAwesomeIcon icon={faArrowLeft}
                                        className="me-1" />{dt('Back')}</button>
                                {prevKpiTab?.length > 1 &&
                                    <div className="btn-group" role="group" style={{ borderLeft: ".5px solid" }}>
                                        <button type="button" className="btn btn-danger dropdown-toggle back-button-kpi" data-bs-toggle="dropdown" aria-expanded="false">
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-start">
                                            {prevKpiTab.map((tab, index) => (
                                                <li key={index}>
                                                    <button
                                                        className="dropdown-item pointer text-primary p-1"
                                                        onClick={() => onPrevSelect(index)}
                                                    >
                                                        {tab?.jsonData?.dashboardName || `Level ${index + 1}`}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            </div>
                        )}

                        {/* <div className='session-timer' style={{ float: "right" }}>
                        <SessionClock />
                    </div> */}

                        {/* {(activeTab?.jsonData?.docJsonString && JSON.parse(activeTab?.jsonData?.docJsonString)?.length > 0) && (
                            <>

                                <div className='help-docs'>
                                    <Suspense
                                        fallback={
                                            <div className="pt-3 text-center">
                                                {dt('Loading')}...
                                            </div>
                                        }
                                    >
                                        <PdfDownload docJsonString={activeTab?.jsonData?.docJsonString} />
                                    </Suspense>
                                </div>
                            </>
                        )} */}

                        {tabNameReq === "Yes" &&
                            <h4 className='text-center'
                                style={{
                                    color: titleclr,
                                    fontWeight: tabNameFontWeight,
                                    fontSize: `${tabNameFontSize}%`,
                                    marginBottom: `${tabNameMarginBottom}px`,
                                    textDecoration: `${tabNameDecoration}`
                                }}>{dt(activeTab?.jsonData?.dashboardName)}</h4>
                        }

                        {activeTab?.jsonData?.isLayoutWithPreview && activeTab?.jsonData?.isLayoutWithPreview === "Yes" ?
                            <>
                                <CustomGrid
                                    layout={activeTab?.jsonData?.tabLayout}
                                    // layout={activeTab?.jsonData?.droppedComponents?.map((dt)=>dt?.layout)}
                                    cssClass={[theme?.at(1), theme?.at(2)]}
                                >
                                    {paramsForPreview?.length > 0 && paramsForPreview?.map((param) => (
                                        <div className='parameter-box' gridKey={param} key={param}>
                                            <Suspense
                                                fallback={
                                                    <div className="pt-3 text-center">
                                                        {dt('Loading')}...
                                                    </div>
                                                }
                                            >
                                                <Parameters params={param} dashFor={activeTab?.dashboardFor} scope={'tabParams'} isLayoutWithPreview={true} setTabParams={setTabParams} tabParams={tabParams} />
                                            </Suspense>
                                        </div>
                                    ))
                                    }

                                    {widWithoutLinked?.length > 0 && widWithoutLinked.map((widget, index) => (
                                        <div gridKey={String(widget.rptId)} key={widget.rptId} style={{ height: "100%", width: "100%" }}>
                                            {widget &&
                                                <>
                                                    <Suspense
                                                        fallback={
                                                            <div className="pt-3 text-center">
                                                                {dt('Loading')}...
                                                            </div>
                                                        }
                                                    >
                                                        <WidgetDash widgetDetail={widget} presentWidgets={presentWidgets} presentTabs={presentTabs} isLayoutWithPreview={true} />
                                                    </Suspense>
                                                </>
                                            }
                                        </div>
                                    ))
                                    }
                                </CustomGrid>
                            </>
                            :
                            <>
                                {activeTab?.jsonData?.allParameters && (
                                    <div className='parameter-box'>
                                        <Suspense
                                            fallback={
                                                <div className="pt-3 text-center">
                                                    {dt('Loading')}...
                                                </div>
                                            }
                                        >
                                            <Parameters params={activeTab?.jsonData?.allParameters} dashFor={activeTab?.dashboardFor} scope={'tabParams'} isLayoutWithPreview={false} setTabParams={setTabParams} tabParams={tabParams} />
                                        </Suspense>
                                    </div>
                                )}

                                <div className='row'>
                                    {widWithoutLinked?.length > 0 && widWithoutLinked.map((widget, index) => (
                                        <React.Fragment key={index}>
                                            {widget &&
                                                <>
                                                    <Suspense
                                                        fallback={
                                                            <div className="pt-3 text-center">
                                                                {dt('Loading')}...
                                                            </div>
                                                        }
                                                    >
                                                        <WidgetDash widgetDetail={widget} presentWidgets={presentWidgets} presentTabs={presentTabs} isLayoutWithPreview={false} />
                                                    </Suspense>
                                                </>
                                            }
                                        </React.Fragment>
                                    ))
                                    }
                                </div>
                            </>
                        }

                        <FooterText footerText={footerText} />
                    </div>
                )}
        </>
    );
});

export function CustomGrid({ layout, children, cssClass }) {
    const GRID_COLS = 10;
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
        if (child?.props?.gridKey) {
            childrenMap[String(child.props.gridKey)] = child;
        }
    });

    return (
        <div style={gridStyle} className={cssClass?.at(0)}>
            {layout.map(({ i, x, y, w, h }) => {
                const cleanKey = i;

                return (
                    <div
                        key={cleanKey}
                        style={{
                            gridColumnStart: x + 1,
                            gridColumnEnd: x + 1 + w,
                            gridRowStart: y + 1,
                            gridRowEnd: y + 1 + h,
                        }}
                        className={cssClass?.at(1)}
                    >
                        {childrenMap[cleanKey] || <div>Missing component for {i}</div>}
                    </div>
                );
            })}
        </div>
    );
}

export default TabDash;
