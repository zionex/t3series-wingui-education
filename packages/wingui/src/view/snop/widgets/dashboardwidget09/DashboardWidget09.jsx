import React, { useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, BarElement } from "chart.js";
import { Chart } from "react-chartjs-2";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, BarElement);

function DashboardWidget09() {
  const chartRef = useRef(null);

  // 샘플 데이터
  const labels = ["Q3", "Q4", "Q1", "Q2", "Q3", "Q4"];
  const retentionRate = [60, 70, 85, 90, 95, 105];
  const ranges = [
    { yMin: 50, yMax: 150 },
    { yMin: 55, yMax: 140 },
    { yMin: 45, yMax: 130 },
    { yMin: 50, yMax: 125 },
    { yMin: 60, yMax: 140 },
    { yMin: 70, yMax: 145 }
  ];

  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Retention Rate",
        data: retentionRate,
        borderColor: "#1d1d1d",
        backgroundColor: "#fff",
        pointBorderColor: "#000",
        pointBackgroundColor: "#fff", // 안 흰색
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.3,
        yAxisID: "y"
      },
      {
        type: "bar", // Range dummy
        label: "Range",
        data: ranges.map(r => r.yMax),
        backgroundColor: "transparent",
        borderWidth: 0,
        yAxisID: "y"
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 160,
        ticks: { callback: (value) => value + "%" }
      }
    }
  };

  // Custom Plugin: Draw vertical line + blue/red squares
  const rangePlugin = {
    id: "rangePlugin",
    beforeDatasetsDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      const meta = chart.getDatasetMeta(1);
      meta.data.forEach((bar, index) => {
        const { yMin, yMax } = ranges[index];
        const xPos = bar.x;

        ctx.save();
        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(xPos, y.getPixelForValue(yMax));
        ctx.lineTo(xPos, y.getPixelForValue(yMin));
        ctx.stroke();

        // 상단 파란 사각형
        ctx.fillStyle = "#1d8cf8";
        ctx.fillRect(xPos - 6, y.getPixelForValue(yMax) - 6, 12, 12);

        // 하단 빨간 사각형
        ctx.fillStyle = "#f5365c";
        ctx.fillRect(xPos - 6, y.getPixelForValue(yMin) - 6, 12, 12);
        ctx.restore();
      });
    }
  };

  return (
    <WidgetContent>
      <Chart ref={chartRef} type="line" data={data} options={options} plugins={[rangePlugin]} />
    </WidgetContent>
  );
}

export default DashboardWidget09;
