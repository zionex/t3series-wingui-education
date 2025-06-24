
#### 그리드에서의 팝업호출
```javascript
 const [namePopupOpen, setNamePopupOpen] = useState(false);


  //grid button click
  gridView.onCellButtonClicked = (grid, itemIndex, column) => {
      if (column.fieldName === "KORNAME") {
        setNamePopupOpen(true);
      }
  };

  {namePopupOpen && <PopName open={namePopupOpen} onClose={() => setNamePopupOpen(false)} confirm={confirmNamePopup} />}

  //팝업에서 가져온 데이터 셋팅
  const confirmNamePopup = (dataRows) => {
    let itemIndex = grid1.gridView.getCurrent().itemIndex;
    grid1.gridView.beginUpdateRow();  
    grid1.gridView.setValue(itemIndex, "KORNAME", dataRows[0].NAME);
  }

```