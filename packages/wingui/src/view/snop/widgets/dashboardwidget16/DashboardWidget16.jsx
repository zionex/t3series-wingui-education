import React from "react";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";

function DashboardWidget16() {
  const totalValue = "$745,568";
  const overallPercent = 21.4;

  const items = [
    { label: "Technology", percent: 20.2 },
    { label: "Office Supplies", percent: 36.2 },
    { label: "Furniture", percent: 9.1 }
  ];

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
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "6px" }}>Sales</div>
          <div style={{ fontSize: "26px", fontWeight: "bold", color: "#4b4ba5", marginBottom: "10px" }}>{totalValue}</div>
          <div style={{
            backgroundColor: "#e6f4ea",
            color: "#1e7d34",
            fontWeight: "bold",
            fontSize: "14px",
            padding: "6px 12px",
            borderRadius: "6px",
            display: "inline-block"
          }}>
            {overallPercent}%
          </div>
        </div>

        {/* 오른쪽 Breakdown Progress Bars */}
        <div style={{ width: "65%", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px" }}>
          {items.map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center" }}>
              {/* Label */}
              <div style={{ width: "25%", fontSize: "14px", color: "#555" }}>{item.label}</div>

              {/* Progress Bar */}
              <div style={{
                flexGrow: 1,
                height: "14px",
                backgroundColor: "#dcdcff",
                borderRadius: "8px",
                overflow: "hidden",
                marginRight: "10px"
              }}>
                <div style={{
                  width: `${item.percent}%`,
                  height: "100%",
                  backgroundColor: "#6b6bff",
                  transition: "width 0.6s ease"
                }} />
              </div>

              {/* Percent Box */}
              <div style={{
                backgroundColor: "#e6f4ea",
                color: "#1e7d34",
                fontWeight: "bold",
                fontSize: "13px",
                padding: "4px 8px",
                borderRadius: "6px"
              }}>
                {item.percent}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget16;
