
#### Search 영역의 Input 에서의 팝업호출
```javascript
  const [namePopupOpen2, setNamePopupOpen2] = useState(false);

  <InputField type="action" name="action" label={transLangKey("팝업")} control={control} onClick={()=> setNamePopupOpen2(true)}><Icon.Search /></InputField>


  {namePopupOpen2 && <PopName open={namePopupOpen2} onClose={() => setNamePopupOpen2(false)} confirm={confirmNamePopup2} />}

  //팝업 에서 가져온 데이터 셋팅
  const confirmNamePopup2 = (dataRows) => {
    setValue('action', dataRows[0].NAME);
  }
```