### 개요
    회사 구조 4 단계 정보인 스테이지 정보를 정의합니다.

### 주의 사항
    테이블 삭제시 거의 대부분의 FP 테이블이 초기화 됩니다..
    기준 정보 중 중요한 테이블인 `TB_FP_RESOURCE`, `TB_FP_ROUTE`, `TB_FP_INVENTORY` 테이블이 
    조직정보 최하위인 `TB_FP_STAGE` 테이블을 참조 하고 있기 때문입니다.

### 관련 화면
- 없음

### 작업 테이블 정보

- #### TB_FP_STAGE


| 필수 | 물리명      | 논리명       | 형식     |    기본값    | 
|:--:|:---------|:----------|:-------|:---------:|
| O  | STAGE_CD | 스테이지 코드   | STRING |           |
|    | STAGE_NM | 스테이지 명칭   | STRING |           |
| O  | PLANT_CD | 공장 코드    | STRING |           |
|    | DESC_TXT | 스테이지부연 설명 | STRING |           |

#### SITE_CD
> 스테이지 코드  

#### SITE_NM
> 스테이지 명칭  

#### PLANT_CD
> 공장 코드
> `TB_FP_PLANT` 테이블의 `PLANT_CD` 값을 참조 합니다.

#### DESC_TXT
> 스테이지 부연 설명  
