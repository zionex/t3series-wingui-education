import React, { useState, useEffect, useRef } from "react";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';

function DashboardWidget08() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });

  const chartOption = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      datalabels: { display: false }, // 데이터 라벨 숨김
      legend: {
        display: true,
        position: 'right',
        labels: { boxWidth: 10, pointStyle: "rect", usePointStyle: true }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: { stacked: true, grid: { display: true } },
      y: { position: "left", stacked: true },
      y2: { position: "right", display: false, stacked: false }
    }
  };

  useEffect(() => {
    // X축 라벨 10개
    const labels = [
      "Day 1", "Day 2", "Day 3", "Day 4", "Day 5",
      "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"
    ];

    // Bar는 8일까지 값, 이후 null
    const barDatasets = [];
    const barColors = [
      "#A3C9E2", "#F6B6B6", "#C4E3CB", "#FCE3B3",
      "#D6C7F7", "#F8D1C0", "#B4E1E8", "#F9D8D6"
    ];

    for (let i = 0; i < 8; i++) {
      const data = Array.from({ length: 8 }, () => Math.floor(Math.random() * 200) + 50);
      data.push(null, null); // Day 9~10에는 값 없음
      barDatasets.push({
        type: "bar",
        label: `Bar ${i + 1}`,
        data,
        backgroundColor: barColors[i],
        stack: "stack1",
        yAxisID: "y",
        order: 3
      });
    }

    // Line 데이터 (3개) + 확장
    const cumulTarget = [150, 180, 220, 230, 270, 300, 310, 330];
    const outputQty = [130, 160, 210, 220, 250, 280, 295, 310];
    const dailyTarget = [140, 170, 210, 225, 260, 290, 305, 320];

    // 예측 값 추가 (대각선 뻗어나감)
    const extendLine = (arr, step) => {
      const last = arr[arr.length - 1];
      return [...arr, last + step, last + step * 2];
    };

    const lineDatasets = [
      {
        type: "line",
        label: "Target Line",
        data: extendLine(cumulTarget, 20),
        fill: false,
        borderColor: "#FF9AA2", // 파스텔 코랄
        backgroundColor: "#FF9AA2",
        pointRadius: 3,
        borderDash: [5, 5],
        tension: 0,
        yAxisID: "y2",
        order: 1
      },
      {
        type: "line",
        label: "outputQty",
        data: extendLine(outputQty, 15),
        fill: false,
        borderColor: "#A7E3B8", // 파스텔 민트
        backgroundColor: "#A7E3B8",
        pointRadius: 3,
        tension: 0,
        yAxisID: "y2",
        order: 2
      },
      {
        type: "line",
        label: "dailyTarget",
        data: extendLine(dailyTarget, 18),
        fill: false,
        borderColor: "#CBAACB", // 파스텔 라벤더
        backgroundColor: "#CBAACB",
        pointRadius: 3,
        borderDash: [3, 3],
        tension: 0,
        yAxisID: "y2",
        order: 2
      }
    ];



    setChartData({ labels, datasets: [...barDatasets, ...lineDatasets] });
  }, []);

  return (
    <WidgetContent>
      <ChartComponent options={chartOption} dataset={chartData} ref={chartRef} config={false} />
    </WidgetContent>
  );
}

export default DashboardWidget08;
