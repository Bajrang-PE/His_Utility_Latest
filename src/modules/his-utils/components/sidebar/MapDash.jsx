import React, { lazy, useContext, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getOrderedParamValues, ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { useSearchParams } from "react-router-dom";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faSortAmountDesc, faTableCells } from "@fortawesome/free-solid-svg-icons";
import Tabular from "./Tabular";
import Parameters from "./Parameters";


const MapDash = ({ widgetData, setWidgetData, pkColumn, setPkColumn, levelData, setLevelData }) => {
    const { theme, setSearchScope, singleConfigData, paramsValues, setLoading, isSearchQuery, setIsSearchQuery, presentWidgets, searchScope, dt } = useContext(HISContext);
    const [mapData, setMapData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
    const [stateName, setStateName] = useState([]);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(0);

    const [queryParams] = useSearchParams();
    const isPrev = queryParams.get('isPreview');

    const isChildPresent = widgetData?.children && widgetData?.children?.length > 0;
    const childId = widgetData?.children?.length > 0 ? widgetData?.children[0] : '';

    const borderReq = useMemo(() => widgetData?.isWidgetBorderRequired || '', [widgetData?.isWidgetBorderRequired]);
    const headingAlign = useMemo(() => widgetData?.widgetHeadingAlignment || '', [widgetData?.widgetHeadingAlignment]);
    const widgetHeadingColor = useMemo(() => widgetData?.widgetHeadingColor || '', [widgetData?.widgetHeadingColor]);
    const isWidgetNameVisible = useMemo(() => widgetData?.isWidgetNameVisible || '', [widgetData?.isWidgetNameVisible]);
    const isDirectDownloadRequired = useMemo(() => widgetData?.isDirectDownloadRequired || 'No', [widgetData?.isDirectDownloadRequired]);
    const widgetTopMargin = useMemo(() => widgetData.widgetTopMargin || "", [widgetData.widgetTopMargin]);
    const footerText = useMemo(() => widgetData.footerText || "", [widgetData.footerText]);
    const rptDisplayName = useMemo(() => widgetData?.rptDisplayName, [widgetData?.rptDisplayName]);
    const initialRecord = widgetData?.initialRecordNo;
    const finalRecord = widgetData?.finalRecordNo;

    const widgetLimit = useMemo(() => widgetData?.limitHTMLFromDb || '', [widgetData?.limitHTMLFromDb]);
    const mainQuery = widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''

    const rptId = useMemo(() => widgetData?.rptId, [widgetData?.rptId]);
    const modeOfQuery = useMemo(() => widgetData?.modeOfQuery, [widgetData?.modeOfQuery]);
    const procedureMode = useMemo(() => widgetData?.procedureMode, [widgetData?.procedureMode]);

    const defLimit = useMemo(() => singleConfigData?.databaseConfigVO?.setDefaultLimit || '', [singleConfigData]);
    const parsedLimit = useMemo(() => parseInt(defLimit, 10), [defLimit]);
    const safeLimit = useMemo(() => isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit, [parsedLimit]);
    const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;
    const paramsData = widgetData.selFilterIds || "";

    useEffect(() => {
        const timeout = setTimeout(() => {
            Promise.all([
                import('highcharts/modules/map'),
                import('highcharts/modules/drilldown'),
                import('highcharts/modules/exporting'),
                import('highcharts/modules/export-data'),
                // import('highcharts/highcharts-more')
            ])
                .then(([mapModule, drilldownModule, exportingModule, exportDataModule]) => {
                    const modules = [mapModule, drilldownModule, exportingModule, exportDataModule];

                    const applyModule = (mod) => {
                        if (typeof mod === 'function') {
                            mod(Highcharts);
                        } else if (mod && typeof mod.default === 'function') {
                            mod.default(Highcharts);
                        } else {
                            console.warn('Module is not a valid Highcharts module:', mod);
                        }
                    };

                    try {
                        modules.forEach((mod, index) => {
                            applyModule(mod);
                        });
                        setIsLoaded(true);

                    } catch (error) {
                        console.error('Error during module initialization:', error);
                    }
                })
                .catch((error) => {
                    console.error('Error loading Highcharts modules:', error);
                });
        }, 2000);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const loadMap = async () => {
            if (levelData && levelData?.length > 1) {
                const stateName = levelData[levelData.length - 1];
                if (stateName?.name) {
                    setStateName(stateName?.name)
                    const mapdt = await getStateMatDt(stateName.name);
                    setMapData(mapdt?.mapData)
                }
            } else {
                fetch("https://code.highcharts.com/mapdata/countries/in/in-all.geo.json")
                    .then((res) => res.json())
                    .then((data) => {
                        setMapData(data);
                    })
                    .catch((err) => {
                        console.error("Failed to load India map", err);
                    });
            }
        };
        loadMap();
    }, [widgetData])


    const formatData = (rawData = []) => {
        return rawData.map((item) => {
            const formattedItem = {};
            Object.entries(item).forEach(([key, value]) => {

                const formattedKey = key.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

                formattedItem[formattedKey] = formattedKey.includes("State") ? value : value;
            });
            return formattedItem;
        });
    };


    const getFirstValue = (val) => {
        return typeof val === 'string' && val.includes('##') ? val.split('##')[0] : val;
    };

    const generateColumns = (data, ifDrill = isChildPresent) => {
        if (!data || data.length === 0) return [];

        // const keys = Object.keys(data[0]);
        const keys = Object.keys(data[0]).filter(key => key !== 'pkcolumn');

        const reorderedKeys = [
            ...keys.filter(k => /^sno$/i.test(k)),
            ...keys.filter(k => /state/i.test(k)),
            // ...keys.filter(k => !/state/i.test(k))
            ...keys.filter(k => !/^sno$/i.test(k) && !/state/i.test(k))
        ];

        const dynamicColumns = reorderedKeys.map((key) => ({
            name: key,
            selector: row => getFirstValue(row[key]),
            sortable: true,
            wrap: true,
            width: /^sno$/i.test(key) ? '8%' : undefined,
            cell: (row) => {
                const value = row[key];
                const displayValue = getFirstValue(value);

                return typeof value === 'string' && value.includes("##") ? (
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                    // onClick={() => openPopUpWidget(value)}
                    >
                        {displayValue}
                    </span>
                ) : (
                    <span>{displayValue}</span>
                );
            }
        }));

        if (ifDrill) {
            const drillColumn = {
                name: "Action",
                cell: (row) => (
                    <button
                        className="rounded-4 border-1"
                    // onClick={() => onDrillDown(row?.pkcolumn)}
                    >
                        <FontAwesomeIcon icon={faSortAmountDesc} />
                    </button>
                )
            };
            return [drillColumn, ...dynamicColumns];
        }

        return dynamicColumns;
    };



    const fetchData = async (widget) => {

        if (widget?.modeOfQuery === "Procedure") {
            if (!widget?.procedureMode) return;
            try {
                const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');

                const params = [
                    getAuthUserData('hospitalCode')?.toString(), //hospital code===
                    "10001", //user id===
                    pkColumn ? pkColumn?.toString() : '', //primary key
                    paramVal.paramsId || "", //parameter ids
                    paramVal.paramsValue || "", //parameter values
                    isPaginationReq?.toString(), //is pagination required===
                    initialRecord?.toString(), //initial record no.===
                    finalRecord?.toString(), //final record no.===
                    "", //date options
                    formatDateFullYear(new Date()),//from values
                    formatDateFullYear(new Date()) // to values
                ]
                const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid);
                const formattedData = formatData(response.data || []);
                const generatedColumns = generateColumns(formattedData, isChildPresent);
                setColumns(generatedColumns);
                setTableData(formattedData);
                setLoading(false)
                setIsSearchQuery(false)
                setSearchScope({ scope: "", id: "" })
            } catch (error) {
                console.error("Error loading query data:", error);
                setLoading(false)
            }
        } else {
            if (!widget?.queryVO?.length > 0) return;

            const params = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);

            try {
                const data = await fetchQueryData(widget?.queryVO?.length > 0 ? widget?.queryVO : [], widget?.JNDIid, params);
                if (data?.length > 0) {
                    let filteredData = data;

                    if (widget?.isQuerychild && widget?.isQuerychild === "1") {
                        const columnIndexes = widget?.columnIndexesParent || [];
                        const keys = Object.keys(data[0]);
                        filteredData = data.map(row => {
                            const filteredRow = {};
                            columnIndexes.forEach(idx => {
                                const key = keys[idx];
                                if (key) filteredRow[key] = row[key];
                            });
                            return filteredRow;
                        });
                    }
                    const formattedData = formatData(filteredData);
                    const generatedColumns = generateColumns(formattedData, false);
                    setColumns(generatedColumns);
                    setTableData(formattedData);
                    setLoading(false)
                    setIsSearchQuery(false)
                    setSearchScope({ scope: "", id: "" })
                } else {
                    setColumns([]);
                    setTableData([]);
                }
            } catch (error) {
                console.error("Error loading query data:", error);
            }
        }
    }

    useEffect(() => {
        fetch("https://code.highcharts.com/mapdata/countries/in/in-all.geo.json")
            .then((res) => res.json())
            .then((data) => {
                setMapData(data);
            })
            .catch((err) => {
                console.error("Failed to load India map", err);
            });

    }, []);


    useEffect(() => {
        if (widgetData && !isSearchQuery) {
            fetchData(widgetData);
        }
    }, [widgetData, paramsValues]);

    useEffect(() => {
        if (isSearchQuery && searchScope?.scope === "widgetParams" && searchScope?.id == widgetData?.rptId) {
            fetchData(widgetData);
        } else if (isSearchQuery && searchScope?.scope !== "" && searchScope?.scope !== "widgetParams") {
            fetchData(widgetData);
        }
    }, [isSearchQuery]);


    if (!isLoaded) {
        return <div>{dt('Loading Chart')}...</div>
    }


    const transformMapData = (mapData) => {
        if (!mapData?.objects) return mapData;

        const stateKey = Object.keys(mapData.objects)[0];
        if (!stateKey || !mapData.objects[stateKey]?.geometries) return mapData;

        return {
            ...mapData,
            objects: {
                [stateKey]: {
                    ...mapData.objects[stateKey],
                    geometries: mapData.objects[stateKey].geometries.map((geo) => {
                        const districtName = geo.properties.district || geo.properties.name || geo.properties.district_name;
                        const hcKey = districtName?.toLowerCase().replace(/\s+/g, "-");

                        return {
                            ...geo,
                            properties: {
                                ...geo.properties,
                                "hc-key": hcKey,
                                name: districtName,
                            },
                        };
                    }),
                },
            },
        };
    };

    const getStateMatDt = async (name) => {
        if (!name) return null;

        const ftName = name.replace(/\s+/g, "").toLowerCase();

        try {
            const mapModule = await import(`../../localData/mapJson/${ftName}.json`);
            const mapData = transformMapData(mapModule.default);

            return {
                name: name,
                mapData: mapData,
                data: []
            };
        } catch (error) {
            console.error(`Error loading map for ${name}:`, error);
            return null;
        }
    };


    const onDrillDown = (pkCol, name) => {
        if (isChildPresent && childId) {
            setPkColumn(pkCol)
            setCurrentLevel(currentLevel + 1)
            const widgetDetail = presentWidgets?.length > 0 && presentWidgets?.filter(dt => dt?.rptId == childId)[0]
            setWidgetData(widgetDetail)
            setLevelData(prevLevelData => [
                ...prevLevelData,
                {
                    'rptId': widgetDetail?.rptId,
                    'rptName': widgetDetail?.rptName,
                    'rptLevel': currentLevel + 1,
                    'pkclm': pkCol,
                    'name': name
                }
            ]);
        } else {
            ToastAlert('No child available', 'warning')
        }
    }


    const chartOptions = {
        chart: {
            type: "map",
            map: mapData,
            events: {
                drilldown: async function (e) {
                    if (!e.seriesOptions) {
                        const chart = this;
                        // const state = await getStateMatDt(e.point.name);
                        if (e.point.name && isChildPresent) {
                            const pkCol = tableData.find(item => item.state_name == e.point.name)?.pkcolumn;
                            chart.showLoading("Loading...");
                            setTimeout(() => {
                                onDrillDown(pkCol, e.point.name)
                                chart.hideLoading();
                                // chart.addSeriesAsDrilldown(e.point, {
                                //     type: "map",
                                //     name: state.name,
                                //     mapData: state.mapData,
                                //     joinBy: "name",
                                //     data: state.data?.map(({ state_name, count }) => ({
                                //         name: state_name,
                                //         value: count,
                                //     })),
                                //     colorAxis: true,
                                //     tooltip: {
                                //         pointFormat: "{point.name}: {point.value}",
                                //     },
                                // });

                            }, 1000);
                        } else {
                            ToastAlert(dt('Child Not Found!'))
                        }
                    }
                },
                drillup: function () {
                    console.log("Drilling up...");
                },
            },
        },
        title: {
            text: "India Map with Drilldown",
        },
        subtitle: {
            text: "Click states to view districts",
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: "bottom",
            },
        },
        colorAxis: {
            // min: 0,
            // max: Math.max(...tableData.map(d => d.count)),
            // minColor: "#E6E7E8",
            // maxColor: "#006400",
            min: 1,
            max: Math.max(...tableData.map(d => levelData?.length > 1 ? d?.edl_district_count : d?.count)),
            stops: [
                [0, '#E6E7E8'],
                [0.5, '#66bb66'],
                [1, '#006400']
            ]
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: "#EEDD66",
                    },
                },
                allAreas: true,
                nullColor: "#F0F0F0",
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                    style: {
                        fontWeight: "bold",
                        color: "black",
                    },
                },
            },
        },
        series: [
            {
                name: "India",
                mapData: mapData,
                data: (stateName !== tableData[0]?.state_name && levelData?.length > 1) ? [] : tableData.map((dt) => ({
                    name: levelData?.length > 1 ? dt?.district : dt?.state_name,
                    value: levelData?.length > 1 ? dt?.edl_district_count : dt?.count,
                    drilldown: levelData?.length > 1 ? dt?.district : dt?.state_name
                })),
                // data: tableData.map((dt) => ({
                //     name:  dt?.state_name,
                //     value:  dt?.count,
                //     drilldown:  dt?.state_name
                // })),
                joinBy: "name",
                tooltip: {
                    pointFormat: "{point.name}: {point.value}",
                },
            },
        ],
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    menuItems: [
                        "viewFullscreen",
                        "printChart",
                        "separator",
                        "downloadPNG",
                        "downloadJPEG",
                        "downloadPDF",
                        "downloadSVG",
                        "separator",
                        "downloadCSV",
                        "downloadXLS",
                    ],
                },
            },
            filename: "india-map",
        },
        drilldown: {
            series: [],
            activeDataLabelStyle: {
                color: "#0022ff",
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "none"
            },
            breadcrumbs: {
                position: {
                    align: "right",
                },
                buttonTheme: {
                    style: {
                        color: "#006400",
                    },
                },
            },
        },
    };

    const backToParentWidget = (id) => {
        if (levelData?.length > 1 && currentLevel !== 0) {
            let targetLevel = null;
            let widgetDetail = null;
            let pkClm = '';

            if (id) {
                const targetItem = levelData.find(dt => dt.rptId === id);
                pkClm = targetItem?.pkclm
                if (targetItem) {
                    targetLevel = targetItem.rptLevel;
                    widgetDetail = presentWidgets?.find(dt => dt?.rptId == id);
                }
            } else {
                targetLevel = currentLevel - 1;
                const parentItem = levelData.find(dt => dt.rptLevel === targetLevel);
                pkClm = parentItem?.pkclm
                widgetDetail = presentWidgets?.find(dt => dt?.rptId == parentItem?.rptId);
            }

            if (widgetDetail && targetLevel !== null) {
                setWidgetData(widgetDetail);
                setCurrentLevel(targetLevel);
                setPkColumn(pkClm)
                const restLevels = levelData.filter(dt => dt.rptLevel <= targetLevel);
                setLevelData(restLevels);
                setMapData(null)
            }
        }
    }


    return (
        <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>
            <div className="row px-2 py-2 border-bottom" style={{ textAlign: headingAlign, color: widgetHeadingColor }} >
                {isWidgetNameVisible === "Yes" &&
                    <div className={` ${isDirectDownloadRequired === 'Yes' ? 'col-md-7' : 'col-md-12'} fw-medium fs-6`} >{dt(rptDisplayName)}</div>
                }
                <div className="col-md-5">
                    {currentLevel !== 0 && (
                        <>
                            <button className="small-box-btn-dwn" onClick={() => backToParentWidget()}>
                                <FontAwesomeIcon icon={faArrowCircleLeft} />
                            </button>

                            <div className="nav-item dropdown" >
                                <button className="small-box-btn-dwn nav-link" data-bs-toggle="dropdown">
                                    <FontAwesomeIcon icon={faTableCells} />
                                </button>

                                <ul className="dropdown-menu dropdown-menu-start" >
                                    {levelData?.length > 0 && levelData
                                        ?.filter((level, index) => {
                                            const maxLevel = Math.max(...levelData.map(l => l.rptLevel));
                                            return level.rptLevel !== maxLevel;
                                        })
                                        ?.map((level, index) => (
                                            <li className="dropdown-item pointer text-primary p-1" style={{ whiteSpace: "normal", wordBreak: "break-word" }} key={index}
                                                onClick={() => backToParentWidget(level?.rptId)}
                                            >
                                                {level?.rptName}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {paramsData && (
                <div className='parameter-box py-1'>
                    <Parameters params={paramsData} scope={'widgetParams'} widgetId={widgetData?.rptId} />
                </div>
            )}

            <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
                <h4 style={{ fontWeight: "500", fontSize: "20px" }}>{dt('Query')} : {rptId}</h4>
                {(modeOfQuery === 'Query' && isPrev == 1) &&
                    <span>{mainQuery}</span>
                }
                {(modeOfQuery === "Procedure" && isPrev == 1) &&
                    <span>{procedureMode}</span>
                }
            </div>

            <div className="row">

                <div className="col-sm-6" style={{ height: "auto" }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                        constructorType="mapChart"
                    />
                </div>
                <div className="col-sm-6">

                    <Tabular
                        columns={columns}
                        data={tableData}
                        pagination={true}
                        // recordsPerPage={recordPerPage}
                        // fixedHeader={isHeadingFixed}
                        // scrollHeight={scrollHeight}
                        headingFontColor={"#ffffff"}
                        headingBgColor={"#000000"}
                        // headingAlignment={headingAlignTable}
                        recordsPerPageOptions={[10, 20, 50]}
                        // isTableHeadingRequired={!headingReq}
                        theme={theme}
                        noDataComponent={<div className="text-danger fw-bold fs-13">{dt("There are no records to display")}</div>}
                    />
                </div>

            </div>

            {footerText && footerText.trim() !== '' && (
                <>
                    <h6 className='header-devider mt-2 mb-0'></h6>
                    <div className="px-2 py-2">
                        <span style={{ fontSize: '12px' }}>{footerText}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default MapDash;
