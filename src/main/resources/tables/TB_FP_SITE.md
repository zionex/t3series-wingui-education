### 개요
    회사 구조 2 단계 정보인 사이트 정보를 정의합니다.

### 주의 사항
    테이블 삭제시 거의 대부분의 FP 테이블이 초기화 됩니다..
    기준 정보 중 중요한 테이블인 `TB_FP_RESOURCE`, `TB_FP_ROUTE`, `TB_FP_INVENTORY` 테이블이 
    조직정보 최하위인 `TB_FP_STAGE` 테이블을 참조 하고 있기 때문입니다.

### 관련 화면
- 없음

### 작업 테이블 정보

- #### TB_FP_SITE


| 필수 | 물리명            | 논리명       | 형식     |    기본값    | 
|:--:|:---------------|:----------|:-------|:---------:|
| O  | SITE_CD        | 사이트 코드    | STRING |           |
|    | SITE_NM        | 사이트 명칭    | STRING |           |
| O  | CORPORATION_CD | 법인 코드     | STRING |           |
|    | DESC_TXT       | 사이트 부연 설명 | STRING |           |

#### SITE_CD
> 사이트 코드  

#### SITE_NM
> 사이트 명칭  

#### CORPORATION_CD
> 법인 코드
> `TB_FP_CORPORATION` 테이블의 `CORPORATION_CD` 값을 참조 합니다.

#### DESC_TXT
> 사이트 부연 설명  
