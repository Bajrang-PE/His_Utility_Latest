import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import ApacheGaugeChart from "./ApacheGaugeChart";
import ApacheThreeDChart from "./ApacheThreeDChart";

const ApacheGenChart = (props) => {

    const { widgetData, data, chartType, yAxisLabel, xAxisLabel, colorList } = props;

    const formatChartData = (data = []) => {

        if (!Array.isArray(data)) {
            return {
                categories: [],
                values: []
            };
        }

        const first = data?.[0];

        if (!first) {
            return {
                categories: [],
                values: []
            };
        }

        const keys = Object.keys(first);

        const valueKey = keys.find(key =>
            data.some(row => !isNaN(Number(row?.[key])))
        );

        const categoryKey = keys.find(
            key => key !== valueKey
        );

        return {
            categories: data.map(
                row => row?.[categoryKey] ?? "-"
            ),

            values: data.map(
                row => Number(row?.[valueKey]) || 0
            ),

            categoryKey,
            valueKey
        };
    };


    const buildChartOption = ({
        type,
        xAxisLabel,
        yAxisLabel,
        categories = [],
        values = [],
        categoryKey = "",
        valueKey = ""
    }) => {

        const axisNameStyle = {
            fontSize: 14,
            fontWeight: "bold",
            color: "#333"
        };

        const commonGrid = {
            left: "8%",
            right: "5%",
            top: "10%",
            bottom: "18%",
            containLabel: true
        };

        const commonTooltip = {
            trigger: "axis"
        };

        switch (type) {
            case "LINE":

                return {
                    grid: commonGrid,

                    tooltip: commonTooltip,

                    xAxis: {
                        type: "category",
                        data: categories,
                        name: xAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: axisNameStyle,
                        axisLabel: {
                            interval: 0,
                            rotate: categories.length > 10 ? 30 : 0
                        }
                    },

                    yAxis: {
                        type: "value",
                        name: yAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 50,
                        nameTextStyle: axisNameStyle
                    },

                    series: [
                        {
                            type: "line",
                            smooth: true,
                            data: values?.map((value, index) => ({
                                value,
                                itemStyle: {
                                    color: colorList[index % colorList.length]
                                }
                            })),

                            label: {
                                show: true,
                                position: "top",
                                fontWeight: "bold"
                            },

                            lineStyle: {
                                width: 3
                            }
                        }
                    ]
                };

            case "BAR":

                return {
                    grid: commonGrid,

                    tooltip: commonTooltip,

                    xAxis: {
                        type: "value",
                        name: xAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: axisNameStyle
                    },

                    yAxis: {
                        type: "category",
                        data: categories,
                        name: yAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 70,
                        nameTextStyle: axisNameStyle
                    },

                    series: [
                        {
                            type: "bar",
                            data: values?.map((value, index) => ({
                                value,
                                itemStyle: {
                                    color: colorList[index % colorList.length]
                                }
                            })),

                            label: {
                                show: true,
                                position: "right",
                                fontWeight: "bold"
                            },

                            barMaxWidth: 50
                        }
                    ]
                };

            case "COLUMN":

                return {
                    grid: commonGrid,
                    tooltip: commonTooltip,
                    xAxis: {
                        type: "category",
                        data: categories,
                        name: xAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: axisNameStyle,
                        axisLabel: {
                            interval: 0,
                            rotate: categories.length > 10 ? 30 : 0
                        }
                    },

                    yAxis: {
                        type: "value",
                        name: yAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 50,
                        nameTextStyle: axisNameStyle
                    },

                    series: [
                        {
                            type: "bar",
                            data: values?.map((value, index) => ({
                                value,
                                itemStyle: {
                                    color: colorList[index % colorList.length]
                                }
                            })),

                            label: {
                                show: true,
                                position: "top",
                                fontWeight: "bold"
                            },

                            barMaxWidth: 60
                        }
                    ]
                };

            case "AREA":

                return {
                    grid: commonGrid,

                    tooltip: commonTooltip,

                    xAxis: {
                        type: "category",
                        data: categories,
                        name: xAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: axisNameStyle,
                        axisLabel: {
                            interval: 0,
                            rotate: categories.length > 10 ? 30 : 0
                        }
                    },

                    yAxis: {
                        type: "value",
                        name: yAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 50,
                        nameTextStyle: axisNameStyle
                    },

                    series: [
                        {
                            type: "line",
                            smooth: true,
                            areaStyle: {},

                            data: values,

                            label: {
                                show: true,
                                position: "top",
                                fontWeight: "bold"
                            },

                            lineStyle: {
                                width: 3,
                                color: colorList[0]
                            }
                        }
                    ]
                };

            case "PIE":

                return {

                    tooltip: {
                        trigger: "item"
                    },

                    legend: {
                        bottom: 0
                    },

                    series: [
                        {
                            type: "pie",

                            radius: "65%",

                            data: categories.map((name, i) => ({
                                name,
                                value: values[i]
                            })),

                            label: {
                                show: true,
                                formatter: "{b}\n{c}",
                                fontWeight: "bold"
                            },

                            emphasis: {
                                scale: true,
                                scaleSize: 10
                            }
                        }
                    ]
                };

            case "DONUT":

                return {

                    tooltip: {
                        trigger: "item"
                    },

                    legend: {
                        bottom: 0
                    },

                    series: [
                        {
                            type: "pie",

                            radius: ["45%", "70%"],

                            data: categories.map((name, i) => ({
                                name,
                                value: values[i]
                            })),

                            label: {
                                show: true,
                                formatter: "{b}\n{c}",
                                fontWeight: "bold"
                            },

                            emphasis: {
                                scale: true,
                                scaleSize: 10
                            }
                        }
                    ]
                };

            default:

                return {
                    title: {
                        text: "No Chart Data",
                        left: "center"
                    }
                };
        }
    };



    //  Decide which chart to render
    if (chartType === "3D_BAR") {
        return <ApacheThreeDChart type="bar3D" widgetData={widgetData} gdata={data?.originalData || []} />;
    }

    if (chartType === "GAUGE") {
        return <ApacheGaugeChart widgetData={widgetData} gdata={data?.originalData || []} />;
    }

    const formatted =
        formatChartData(data?.originalData);

    console.log('formatted', formatted)

    // fallback (normal charts)
    // const option = buildChartOption({ type: chartType, data });

    const option = buildChartOption({
        type: chartType,
        xAxisLabel: xAxisLabel,
        yAxisLabel: yAxisLabel,
        ...formatted
    });


    return (

        <ReactECharts
            option={option}
            style={{ height: "400px" }}
            notMerge={true}
            lazyUpdate={true}
        />

    );
};

export default ApacheGenChart;