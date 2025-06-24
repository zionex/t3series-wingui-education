
## Material-UI (MUI)

### 개요

\*\*Material-UI(MUI)\*\*는 Google의 **Material Design** 가이드를 따르는 **React 전용 UI 프레임워크**입니다. 버튼, 텍스트 필드, 다이얼로그, 테이블 등 다양한 고품질 UI 컴포넌트를 제공합니다.

### 주요 특징

- **다양한 컴포넌트**: 버튼, 폼, 모달, 탭, 레이아웃 등 자주 쓰이는 컴포넌트를 기본 제공
- **테마 커스터마이징**: `ThemeProvider`를 통해 색상, 폰트, 간격 등을 일괄 지정 가능
- **반응형 지원**: 다양한 디바이스 화면 크기에 맞게 자동 레이아웃 조절
- **접근성(Accessibility)**: 웹 표준을 준수하여 키보드 탐색, 스크린 리더 등 지원

### 기본 사용 예시

```javascript
import React from 'react';
import { Button } from '@mui/material';

function App() {
  return (
    <Button variant="contained" color="primary">
      Hello, MUI!
    </Button>
  );
}
```

---

## 우리 회사의 활용 방식 (🌟)

우리 회사는 MUI의 **Base 디자인 시스템**을 바탕으로 개발을 진행합니다. 기본적으로 MUI의 컴포넌트를 기반으로 하되, 공통 스타일이나 사용 편의를 위해 **React Hook Form과 함께 커스터마이징한 input 컴포넌트**를 사용하고 있습니다.

### 장점

- **일관된 디자인** 유지
- **폼 검증 로직을 컴포넌트와 분리**하여 유지보수 용이
- **재사용성 높은 컴포넌트 구조 구성 가능**

MUI와 React Hook Form의 조합은 **대규모 업무 시스템 개발 시 안정적이고 확장 가능한 폼 개발 방식**으로 매우 유용합니다.
