### 개요
    동시 사용 자원 정보를 정의합니다.

### 주의 사항
    삭제할 경우 연관되어 있는 Tool 제약이 동작 하지 않습니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [BOR](#/dataintegration/factoryplan/bor)

### 작업 테이블 정보
- #### TB_FP_BOR_SET_DTL


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT    |
| O  | BOR_SET_CD        | 품목 코드    | STRING |           |
| O  | ROUTE_CD | 품목 명칭     | STRING |           |
| O  | RESOURCE_CD       | 품목 상위 그룹 코드 | STRING |           |
|    | RESOURCE_TP_CD        | 품목 그룹 코드    | STRING | M          |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### BOR_SET_CD
> 자원 집합 코드  
> `TB_FP_BOR_SET_MST` 테이블의 `BOR_SET_CD`

#### ROUTE_CD
> 공정 코드  
> `TB_FP_ROUTE` 테이블의 `ROUTE_CD`

#### RESOURCE_CD
> 자원 코드  
> `TB_FP_RESOURCE` 테이블의 `RESOURCE_CD`

#### RESOURCE_TP_CD
> 자원 유형
> - M : Main Resource (주 자원)
> - S : Sub Resource (부 자원)
> > 같은 자원 집합 내의 주 자원은 반드시 하나만 존재 해야 한다.

#### DESC_TXT
> 부연 설명
