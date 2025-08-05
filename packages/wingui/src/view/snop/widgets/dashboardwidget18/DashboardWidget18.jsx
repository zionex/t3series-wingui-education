import React, { useRef } from "react";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";

function DashboardWidget18() {
  const chartRef = useRef();

  const labels = ["2월", "4월", "6월", "8월", "10월", "12월"];
  const values = [6000, 15000, 8000, 10000, 12000, 9000];

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        data: values,
        backgroundColor: values.map((_, i) => (labels[i] === "8월" ? "#00bcd4" : "#dcdcdc")), // 8월만 청록
        borderRadius: 4,
        barPercentage: 0.4,
        categoryPercentage: 0.6
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
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => (value >= 1000 ? value / 1000 + "K" : value)
        }
      }
    }
  };

  // 블랙 기준선 (각 바 중앙)
  const blackLines = {
    id: "blackLines",
    afterDatasetsDraw(chart) {
      const { ctx, scales: { y } } = chart;
      const meta = chart.getDatasetMeta(0);
      ctx.save();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;

      meta.data.forEach((bar, i) => {
        const avgY = y.getPixelForValue(values[i] / 2);
        ctx.beginPath();
        ctx.moveTo(bar.x - 10, avgY);
        ctx.lineTo(bar.x + 10, avgY);
        ctx.stroke();
      });

      ctx.restore();
    }
  };

  return (
    <WidgetContent>
      <div style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        padding: "15px",
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
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>Profit</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#0097a7", marginBottom: "12px" }}>95,926</div>
          <div style={{ fontSize: "14px", color: "#2e7d32", fontWeight: "bold", marginBottom: "6px" }}>
            vs. MoM (%) <span style={{ color: "#2e7d32" }}>+35.4%</span>
          </div>
          <div style={{ fontSize: "14px", color: "#2e7d32", fontWeight: "bold" }}>
            vs. YoY (%) <span style={{ color: "#2e7d32" }}>+16.0%</span>
          </div>
        </div>

        {/* 오른쪽 차트 */}
        <div style={{ width: "65%", height: "100%", display: "flex" }}>
          <ChartComponent
            ref={chartRef}
            type="bar"
            data={data}
            options={options}
            plugins={[blackLines]}
          />
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget18;
