### 개요
    자원 집합을 정의합니다.

### 주의 사항
    데이터 누락시 설정된 동시 사용 자원, 툴 자원 설정, 툴 공급 계획 제약이 동작 하지 않습니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [BOR](#/dataintegration/factoryplan/bor)

### 작업 테이블 정보
- #### TB_FP_BOR_SET_MST


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT    |
| O  | BOR_SET_CD        | 자원 집합 코드    | STRING |           |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### BOR_SET_CD
> 자원 집합 코드

#### DESC_TXT
> 부연 설명
