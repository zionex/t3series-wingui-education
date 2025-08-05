import React, { useRef } from "react";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent';

function DashboardWidget11() {
  const chartRef = useRef();

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // 데이터: 앞부분은 회색, 마지막 4개는 파란색
  const dataValues = [15, 20, 25, 30, 35, 28, 40, 42, 38, 45, 50, 60];
  const colors = dataValues.map((_, i) => (i >= 8 ? "#6b6bff" : "#e0e0e0"));

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: dataValues,
        backgroundColor: colors,
        borderRadius: 4, // 바 모서리 둥글게
        barPercentage: 0.6,
        categoryPercentage: 0.8
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
        display: false // X축 숨김
      },
      y: {
        display: false // Y축 숨김
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
          width: "40%", // 왼쪽 비율
          paddingRight: "15px"
        }}>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Sales</div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#4b4ba5", marginBottom: "8px" }}>$745,568</div>
          <div style={{
            backgroundColor: "#e6f4ea", // 연두
            color: "#1e7d34",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "6px 10px",
            borderRadius: "6px",
            display: "inline-block",
            textAlign: "center"
          }}>
            21.4%
          </div>
        </div>

        {/* 오른쪽 차트 */}
        <div style={{ width: "60%", height: "100%", display: "flex" }}>
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

export default DashboardWidget11;
