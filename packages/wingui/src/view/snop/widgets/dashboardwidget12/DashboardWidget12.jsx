import React, { useRef } from "react";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent';

function DashboardWidget12() {
  const chartRefs = [useRef(), useRef(), useRef()];

  const labels = ["F", "A", "J", "A", "O", "D"];

  const createData = (values) => ({
    labels,
    datasets: [
      {
        data: values,
        borderColor: "#7d79f2",
        backgroundColor: "rgba(125, 121, 242, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false }, 
      datalabels: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        ticks: { color: "#666", font: { size: 10 } },
        grid: { display: false }
      },
      y: { display: false }
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
        {/* 왼쪽 영역 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "35%",
          paddingRight: "15px"
        }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Sales</div>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "2px" }}>Current Year</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#4b4ba5", marginBottom: "6px" }}>$745,568</div>
          <div style={{ fontSize: "12px", color: "#888" }}>vs. PY (%)</div>
          <div style={{
            backgroundColor: "#e6f4ea",
            color: "#1e7d34",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "6px 10px",
            borderRadius: "6px",
            display: "inline-block",
            marginTop: "4px"
          }}>
            +21.4%
          </div>
        </div>

        {/* 오른쪽 라인 차트 3개 */}
        <div style={{ width: "65%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {["Furniture", "Office Supplies", "Technology"].map((label, idx) => (
            <div key={label} style={{ display: "flex", alignItems: "center", marginBottom: idx !== 2 ? "8px" : "0" }}>
              <div style={{ width: "30%", fontSize: "12px", color: "#555" }}>{label}</div>
              <div style={{ width: "70%", height: "40px" }}>
                <ChartComponent
                  ref={chartRefs[idx]}
                  type="line"
                  data={createData(
                    idx === 0 ? [50, 60, 70, 65, 80, 90] :
                    idx === 1 ? [20, 40, 35, 55, 60, 70] :
                                 [30, 25, 40, 35, 50, 65]
                  )}
                  options={chartOptions}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget12;
