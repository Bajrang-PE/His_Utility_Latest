import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import "echarts-gl";

const ApacheThreeDChart = ({
  type = "bar3D",
  widgetData,
  gdata
}) => {

  // SAFE ARRAY
  const safeData = useMemo(() => {
    return Array.isArray(gdata) ? gdata : [];
  }, [gdata]);

  // FORMATTER
  const formattedData = useMemo(() => {

    try {

      if (!safeData.length) {
        return {
          chartMode: "EMPTY",
          xData: [],
          yData: [],
          data3D: [],
          data2D: []
        };
      }

      const first = safeData[0];

      // ----------------------------
      // ARRAY FORMAT
      // ----------------------------

      if (Array.isArray(first)) {

        const xSet = new Set();
        const ySet = new Set();

        safeData.forEach((item) => {
          xSet.add(item?.[0] ?? "Unknown");
          ySet.add(item?.[1] ?? "Default");
        });

        const xData = [...xSet];
        const yData = [...ySet];

        const data3D = safeData.map((item) => [
          xData.indexOf(item?.[0] ?? "Unknown"),
          yData.indexOf(item?.[1] ?? "Default"),
          Number(item?.[2]) || 0
        ]);

        return {
          chartMode: "3D",
          xData,
          yData,
          data3D,
          data2D: []
        };
      }

      // ----------------------------
      // OBJECT FORMAT
      // ----------------------------

      if (typeof first === "object" && first !== null) {

        const keys = Object.keys(first);

        if (!keys.length) {
          return {
            chartMode: "EMPTY",
            xData: [],
            yData: [],
            data3D: [],
            data2D: [],
            xLabel: "",
            yLabel: "",
            zLabel: ""
          };
        }

        // FIND VALUE KEY
        const valueKey = keys.find((k) => {

          return safeData.some((row) => {
            return !isNaN(Number(row?.[k]));
          });

        });

        if (!valueKey) {

          return {
            chartMode: "INVALID",
            xData: [],
            yData: [],
            data3D: [],
            data2D: [],
            xLabel: "",
            yLabel: "",
            zLabel: ""
          };
        }

        const dimKeys = keys.filter((k) => k !== valueKey);

        // -----------------------
        // 2D
        // -----------------------

        if (dimKeys.length === 1) {

          const xKey = dimKeys[0];

          return {

            chartMode: "2D",

            xLabel: xKey,
            yLabel: valueKey,
            zLabel: "",

            xData: safeData.map(
              (d) => d?.[xKey] ?? "Unknown"
            ),

            yData: [],

            data3D: [],

            data2D: safeData.map((d) => ({
              name: d?.[xKey] ?? "Unknown",
              value: Number(d?.[valueKey]) || 0
            }))
          };
        }

        // -----------------------
        // 3D
        // -----------------------

        const xKey = dimKeys[0];
        const yKey = dimKeys[1];

        const xData = [
          ...new Set(
            safeData.map((d) => d?.[xKey] ?? "Unknown")
          )
        ];

        const yData = [
          ...new Set(
            safeData.map((d) => d?.[yKey] ?? "Default")
          )
        ];

        const data3D = safeData.map((d) => [

          xData.indexOf(d?.[xKey] ?? "Unknown"),

          yData.indexOf(d?.[yKey] ?? "Default"),

          Number(d?.[valueKey]) || 0

        ]);

        return {

          chartMode: "3D",

          xLabel: xKey,
          yLabel: yKey,
          zLabel: valueKey,

          xData,
          yData,
          data3D,
          data2D: []
        };
      }

      return {
        chartMode: "INVALID",
        xData: [],
        yData: [],
        data3D: [],
        data2D: []
      };

    } catch (err) {

      console.error("Chart formatter error", err);

      return {
        chartMode: "ERROR",
        xData: [],
        yData: [],
        data3D: [],
        data2D: []
      };
    }

  }, [safeData]);

  const {
    chartMode,
    xData,
    yData,
    data3D,
    data2D,
    xLabel,
    yLabel,
    zLabel
  } = formattedData;

  // MAX VALUE
  const maxVal = useMemo(() => {

    if (!data3D?.length) return 0;

    return Math.max(
      ...data3D.map((d) => Number(d?.[2]) || 0),
      0
    );

  }, [data3D]);

  // OPTION
  const option = useMemo(() => {

    // ----------------------------
    // EMPTY
    // ----------------------------

    if (
      chartMode === "EMPTY" ||
      chartMode === "INVALID" ||
      chartMode === "ERROR"
    ) {

      return {
        title: {
          text: "No Data Available",
          left: "center",
          top: "center"
        }
      };
    }

    // ----------------------------
    // 2D CHART
    // ----------------------------

    if (chartMode === "2D") {

      return {

        tooltip: {
          trigger: "axis"
        },

        xAxis: {
          type: "category",
          name: xLabel,
          data: data2D.map((d) => d.name),
          axisLabel: {
            interval: 0,
            rotate: 20
          }
        },

        yAxis: {
          type: "value",
          name: yLabel
        },

        series: [
          {
            type: "bar",
            data: data2D.map((d) => d.value),
            label: {
              show: true
            }
          }
        ]
      };
    }

    // ----------------------------
    // 3D CHART
    // ----------------------------

    return {

      tooltip: {

        formatter: (params) => {

          const val = params?.value || [];

          const x = xData?.[val?.[0]] ?? "-";

          const y = yData?.[val?.[1]] ?? "-";

          const z = val?.[2] ?? 0;

          return `
            <div>
              <strong>${x}</strong><br/>
              ${y}<br/>
              Value : ${z}
            </div>
          `;
        }
      },

      visualMap: {

        max: maxVal,

        calculable: true,

        orient: "horizontal",

        left: "center",

        bottom: 10,

        inRange: {
          color: [
            "#87aa66",
            "#eba438",
            "#d94d4c"
          ]
        }
      },

      xAxis3D: {
        type: "category",
         name: xLabel,
        data: xData,
        axisLabel: {
          interval: 0,
          rotate: 25,
          fontSize: 12
        }
      },

      yAxis3D: {
        type: "category",
          name: yLabel,
        data: yData
      },

      zAxis3D: {
        type: "value",
        name: zLabel
      },

      grid3D: {

        boxWidth: 180,

        boxDepth: 100,

        viewControl: {
          alpha: 20,
          beta: 35,
          distance: 250,
          autoRotate: false
        },

        light: {

          main: {
            intensity: 1.2,
            shadow: true
          },

          ambient: {
            intensity: 0.4
          }
        }
      },

      series: [
        {
          name: "Data",

          type: "bar3D",

          data: data3D,

          shading: "lambert",

          label: {

            show: true,

            formatter: (params) => {
              return params?.value?.[2] ?? 0;
            },

            textStyle: {
              fontSize: 12,
              color: "#000"
            }
          },

          emphasis: {

            label: {
              fontSize: 14,
              color: "#000"
            },

            itemStyle: {
              color: "#ffcc00"
            }
          }
        }
      ]
    };

  }, [
    chartMode,
    xData,
    yData,
    data3D,
    data2D,
    maxVal
  ]);

  return (

    <ReactECharts
      option={option}
      style={{
        height: "450px",
        width: "100%"
      }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default React.memo(ApacheThreeDChart);