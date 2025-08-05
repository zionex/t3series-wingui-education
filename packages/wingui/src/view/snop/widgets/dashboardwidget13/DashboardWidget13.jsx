import React, { useRef } from "react";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent';

function DashboardWidget13() {
  const chartRef = useRef();

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Sales",
        data: [15000, 20000, 30000, 25000, 40000, 45000, 50000, 70000, 75000, 90000, 85000, 95000],
        backgroundColor: labels.map((label) => label === "Aug" ? "#6b6bff" : "#d8d8d8"), // Aug만 보라색
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        order: 2
      },
      {
        type: "line",
        label: "Trend",
        data: [12000, 16000, 22000, 28000, 32000, 37000, 42000, 50000, 65000, 78000, 82000, 90000],
        borderColor: "#6b6bff",
        backgroundColor: "#6b6bff",
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#6b6bff",
        yAxisID: "y",
        order: 1
      }
    ]
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false }, 
      datalabels: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        ticks: { color: "#666" },
        grid: { drawTicks: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => (value >= 1000 ? value / 1000 + "K" : value)
        }
      }
    }
  };

  return (
    <WidgetContent>
      <div style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        padding: "10px",
        boxSizing: "border-box",
        alignItems: "center"
      }}>
        {/* 왼쪽 텍스트 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "35%",
          paddingRight: "15px"
        }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Sales (CY)</div>
          <div style={{ fontSize: "26px", fontWeight: "bold", color: "#4b4ba5", marginBottom: "8px" }}>$745,568</div>
          <div style={{ color: "#1e7d34", fontWeight: "bold", fontSize: "14px" }}>
            ▲39.4% <span style={{ color: "#666", fontWeight: "normal" }}>MoM</span>
          </div>
        </div>

        {/* 오른쪽 차트 */}
        <div style={{ width: "65%", height: "100%", display: "flex" }}>
          <ChartComponent
            ref={chartRef}
            type="bar"
            data={data}
            options={options}
          />
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget13;
