import React, { lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import WidgetDash from './WidgetDash';
import { HISContext } from '../../contextApi/HISContext';
import FooterText from '../commons/FooterText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';
import { fetchPostData } from '../../../../utils/HisApiHooks';
import { decryptData } from '../../../../utils/SecurityConfig';

const PdfDownload = lazy(() => import('../commons/PdfDownload'));
const Parameters = lazy(() => import('./Parameters'));

const TabDash = React.memo(() => {
    const { setLoading, loading, activeTab, setParamsValues, presentWidgets, setPresentWidgets, prevKpiTab, setActiveTab, setPrevKpiTab, setParamsValuesPro, dt } = useContext(HISContext);
    const [presentTabs, setPresentTabs] = useState([]);
    const [widWithoutLinked, setWidWithoutLinked] = useState([]);
    const [allWidgetData, setAllWidgetData] = useState([]);
    const [tabLoading, setTabloading] = useState(false);

    const [searchParams] = useSearchParams();
    const groupId = atob(searchParams.get("groupId"));
    const dashboardFor = atob(searchParams.get("dashboardFor"));

    const footerText = activeTab?.jsonData?.footerText || "";

    const getAllAvailableWidgets = useCallback(async (idArr, dashFor) => {
        
        try {
            const val = {
                ids: idArr || [],
                dashboardFor: dashFor || 'CENTRAL DASHBOARD',
                masterName: "DashboardWidgetMst"
            };
       
            const data = await fetchPostData("/hisutils/getWdgtMultipleData", val);

           
            if (data?.status === 1) {
                setAllWidgetData(data?.data);
                return data?.data;
            } else {
                setAllWidgetData([]);
                return [];
            }
        } catch (error) {
            console.error("Error fetching tabs data", error);
            return [];
        }
    }, []);


    useEffect(() => {
        const loadWidgets = async () => {
            setTabloading(true)
            if (activeTab?.jsonData?.lstDashboardWidgetMapping?.length > 0) {
                setParamsValues({
                    tabParams: {},
                    widgetParams: {},
                })
                setParamsValuesPro({
                    tabParams: {},
                    widgetParams: {},
                })
                const widgetIds = activeTab?.jsonData?.lstDashboardWidgetMapping;

                const sortedWidgets = [...widgetIds].sort((a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder));
                // const availableWidgets = sortedWidgets
                //     ?.map(wid => allWidgetData?.find(widget => widget?.rptId == wid?.rptId))
                //     ?.filter(widget => widget);

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

                setWidWithoutLinked(standaloneAndParentsOnly);
                setPresentWidgets(uniqueWidgets);
                setPresentTabs(sortedWidgets);
                setTabloading(false);
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
                setTabloading(false);
            }
        };

        loadWidgets();
    }, [activeTab]);

    const onPrevClick = () => {
        setActiveTab(prevKpiTab[0])
        setPrevKpiTab([])
    }

    // console.log(activeTab,'activeTab')

    return (
        <>
            {tabLoading ? <h1>Loading...</h1> : (
                <div>
                    {prevKpiTab?.length > 0 &&
                        <div className=''>
                            <button className='btn btn-sm me-1 back-button-kpi' onClick={onPrevClick}>
                                <FontAwesomeIcon icon={faArrowLeft}
                                    className="me-1" />{dt('Back')}</button>
                        </div>
                    }
                    {(activeTab?.jsonData?.docJsonString && JSON.parse(activeTab?.jsonData?.docJsonString)?.length > 0) && (
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
                    )}

                    <h4 className='text-center'>{dt(activeTab?.jsonData?.dashboardName)}</h4>

                    {activeTab?.jsonData?.allParameters && (
                        <div className='parameter-box'>
                            <Suspense
                                fallback={
                                    <div className="pt-3 text-center">
                                        {dt('Loading')}...
                                    </div>
                                }
                            >
                                <Parameters params={activeTab?.jsonData?.allParameters} dashFor={activeTab?.dashboardFor} scope={'tabParams'} />
                            </Suspense>
                        </div>
                    )}

                    <div className='row mt-4'>
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
                                            <WidgetDash widgetDetail={widget} presentWidgets={presentWidgets} presentTabs={presentTabs} />
                                        </Suspense>
                                    </>
                                }
                            </React.Fragment>
                        ))
                        }
                    </div>
                    <FooterText footerText={footerText} />
                </div>
            )}

        </>
    );
});

export default TabDash;
