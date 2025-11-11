import React, { useContext, useEffect, useState, useCallback, Suspense, lazy } from "react";
import { HISContext } from "../../contextApi/HISContext";
import { useSearchParams } from "react-router-dom";
import { fetchData, fetchPostData } from "../../../../utils/HisApiHooks";
import Parameters from "../../components/sidebar/Parameters";

const DashSidebar = lazy(() => import("../../components/sidebar/Sidebar"));
const TopBar = lazy(() => import("../../components/sidebar/TopBar"));
const TabDash = lazy(() => import("../../components/sidebar/TabDash"));

const DashboardMst = () => {
    const { activeTab, setActiveTab, theme, setTheme, mainDashData, setMainDashData, setLoading, loading, getDashConfigData, setParamsValues, setPrevKpiTab, dt, setPresentTabsDash } = useContext(HISContext);

    const [searchParams] = useSearchParams();
    const [presentTabs, setPresentTabs] = useState([]);
    const [allTabIds, setAllTabIds] = useState([]);

    const groupId = atob(searchParams.get("groupId"));
    const dashboardFor = atob(searchParams.get("dashboardFor"));
    const isGlobal = searchParams.get("isGlobal") || 0;


    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);
            try {
                //  First get the config data (which sets the token)
                await getDashConfigData();

                //  Wait a moment to ensure token is stored in localStorage
                await new Promise(resolve => setTimeout(resolve, 500));

                //  Now call the dashboard data
                if (dashboardFor && groupId) {
                    getDashboardData(groupId, dashboardFor);
                }

            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, [dashboardFor, groupId]);

    const getDashboardData = (groupId, dashFor) => {
        try {
            fetchData(`/hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst?isGlobal=${isGlobal || 0}`).then((data) => {
                if (data?.status === 1) {
                    setMainDashData(data?.data);

                    if (data?.data) {
                        const ids = data.data.jsonData.dashboardIds.split(',').map(Number) || [];
                        const themes = data.data?.jsonData?.dashboardTheme || 'Default';
                        if (ids?.length > 0) {
                            setAllTabIds(ids);
                        } else {
                            setAllTabIds([]);

                        }
                        setTheme(themes);
                        // await getAllAvailableTabs(ids, dashboardFor);
                    }
                }
            })

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };


    const getAllAvailableTabs = (idArr, dashFor) => {
        try {
            const val = {
                "ids": idArr || [],
                "dashboardFor": dashFor,
                "masterName": "DashboardMst"
            };
            fetchPostData(`/hisutils/gettabsMultipleData?isGlobal=${isGlobal || 0}`, val).then((data) => {
                if (data?.status === 1) {
                    setPresentTabs(data?.data);
                    setPresentTabsDash(data?.data);
                    setLoading(false);
                } else {
                    setPresentTabs([]);
                    setPresentTabsDash([]);
                    setLoading(false);
                };
            })
        } catch (error) {
            console.error("Error fetching tabs data", error);
        }
    };

    useEffect(() => {
        if (allTabIds?.length > 0) {
            // const ids = mainDashData.jsonData.dashboardIds.split(',').map(Number) || [];
            // const themes = mainDashData?.jsonData?.dashboardTheme || 'Default'
            // setTheme(themes);
            getAllAvailableTabs(allTabIds, dashboardFor);
        }
        // else {
        //     setNoTabErr('no tabs')
        // }
    }, [allTabIds]);

    const isTopBarLayout = mainDashData?.jsonData?.tabDisplayStyle === 'TOP';
    const parameters = mainDashData?.jsonData?.allSelectedParaList || '';

    const handleSetParamsValues = useCallback((values) => {
        setParamsValues(values);
    }, []);


    return (
        <>
            {loading ? <h1 className="text-center">Loading...</h1> : (
                <div className={`${theme === 'Dark' ? 'dark-theme' : ''}`} style={{
                    display: isTopBarLayout ? "block" : 'flex',
                    backgroundColor: "#f4f4f4",
                    minHeight: "100vh"
                }}>
                    <Suspense
                        fallback={
                            <div className="pt-3 text-center">
                                {dt('Loading')}...
                            </div>
                        }
                    >
                        {isTopBarLayout ? (
                            <TopBar
                                data={presentTabs}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                dashboardData={mainDashData}
                                setPrevKpiTab={setPrevKpiTab}
                                dt={dt}
                            />
                        ) : (
                            <DashSidebar
                                data={presentTabs}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                dashboardData={mainDashData}
                                setPrevKpiTab={setPrevKpiTab}
                                dt={dt}
                            />
                        )}
                    </Suspense>

                    <main style={{ flex: 1, width: isTopBarLayout ? "" : "80%" }} >
                        {parameters &&
                            <div className='parameter-box'>
                                <Suspense
                                    fallback={
                                        <div className="pt-3 text-center">
                                            {dt('Loading')}...
                                        </div>
                                    }
                                >
                                    <Parameters params={parameters} dashFor={mainDashData?.dashboardFor} setParamsValues={handleSetParamsValues} />
                                </Suspense>
                            </div>
                        }

                        {activeTab &&
                            <Suspense
                                fallback={
                                    <div className="pt-3 text-center">
                                        {dt('Loading')}...
                                    </div>
                                }
                            >
                                <TabDash />
                            </Suspense>
                            // <p className="text-center text-danger"> {noTabErr}</p>
                            // : <>
                            //     <h2 className="text-danger">Internal Error!!!! </h2>
                            // </>
                        }

                    </main>
                </div>
            )}
            <p className="version-tag">version 1.1</p>
        </>
    );
};

export default DashboardMst;
