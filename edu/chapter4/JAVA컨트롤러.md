## Java controller
**샘플 파일명:**  `Practice02.jsx`,`PracticeController.java`

>이 샘플에서는 Java 컨트롤러에서 저장 프로시저(SP)와 SQL 쿼리문을 호출하는 방법을 실습해볼 수 있습니다. SQL 쿼리문 호출 시 반드시 PreparedStatement를 사용해야 합니다. 또한, queryHandler의 save 메서드는 P_RT_ROLLBACK_FLAG와 P_RT_MSG 두 가지 OUTPUT 파라미터를 기본으로 포함하고 있으므로, 저장 프로시저에서도 이를 구현해야 합니다.

### 실행권한 체크 
 - ExecPermission annotation 사용 
   - menuCd: 화면 ID
   - type : 조회권한 타입 ( PERMISSION_TYPE_READ, PERMISSION_TYPE_UPDATE, PERMISSION_TYPE_DELETE )
### 조회

```java
 @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_READ)
  @PostMapping("/practice/q1")
  public List<Map<String, Object>> getData1(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
    return queryHandler.getList("SP_UI_PRACTICE_01Q", params);
  }
```

### 저장
```java
 @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_UPDATE)
  @PostMapping("/practice/s1")
  public Map<String, Object> saveData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) throws Exception {
    String username = userService.getUserDetails().getUsername();
    Map<String, Object> resultMap = new HashMap<>();
    for (Map<String, Object> params : changes) {
      Map<String, Object> param = new HashMap<>();
      param.put("P_ID", new Object[] { params.get("ID"), String.class, ParameterMode.IN });
      param.put("P_KORNAME", new Object[] { params.get("KORNAME"), String.class, ParameterMode.IN });
      param.put("P_GENDER", new Object[] { params.get("GENDER"), String.class, ParameterMode.IN });
      param.put("P_AGE", new Object[] { params.get("AGE"), Integer.class, ParameterMode.IN });
      param.put("P_USERNAME", new Object[] { username, String.class, ParameterMode.IN });
      Map<String, Object> result = queryHandler.save("SP_UI_PRACTICE_01S", param);

      resultMap.putAll(result);
    }
    return resultMap;
  }
```

### 삭제
```java
 @ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_DELETE)
  @PostMapping("/practice/d1")
  public Map<String, Object> deleteData1(@RequestBody List<Map<String, Object>> changes, HttpServletRequest request) throws Exception {
    String username = userService.getUserDetails().getUsername();

    Map<String, Object> resultMap = new HashMap<>();
    for (Map<String, Object> params : changes) {
      Map<String, Object> param = new HashMap<>();
      
      param.put("P_ID", new Object[] { params.get("ID"), String.class, ParameterMode.IN });
      param.put("P_USERNAME", new Object[] { username, String.class, ParameterMode.IN });
      Map<String, Object> result = queryHandler.save("SP_UI_PRACTICE_01D", param);
      resultMap.putAll(result);
    }
    return resultMap;
  }
```


### native sql
- sql 문을 직접 호출 할 수 있지만 프로시저 사용을 권장함.
```java
@ExecPermission(menuCd = "UI_PRACTICE_01", type = ServiceConstants.PERMISSION_TYPE_READ)
  @PostMapping("/practice/q2")
  public List<?> getData2(@RequestBody Map<String, Object> params, HttpServletRequest request) throws Exception {
      String sqlQuery = 
      "SELECT '쿼리-박OO' AS KORNAME, '남' AS GENDER, '71' AS AGE, '(025)6563-2802' AS PHONE, " +
      "'198160731-00008' AS PRODUCTID, '모잠비크' AS KORCOUNTRY, '2021-01-16' AS ORDERDATE, 'Y' AS ACTIVE " +
      "UNION ALL " +
      "SELECT '쿼리-조OO', '남', '62', '(093)8809-8696', " +
      "'571215854-00001', '캐나다', '2019-07-29', 'Y' " +
      "UNION ALL " +
      "SELECT '쿼리-김OO', '남', '45', '(010)1234-5678', " +
      "'123456789-00003', '한국', '2020-05-23', 'N' " +
      "UNION ALL " +
      "SELECT '쿼리-이OO', '여', '32', '(010)8765-4321', " +
      "'987654321-00004', '미국', '2020-11-11', 'Y' " +
      "UNION ALL " +
      "SELECT '쿼리-한OO', '여', '29', '(010)5555-6666', " +
      "'55556666-00005', '호주', '2021-03-14', 'Y' " +
      "UNION ALL " +
      "SELECT '쿼리-장OO', '남', '39', '(010)7777-8888', " +
      "'77778888-00006', '영국', '2018-09-17', 'N' " +
      "UNION ALL " +
      "SELECT '쿼리-송OO', '여', '35', '(010)9999-0000', " +
      "'99990000-00007', '프랑스', '2021-06-21', 'N';";

    return queryHandler.getNativeQueryData(sqlQuery);
  }

```