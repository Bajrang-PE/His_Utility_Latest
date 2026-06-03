import React, { useState, useEffect, useContext, lazy, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faCog, faFileCsv, faFileExcel, faFilePdf, faRefresh, faSliders, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { backToParentWidget, fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getDisplayQuery, getOrderedParamValues, getWidgetParametersOnly, ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { apacheChartOptions, googleChartOptions, highchartGraphOptions } from "../../localData/DropDownData";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { generateGraphCSV, generateGraphCSVWorkers, generateGraphPDF, generateGraphPDFWorkers } from "../commons/advancedPdf";
import { useSearchParams } from "react-router-dom";
import AdvancedOptionsModal from "./AdvancedOptionsModal";
import { AdvancedbtnSvg, CsvBtnSvg, PdfbtnSvg, RefreshbtnSvg, SettingbtnSvg } from "../../utils/commonSVG";
import GooglePieChartDash from "./GooglePieChart";
import ApacheGenChart from "./apacheCharts/ApacheGenChart";

// v12+ auto-registering imports
import "highcharts/modules/exporting";
import "highcharts/modules/offline-exporting";
import "highcharts/modules/export-data";
import "highcharts/modules/no-data-to-display";
import "highcharts/highcharts-more";
import "highcharts/modules/heatmap";
import "highcharts/modules/solid-gauge";
import "highcharts/modules/treemap";

const Parameters = lazy(() => import('./Parameters'));

const GraphDash = ({ widgetData, setWidgetData, pkColumn, setPkColumn, isLayoutWithPreview, presentTabs, levelData, setLevelData }) => {
  const { theme, paramsValues, singleConfigData, isSearchQuery, setIsSearchQuery, setSearchScope, searchScope, dt, presentWidgets, tabParams, jndiServerDrpData, syncPkValues, setsyncPkValues, selectedPk, setSelectedPk, allDrpDtParams, setAllDrpDtParams } = useContext(HISContext);

  const [widParamsValues, setWidParamsValues] = useState();
  const [filteredGraphOptions, setFilteredGraphOptions] = useState([]);
  const [chartType, setChartType] = useState('BAR_GRAPH');
  const [graphData, setGraphData] = useState([]);
  const [allGraphData, setAllGraphData] = useState([]);
  const [widgetParams, setWidgetParams] = useState([]);
  // const [allDrpDtParams, setAllDrpDtParams] = useState([]);
  const [queryParams] = useSearchParams();
  const isPrev = queryParams.get('isPreview');
  const isGlobal = queryParams.get("isGlobal") || 0;
  const [fetching, setFetching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [jndiName, setJndiName] = useState('');

  const isInitialGraphSyncLoad = useRef({});
  const paramsValuesRef = useRef(paramsValues);

  const is3D = widgetData.is3d === "true" || widgetData.is3d === "Yes";
  const xAxisLabel = widgetData.xAxisLabel || "X Axis";
  const yAxisLabel = widgetData.yAxisLabel || "Y Axis";
  const showLegend = widgetData.showInLegend === "true" || widgetData.showInLegend === "Yes";
  const dataLabelsEnabled = widgetData.dataLabels === "true" || widgetData.dataLabels === "Yes";
  const colorList = widgetData.colorForBars ? widgetData.colorForBars.split(",") : ["red", "blue", "green"];
  const mainQuery = widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''
  const alpha = widgetData.alpha || 15;
  const beta = widgetData.beta || 15;

  const xAxisFontSize = parseInt(widgetData?.XAxisFontSize, 10) || 10;
  const yAxisFontSize = parseInt(widgetData?.YAxisFontSize, 10) || 10;
  const annotationFontSize = parseInt(widgetData?.annotationFontSize, 10) || 12;
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequired || 'Yes';

  const minAxisValue = widgetData?.minValueOfAxis && widgetData?.minValueOfAxis !== '0' ? parseInt(widgetData.minValueOfAxis, 10) : undefined;
  const maxAxisValue = widgetData?.maxValueOfAxis && widgetData?.maxValueOfAxis !== '0' ? parseInt(widgetData.maxValueOfAxis, 10) : undefined;

  const isActionButtonReq = widgetData?.isActionButtonReq || "Yes";
  const labelRotation = parseInt(widgetData.rotation, 10) || 0;
  const isScrollbarRequired = widgetData.isScrollbarRequired === "Yes";
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const isDarkTheme = theme === 'Dark';

  const headingReq = widgetData?.isWidgetNameVisible || "Yes";
  const headingAlign = widgetData?.widgetHeadingAlignment?.toLowerCase() || 'left';
  const widgetHeadingColor = widgetData?.widgetHeadingColor || '#000000';

  //procedure
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;
  const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;

  const widgetLimit = widgetData?.limitHTMLFromDb || ''
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit;

  const customMessage = widgetData?.customMessage || "";

  const widheight = presentTabs?.length > 0 && presentTabs?.filter(dt => dt?.rptId == widgetData?.rptId)[0]?.widgetHeight;

  const isChildPresent = widgetData?.children && widgetData?.children?.length > 0;
  const childId = widgetData?.children?.length > 0 ? widgetData?.children[0] : '';


  const isQueryDataPreview = widgetData?.isQueryDataPreview || 'No';
  const widgetGraphPreviewData = widgetData?.widgetGraphPreviewData || {};

  const isSynchronized = widgetData?.synchronizedWidgetRptId ? true : false;

  const pluginName = widgetData.graphPluginName || "highChart";

  const getParametersWithValues = (widgetParams, paramsValues, widgetId, allDrpDtParams) => {
    let allParams = [...widgetParams];

    const tabParamsEntries = Object.entries(paramsValues?.tabParams || {});

    tabParamsEntries.forEach(([id, value]) => {
      const exists = allParams.some(p => String(p.id) === String(id));
      if (!exists) {
        // Find the tab parameter data to get the label
        const tabParamData = tabParams.find(tab => String(tab.id) === String(id));

        allParams.push({
          id: parseInt(id),
          disName: tabParamData?.disName || '',
          paraName: tabParamData?.paraName || '',
          value
        });
      }
    });

    if (levelData) {
      levelData.forEach((level, index) => {
        if (level?.columnToShow?.length > 0) {
          level.columnToShow.forEach((column, colIndex) => {
            // Create a unique ID for level data parameters
            const levelParamId = `level_${level.rptId}_${index}_${colIndex}`;

            allParams.push({
              id: levelParamId,
              disName: column.label,
              paraName: column.label,
              value: column.value,
              val: column.value,
              isLevelData: true
            });
          });
        }
      });
    }


    const parentWidgetIds = levelData
      ?.filter(level => level.rptId != widgetId)
      .map(level => level.rptId);


    return allParams?.map(param => {
      let widgetValue = paramsValues?.widgetParams?.[widgetId]?.[param?.id] || null;

      if (widgetValue === null && parentWidgetIds?.length > 0) {
        for (const parentWidgetId of parentWidgetIds) {
          widgetValue = paramsValues?.widgetParams?.[parentWidgetId]?.[param?.id] || null;
          if (widgetValue !== null) break;
        }
      }

      const tabValue = paramsValues?.tabParams?.[param?.id] || param?.value || null;
      const value = widgetValue ?? tabValue ?? null;

      const valOptions = allDrpDtParams?.[param?.paraName] || [];
      const matchedOption = valOptions.find(dt => dt?.optionValue == value);

      return {
        ...param,
        value,
        val: matchedOption
          ? matchedOption.optionText
          : value == "%" ? "All" : value
      };
    });
  };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     Promise.all([
  //       import("highcharts/modules/offline-exporting"),
  //       import("highcharts/modules/exporting"),
  //       import("highcharts/modules/export-data"),
  //       import('highcharts/modules/no-data-to-display')
  //     ])
  //       .then(([OfflineExporting, exportingModule, exportDataModule, HighchartsNoData]) => {
  //         const modules = [OfflineExporting, exportingModule, exportDataModule, HighchartsNoData];

  //         const applyModule = (mod) => {
  //           if (typeof mod === 'function') {
  //             mod(Highcharts);
  //           } else if (mod && typeof mod.default === 'function') {
  //             mod.default(Highcharts);
  //           }
  //         };

  //         try {
  //           modules.forEach((mod, index) => {
  //             applyModule(mod);
  //           });
  //         } catch (error) {
  //           console.error('Error during module initialization:', error);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error loading Highcharts modules:', error);
  //       });
  //   }, 2000);

  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, []);

  const chartTypeMapping = {
    BAR_GRAPH: "column",
    STACKED_GRAPH: "column",
    STACKED_BAR_GRAPH: "column",
    VERTICAL_BAR_GRAPH: "bar",
    VERTICAL_STACKED_BAR_GRAPH: "bar",
    PIE_CHART: "pie",
    DONUT_CHART: "pie",
    LINE_GRAPH: "line",
    AREA_GRAPH: "area",
    AREA_STACKED_GRAPH: "area",
    COLUMN_LINE_PIE_GRAPH: "column",
    DUAL_AXES_LINE_COLUMN: "column",
    BAR_RACE: "bar"
  };

  const defGraphTypes = (plugin) => {

    switch (plugin) {
      case "highchart":
        return highchartGraphOptions;

      case "googlechart":
        return googleChartOptions;

      case "apacheChart":
        return apacheChartOptions;

      default:
        return googleChartOptions;
    }
  }

  useEffect(() => {
    if (widgetData.defaultgraphType) {
      const availableGraphs = widgetData.graphChangeOptions || [];
      let opt = [];


      opt = defGraphTypes(pluginName)?.filter(option => availableGraphs.includes(option.value))

      if (widgetData.defaultgraphType && !availableGraphs.includes(widgetData.defaultgraphType)) {
        const defaultGraphOption = defGraphTypes(pluginName)?.find(option => option.value === widgetData.defaultgraphType);
        if (defaultGraphOption) {
          opt.push(defaultGraphOption);
        }
      }

      setFilteredGraphOptions(opt)
      setChartType(widgetData.defaultgraphType)
    }
  }, [widgetData])

  const fetchDataQry = async (widget, isRef, syncPk) => {
    const queries = widget?.queryVO?.length > 0 ? widget?.queryVO : [];
    if (!queries.length) return;
    setFetching(true);
    setStatusMessage("Requesting...");

    try {
      setStatusMessage("Executing Query...");
      const results = await Promise.all(
        queries.map(async (q) => {
          const params = getOrderedParamValues(q?.mainQuery, isRef ? paramsValuesRef.current : paramsValues, widget?.rptId);
          const data = await fetchQueryData([q], widgetData?.JNDIid, params, syncPk ? syncPk : pkColumn, isGlobal, setJndiName);
          let filteredData = data;

          if (widget?.isQuerychild && widget?.isQuerychild === "1") {
            const columnIndexes = widget?.columnIndexesParent || [];
            if (data.length > 0 && columnIndexes.length > 0) {
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
          }

          const limit = widgetLimit
            ? parseInt(widgetLimit)
            : safeLimit
              ? parseInt(safeLimit)
              : filteredData.length;

          const limitedData = filteredData.slice(0, limit);


          if (!limitedData.length) {
            return {
              limited: { queryName: q?.mainQuery || '', categories: [], seriesData: [], originalData: [] },
              all: { queryName: q?.mainQuery || '', categories: [], seriesData: [], originalData: [] }
            };
          }

          const processChartData = (dataToProcess) => {
            if (!dataToProcess.length) {
              return { categories: [], seriesData: [], originalData: [] };
            }

            const columnNames = Object.keys(dataToProcess[0]).filter(
              key => key !== 'pkcolumn'
            );

            /* =========================
               PREVIEW MODE (USER INPUT)
               ========================= */
            if (isQueryDataPreview === 'Yes') {
              const xAxisKey = widgetGraphPreviewData?.selectedXAxisPreview?.[0];
              const yAxisKeys = widgetGraphPreviewData?.selectedYAxisPreview || [];

              // Safety check
              if (!xAxisKey || !yAxisKeys.length) {
                console.warn('Preview axis not properly selected');
                return { categories: [], seriesData: [], originalData: dataToProcess };
              }

              // X-axis categories
              const categories = dataToProcess.map(item => item[xAxisKey]);

              // Y-axis series
              const seriesData = yAxisKeys.map(key => ({
                name: key,
                type: widgetGraphPreviewData?.chartTypesPreview?.[key] || 'column',
                color: widgetGraphPreviewData?.chartColorsPreview?.[key],
                data: dataToProcess.map(item => ({
                  y: item[key],
                  pkcolumn: item.pkcolumn,
                  label: xAxisKey,
                  color: widgetGraphPreviewData?.chartColorsPreview?.[key],
                }))
              }));

              return { categories, seriesData, originalData: dataToProcess };
            }

            /* =========================
               NORMAL MODE (UNCHANGED)
               ========================= */

            // Case 1: Single row with multiple metrics
            if (dataToProcess.length === 1 && columnNames.length > 1) {
              const singleRow = dataToProcess[0];
              // const categories = columnNames;
              const categories = dataToProcess[0][columnNames[0]];
              const cat = [categories];

              const seriesData = [{
                name: 'Values',
                // data: columnNames.map(key => ({
                //   y: singleRow[key],
                //   pkcolumn: singleRow.pkcolumn,
                //   label: columnNames[0]
                // })),
                data:
                  [{
                    y: singleRow[columnNames[1]],
                    pkcolumn: singleRow.pkcolumn || "",
                    label: columnNames[0]
                  }],
                colorByPoint: true,
                label: columnNames[0]
              }];

              return { categories: cat, seriesData, originalData: dataToProcess };
            }

            // Case 2: Multiple rows (default behavior)
            else if (columnNames.length >= 2) {
              const categoriesKey = columnNames[0];
              const seriesKeys = columnNames.slice(1);

              const categories = dataToProcess.map(item => item[categoriesKey]);

              const seriesData = seriesKeys.map(key => ({
                name: key,
                data: dataToProcess.map(item => ({
                  y: item[key],
                  pkcolumn: item.pkcolumn,
                  label: categoriesKey
                })),
                colorByPoint: true,
                label: categoriesKey
              }));

              return { categories, seriesData, originalData: dataToProcess };
            }

            // Fallback
            else {
              console.warn('Unexpected data structure:', dataToProcess);
              return { categories: [], seriesData: [], originalData: dataToProcess };
            }
          };


          const limitedProcessed = processChartData(limitedData);
          const allProcessed = processChartData(data);



          return {
            limited: {
              queryName: q?.mainQuery || '',
              categories: limitedProcessed.categories,
              seriesData: limitedProcessed.seriesData,
              originalData: limitedProcessed.originalData
            },
            all: {
              queryName: q?.mainQuery || '',
              categories: allProcessed.categories,
              seriesData: allProcessed.seriesData,
              originalData: limitedProcessed.originalData
            }
          };
        })
      );

      setStatusMessage("Prepairing Data...")

      const limitedResults = results.map(r => r.limited);
      const allResults = results.map(r => r.all);

      setGraphData(limitedResults);
      setAllGraphData(allResults);

      setIsSearchQuery(false);
      setSearchScope({ scope: "", id: "" });
      setFetching(false);
      setStatusMessage('');
    } catch (error) {
      console.error("Error loading query data:", error);
      setIsSearchQuery(false);
      setFetching(false);
      setStatusMessage('');
    }
  };

  const formatProcedureDataForGraph = (data, query) => {
    if (!data || data.length === 0) return { categories: [], seriesData: [] };

    const [firstItem] = data;
    const keys = Object.keys(firstItem);
    // const keys = Object.keys(dataToProcess[0]).filter(key => key !== 'pkcolumn');

    // 1. Find the key with string value (to use as category)
    const categoryKey = keys.find(k => typeof firstItem[k] === 'string');
    if (!categoryKey) {
      console.warn("No string column found for category.");
      return { categories: [], seriesData: [] };
    }

    // 2. Get numeric value keys (series)
    const valueKeys = keys.filter(k =>
      k !== categoryKey && typeof firstItem[k] === 'number' && k !== 'pkcolumn'
    );

    // 3. Format categories and series
    const categories = data.map(item => item[categoryKey]);
    const seriesData = valueKeys.map(valueKey => ({
      name: valueKey,
      // data: data.map(item => parseFloat(item[valueKey]) || 0),
      data: data.map((item, index) => ({
        y: item[valueKey],
        pkcolumn: item.pkcolumn || '',
        lebel: valueKeys[0]
      })),
      colorByPoint: valueKeys.length === 1
    }));

    return { categories, seriesData, queryName: query, originalData: data };
  };

  const fetchProcedure = async (widget, syncPk) => {
    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        setFetching(true);
        setStatusMessage("Requesting...");
        const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '', tabParams);
        const widgetLimit = widget?.limitHTMLFromDb || ''
        const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
        const parsedLimit = parseInt(defLimit, 10);
        const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit;

        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          syncPk ? syncPk : pkColumn ? pkColumn?.toString() : '', //primary key
          paramVal.paramsId || "", //parameter ids
          paramVal.paramsValue || "", //parameter values
          isPaginationReq?.toString(), //is pagination required===
          initialRecord?.toString(), //initial record no.===
          finalRecord?.toString(), //final record no.===
          "", //date options
          formatDateFullYear(new Date()),//from values
          formatDateFullYear(new Date()) // to values
        ]
        setStatusMessage("Executing Query...");
        const data = await fetchProcedureData(widget?.procedureMode, params, widgetData?.JNDIid, null, isGlobal, setJndiName);
        setStatusMessage("Prepairing Data...")
        const limit = widgetLimit
          ? parseInt(widgetLimit)
          : safeLimit
            ? parseInt(safeLimit)
            : data?.data?.length;
        const limitedData = data?.data?.slice(0, limit);

        const formattedData = formatProcedureDataForGraph(limitedData, data?.query);
        const formattedDataAll = formatProcedureDataForGraph(data?.data, data?.query);
        setGraphData([formattedData]);
        setAllGraphData([formattedDataAll]);
        setIsSearchQuery(false)
        setSearchScope({ scope: "", id: "" })
        setFetching(false);
        setStatusMessage('');
      } catch (error) {
        console.error("Error loading query data:", error);
        setIsSearchQuery(false)
        setFetching(false);
        setStatusMessage('');
      }
    }
  }

  useEffect(() => {
    paramsValuesRef.current = paramsValues;
  }, [paramsValues]);

  useEffect(() => {
    let intervalId;

    const shouldFetchData = widgetData && widgetData?.widgetLoadOption !== "ONGOBUTTONCLICK";

    if (shouldFetchData) {
      const refreshTime = widgetData?.widgetRefreshTime || '0';
      const shouldSetInterval = refreshTime && parseInt(refreshTime) > 0;

      const handleFetchWithInterval = async (isRef) => {
        try {
          if (widgetData?.modeOfQuery === "Procedure" && !isSearchQuery) {
            await fetchProcedure(widgetData);
          } else if (!isSearchQuery) {
            await fetchDataQry(widgetData, isRef);
          }

        } catch (error) {
        }
      };

      // Initial call
      handleFetchWithInterval(false);
      if (shouldSetInterval && !intervalId) {
        intervalId = setInterval(() => {
          handleFetchWithInterval(true);
        }, parseInt(refreshTime));
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [widgetData]);

  useEffect(() => {
    if (paramsValues?.widgetParams[widgetData?.rptId] && !isSearchQuery && widgetData) {
      if (widgetData?.modeOfQuery === "Procedure") {
        fetchProcedure(widgetData);
      } else {
        fetchDataQry(widgetData);
      }
    }
  }, [paramsValues?.widgetParams[widgetData?.rptId]]);

  useEffect(() => {
    if (isSearchQuery && searchScope?.scope === "widgetParams" && searchScope?.id == widgetData?.rptId) {
      if (widgetData?.modeOfQuery === "Procedure") {
        fetchProcedure(widgetData);
      } else {
        fetchDataQry(widgetData);
      }
    } else if (isSearchQuery && searchScope?.scope !== "widgetParams" && searchScope?.scope !== "") {
      if (widgetData?.modeOfQuery === "Procedure") {
        fetchProcedure(widgetData);
      } else {
        fetchDataQry(widgetData);
      }
    }
  }, [isSearchQuery]);

  useEffect(() => {
    if (syncPkValues[widgetData?.rptId] && widgetData) {
      if (widgetData?.modeOfQuery === "Procedure") {
        fetchProcedure(widgetData, syncPkValues[widgetData?.rptId]);
      } else {
        fetchDataQry(widgetData, false, syncPkValues[widgetData?.rptId]);
      }
    }
  }, [syncPkValues?.[widgetData?.rptId]]);


  useEffect(() => {

    // graph has no data
    if (!graphData?.length) return;

    // first graph object
    const firstGraph = graphData?.[0];

    // no series
    if (!firstGraph?.seriesData?.length) return;

    // first point
    const firstPoint =
      firstGraph?.seriesData?.[0]?.data?.[0];

    // no point
    if (!firstPoint) return;

    const firstPk =
      firstPoint?.pkcolumn;

    if (!firstPk) return;

    // synchronized widgets only
    const isSyncWidget =
      widgetData?.synchronizedWidgetRptId &&
      widgetData?.synchronizedWidgetRptId !== "";

    if (!isSyncWidget) return;

    // RED SELECTION
    setSelectedPk(prev => ({
      ...prev,
      [widgetData?.rptId]: firstPk
    }));

    // TARGET WIDGETS
    const widgetList =
      widgetData?.synchronizedWidgetRptId
        ?.split(",")
        ?.map(id => id.trim()) || [];

    // SYNC CHILDREN
    setsyncPkValues(prev => {

      const updated = { ...prev };

      widgetList.forEach(targetId => {
        updated[targetId] = firstPk;
      });

      return updated;
    });

  }, [graphData]);


  const refreshData = (widgetData) => {
    if (widgetData && widgetData?.modeOfQuery === "Procedure") {
      fetchProcedure(widgetData)
    } else {
      fetchDataQry(widgetData);
    }
  }

  const exportingOptions = {
    enabled: isActionButtonReq !== "No" && isActionButtonReq !== "None",
    allowHTML: true,
    useHTML: true,
    fallbackToExportServer: false,
    libURL: "https://code.highcharts.com/modules/",
    buttons: {
      contextButton: {
        menuItems: (() => {
          switch (isActionButtonReq) {
            case "pdf":
              return ["downloadPDF"];
            case "csv":
              return ["downloadCSV"];
            case "pdfAndcsv":
              return ["downloadPDF", "downloadCSV"];
            case "advanced":
              return ["viewFullscreen", "downloadXLS", "downloadPNG", "downloadJPEG"];
            case "All":
            case "Yes":
              return ["downloadPDF", "downloadCSV", "viewFullscreen", "downloadXLS", "downloadPNG", "downloadJPEG"];
            default:
              return [];
          }
        })()
      }
    }
  };


  const getSeriesForType = (cats, ser, org) => {
    if (chartType === "PIE_CHART" || chartType === "DONUT_CHART") {

      return [{
        type: 'pie',
        name: widgetData.rptName || "",
        data: cats?.map((cat, i) => ({
          name: cat,
          y: ser[0]?.data[i]?.y || 0,
          pkcolumn: ser[0]?.data[i]?.pkcolumn,
          lebel: ser[0]?.data[i]?.lebel
          // pkcolumn: org[i]?.pkcolumn,
        })),
        colors: colorList
      }];
    }

    // For other chart types, return seriesData as is, without pie-specific structure
    return ser?.map(s => ({
      ...s,
      type: chartTypeMapping[chartType],
      colorByPoint: true,
      data: s.data?.map(point => (typeof point === 'object' ? point : { y: point }))
    })) || [];
  };

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [sortConfig, setSortConfig] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState();
  const [columns, setColumns] = useState([]);

  const filterColumns = (clms) => {
    if (clms?.length > 0) {
      return columns?.filter(column => {
        return clms.includes(column.name);
      });
    } else {
      return columns;
    }
  }

  const onClickAdvanced = () => {
    const headers = [xAxisLabel, ...graphData[0]?.seriesData?.map(s => s.name)];
    const headerWithName = headers?.map(h => ({
      name: h
    }))
    setColumns(headerWithName);
    setShowAdvancedOptions(true);
  }

  const handleColumnClick = (point) => {
    if (isChildPresent && childId) {
      setPkColumn(point?.pkcolumn)
      setCurrentLevel(currentLevel + 1)
      const widgetDetail = presentWidgets?.length > 0 && presentWidgets?.filter(dt => dt?.rptId == childId)[0]
      setWidgetData(widgetDetail);

      const clmtoshow = [{
        label: point?.lebel,
        value: point?.key
      }];

      setLevelData(prevLevelData => [
        ...prevLevelData,
        {
          'rptId': widgetDetail?.rptId,
          'rptName': widgetDetail?.rptName,
          'rptLevel': currentLevel + 1,
          'pkclm': point?.pkcolumn || '',
          'columnToShow': clmtoshow ? clmtoshow : []
        }
      ]);
    } else {
      ToastAlert('No child available', 'warning')
    }
  }

  const handleSyncClick = (point) => {
    const clickedPk =
      point?.options?.pkcolumn || point?.category;

    if (!clickedPk) return;

    if (selectedPk === clickedPk) return;

    //setSelectedPk(clickedPk);
    setSelectedPk(prev => ({
      ...prev,
      [widgetData?.rptId]: clickedPk
    }));

    if (widgetData?.synchronizedWidgetRptId) {
      const widgetList =
        widgetData?.synchronizedWidgetRptId
          ?.split(",")
          ?.map(id => id.trim()) || [];

      setsyncPkValues(prev => {
        const updated = { ...prev };
        widgetList.forEach(targetId => {
          updated[targetId] = clickedPk;
        });
        return updated;
      });
    }
  };

  return (
    <div className={`widget_id_${widgetData?.rptId} high-chart-main ${theme === 'Dark' ? 'dark-theme' : ""}`}
      style={{
        border: `7px solid ${theme === 'Dark' ? 'white' : '#e8e4e4'}`,
        // height: isLayoutWithPreview ? '100%' : '650px'
        height: isLayoutWithPreview ? '100%' : widheight && widheight != '0' ? `${widheight}px` : '650px',
      }} key={widgetData?.id}>


      <div className={`row ps-1 py-1 m-0 border-bottom ${headingReq !== "Yes" ? "align-content-end" : ""}`} style={{ width: "100%" }}>

        {/* <div className="col-md-8 col-xs-7 fw-medium fs-6 pe-0">
          {dt(widgetData?.rptDisplayName)}
        </div> */}

        {headingReq === "Yes" &&
          <div className={` ${isActionButtonReq !== 'No' || isActionButtonReq !== 'None' || currentLevel !== 0 ? 'col-md-9' : 'col-md-12'} fw-medium fs-6`} style={{ textAlign: headingAlign, color: widgetHeadingColor }} >{dt(widgetData?.rptDisplayName)}</div>
        }

        {/* {isDirectDownloadRequired === 'Yes' && */}
        <div className={`${headingReq === "Yes" ? "col-md-3 pe-0 ps-0" : "col-md-12 pe-0 ps-0"}`}>
          {(isActionButtonReq !== 'No' && isActionButtonReq !== 'None') && (<>
            <span
              type="button"
              className="small-box-btn-dwn"
              aria-expanded="false"
              data-bs-toggle="dropdown"
            >
              {/* <FontAwesomeIcon icon={faCog} className="dropdown-gear-icon" /> */}
              <SettingbtnSvg />
            </span>

            <ul className="dropdown-menu p-2">

              {(isActionButtonReq === 'Yes' || isActionButtonReq === 'advanced') &&
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => refreshData(widgetData)}>
                  {/* <FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-2" /> */}
                  <RefreshbtnSvg />
                  {dt('Refresh Data')}
                </li>
              }

              {(isActionButtonReq === 'Yes' || isActionButtonReq === 'pdf' || isActionButtonReq === 'pdfAndcsv') &&
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}
                  onClick={() => generateGraphPDFWorkers(widgetData, graphData, singleConfigData?.databaseConfigVO, filterColumns(visibleColumns), sortConfig, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))} title="pdf">
                  {/* <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon me-2" /> */}
                  <PdfbtnSvg className="me-1 dropdown-gear-icon" height="22" width="22" viewBox="0 0 28 28" />
                  {dt('Download PDF')}
                </li>
              }

              {(isActionButtonReq === 'Yes' || isActionButtonReq === 'csv' || isActionButtonReq === 'pdfAndcsv') &&
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generateGraphCSVWorkers(widgetData, graphData, singleConfigData?.databaseConfigVO, filterColumns(visibleColumns), sortConfig, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))}>
                  {/* <FontAwesomeIcon icon={faFileExcel} className="dropdown-gear-icon me-2" /> */}
                  <CsvBtnSvg className="me-1" height="22" width="22" viewBox="0 0 28 28" />
                  {dt('Download CSV')}
                </li>
              }
              {(isActionButtonReq === 'Yes' || isActionButtonReq === 'advanced') &&
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}
                  onClick={() => onClickAdvanced()}>
                  {/* <FontAwesomeIcon icon={faSliders} className="dropdown-gear-icon me-2" /> */}
                  <AdvancedbtnSvg />
                  {dt('Advanced')}</li>
              }
            </ul>

          </>)}

          {isDirectDownloadRequired === "Yes" && (<>
            <span type="button" className="small-box-btn-dwn"
              onClick={() => generateGraphPDFWorkers(widgetData, allGraphData, singleConfigData?.databaseConfigVO, filterColumns(visibleColumns), sortConfig, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))}
              title="PDF"
            >
              {/* <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon" /> */}
              <PdfbtnSvg />
            </span>

            <span type="button" className="small-box-btn-dwn"
              onClick={() => generateGraphCSVWorkers(widgetData, allGraphData, singleConfigData?.databaseConfigVO, filterColumns(visibleColumns), sortConfig, getParametersWithValues(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams))}
              title="CSV"
            >
              {/* <FontAwesomeIcon icon={faFileCsv} className="dropdown-gear-icon" /> */}
              <CsvBtnSvg />
            </span>
          </>)}

          {currentLevel !== 0 && (
            <>
              <button className="small-box-btn-dwn"
                onClick={() =>
                  backToParentWidget('', levelData, currentLevel, presentWidgets, setCurrentLevel, setPkColumn, setLevelData, setWidgetData, widgetData?.rptId)}>
                <FontAwesomeIcon icon={faArrowCircleLeft} />
              </button>

              <div className="nav-item dropdown" >
                <button className="small-box-btn-dwn nav-link" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faTableCells} />
                </button>

                <ul className="dropdown-menu dropdown-menu-start" >
                  {levelData?.length > 0 && levelData
                    ?.filter((level, index) => {
                      const maxLevel = Math.max(...levelData?.map(l => l.rptLevel));
                      return level.rptLevel !== maxLevel;
                    })
                    ?.map((level, index) => (
                      <li className="dropdown-item pointer text-primary p-1" style={{ whiteSpace: "normal", wordBreak: "break-word" }} key={index} onClick={() => backToParentWidget(level?.rptId, levelData, currentLevel, presentWidgets, setCurrentLevel, setPkColumn, setLevelData, setWidgetData, widgetData?.rptId)}>
                        {level?.rptName}
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}
        </div>
        {/* } */}

      </div>

      {widgetData?.showParentParameterDetailsinChild === "Yes" &&
        <div className="parent heading">
          {getWidgetParametersOnly(widgetParams, paramsValues, widgetData?.rptId, allDrpDtParams, levelData)
            ?.filter(param => param.value !== null && param.value !== undefined && param?.rptid !== widgetData?.rptId)
            ?.map((param, index) => (
              <span key={param.id || index} className="parameter-item">
                <strong className="mx-1">{param.disName || param.paraName} :</strong>
                <span className="mx-1">{param.val || param.value}</span>
              </span>
            ))
          }
        </div>
      }

      {widgetData?.showParentDetailsinChild === "Yes" &&
        <div className="parent heading">
          {levelData?.length > 0 && levelData?.map((level, index) => (
            <div key={index}>
              {level?.columnToShow?.length > 0 && (
                <div className="column-show-data">
                  {level.columnToShow.map((column, colIndex) => (
                    <span key={colIndex} className="column-item">
                      <strong className="mx-1">{column.label} :</strong> <span className="mx-1"> {column.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      }

      {paramsData && (
        <div className='parameter-box'>
          <Parameters params={paramsData} setParamsValues={setWidParamsValues} scope={'widgetParams'} widgetId={widgetData?.rptId} setWidgetParams={setWidgetParams} setAllDrpDtParams={setAllDrpDtParams} />
        </div>
      )}

      {graphData?.map((gdata, index) => {

        const options = {
          chart: {
            type: isQueryDataPreview !== "Yes" && chartTypeMapping[chartType],
            height: parseInt(widgetData.graphHeight, 10) || 350,
            backgroundColor: isDarkTheme ? "#1f1f1f" : "#ffffff",
            options3d: {
              enabled: is3D,
              alpha: alpha,
              beta: beta,
              depth: 50,
            },
          },
          title: {
            text: "",
            // style: { color: isDarkTheme ? "#ffffff" : "#000000" }
          },
          xAxis: {
            categories: gdata?.categories,
            type: "category",
            title: {
              text: xAxisLabel,
              style: {
                fontSize: `${xAxisFontSize}px`,
                color: isDarkTheme ? "#ffffff" : "#000000"
              },
            },
            labels: {
              y: chartTypeMapping[chartType] !== 'bar' ? 45 : 0,
              rotation: chartTypeMapping[chartType] === 'bar' ? 0 : (labelRotation ? parseInt(labelRotation, 10) : -45),
              style: {
                fontSize: "11px",
                color: isDarkTheme ? "#ffffff" : "#000000",
              },
              step: 1,
              align: chartTypeMapping[chartType] === 'bar' ? 'right' : 'center',
              reserveSpace: true,
              formatter: function () {
                const maxLength = 25;
                const value = this.value;
                if (value.length > maxLength) {
                  return value.substring(0, maxLength) + "...";
                }
                return value;
              }
            },
            scrollbar: {
              enabled: isScrollbarRequired,
            },
            gridLineColor: isDarkTheme ? "#444444" : "#e6e6e6",
          },
          yAxis: {
            title: {
              text: yAxisLabel,
              style: {
                fontSize: `${yAxisFontSize}px`,
                color: isDarkTheme ? "#ffffff" : "#000000"
              },
            },
            labels: {
              style: {
                fontSize: "11px",
                color: isDarkTheme ? "#ffffff" : "#000000",

              },
            },
            gridLineColor: isDarkTheme ? "#444444" : "#e6e6e6",
          },
          legend: {
            enabled: showLegend,
            itemStyle: {
              color: isDarkTheme ? "#ffffff" : "#000000"
            }
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: dataLabelsEnabled,
                style: {
                  color: isDarkTheme ? "#ffffff" : "#000000"
                }
              },
              colorByPoint:
                isQueryDataPreview !== "Yes" &&
                (chartType === "PIE_CHART" || chartType === "BAR_GRAPH"),
              ...((isChildPresent || isSynchronized) && {
                point: {
                  events: {
                    click: function () {
                      // Call your function here with point data
                      handleSyncClick(this);

                      if (isChildPresent) {
                        handleColumnClick(this);
                      }
                    }
                  }
                },
                cursor: "pointer",
                states: {
                  hover: {
                    enabled: true,
                    brightness: 0.1, // Slight darkening on hover
                  }
                }
              })
            },
            pie: {
              allowPointSelect: true,
              colors: colorList,
              dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b>: {point.y}",
                style: { color: isDarkTheme ? "#ffffff" : "#000000" }
              },
              innerSize: chartType === "DONUT_CHART" ? "50%" : "0%",
              ...((isChildPresent || isSynchronized) && {
                cursor: "pointer",
                point: {
                  events: {
                    click: function () {
                      handleSyncClick(this);

                      if (isChildPresent) {
                        handleColumnClick(this);
                      }
                    }
                  }
                }
              })
            },
            bar: {
              colors: colorList || ["red", "blue", "green"],
              ...((isChildPresent || isSynchronized) && {
                cursor: "pointer",
                point: {
                  events: {
                    click: function () {
                      handleSyncClick(this);

                      if (isChildPresent) {
                        handleColumnClick(this);
                      }
                    }
                  }
                }
              })
            },
            column: {
              colors: colorList,
              stacking: chartType === "STACKED_BAR_GRAPH" || chartType === "STACKED_GRAPH" ? "normal" : undefined,
              ...((isChildPresent || isSynchronized) && {
                point: {
                  events: {
                    click: function () {
                      handleSyncClick(this);

                      if (isChildPresent) {
                        handleColumnClick(this);
                      }
                    }
                  }
                }
              })
            },
            line: {
              colors: colorList,
              marker: {
                enabled: true,
                fillColor: "red",
                lineColor: "black",
                lineWidth: 2,
                radius: 4,
              },
              point: {
                events: {
                  click: function () {
                    handleSyncClick(this);
                    handleColumnClick(this);
                  }
                }
              }
            },
            area: {
              colors: colorList,
              stacking: chartType === "AREA_STACKED_GRAPH" ? "normal" : undefined,
              point: {
                events: {
                  click: function () {
                    handleSyncClick(this);
                    handleColumnClick(this);
                  }
                }
              }
            }
          },
          tooltip: {
            shared: false,
            // shared: !(chartType === "PIE_CHART" || chartType === "DONUT_CHART"),
            // useHTML: true,
            valueSuffix: " units",
            backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.85)" : "#ffffff",
            style: {
              color: isDarkTheme ? "#ffffff" : "#000000"
            },
          },
          exporting: exportingOptions,
          series: isQueryDataPreview === "Yes" ? gdata?.seriesData : getSeriesForType(gdata?.categories, gdata?.seriesData, gdata?.originalData),
          lang: {
            noData: customMessage || "No data available for this graph",
          },
          noData: {
            position: {
              align: "center",
              verticalAlign: "middle",
              x: 0,
              y: 0,
            },
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              color: isDarkTheme ? "#ff6666" : "#ff0000",
              textAlign: "center"
            },
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
          }
        };


        return (
          <>
            <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>

              {(widgetData?.modeOfQuery === 'Query' && isPrev == 1) &&
                <>
                  <h4 style={{ fontWeight: "500", fontSize: "20px" }}>{dt('Query')} :</h4>
                  {/* <span>{`${gdata?.queryName}---- JNDI Name ---${jndiName || 'null'}`}</span> */}
                  <span>{`${getDisplayQuery(
                    gdata?.queryName,
                    pkColumn,
                    paramsValues
                  )}---- JNDI Name ---${jndiName || 'null'}`}</span>
                </>
              }

              {(widgetData?.modeOfQuery === "Procedure" && isPrev == 1) &&
                // <span>{`${widgetData?.procedureMode}---- JNDI Name ---${widgetData?.JNDIid}`}</span>
                <span>{`Procedure-----${widgetData?.procedureMode}-----${gdata?.queryName}---- JNDI Name ---${jndiName || 'null'}`}</span>
              }

            </div>
            <div className="high-chart-box">
              {(fetching || statusMessage) ? (
                <>
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <h6 className="text-center">{statusMessage}</h6>
                  </div>
                </>
              ) : (
                pluginName === "apacheChart" ? (
                  <div className="" style={{ background: "#ffffff" }}>
                    <ApacheGenChart
                      widgetData={widgetData}
                      data={gdata}
                      chartType={chartType}
                      xAxisLabel={xAxisLabel}
                      yAxisLabel={yAxisLabel}
                      colorList={colorList}
                    />
                  </div>
                ) :
                  pluginName === "googlechart" ?
                    <GooglePieChartDash
                      widgetData={widgetData}
                      pkColumn={pkColumn}
                    /> :
                    <HighchartsReact highcharts={Highcharts} options={options} />
              )}
            </div>
          </>
        )
      })}

      {(filteredGraphOptions?.length > 0 && widgetData?.isQueryDataPreview !== 'Yes') &&
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{ marginBottom: "10px" }}
          className="form-select form-select-sm w-50 mt-1 ms-1"
        >
          {filteredGraphOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}

        </select>
      }
      {footerText !== '' &&
        <div className="px-2 py-2">
          <span>{footerText}</span>
        </div>
      }
      <AdvancedOptionsModal
        show={showAdvancedOptions}
        onClose={() => setShowAdvancedOptions(false)}
        columns={columns}
        sortConfig={sortConfig}
        onSortConfigChange={setSortConfig}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        isFirstRowHeading={'Yes'}
      />
    </div>
  );
};


export default GraphDash;
