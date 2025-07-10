
# 버튼 컴포넌트

본 문서에서는 프로젝트 내에서 사용되는 버튼 컴포넌트들의 역할과 특징에 대해 설명합니다. 버튼은 주로 **그리드 제어용(GridButton)** 과 **공통 UI용(CommonButton)** 으로 구성되어 있습니다.

---

## GridButton 컴포넌트

GridButton은 주로 **그리드 데이터의 추가, 삭제, 저장, 엑셀 입출력** 등의 기능을 담당합니다. 권한 제어, 예외 처리, 유효성 검사 등 다양한 부가 기능이 내장되어 있습니다.

### GridAddRowButton

- **기능**: 그리드에 새로운 행을 추가합니다.
- **주요 옵션**
  - `onBeforeAdd`: 행 추가 전 사용자 정의 로직 실행
  - `onGetData`: 삽입할 데이터 제공
  - `onAfterAdd`: 삽입 완료 후 후처리
- **권한 체크**: `PERMISSION_TYPE_UPDATE` 권한 필요

### GridDeleteRowButton

- **기능**: 체크된 행을 삭제합니다.
- **주요 옵션**
  - `onBeforeDelete`: 삭제 전 사용자 정의 로직 실행
  - `onDelete`: 삭제 시 서버 연동 가능
  - `onAfterDelete`: 삭제 후 후처리
  - `url`: REST API를 통한 삭제 연동
- **권한 체크**: `PERMISSION_TYPE_DELETE` 권한 필요

### GridSaveButton

- **기능**: 그리드에서 변경된 데이터를 저장합니다.
- **주요 옵션**
  - `onBeforeSave`, `onSave`, `onAfterSave`: 전/후처리 훅 지원
  - `url`: REST API 저장 연동
- **유효성 검사**: `gridView.validateCells()`로 유효성 검사 수행
- **권한 체크**: `PERMISSION_TYPE_UPDATE` 권한 필요

### GridExcelImportButton

- **기능**: 엑셀 파일을 업로드하여 그리드에 데이터를 삽입합니다.
- **지원 방식**
  - 서버 업로드 (`zAxios`)
  - 클라이언트 파싱 (SheetJS 사용, `clientside` 속성으로 제어)
- **콜백 지원**
  - `onExcelImportSelect`, `onExcelImportSuccess`, `onExcelImportError`, `onExcelImportComplete`

### GridExcelExportButton

- **기능**: 현재 그리드 데이터를 엑셀로 내보냅니다.
- **옵션 팝업**: uiSettings.js `excelExportSettings.useTypePopup` 설정에 따라 엑셀 옵션 팝업 제공
- **콜백**: `onClick`으로 내보내기 로직 커스터마이징 가능

---

## CommonButton 컴포넌트

공통 UI 버튼으로, 일반 버튼부터 아이콘 버튼, 툴팁 및 위치 제어 등이 가능합니다.

###  CommonButton

- **기능**: 범용 버튼 컴포넌트
- **유형 선택**
  - `type="text"`: 일반 텍스트 버튼
  - `type="icon"`: 아이콘 버튼 (Default)
- **자동 툴팁 적용**
- **children에 아이콘 컴포넌트 전달 가능**
- **variant 옵션**: `outlined`(기본값), `contained`, `text`

### MUI 버튼 스타일 종류

- **text**: 배경 없이 텍스트만 있는 가장 가벼운 형태의 버튼
- **outlined**: 테두리만 있는 중간 강조 버튼
- **contained**: 배경색이 채워진 가장 강조도가 높은 버튼

- 아이콘 버튼
```javascript
<CommonButton title={transLangKey('UI_IM_03_BATCH_UPDATE_02')} onClick={saveBatchDistributionCenterGrade} disabled={!permissions?.PERMISSION_TYPE_UPDATE}><Icon.File/></CommonButton>

<CommonButton title="저장" onClick={handleSave}><Save /></CommonButton>
```

- 텍스트 버튼
```javascript
<CommonButton type="text" title={transLangKey("SAVE_TARGETS")} onClick={() => { saveData(); }}>
</CommonButton>
```

- 이미지 버튼
```javascript
<CommonButton type="icon" title={transLangKey("TEST")} onClick={() => test()} >
  <img alt="icon" src={"images/icons/cpu.png"} />
</CommonButton>
```

### SearchButton

- 검색 버튼 (돋보기 아이콘)
- `transLangKey("SEARCH")` 툴팁 자동 적용

### SaveButton

- 저장 버튼 (플로피 디스크 아이콘)
- `transLangKey("SAVE")` 툴팁 자동 적용

### RefreshButton

- 새로고침 버튼
- `transLangKey("REFRESH")` 툴팁 자동 적용

### PersonalButton

- 그리드 개인화(설정) 버튼
- `transLangKey("GRID_CONFIGURATION")` 툴팁 자동 적용

### HelpButton

- 도움말 버튼
- `transLangKey("HELP")` 툴팁 자동 적용

---

## 참고사항

- 모든 버튼은 `Tooltip`을 기본 지원하며, `MUI`의 `IconButton`, `Button`, `Avatar` 등을 사용합니다.
- 버튼 활성화/비활성화는 `permissions` 정보와 `props.disabled` 조합으로 처리됩니다.
- GridButton은 대부분 `grid`, `url`, `onXXX`와 같은 props를 통해 외부 로직과 연동할 수 있도록 설계되어 있습니다.
