## CRUD 샘플
**샘플 파일명:**  `Practice04.jsx`, `PraticeController.java`

![preview](../images/chapter4/Pratice04.png)


>이 샘플은 데이터베이스를 이용한 조회, 저장, 삭제 기능을 구현한 예제입니다. 개발 시, 이 구조를 참고하여 개발을 진행해 주세요.

### crud url 권장 네이밍 규칙
화면에 여러 개의 그리드가 있을 경우, 각 그리드에 대해 URL을 구분하기 위해 q1, q2, q3 식으로 숫자를 증가시켜 사용합니다.

- 조회 : 메뉴path/q1
- 저장 : 메뉴path/s1
- 삭제 : 메뉴path/d1
- 팝업 : 메뉴path/popup/q1

예) fp/fp-0001/q1
