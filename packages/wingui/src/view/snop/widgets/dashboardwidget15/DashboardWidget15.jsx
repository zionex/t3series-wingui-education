import React, { useRef } from "react";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";

function DashboardWidget15() {
  const chartRef = useRef();

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const data = {
    labels,
    datasets: [
      {
        label: "Profit Ratio",
        data: [8, 15, 12, 10, 14, 13, 9, 11, 18, 22, 10, 7],
        borderColor: "#6b6bff",
        borderWidth: 2,
        fill: false,
        pointRadius: 0
      },
      {
        label: "Background Fill",
        data: [10, 2, 20, 14, 10, 3, 8, 10, 12, 14, 13, 14],
        backgroundColor: "rgba(125, 121, 242, 0.2)",
        borderWidth: 0,
        fill: true, 
        pointRadius: 0,
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
        ticks: { color: "#555" },
        grid: { drawTicks: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + "%"
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
        alignItems: "center"
      }}>
        {/* 왼쪽 텍스트 */}
        <div style={{ width: "35%", paddingRight: "15px" }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>Profit Ratio</div>
          <div style={{ fontSize: "26px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>12.9%</div>
          <div style={{
            backgroundColor: "#fdecea",
            color: "#d93025",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "6px 12px",
            borderRadius: "6px",
            display: "inline-block"
          }}>
            -4.4%
          </div>
        </div>

        {/* 오른쪽 차트 */}
        <div style={{ width: "65%", height: "100%" }}>
          <ChartComponent
            ref={chartRef}
            type="line"
            data={data}
            options={options}
          />
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget15;
