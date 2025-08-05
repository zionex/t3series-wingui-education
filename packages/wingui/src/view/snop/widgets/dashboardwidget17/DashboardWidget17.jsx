import React from "react";
import WidgetContent from "@zionex/wingui-core/component/dashboard/WidgetContent";

function DashboardWidget17() {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const categories = [
    { label: "Furniture", values: [false, true, true, false, true, true, false, true, true, true, true, false] },
    { label: "Office Supplies", values: [true, false, true, true, true, true, true, true, true, true, false, true] },
    { label: "Technology", values: [true, false, false, true, true, true, true, true, true, true, true, false] }
  ];

  return (
    <WidgetContent>
      <div style={{
        display: "flex",
        justifyContent: "center", // ✅ 가로 중앙
        alignItems: "center",      // ✅ 세로 중앙
        width: "100%",
        height: "100%"
      }}>
        {/* 전체 Grid (왼쪽 라벨 + 월별 박스) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "120px repeat(12, 1fr)", // 첫 컬럼: 카테고리명 + 12칸
          gap: "6px",
          width: "95%", // Responsive 대응
          maxWidth: "1000px" // ✅ 큰 화면에서도 너무 안 퍼지도록
        }}>
          {/* 첫 번째 행: 빈칸 + 월 라벨 */}
          <div></div>
          {months.map((m, i) => (
            <div key={i} style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "500",
              color: "#666"
            }}>
              {m}
            </div>
          ))}

          {/* 카테고리별 데이터 */}
          {categories.map((cat, idx) => (
            <React.Fragment key={idx}>
              {/* 카테고리 라벨 */}
              <div style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                textAlign: "right",
                paddingRight: "10px"
              }}>
                {cat.label}
              </div>

              {/* 데이터 블록 */}
              {cat.values.map((val, i) => (
                <div key={i} style={{
                  height: "20px",
                  backgroundColor: val ? "#81C784" : "#E57373", // ✅ 초록 / 빨강
                  borderRadius: "4px"
                }} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </WidgetContent>
  );
}

export default DashboardWidget17;
