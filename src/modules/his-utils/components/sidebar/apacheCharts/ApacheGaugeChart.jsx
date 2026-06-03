import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

const GaugeCard = ({
  item,
  maxValue,
  index
}) => {

  const colors = [
    "#4facfe",
    "#43e97b",
    "#fa709a",
    "#f9d423",
    "#00c9a7",
    "#845ec2"
  ];

  const option = {

    backgroundColor: "transparent",

    // tooltip: {
    //   formatter: `
    //     ${item.name}<br/>
    //     Value : ${item.value}
    //   `
    // },
    tooltip: {
      formatter: (params) => {
        return `
      ${params.name}<br/>
      Value : ${params.value}
    `;
      }
    },

    series: [
      {
        type: "gauge",
        min: 0,
        max: maxValue,
        radius: "90%",
        progress: {
          show: true,
          roundCap: true,
          width: 10,
          itemStyle: {
            color:
              colors[index % colors.length]
          }
        },

        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 10,
            color: [[1, "#ececec"]]
          }
        },

        splitLine: {
          distance: -11,
          length: 8
        },

        axisTick: {
          distance: -10,
          length: 5
        },

        axisLabel: {
          distance: 15,
          color: "#666"
        },

        pointer: {
          width: 5,
          length: "75%"
        },

        anchor: {
          show: true,
          size: 14
        },

        title: {

          offsetCenter: [0, "85%"],
          fontSize: 14,
          color: "#333",
          fontWeight: "bold"
        },

        detail: {

          valueAnimation: true,
          offsetCenter: [0, "55%"],
          fontSize: 22,
          fontWeight: "bold",
          color: "#111",
          formatter: "{value}"
        },

        // data: [
        //   {
        //     value: item.value,
        //     name: item.name
        //   }
        // ]
        data: item.data.map((d, i) => ({

          value: d.value,

          name: d.name,

          itemStyle: {
            color:
              colors[
              (index + i) % colors.length
              ]
          },

          title: {
            offsetCenter: [
              0,
              `${85 + (i * 18)}%`
            ]
          },

          detail: {
            offsetCenter: [
              0,
              `${55 + (i * 18)}%`
            ]
          }

        }))
      }
    ]
  };

  return (

    <div
      style={{
        width: "100%",
        height: "260px",
        background: "#fff",
        borderRadius: "14px",
        padding: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}
    >

      <ReactECharts
        option={option}
        style={{
          height: "100%",
          width: "100%"
        }}
      />

    </div>
  );
};

const ApacheGaugeChart = ({ gdata }) => {

  // SAFE FORMAT
  // const formattedData = useMemo(() => {

  //   if (!Array.isArray(gdata)) return [];

  //   return gdata
  //     .map((item, index) => {

  //       if (!item || typeof item !== "object") {
  //         return null;
  //       }

  //       const keys = Object.keys(item);

  //       const valueKey = keys.find(
  //         (k) => !isNaN(Number(item?.[k]))
  //       );

  //       const nameKey = keys.find(
  //         (k) => k !== valueKey
  //       );

  //       return {
  //         name:
  //           item?.[nameKey] ||
  //           `Gauge ${index + 1}`,

  //         value:
  //           Number(item?.[valueKey]) || 0
  //       };

  //     })
  //     .filter(Boolean);

  // }, [gdata]);
  const formattedData = useMemo(() => {

    if (!Array.isArray(gdata)) return [];

    return gdata
      .map((item, index) => {

        // -----------------------------------
        // MULTI POINTER GAUGE
        // -----------------------------------

        if (Array.isArray(item)) {

          const multiData = item
            .map((subItem, subIndex) => {

              if (
                !subItem ||
                typeof subItem !== "object"
              ) {
                return null;
              }

              const keys = Object.keys(subItem);

              const valueKey = keys.find(
                (k) =>
                  !isNaN(Number(subItem?.[k]))
              );

              const nameKey = keys.find(
                (k) => k !== valueKey
              );

              return {
                name:
                  subItem?.[nameKey] ||
                  `Pointer ${subIndex + 1}`,

                value:
                  Number(
                    subItem?.[valueKey]
                  ) || 0
              };

            })
            .filter(Boolean);

          return {
            isMulti: true,
            data: multiData
          };
        }

        // -----------------------------------
        // SINGLE POINTER GAUGE
        // -----------------------------------

        if (
          !item ||
          typeof item !== "object"
        ) {
          return null;
        }

        const keys = Object.keys(item);

        const valueKey = keys.find(
          (k) => !isNaN(Number(item?.[k]))
        );

        const nameKey = keys.find(
          (k) => k !== valueKey
        );

        return {
          isMulti: false,
          data: [
            {
              name:
                item?.[nameKey] ||
                `Gauge ${index + 1}`,

              value:
                Number(
                  item?.[valueKey]
                ) || 0
            }
          ]
        };

      })
      .filter(Boolean);

  }, [gdata]);
  // MAX VALUE
  const maxValue = useMemo(() => {

    // const max = Math.max(
    //   ...formattedData.map((d) => d.value),
    //   100
    // );

    const max = Math.max(
      ...formattedData.flatMap((d) =>
        d.data.map((x) => x.value)
      ),
      100
    );

    return Math.ceil(max / 10) * 10;

  }, [formattedData]);

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "10px",
        width: "100%"
      }}
    >

      {formattedData.map((item, index) => (

        <GaugeCard
          key={index}
          item={item}
          maxValue={maxValue}
          index={index}
        />

      ))}

    </div>
  );
};

export default React.memo(ApacheGaugeChart);