import React, { useRef } from "react";
import WidgetContent from '@zionex/wingui-core/component/dashboard/WidgetContent';
import ChartComponent from '@zionex/wingui-core/component/chart/ChartComponent';

function DashboardWidget10() {
  const chartRef = useRef();

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const data = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: [20000, 30000, 45000, 40000, 50000, 60000, 70000, 80000, 85000, 90000, 100000, 95000],
        backgroundColor: "#bcbbff", // 보라색
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: "Prev Sales",
        data: [15000, 20000, 30000, 32000, 42000, 50000, 60000, 70000, 75000, 80000, 90000, 88000],
        backgroundColor: "#eca8ad", // 분홍색
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 10, right: 10, left: 10, bottom: 10 }
    },
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
          callback: (value) => (value >= 1000 ? value / 1000 + "K" : value)
        }
      }
    }
  };

  // 블랙 기준선 추가 (평균선)
  const customLines = {
    id: "customLines",
    afterDatasetsDraw(chart) {
      const { ctx, scales: { y } } = chart;
      const meta1 = chart.getDatasetMeta(0);
      ctx.save();
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;

      meta1.data.forEach((bar, i) => {
        const avg = (data.datasets[0].data[i] + data.datasets[1].data[i]) / 2;
        const avgY = y.getPixelForValue(avg);
        const xCenter = bar.x;
        ctx.beginPath();
        ctx.moveTo(xCenter - 12, avgY);
        ctx.lineTo(xCenter + 12, avgY);
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
        padding: "10px",
        boxSizing: "border-box",
        alignItems: "center"
      }}>
        {/* 왼쪽 텍스트 영역 */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "30%", // 왼쪽 30%
          paddingRight: "15px"
        }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>$745,568</div>
          <div style={{
            backgroundColor: "#e6f4ea", // 연두색
            color: "#1e7d34", // 초록색 글자
            fontWeight: "bold",
            fontSize: "16px",
            padding: "8px 12px",
            borderRadius: "6px",
            display: "inline-block",
            textAlign: "center"
          }}>
            21.4%
          </div>
        </div>

        {/* 오른쪽 차트 영역 */}
        <div style={{ width: "70%", height: "100%", display: "flex" }}>
          <ChartComponent
            ref={chartRef}
            type="bar"
            data={data}
            options={options}
            plugins={[customLines]}
          />
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget10;
