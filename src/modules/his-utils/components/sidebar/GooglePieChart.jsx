import React, { useEffect, useState, useContext } from "react";
import { Chart } from "react-google-charts";
import {
  fetchProcedureData,
  fetchQueryData,
  formatParams,
  getOrderedParamValues
} from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";

const GooglePieChartDash = ({ widgetData, pkColumn, isGlobal }) => {

  const { paramsValues, isSearchQuery, setIsSearchQuery, setSearchScope, theme } =
    useContext(HISContext);

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chartType = (widgetData?.defaultgraphType || "PIE_CHART").toUpperCase();

  const isPieChart = chartType === "PIE_CHART" || chartType === "DONUT_CHART";
  const isDonut = chartType === "DONUT_CHART";

  const chartTitle = widgetData?.rptDisplayName || widgetData?.rptName || "";

  const showLegend =
    widgetData.showInLegend === "true" || widgetData.showInLegend === "Yes";

  const dataLabelsEnabled =
    widgetData.dataLabels === "true" || widgetData.dataLabels === "Yes";

  const is3D = widgetData?.is3d === "true" || widgetData?.is3d === "Yes";

  const isDarkTheme = theme === "Dark";

  //dynamic colour list


  const colorString = widgetData?.colorForBars || widgetData?.color_for_bars || "";
  const colorList = colorString.trim() !== ""
    ? colorString.split(",").map(c => c.trim())
    : null;

  const xAxisLabel = widgetData.xAxisLabel || "X Axis";
  const yAxisLabel = widgetData.yAxisLabel || "Y Axis";

  // ---------------- CHART TYPE MAPPING ----------------

  const chartTypeMapping = {
    BAR_GRAPH: "ColumnChart",    //-high
    STACKED_GRAPH: "ColumnChart",    //-----high
    STACKED_BAR_GRAPH: "ColumnChart",    //--h
    VERTICAL_BAR_GRAPH: "BarChart",     //---h
    VERTICAL_STACKED_BAR_GRAPH: "BarChart",  //--h
    PIE_CHART: "PieChart",       //--h
    DONUT_CHART: "PieChart",     //--h
    LINE_GRAPH: "LineChart",    //--h
    AREA_GRAPH: "AreaChart",       //--h
    AREA_STACKED_GRAPH: "AreaChart",   //--h
    //-----------------------------------------------------------------------------
    COMBO_CHART: "ComboChart",                  //--working 
    BUBBLE_CHART: "BubbleChart",               //--working but colour not working
    HISTOGRAM: "Histogram",                   //--
    STEPPED_AREA_GRAPH: "SteppedAreaChart",
    CANDLESTICK_CHART: "CandlestickChart",   //--working
    SCATTER_CHART: "ScatterChart",           //--working
    TREEMAP_CHART: "TreeMap",               // --working
    GEO_CHART: "GeoChart",                  //---not working it is not for state lkevel this is for country level
    CALENDAR_CHART: "Calendar",             //---working for calender date should be in query  not working properly
    GANTT_CHART: "Gantt",                   // --working but data should be accordingly
    SANKEY_CHART: "Sankey",                
  };

  const finalChartType = chartTypeMapping[chartType] || "ColumnChart";

  //  v5 mein packages prop alag hota hai
  const getPackages = () => {
    const pkgs = ["corechart"];
    if (chartType === "GEO_CHART") pkgs.push("geochart");
    if (chartType === "SANKEY_CHART") pkgs.push("sankey");
    if (chartType === "GANTT_CHART") pkgs.push("gantt");
    if (chartType === "CALENDAR_CHART") pkgs.push("calendar");
    if (chartType === "TREEMAP_CHART") pkgs.push("treemap");
    return pkgs;
  };



  const getChartHint = () => {
  switch (chartType) {
    case "COMBO_CHART": {
  const seriesCount = chartData ? chartData[0].length - 1 : 0;
  const extraCols = seriesCount > 10 ? seriesCount - 10 : 0;
  
  if (extraCols > 0) {
    return `Maximum 10 columns supported for Combo Chart. You have provided ${seriesCount} data columns — columns 1 to 10 will be rendered with configured colors, and the remaining ${extraCols} column(s) will be displayed on the left side of the bar using default system colors.`;
  }
  return "Column 1: Category | Column 2: Bar value | Column 3–11: Line values (max 10 lines)";
}
    case "CALENDAR_CHART":
      return "Column 1: Date | Column 2: Number value";

    case "GANTT_CHART":
      return "Columns: Task ID | Task Name | Resource | Start Date | End Date | % Complete | Dependencies";

    case "SANKEY_CHART":
      return "Columns: From | To | Weight";

  case "BUBBLE_CHART": {
  const seriesCount = chartData ? chartData[0].length : 0;
  const isExtraColumns = seriesCount > 4;
  if (isExtraColumns) {
    return `Bubble Chart supports maximum 4 columns only (ID | X value | Y value | Size value). You have provided ${seriesCount - 1} data columns — extra column(s) will be ignored and only first 4 columns will be rendered.`;
  }
  return "Column 1: ID | Column 2: X value | Column 3: Y value | Column 4: Size value";
}

    case "CANDLESTICK_CHART":
      return "Columns: Date | Low | Open | Close | High";

    case "SCATTER_CHART":
      return "Columns: X value | Y value";

    case "TREEMAP_CHART":
      return "Columns: Category | Value";

    default:
      return null;
  }
};

// ---------------- FORMAT FUNCTIONS ----------------

  //1.
  const formatForPie = (rows) => {
    if (!rows || rows.length === 0) return [["Category", "Value"]];
    const keys = Object.keys(rows[0]);
    return [["Category", "Value"], ...rows.map((row) => [String(row[keys[0]]), Number(row[keys[1]] || 0)])];
  };


  //2.
const formatForCalendar = (rows) => {
  if (!rows || rows.length === 0) return [["Date", "Value"]];
  const keys = Object.keys(rows[0]);
  return [
    ["Date", "Value"],
    ...rows.map(row => {
      const dateVal = row[keys[0]];
      let dateObj;

      if (dateVal instanceof Date) {
        dateObj = dateVal;
      } else if (typeof dateVal === "string" && dateVal.includes("-")) {
        const parts = dateVal.split("-");
        if (parts[0].length === 2) {

          // DD-MM-YYYY format handle karo
          dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {

          // YYYY-MM-DD format
          dateObj = new Date(dateVal);
        }
      } else {
        dateObj = new Date(dateVal);
      }

      return [dateObj, Number(row[keys[1]] || 0)];
    })
  ];
};


//3.
const formatForGantt = (rows) => {
  if (!rows || rows.length === 0)
    return [["Task ID", "Task Name", "Resource", "Start Date", "End Date", "Duration", "Percent Complete", "Dependencies"]];
  
  const keys = Object.keys(rows[0]);
  const today = new Date();
  
  return [
    ["Task ID", "Task Name", "Resource", "Start Date", "End Date", "Duration", "Percent Complete", "Dependencies"],
    ...rows.map((row, index) => {
      //  Start date — fallback: aaj se index*day
      const startDate = keys[3] && row[keys[3]]
        ? new Date(row[keys[3]])
        : new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);

      //  End date — fallback: start + 1 day
      const endDate = keys[4] && row[keys[4]]
        ? new Date(row[keys[4]])
        : new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

   return [
  String(row[keys[0]] || `task${index}`),
  String(row[keys[1]] || row[keys[0]] || `Task ${index}`),
  String(row[keys[2]] || ""),
  startDate,
  endDate,
  0,          // null ki jagah 0
  Number(row[keys[5]] || 0),
  row[keys[6]] ? String(row[keys[6]]) : null
];
    })
  ];
};

//4.
  const formatForBar = (rows) => {
    if (!rows || rows.length === 0) return [["Category", "Value", { role: "style" }]];
    const keys = Object.keys(rows[0]);
    return [
      ["Category", "Value", { role: "style" }],
      ...rows.map((row, index) => [
        String(row[keys[0]]),
        Number(parseFloat(row[keys[1]]) || 0),
        colorList ? colorList[index % colorList.length] : null
      ])
    ];
  };

  //5.
  // const formatForCombo = (rows) => {
  //   if (!rows || rows.length === 0) return [["Category", "Bar", "Line"]];
  //   const keys = Object.keys(rows[0]);
  //   return [
  //     ["Category", "Bar", "Line"],
  //     ...rows.map(row => [String(row[keys[0]]), Number(row[keys[1]] || 0), Number(row[keys[2]] || row[keys[1]] || 0)])
  //   ];
  // };


  const formatForCombo = (rows) => {
  if (!rows || rows.length === 0) return [["Category", "Bar", "Line"]];
  const keys = Object.keys(rows[0]);

  //  Header — pehla column Category, baaki sab series
  const header = keys.map((key, index) => {
    if (index === 0) return key;
    return key;
  });

  return [
    header,
    ...rows.map(row => keys.map((key, index) => {
      if (index === 0) return String(row[key]);  // Category
      return Number(row[key] || 0);              // Values
    }))
  ];
};

  //6.
  const formatForBubble = (rows) => {
    if (!rows || rows.length === 0) return [["ID", "X", "Y", "Size"]];
    const keys = Object.keys(rows[0]);
    return [
      ["ID", keys[0], keys[1], keys[2] || keys[1]],
      ...rows.map((row, index) => [
        String(row[keys[0]]),
        Number(row[keys[1]] || 0),
        Number(row[keys[2]] || 0),
        Number(row[keys[3]] || 0),
       
      ])
    ];
  };

//7.
 const formatForHistogram = (rows) => {
  if (!rows || rows.length === 0) return [["Category", "Value", { role: "style" }]];
  const keys = Object.keys(rows[0]);

  //  ColorList hai toh ColumnChart format — har bar alag color
  if (colorList) {
    return [
      [keys[0], keys[1], { role: "style" }],
      ...rows.map((row, index) => [
        String(row[keys[0]]),
        Number(row[keys[1]] || 0),
        colorList[index % colorList.length]
      ])
    ];
  }

  // ColorList nahi — normal Histogram format
  return [
    [keys[0], keys[1]],
    ...rows.map(row => [
      String(row[keys[0]]),
      Number(row[keys[1]] || 0)
    ])
  ];
};


//8.
const formatForScatter = (rows) => {
  if (!rows || rows.length === 0) return [["X", "Y"]];
  const keys = Object.keys(rows[0]);
  return [
    //  Pehli value index use karo X axis ke liye
    ["Index", keys[1]],
    ...rows.map((row, index) => [
      index + 1,                          //  X = 1,2,3,4,5 (index)
      Number(row[keys[1]] || 0)           //  Y = RC_Count value
    ])
  ];
};

//9.
  const formatForCandlestick = (rows) => {
    if (!rows || rows.length === 0) return [["Date", "Low", "Open", "Close", "High"]];
    const keys = Object.keys(rows[0]);
    return [
      ["Date", "Low", "Open", "Close", "High"],
      ...rows.map(row => [String(row[keys[0]]), Number(row[keys[1]] || 0), Number(row[keys[2]] || 0), Number(row[keys[3]] || 0), Number(row[keys[4]] || row[keys[3]] || 0)])
    ];
  };

  //10.
  const formatForGeo = (rows) => {
    if (!rows || rows.length === 0) return [["Country", "Value"]];
    const keys = Object.keys(rows[0]);
    return [["Country", "Value"], ...rows.map(row => [String(row[keys[0]]), Number(row[keys[1]] || 0)])];
  };

  //11.
const formatForTreemap = (rows) => {
  if (!rows || rows.length === 0) return [["ID", "Parent", "Value", "Color"]];
  const keys = Object.keys(rows[0]);
  return [
    ["ID", "Parent", "Value", "Color"],
    ["Root", null, 0, 0],
    ...rows.map((row, index) => [
      String(row[keys[0]]),
      "Root",
      Number(row[keys[1]] || 0),
      Number(row[keys[1]] || 0)  //  0 ki jagah actual value do
    ])
  ];
};

//12.
  const formatForSankey = (rows) => {
    if (!rows || rows.length === 0) return [["From", "To", "Weight"]];
    const keys = Object.keys(rows[0]);
    return [["From", "To", "Weight"], ...rows.map(row => [String(row[keys[0]]), String(row[keys[1]]), Number(row[keys[2]] || 0)])];
  };

  // ---------------- COMMON FORMAT HANDLER ----------------

  const setFormattedChartData = (rows) => {
    if (chartType === "COMBO_CHART") setChartData(formatForCombo(rows));
    else if (isPieChart) setChartData(formatForPie(rows));
    else if (chartType === "GANTT_CHART") setChartData(formatForGantt(rows));
    else if (chartType === "BUBBLE_CHART") setChartData(formatForBubble(rows));
    else if (chartType === "HISTOGRAM") setChartData(formatForHistogram(rows));
    else if (chartType === "SCATTER_CHART") setChartData(formatForScatter(rows));
    else if (chartType === "CANDLESTICK_CHART") setChartData(formatForCandlestick(rows));
    else if (chartType === "GEO_CHART") setChartData(formatForGeo(rows));
    else if (chartType === "TREEMAP_CHART") setChartData(formatForTreemap(rows));
    else if (chartType === "SANKEY_CHART") setChartData(formatForSankey(rows));
    else if (chartType === "CALENDAR_CHART") setChartData(formatForCalendar(rows));
    else setChartData(formatForBar(rows));
  };

  // ---------------- FETCH QUERY ----------------

  const fetchQuery = async () => {
    const queries = widgetData?.queryVO || [];
    if (!queries.length) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        queries.map(async (q) => {
          const params = getOrderedParamValues(q?.mainQuery, paramsValues, widgetData?.rptId);
          return await fetchQueryData([q], widgetData?.JNDIid, params, null, isGlobal);
        })
      );
      const combined = results.flat();
      setFormattedChartData(combined);
    } catch (e) {
      console.error(" fetchQuery error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
      setIsSearchQuery(false);
      setSearchScope({ scope: "", id: "" });
    }
  };

  // ---------------- FETCH PROCEDURE ----------------

  const fetchProcedure = async () => {
    setLoading(true);
    setError(null);
    try {
      const paramVal = formatParams(paramsValues || null, widgetData?.rptId || "");
      const params = ["", "10001", pkColumn ?? "", paramVal.paramsId ?? "", paramVal.paramsValue ?? "", "false", "", "", "", new Date().toISOString(), new Date().toISOString()];
      const response = await fetchProcedureData(widgetData?.procedureMode, params, widgetData?.JNDIid, null, isGlobal);
      const data = response?.data || [];
      setFormattedChartData(data);
    } catch (e) {
      console.error(" fetchProcedure error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
      setIsSearchQuery(false);
      setSearchScope({ scope: "", id: "" });
    }
  };

  // ---------------- USE EFFECT ----------------

  useEffect(() => {
    if (widgetData?.modeOfQuery === "Procedure") {
      fetchProcedure();
    } else {
      fetchQuery();
    }
  }, [widgetData, paramsValues, isSearchQuery]);


  // ---------------- OPTIONS ----------------

  const options = {
    title: chartTitle,
   //  COMBO, BUBBLE, HISTOGRAM, SCATTER exclude
...(colorList &&
  chartType !== "COMBO_CHART" &&
  chartType !== "BUBBLE_CHART" &&
  chartType !== "HISTOGRAM" &&
  chartType !== "SCATTER_CHART" &&
  chartType !== "TREEMAP_CHART" &&
  { colors: colorList }
),
    //   seriesType: "bars",
    //   series: {
    //     0: { type: "bars", color: colorList?.[0] || "#4285F4" },
    //     1: { type: "line", color: colorList?.[1] || "#FF0000", lineWidth: 2, pointSize: 5 }
    //   }
    // }),

//scatter
...(chartType === "SCATTER_CHART" && {
  hAxis: { 
    title: xAxisLabel,
    textStyle: { color: isDarkTheme ? "#fff" : "#000" }
  },
  vAxis: { 
    title: yAxisLabel,
    textStyle: { color: isDarkTheme ? "#fff" : "#000" }
  },
  pointSize: 8,           //  Points bade dikhenge
  colors: colorList || ["#4285F4"]  // Color
}),

//  SIRF YEH RAKHO
...(chartType === "COMBO_CHART" && {
  seriesType: "bars",
  series: {
    0: { type: "bars", color: colorList?.[0] || "#4285F4" },
    1: { type: "line", color: colorList?.[1] || "#FF0000", lineWidth: 2, pointSize: 5 },
    2: { type: "line", color: colorList?.[2] || "#00C853", lineWidth: 2, pointSize: 5 },
    3: { type: "line", color: colorList?.[3] || "#FF6D00", lineWidth: 2, pointSize: 5 },
    4: { type: "line", color: colorList?.[4] || "#AA00FF", lineWidth: 2, pointSize: 5 },
    5: { type: "line", color: colorList?.[5] || "#00B8D4", lineWidth: 2, pointSize: 5 },
    6: { type: "line", color: colorList?.[6] || "#FFD600", lineWidth: 2, pointSize: 5 },
    7: { type: "line", color: colorList?.[7] || "#DD2C00", lineWidth: 2, pointSize: 5 },
    8: { type: "line", color: colorList?.[8] || "#1B5E20", lineWidth: 2, pointSize: 5 },
    9: { type: "line", color: colorList?.[9] || "#880E4F", lineWidth: 2, pointSize: 5 },
  }
}),

// GANTT
...(chartType === "GANTT_CHART" && {
  gantt: {
    trackHeight: 30,
    barHeight: 20,
    labelStyle: {
      fontName: "Arial",
      fontSize: 12,
      color: isDarkTheme ? "#fff" : "#000"
    },
    innerGridTrack: {
      fill: isDarkTheme ? "#2a2a2a" : "#f5f5f5"
    },
    innerGridDarkTrack: {
      fill: isDarkTheme ? "#333" : "#e0e0e0"
    },
    criticalPathEnabled: true,
    criticalPathStyle: {
      stroke: "#e64a19",
      strokeWidth: 2
    },
    arrow: {
      angle: 100,
      width: 2,
      color: isDarkTheme ? "#fff" : "#000",
      radius: 0
    }
  }
}),


// Calender
    ...(chartType === "CALENDAR_CHART" && {
  calendar: {
    cellSize: 15,
    dayOfWeekLabel: { fontSize: 10 },
    monthLabel: { fontSize: 12, bold: true }
  },
  colorAxis: {
    colors: colorList && colorList.length >= 2
      ? colorList
      : ["#ffffff", "#4285F4"]
  }
}),


    ...(chartType === "TREEMAP_CHART" && {
  minColor: colorList?.[0] || "#ff0000",   //  Choti value = red
  midColor: colorList?.[1] || "#ffff00",   //  Mid value = yellow  
  maxColor: colorList?.[2] || "#00ff00",   //  Badi value = green
  headerHeight: 15,
  fontColor: "#000000",
  showScale: true
}),


...(chartType === "HISTOGRAM" && !colorList && {
  histogram: {
    bucketSize: "auto",
    maxNumBuckets: 10,
  },
  colors: ["#4285F4"]  // default single color jab colorList na ho
}),

//  ColorList hai toh — ColumnChart ban gaya hai, colors apply karo
...(chartType === "HISTOGRAM" && colorList && {
  colors: colorList,  // saare colors use karega
}),


    ...(chartType === "GEO_CHART" && { colorAxis: { colors: ["#e0f7fa", "#006064"] } }),
    ...(chartType === "BUBBLE_CHART" && {
      bubble: { textStyle: { fontSize: 11 }},
      hAxis: { title: xAxisLabel },
      vAxis: { title: yAxisLabel },

    }),
    ...(chartType === "CANDLESTICK_CHART" && { legend: "none", candlestick: { fallingColor: { strokeWidth: 0, fill: "#a52714" }, risingColor: { strokeWidth: 0, fill: "#0f9d58" } } }),
    ...(chartType === "SANKEY_CHART" && { sankey: { node: { colors: colorList || ["#a6cee3", "#b2df8a", "#fb9a99"] }, link: { colorMode: "gradient" } } }),
    is3D: isPieChart && !isDonut ? is3D : false,
    pieHole: isDonut ? 0.4 : 0,
    pieSliceText: dataLabelsEnabled ? "percentage" : "none",
    legend: showLegend ? { position: "right", textStyle: { color: isDarkTheme ? "#fff" : "#000" } } : "none",
    ...(!isPieChart && chartType !== "GEO_CHART" && chartType !== "TREEMAP_CHART" && chartType !== "SANKEY_CHART" && chartType !== "CALENDAR_CHART" && chartType !== "BUBBLE_CHART" &&  chartType !== "GANTT_CHART" &&  chartType !== "SCATTER_CHART" &&  {
      hAxis: { title: xAxisLabel, textStyle: { color: isDarkTheme ? "#fff" : "#000" } },
      vAxis: { title: yAxisLabel, textStyle: { color: isDarkTheme ? "#fff" : "#000" } }
    }),
    backgroundColor: { fill: isDarkTheme ? "#1f1f1f" : "#ffffff" }
  };

  // ---------------- UI ----------------

  return (
    <div
      className={`widget_id_${widgetData?.rptId} high-chart-main ${theme === "Dark" ? "dark-theme" : ""}`}
      style={{ border: `7px solid ${theme === "Dark" ? "white" : "black"}`, height: "500px" }}
      key={widgetData?.id}
    >
      <div className="row px-2 py-2 border-bottom">
        <div className="col-12 fw-medium fs-6">
          {widgetData?.rptDisplayName}
        </div>


         {/*  SIRF YEH ADD KARO */}
{getChartHint() && (
  <div
    className="col-12 mt-1"
    style={{
      fontSize: "11px",
      color: chartType === "COMBO_CHART" && chartData && chartData[0].length - 1 > 10
        ? "#721c24"
        : "#856404",
      backgroundColor: chartType === "COMBO_CHART" && chartData && chartData[0].length - 1 > 10
        ? "#f8d7da"
        : "#fff8e1",
      padding: "6px 10px",
      borderRadius: "4px",
      border: chartType === "COMBO_CHART" && chartData && chartData[0].length - 1 > 10
        ? "1px solid #f5c6cb"
        : "1px solid #ffe082",
      lineHeight: "1.5"
    }}
  >
    {getChartHint()}
  </div>
)}
      </div>

      <div style={{ width: "100%", height: "calc(100% - 50px)" }}>
        {loading && (
          <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
        )}
        {!loading && error && (
          <div style={{ padding: "20px", color: "red", fontSize: "13px" }}>⚠️ {error}</div>
        )}
        {!loading && !error && (!chartData || chartData.length <= 1) && (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>No data available</div>
        )}
        {!loading && !error && chartData && chartData.length > 1 && (
          <Chart
            key={finalChartType}
            chartType={finalChartType}
            width="100%"
            height="100%"
            data={chartData}
            options={options}
            loader={<div style={{ padding: "20px", textAlign: "center" }}>Chart Loading...</div>}
            packages={getPackages()}
          />
        )}
      </div>
    </div>
  );
};

export default GooglePieChartDash;
