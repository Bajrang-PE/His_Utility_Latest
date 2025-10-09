import React, { lazy, Suspense, useEffect, useState } from 'react';
import OtherLinkDash from './OtherLinkDash';
import NewsTickerDash from './NewsTickerDash';

const KpiDash = lazy(() => import('./KpiDash'));
const TabularDash = lazy(() => import('./TabularDash'));
const GraphDash = lazy(() => import('./GraphDash'));
const MapDash = lazy(() => import('./MapDash'));
const IframeDash = lazy(() => import('./IframeDash'));

const WidgetDash = React.memo(({ widgetDetail, presentWidgets, presentTabs, pk ,isLayoutWithPreview}) => {

    const [widgetData, setWidgetData] = useState({});
    const [linkedWidget, setLinkedWidget] = useState();
    const [pkColumn, setPkColumn] = useState('');
    const [levelData, setLevelData] = useState([]);

    const handleSetPkColumn = (val) => {
        setPkColumn(val)
    }

    useEffect(() => {
        if (pk && pk !== '') {
            handleSetPkColumn(pk)
        }
    }, [pk])

    useEffect(() => {
        setWidgetData(widgetDetail);
        setLevelData([{
            'rptId': widgetDetail?.rptId,
            'rptName': widgetDetail?.rptName,
            'rptLevel': 0
        }])
    }, [widgetDetail])

    useEffect(() => {
        if (widgetData) {
            const linkedWidgetIds = widgetData?.linkedWidgetRptId
                ?.split(',')
                ?.map(id => id?.trim())
                ?.filter(Boolean) || [];
            setLinkedWidget(linkedWidgetIds)
        }

    }, [widgetData])


    const renderWidget = (data) => {
        switch (data?.reportViewed) {
            case 'KPI': return <KpiDash widgetData={data} presentTabs={presentTabs} isLayoutWithPreview={isLayoutWithPreview}/>;

            case 'Tabular': return <TabularDash widgetData={data} setWidgetData={setWidgetData} levelData={levelData} setLevelData={setLevelData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} isLayoutWithPreview={isLayoutWithPreview} presentTabs={presentTabs}/>;

            case 'Graph': return <GraphDash widgetData={data} setWidgetData={setWidgetData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} isLayoutWithPreview={isLayoutWithPreview} presentTabs={presentTabs}/>;

            case 'Iframe': return <IframeDash widgetData={data} />;

            case 'Other_Link': return <OtherLinkDash widgetData={data} />;

            case 'News_Ticker': return <NewsTickerDash widgetData={data} />;

            case 'Criteria_Map': return (
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <MapDash widgetData={data} setWidgetData={setWidgetData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} levelData={levelData} setLevelData={setLevelData} />
                </div>
            );
            default: return null;
        }
    };


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                {widgetData && (
                    <>
                        {widgetData?.widgetType === "singleQueryParent" ? (
                            <>
                                {(() => {
                                    try {
                                        const parsedChildren = JSON.parse(widgetData?.sqChildJsonString || '[]');
                                        const mainQuery = widgetData?.queryVO?.[0]?.mainQuery || '';
                                        const orderedChildren = presentWidgets
                                            .filter(widget => parsedChildren.some(child => child.SQCHILDWidgetId === widget.rptId))
                                            .map(widget => {
                                                const childWidgetId = widget.rptId;
                                                const widgetWidth = presentTabs?.find(tab => tab?.rptId === childWidgetId)?.widgetWidth || 12;

                                                const childMeta = parsedChildren.find(child => child.SQCHILDWidgetId === childWidgetId);
                                                const columnIndexesParent = childMeta?.modeForSQCHILDColumnNo
                                                    ?.split(',')
                                                    ?.map(idx => parseInt(idx.trim()) - 1)
                                                    ?.filter(idx => !isNaN(idx));
                                                const modifiedWidget = {
                                                    ...widget,
                                                    queryVO: [
                                                        {
                                                            mainQuery
                                                        }
                                                    ],
                                                    columnIndexesParent,
                                                    isQuerychild: "1"
                                                };

                                                return (
                                                    <div
                                                        key={childWidgetId}
                                                        className={`${isLayoutWithPreview ? 'layouthw' : `col-sm-${widgetWidth}`}`}
                                                        style={{ padding: "5px 3px" }}
                                                    >
                                                        {renderWidget(modifiedWidget)}
                                                    </div>
                                                );
                                            });

                                        return <>{orderedChildren}</>;
                                    } catch (error) {
                                        console.error("Invalid sqChildJsonString", error);
                                        return null;
                                    }
                                })()}
                            </>
                        ) : (
                            // Normal widget rendering with col class
                             <div
                                className={`${isLayoutWithPreview ? 'layouthw' : `col-sm-${presentTabs?.find(dt => dt?.rptId == widgetData?.rptId)?.widgetWidth || 12}`} `}
                                style={{
                                    padding: "5px 3px"

                                }}
                            >
                                {renderWidget(widgetData)}
                            </div>
                        )}
                    </>
                )}

                {/* Render linked widgets if available */}
                {linkedWidget && linkedWidget.map((id) => {

                    const linked = presentWidgets?.find(w => w.rptId === id);
                    return linked ?

                        <div key={id} className={`${isLayoutWithPreview ? 'layouthw' : `col-sm-${presentTabs?.filter(dt => dt?.rptId == linkedWidget[0])[0]?.widgetWidth}`}`}
                            style={{
                                padding: "5px 3px"
                            }}
                        >
                            {renderWidget(linked)}
                        </div>
                        : null;
                })}
            </>
        </Suspense>
    );
});

export default WidgetDash;
