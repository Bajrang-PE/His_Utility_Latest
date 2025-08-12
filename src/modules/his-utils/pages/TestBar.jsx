import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Optional: for nice color variations
const colors = Highcharts.getOptions().colors;

const BarRaceChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([
    { name: "A", value: 10 },
    { name: "B", value: 5 },
    { name: "C", value: 8 },
    { name: "D", value: 3 }
  ]);

  // Chart options
  const options = {
    chart: {
      type: "bar",
      animation: false,
      height: 400
    },
    title: {
      text: "Highcharts Bar Race Example"
    },
    xAxis: {
      categories: data.map(d => d.name),
      reversed: false
    },
    yAxis: {
      title: { text: "Value" }
    },
    plotOptions: {
      series: {
        animation: { duration: 500 },
        dataLabels: {
          enabled: true,
          format: "{point.y}"
        }
      }
    },
    legend: { enabled: false },
    series: [
      {
        name: "Score",
        data: data.map((d, i) => ({
          name: d.name,
          y: d.value,
          color: colors[i % colors.length]
        }))
      }
    ]
  };

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        // Increase values randomly
        const updated = prevData.map(d => ({
          ...d,
          value: d.value + Math.round(Math.random() * 5)
        }));

        // Sort by value descending
        updated.sort((a, b) => b.value - a.value);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartRef}
      immutable={true} // forces full redraw for reordering
    />
  );
};

export default BarRaceChart;
