import React, { useState, useEffect, useContext, lazy } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileCsv, faFilePdf, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getOrderedParamValues } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { highchartGraphOptions } from "../../localData/DropDownData";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { generateGraphCSV, generateGraphPDF } from "../commons/advancedPdf";
import { useSearchParams } from "react-router-dom";

const Parameters = lazy(() => import('./Parameters'));

const GraphDash = ({ widgetData, pkColumn, setPkColumn }) => {
  const { theme, paramsValues, singleConfigData, isSearchQuery, setIsSearchQuery, setSearchScope, searchScope, dt } = useContext(HISContext);
  const [widParamsValues, setWidParamsValues] = useState();
  const [filteredGraphOptions, setFilteredGraphOptions] = useState([]);
  const [chartType, setChartType] = useState('BAR_GRAPH');
  const [graphData, setGraphData] = useState([]);
  const [queryParams] = useSearchParams();
  const isPrev = queryParams.get('isPreview');

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
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequiredGraph ? widgetData?.isDirectDownloadRequiredGraph : widgetData?.isDirectDownloadRequired || 'No';

  const minAxisValue = widgetData?.minValueOfAxis && widgetData?.minValueOfAxis !== '0' ? parseInt(widgetData.minValueOfAxis, 10) : undefined;
  const maxAxisValue = widgetData?.maxValueOfAxis && widgetData?.maxValueOfAxis !== '0' ? parseInt(widgetData.maxValueOfAxis, 10) : undefined;

  const isActionButtonReq = widgetData?.isActionButtonReqGraph ? widgetData?.isActionButtonReqGraph : widgetData?.isActionButtonReq || "Yes";
  const labelRotation = parseInt(widgetData.rotation, 10) || 0;
  const isScrollbarRequired = widgetData.isScrollbarRequired === "Yes";
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const isDarkTheme = theme === 'Dark';

  //procedure
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;
  const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;

  const widgetLimit = widgetData?.limitHTMLFromDb || ''
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit;

  const customMessage = widgetData?.customMessage || "";

  useEffect(() => {
    const timeout = setTimeout(() => {
      Promise.all([
        import("highcharts/modules/offline-exporting"),
        import("highcharts/modules/exporting"),
        import("highcharts/modules/export-data"),
        import('highcharts/modules/no-data-to-display')
      ])
        .then(([OfflineExporting, exportingModule, exportDataModule, HighchartsNoData]) => {
          const modules = [OfflineExporting, exportingModule, exportDataModule, HighchartsNoData];

          const applyModule = (mod) => {
            if (typeof mod === 'function') {
              mod(Highcharts);
            } else if (mod && typeof mod.default === 'function') {
              mod.default(Highcharts);
            }
          };

          try {
            modules.forEach((mod, index) => {
              applyModule(mod);
            });
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

  useEffect(() => {
    if (widgetData.defaultgraphType) {
      const availableGraphs = widgetData.graphChangeOptions || [];
      let opt = [];
      opt = highchartGraphOptions
        .filter(option => availableGraphs.includes(option.value))

      if (widgetData.defaultgraphType && !availableGraphs.includes(widgetData.defaultgraphType)) {
        const defaultGraphOption = highchartGraphOptions.find(option => option.value === widgetData.defaultgraphType);
        if (defaultGraphOption) {
          opt.push(defaultGraphOption);
        }
      }

      setFilteredGraphOptions(opt)
      setChartType(widgetData.defaultgraphType)
    }
  }, [widgetData])


  const fetchDataQry = async (widget) => {
    const query = widget?.queryVO?.length > 0 ? widget?.queryVO : []
    if (!query) return;
    const params = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);
    try {
      const data = await fetchQueryData(query, widgetData?.JNDIid, params);

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

      // If no data, do nothing
      if (!limitedData.length) {
        setGraphData({ categories: [], seriesData: [] });
        return;
      }

      // Get dynamic column names
      const columnNames = Object.keys(limitedData[0]);

      if (columnNames.length < 1) {
        console.warn("Insufficient columns to generate graph");
        return;
      }

      const categoriesKey = columnNames[0];
      const seriesKeys = columnNames.slice(1);

      // Extract unique category values
      const categories = limitedData.map(item => item[categoriesKey]);

      // Create dynamic series data
      const seriesData = seriesKeys.map(key => ({
        name: key,
        data: limitedData.map(item => item[key]),
        colorByPoint: true,
      }));

      setGraphData({ categories, seriesData });
      setIsSearchQuery(false)
      setSearchScope({ scope: "", id: "" })

    } catch (error) {
      console.error("Error loading query data:", error);
    }
  };

  const formatProcedureDataForGraph = (data) => {
    if (!data || data.length === 0) return { categories: [], seriesData: [] };

    const [firstItem] = data;
    const keys = Object.keys(firstItem);

    // 1. Find the key with string value (to use as category)
    const categoryKey = keys.find(k => typeof firstItem[k] === 'string');
    if (!categoryKey) {
      console.warn("No string column found for category.");
      return { categories: [], seriesData: [] };
    }

    // 2. Get numeric value keys (series)
    const valueKeys = keys.filter(k =>
      k !== categoryKey && typeof firstItem[k] === 'number'
    );

    // 3. Format categories and series
    const categories = data.map(item => item[categoryKey]);
    const seriesData = valueKeys.map(valueKey => ({
      name: valueKey,
      data: data.map(item => parseFloat(item[valueKey]) || 0),
      colorByPoint: valueKeys.length === 1
    }));

    return { categories, seriesData };
  };


  // utils/graphFormatter.js
  // const formatProcedureDataForGraph = (data) => {
  //   if (!data || data.length === 0) return { categories: [], seriesData: [] };

  //   const [firstItem] = data;
  //   const keys = Object.keys(firstItem);

  //   const nameKey = keys[0];  // e.g. "State / UT"
  //   const valueKey = keys[1]; // e.g. "Base Rate(In INR)"

  //   const categories = data.map(item => item[nameKey]);
  //   const values = data.map(item => parseFloat(item[valueKey]) || 0);

  //   const seriesData = [{
  //     name: valueKey,
  //     data: values,
  //     colorByPoint: true
  //   }];

  //   return { categories, seriesData };
  // };


  const fetchProcedure = async (widget) => {
    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');
        const widgetLimit = widget?.limitHTMLFromDb || ''
        const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
        const parsedLimit = parseInt(defLimit, 10);
        const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit;

        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          pkColumn ? pkColumn : '', //primary key
          paramVal.paramsId || "", //parameter ids
          paramVal.paramsValue || "", //parameter values
          isPaginationReq?.toString(), //is pagination required===
          initialRecord?.toString(), //initial record no.===
          finalRecord?.toString(), //final record no.===
          "", //date options
          formatDateFullYear(new Date()),//from values
          formatDateFullYear(new Date()) // to values
        ]
        const data = await fetchProcedureData(widget?.procedureMode, params, widgetData?.JNDIid);
        const limit = widgetLimit
          ? parseInt(widgetLimit)
          : safeLimit
            ? parseInt(safeLimit)
            : data?.data?.length;
        const limitedData = data?.data?.slice(0, limit);

        const formattedData = formatProcedureDataForGraph(limitedData);
        setGraphData(formattedData);
        setIsSearchQuery(false)
        setSearchScope({ scope: "", id: "" })
      } catch (error) {
        console.error("Error loading query data:", error);
      }
    }
  }

  useEffect(() => {
    if (widgetData && widgetData?.modeOfQuery === "Procedure" && !isSearchQuery) {
      fetchProcedure(widgetData)
    } else if (widgetData && !isSearchQuery) {
      fetchDataQry(widgetData);
    }
  }, [paramsValues, widgetData]);

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

  const options = {
    chart: {
      type: chartTypeMapping[chartType],
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
      text: widgetData.rptName || "",
      style: { color: isDarkTheme ? "#ffffff" : "#000000" }
    },
    xAxis: {
      categories: graphData.categories,
      type: "category",
      title: {
        text: xAxisLabel,
        style: {
          fontSize: `${xAxisFontSize}px`,
          color: isDarkTheme ? "#ffffff" : "#000000"
        },
      },
      labels: {
        //  useHTML: true,
        y: chartTypeMapping[chartType] !== 'bar' ? 45 : 0,
        rotation: chartTypeMapping[chartType] === 'bar' ? 0 : (labelRotation ? parseInt(labelRotation, 10) : -45),
        // rotation: labelRotation ? parseInt(labelRotation, 10) : -45,
        style: {
          fontSize: "10px",
          color: isDarkTheme ? "#ffffff" : "#000000",
          textOverflow: 'none'
        },
        step: 1,
        align: chartTypeMapping[chartType] === 'bar' ? 'right' : 'center',
        reserveSpace: true,
        formatter: function () {
          const maxLength = 15;
          const value = this.value;
          if (value.length > maxLength) {
            const words = value.split(' ');
            let lines = [''];
            let lineIndex = 0;

            words.forEach(word => {
              if ((lines[lineIndex] + word).length > maxLength) {
                lineIndex++;
                lines[lineIndex] = word;
              } else {
                lines[lineIndex] += (lines[lineIndex].length ? ' ' : '') + word;
              }
            });

            return lines.join('<br>');
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
          color: isDarkTheme ? "#ffffff" : "#000000",
        }
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
        colorByPoint: chartType === "PIE_CHART" || chartType === "BAR_GRAPH",
      },
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        colors: colorList,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: { color: isDarkTheme ? "#ffffff" : "#000000" }
        },
        innerSize: chartType === "DONUT_CHART" ? "50%" : "0%",
      },
      bar: {
        colors: colorList || ["red", "blue", "green"],
      },
      column: {
        colors: colorList,
        stacking: chartType === "STACKED_BAR_GRAPH" || chartType === "STACKED_GRAPH" ? "normal" : undefined,
      },
      line: {
        marker: {
          enabled: true,
          fillColor: "red",
          lineColor: "black",
          lineWidth: 2,
          radius: 4,
        },
      },
      area: {
        stacking: chartType === "AREA_STACKED_GRAPH" ? "normal" : undefined,
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: " units",
      backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.85)" : "#ffffff",
      style: {
        color: isDarkTheme ? "#ffffff" : "#000000"
      },
    },
    exporting: exportingOptions,
    series: graphData?.seriesData,
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
    },
  };

  return (
    <div className={`high-chart-main ${theme === 'Dark' ? 'dark-theme' : ""}`} style={{ border: `7px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>


      <div className="row px-2 py-2 border-bottom">
        <div className="col-md-8 col-xs-7 fw-medium fs-6 pe-0">
          {dt(widgetData?.rptDisplayName)}
        </div>
        {isDirectDownloadRequired === 'Yes' &&
          <div className="col-md-4">
            <button
              type="button"
              className="small-box-btn-dwn"
              aria-expanded="false"
              data-bs-toggle="dropdown"
            >
              <FontAwesomeIcon icon={faCog} className="dropdown-gear-icon" />
            </button>
            <ul className="dropdown-menu p-2">
              <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-2" />{dt('Refresh Data')}
              </li>
            </ul>
            <button type="button" className="small-box-btn-dwn"
              onClick={() => generateGraphPDF(widgetData, graphData, singleConfigData?.databaseConfigVO)}
              title="PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon" />
            </button>
            <button type="button" className="small-box-btn-dwn"
              onClick={() => generateGraphCSV(widgetData, graphData, singleConfigData?.databaseConfigVO)}
              title="CSV"
            >
              <FontAwesomeIcon icon={faFileCsv} className="dropdown-gear-icon" />
            </button>
          </div>
        }
      </div>

      <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
        <h4 style={{ fontWeight: "500", fontSize: "20px" }}>{dt('Query')} :{widgetData?.rptId}</h4>
        {(widgetData?.modeOfQuery === 'Query' && isPrev == 1) &&
          <span>{mainQuery}</span>
        }
        {(widgetData?.modeOfQuery === "Procedure" && isPrev == 1) &&
          <span>{widgetData?.procedureMode}</span>
        }
      </div>
      {paramsData && (
        <div className='parameter-box'>
          <Parameters params={paramsData} setParamsValues={setWidParamsValues} scope={'widgetParams'} widgetId={widgetData?.rptId} />
        </div>
      )}
      <div className="high-chart-box">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      {filteredGraphOptions?.length > 0 &&
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
    </div>
  );
};


export default GraphDash;
