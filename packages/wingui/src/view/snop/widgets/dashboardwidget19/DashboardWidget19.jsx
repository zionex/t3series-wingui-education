import React, { useRef } from "react";
import { Box } from "@mui/material";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";
import ChartComponent from "@zionex/wingui-core/component/chart/ChartComponent";

function DashboardWidget28() {
  const chartRef = useRef(null);
  const value = 800;
  const min = 300;
  const max = 850;
  const normalized = value - min;
  const range = max - min;

  // 데이터 (첫 번째 arc는 투명, plugin에서 gradient stroke)
  const data = {
    datasets: [
      {
        data: [normalized, range - normalized],
        backgroundColor: ["transparent", "#eee"],
        borderWidth: 0,
      },
    ],
  };

  // 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: { display: false },
    },
    animation: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  // Plugin (Gradient + Text)
  const gaugePlugin = {
    id: "gaugePlugin",
    beforeDraw(chart) {
      const { ctx } = chart;
      const arc = chart.getDatasetMeta(0).data[0];
      if (!arc) return;

      // Gradient 생성
      const gradient = ctx.createLinearGradient(arc.x - arc.outerRadius, 0, arc.x + arc.outerRadius, 0);
      gradient.addColorStop(0, "#FF4500");
      gradient.addColorStop(0.5, "#FFD700");
      gradient.addColorStop(1, "#228B22");

      // arc path 가져오기
      const { startAngle, endAngle, innerRadius, outerRadius, x, y } = arc.getProps(
        ["startAngle", "endAngle", "innerRadius", "outerRadius", "x", "y"],
        true
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, (innerRadius + outerRadius) / 2, startAngle, endAngle);
      ctx.lineWidth = outerRadius - innerRadius;
      ctx.strokeStyle = gradient;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    },
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const centerX = chartArea.width / 2 + chartArea.left;
      const centerY = chartArea.top + chartArea.height / 2;

      // 반응형 폰트 크기 계산
      const valueFontSize = Math.max(14, chartArea.width * 0.12);
      const statusFontSize = Math.max(12, chartArea.width * 0.06);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 점수
      ctx.font = `bold ${valueFontSize}px sans-serif`;
      ctx.fillStyle = "#333";
      ctx.fillText(value, centerX, centerY);

      // 상태 텍스트
      ctx.font = `${statusFontSize}px sans-serif`;
      ctx.fillStyle = "#666";
      ctx.fillText("Very Good", centerX, centerY + valueFontSize * 0.8);
      ctx.restore();
    },
  };

  return (
    <WidgetContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%"
        }}
      >
        {/* 차트 컨테이너 (relative로 min/max 배치) */}
        <Box sx={{ flex: 1, position: "relative", width: "100%", minHeight: "200px" }}>
          <ChartComponent
            type="doughnut"
            dataset={data}
            options={options}
            plugins={[gaugePlugin]}
            ref={chartRef}
          />

          {/* min / max 절대 위치 */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: "10%",
              fontSize: "14px",
              color: "#555"
            }}
          >
            {min}
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: "10%",
              fontSize: "14px",
              color: "#555"
            }}
          >
            {max}
          </Box>
        </Box>
      </Box>
    </WidgetContent>
  );
}

export default DashboardWidget28;
