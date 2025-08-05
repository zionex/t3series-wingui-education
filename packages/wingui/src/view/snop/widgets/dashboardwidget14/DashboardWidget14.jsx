import React from "react";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";

function DashboardWidget14() {
  const progress = 74.6; // Progress %
  const value = "$745,568";

  return (
    <WidgetContent>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "15px",
        boxSizing: "border-box"
      }}>
        {/* 타이틀 */}
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>Sales</div>

        {/* 메인 값 */}
        <div style={{ fontSize: "26px", fontWeight: "bold", color: "#4b4ba5", marginBottom: "10px" }}>
          {value}
        </div>

        {/* 퍼센트 박스 */}
        <div style={{
          backgroundColor: "#e6f4ea", // 연두색
          color: "#1e7d34", // 초록
          fontWeight: "bold",
          fontSize: "14px",
          padding: "6px 12px",
          borderRadius: "6px",
          marginBottom: "16px"
        }}>
          {progress}% to Target
        </div>

        {/* Progress Bar */}
        <div style={{
          width: "80%",
          height: "16px",
          backgroundColor: "#dcdcff",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#6b6bff",
            transition: "width 0.6s ease"
          }} />
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget14;
