import React, { useContext, useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { HISContext } from "../../contextApi/HISContext";
import { useSearchParams } from "react-router-dom";
import { fetchData, fetchPostData } from "../../../../utils/HisApiHooks";
import Parameters from "../../components/sidebar/Parameters";
import { decryptData, encryptData } from "../../../../utils/SecurityConfig";
import { getEncryptedParamValue } from "../../../../utils/Security";

const DashSidebar = lazy(() => import("../../components/sidebar/Sidebar"));
const TopBar = lazy(() => import("../../components/sidebar/TopBar"));
const TabDash = lazy(() => import("../../components/sidebar/TabDash"));

const DashboardMst = () => {
    const { activeTab, setActiveTab, theme, setTheme, mainDashData, setMainDashData, setLoading, loading, singleConfigData, getDashConfigData, setParamsValues, setPrevKpiTab, dt, setPresentTabsDash } = useContext(HISContext);

    const [searchParams] = useSearchParams();
    const [presentTabs, setPresentTabs] = useState([]);

    const groupId = atob(searchParams.get("groupId"));
    const dashboardFor = atob(searchParams.get("dashboardFor"));
    const isGlobal = searchParams.get("isGlobal") || 0;


    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);
            try {
                // Step 1: First get the config data (which sets the token)
                await getDashConfigData();

                // Step 2: Wait a moment to ensure token is stored in localStorage
                await new Promise(resolve => setTimeout(resolve, 500));

                // Step 3: Now call the dashboard data
                if (dashboardFor && groupId) {
                    await getDashboardData(groupId, dashboardFor);
                }

            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, [dashboardFor, groupId]);

    const getDashboardData = useCallback(async (groupId, dashFor) => {
        try {
            const data = await fetchData(`/hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst?isGlobal=${isGlobal || 0}`);
            if (data?.status === 1) {
                setMainDashData(data?.data);

                // Step 4: After main data is set, get available tabs
                if (data?.data) {
                    const ids = data.data.jsonData.dashboardIds.split(',').map(Number) || [];
                    const themes = data.data?.jsonData?.dashboardTheme || 'Default';
                    setTheme(themes);
                    await getAllAvailableTabs(ids, dashboardFor);
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    }, [dashboardFor]);

    const getAllAvailableTabs = useCallback(async (idArr, dashFor) => {
        try {
            const val = {
                "ids": idArr || [],
                "dashboardFor": dashFor,
                "masterName": "DashboardMst"
            };
            const data = await fetchPostData(`/hisutils/gettabsMultipleData?isGlobal=${isGlobal || 0}`, val);
            if (data?.status === 1) {
                setPresentTabs(data?.data);
                setPresentTabsDash(data?.data);
            } else {
                setPresentTabs([]);
                setPresentTabsDash([]);
            }
        } catch (error) {
            console.error("Error fetching tabs data", error);
        }
    }, []);

    // Remove these separate useEffect hooks as they're now handled in the main initialization
    // useEffect(() => {
    //     if (dashboardFor && groupId) {
    //         getDashboardData(groupId, dashboardFor);
    //     }
    // }, [dashboardFor, groupId]);

    // useEffect(() => {
    //     if (mainDashData) {
    //         const ids = mainDashData.jsonData.dashboardIds.split(',').map(Number) || [];
    //         const themes = mainDashData?.jsonData?.dashboardTheme || 'Default'
    //         setTheme(themes);
    //         getAllAvailableTabs(ids, dashboardFor).finally(() => setLoading(false));
    //     } else {
    //         setLoading(false)
    //     }
    // }, [mainDashData]);

    const isTopBarLayout = mainDashData?.jsonData?.tabDisplayStyle === 'TOP';
    const parameters = mainDashData?.jsonData?.allSelectedParaList || '';

    const handleSetParamsValues = useCallback((values) => {
        setParamsValues(values);
    }, []);


    // useEffect(() => {
    //     const init = async () => {
    //         await getDashConfigData();
    //     };

    //     init();
    // }, [])

    // const getDashboardData = useCallback((groupId, dashFor) => {
    //     setLoading(true);
    //     fetchData(`/hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst`)
    //         .then((data) => {
    //             if (data?.status === 1) setMainDashData(data?.data);
    //         });
    // }, []);

    // const getAllAvailableTabs = useCallback(async (idArr, dashFor) => {
    //     try {

    //         const val = {
    //             "ids": idArr || [],
    //             "dashboardFor": dashFor,
    //             "masterName": "DashboardMst"
    //         };
    //         const data = await fetchPostData("/hisutils/gettabsMultipleData", val);
    //         if (data?.status === 1) {
    //             setPresentTabs(data?.data);
    //             setPresentTabsDash(data?.data);
    //         } else {
    //             setPresentTabs([]);
    //             setPresentTabsDash([]);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching tabs data", error);
    //     }
    // }, []);


    // useEffect(() => {
    //     if (dashboardFor && groupId) {
    //         getDashboardData(groupId, dashboardFor);
    //         // getAllWidgetData(dashboardFor);
    //     }

    // }, [dashboardFor, groupId]);


    // useEffect(() => {
    //     if (mainDashData) {
    //         const ids = mainDashData.jsonData.dashboardIds.split(',').map(Number) || [];
    //         const themes = mainDashData?.jsonData?.dashboardTheme || 'Default'
    //         setTheme(themes);
    //         getAllAvailableTabs(ids, dashboardFor).finally(() => setLoading(false));
    //     } else {
    //         setLoading(false)
    //     }
    // }, [mainDashData]);

    // const isTopBarLayout = mainDashData?.jsonData?.tabDisplayStyle === 'TOP';
    // const parameters = mainDashData?.jsonData?.allSelectedParaList || '';


    // const handleSetParamsValues = useCallback((values) => {
    //     setParamsValues(values);
    // }, []);


    return (
        <>
            {loading ? <h1 className="text-center">Loding...</h1> : (
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
                            // : <>
                            //     <h2 className="text-danger">Internal Error!!!! </h2>
                            // </>
                        }
                    </main>
                </div>
            )}
        </>
    );
};

export default DashboardMst;
