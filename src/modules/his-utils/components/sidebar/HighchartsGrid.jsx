
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import { fetchQueryData } from "../../utils/commonFunction";
import { Grid } from '@highcharts/grid-lite-react';
import DOMPurify from "dompurify";
import "./HighchartGrid.css"

const parseHeadersFromColumns = (columnNames) => {
  const roots = [];
  const groupMap = {};

  columnNames.forEach((alias) => {
    const parts = alias.split("__");

    if (parts.length === 1) {
      roots.push({ columnId: alias, format: alias });
      return;
    }

    const leafLabel = parts[parts.length - 1];
    const groups = parts.slice(0, -1);
    let currentLevel = roots;
    let pathKey = "";

    groups.forEach((groupName) => {
      pathKey += "__" + groupName;
      if (!groupMap[pathKey]) {
        const node = { format: groupName, columns: [] };
        groupMap[pathKey] = node;
        currentLevel.push(node);
      }
      currentLevel = groupMap[pathKey].columns;
    });

    currentLevel.push({ columnId: alias, format: leafLabel });
  });

  return roots;
};

const hasGroupedHeaders = (columnNames) =>
  columnNames.some((name) => name.includes("__"));


const HighchartsGrid = ({ data = [], columns = [], widgetData, gridOptions, syncPkValues, setsyncPkValues, handleSyncChange, selectedPk, setSelectedPk }) => {
  const [options, setOptions] = useState({});
  const [jndiName, setJndiName] = useState("");
  const isSynchronized = widgetData?.synchronizedWidgetRptId !== "" && widgetData?.synchronizedWidgetRptId !== undefined;
  const headingBackgroundColor = widgetData?.headingBackgroundColour || "#e5f0f5";
  const headingFontColor = widgetData?.headingFontColour || "#000000";
  const isHeadingFixed = "Yes";
  const convertToColumns = (data) => {
    if (!data || data.length === 0) return {};
    const colObj = {};
    // Add radio column FIRST if synchronized
    if (isSynchronized) {
      colObj["Select"] = data.map((row, index) => {
        return `<span 
            class="sync-btn syncRow^${widgetData?.rptId}^${widgetData?.synchronizedWidgetRptId}^${row.pkcolumn}" 
            data-pk="${row.pkcolumn}"
            data-syncwidget="${widgetData?.synchronizedWidgetRptId}"
            data-srcwidget="${widgetData?.rptId}"
            style="
              cursor:pointer;
              display:inline-block;
              width:14px;
              height:14px;
              border:2px solid #c6cacf;
              border-radius:50%;
              background:${selectedPk?.[widgetData?.rptId] == row.pkcolumn ? "#1853a1" : "white"};
            ">
          </span>`;
      });
    }
    //background:${selectedPk?.[widgetData?.rptId] == row.pkcolumn ? "#0d40d9" : "white"};
    Object.keys(data[0]).forEach(key => {
      if (key !== "pkcolumn") {
        colObj[key] = data.map(row => row[key]);
      }
    });

    return colObj;
  };


  // ✅ CONDITION PARSER
  const parseCondition = (condition) => {
    if (!condition) return null;

    const match = condition.match(/(.*?)(>=|<=|!=|=|>|<)(.*)/);
    if (!match) return null;

    return {
      column: match[1].trim(),
      operator: match[2],
      value: match[3].trim(),
    };
  };

  // ✅ CONDITION EVALUATOR
  const evaluateCondition = (cellValue, operator, ruleValue) => {
    if (cellValue == null) return false;

    const cleanValue = cellValue.toString().replace(/<[^>]*>/g, "");

    switch (operator) {
      case ">":
        return parseFloat(cleanValue) > parseFloat(ruleValue);
      case "<":
        return parseFloat(cleanValue) < parseFloat(ruleValue);
      case "=":
        return cleanValue == ruleValue;
      case "!=":
        return cleanValue != ruleValue;
      case ">=":
        return parseFloat(cleanValue) >= parseFloat(ruleValue);
      case "<=":
        return parseFloat(cleanValue) <= parseFloat(ruleValue);
      default:
        return false;
    }
  };

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!data || data.length === 0) return;

    if (isInitialLoad.current && isSynchronized) {
      const firstPk = data[0]?.pkcolumn;
      if (firstPk) {

        const targetIds = widgetData?.synchronizedWidgetRptId;
        const widgetList = targetIds.split(",");
        widgetList.forEach((targetId) => {
          setSelectedPk(prev => ({ ...prev, [widgetData?.rptId]: data[0]?.pkcolumn }));  //red buttons on load
          setsyncPkValues(prev => ({ ...prev, [targetId]: data[0]?.pkcolumn }))
        })
      }

      isInitialLoad.current = false;
    }

  }, [data]);

  useEffect(() => {

    if (!data || data.length === 0) {
      console.warn("⚠️ EMPTY DATA in Grid");
      return;
    }
    const columnData = convertToColumns(data);
    const columnNames = Object.keys(columnData);

    const rowColors = data.map((row) => {
      if (gridOptions?.isRowHighlight !== "yes") return null;
      for (let opt of gridOptions.highLightOptions || []) {
        if (!opt.condition) continue;
        const parsed = parseCondition(opt.condition);
        if (!parsed) continue;
        if (evaluateCondition(row?.[parsed.column], parsed.operator, parsed.value)) {
          return opt.color;
        }
      }
      return null;
    });


    const isFilterEnabled = gridOptions?.isGridFilterRequired === "yes";
    const gridTheme = gridOptions?.theme || "hcg-theme-default";
    // ── grouped header detection ──
    const grouped = hasGroupedHeaders(columnNames);
    const headerConfig = grouped ? parseHeadersFromColumns(columnNames) : null;
    const columnWidth = Math.max(
      70,
      Math.floor(window.innerWidth / (columnNames.length + 2))
    );

    setOptions({
      data: {
        columns: columnData
      },
      rendering: {
        theme: gridTheme,   // pass the class name directly
        rows: {
          virtualization: false
        }
      },


      //  inject header only when __ grouping detected
      ...(grouped && { header: headerConfig }),

      columns: Object.keys(columnData)?.map(key => ({
        id: key,
        title: key,
        sortable: true,
        //  wider for sub-columns, auto for plain columns
        width: key === "Select" ? 70 : key.includes("__") ? 150 : undefined,

        cells: {
          formatter: function () {
            const value = this.value;
            if (value === null || value === undefined) return "-";

            const columnId = this.column.id;
            const rowIndex = this.row?.index;
            const row = data[rowIndex];
            const raw = this.value ?? "-";

            let clean;


            //  IMPORTANT: allow HTML for Select column
            if (this.column.id === "Select") {
              clean = raw; // DO NOT sanitize
            } else {
              clean = typeof raw === "number"
                ? String(raw)
                : DOMPurify.sanitize(String(raw));
            }

            //  ONE single bg variable
            let bg = "transparent";

            if (gridOptions?.isRowHighlight === "yes") {
              for (let opt of gridOptions.highLightOptions || []) {
                if (!opt.value) continue;
                const parsed = parseCondition(opt.value);
                if (!parsed) continue;
                const cellValue = row?.[parsed.column];
                if (evaluateCondition(cellValue, parsed.operator, parsed.value)) {
                  bg = opt.colorValue;
                  break;
                }
              }
            }

            return `<div 
             style="
              background-color: ${bg};
              padding: 2px 8px;;   /
              box-sizing: border-box;
              justify-content:flex-start;
              align-items: center;
              white-space: normal;
            ">${clean}</div>`;
          }
        }
      })),

      sorting: { enabled: true },
      columnDefaults: {
        filtering: {
          enabled: isFilterEnabled
        }
      },
      paging: {
        enabled: true,
        pageSize: 10
      },
      selection: { enabled: true },
      toolbar: { enabled: true }
    });

  }, [data, gridOptions]);



  return (
    <div
      className={`dynamic-grid-wrapper ${isHeadingFixed ? "fixed-grid-header" : ""
        }`}
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        scrollbarWidth: "thin",

        "--grid-header-bg": headingBackgroundColor,
        "--grid-header-font": headingFontColor
      }}
    >
      <Grid options={options} />
    </div>
  );
};



export default HighchartsGrid;

