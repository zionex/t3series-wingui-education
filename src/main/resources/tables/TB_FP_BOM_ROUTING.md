### 개요
- 공정과 인벤토리의 상관관계를 정의합니다.

### 주의 사항
    생산 공정을 기준으로 투입 인벤토리와 생산 인벤토리를 정의하는 필수 마스터 정보 입니다.
    삭제시 공정과 인벤토리의 상관관계가 깨지므로 삭제에 유의 바랍니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [BOM](#/dataintegration/factoryplan/bom)

### 작업 테이블 정보
- #### TB_FP_BOM_ROUTING


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT   |
| O  | ROUTE_CD        | 공정 코드    | STRING |           |
| O  | INVENTORY_CD | 인벤토리 코드     | STRING |           |
| O  | BOM_TP_CD       | BOM 유형 | STRING | C          |
| O  | BOM_RATE        | BOM 비율    | NUMBER | 1          |
|    | PRIORITY        | 우선 순위    | NUMBER |           |
|    | INPUT_TP_CD        | 투입 유형 코드    | STRING | R          |
|    | ALT_VAL        | 대체 공정 할당 값    | NUMBER | 0          |

#### ROUTE_CD
> 공정 코드  
> `TB_FP_ROUTE` 테이블의 `ROUTE_CD`

#### INVENTORY_CD
> 인벤토리 코드 
> `TB_FP_INVENTORY` 테이블의 `INVENTORY_CD`

#### BOM_TP_CD
> BOM 유형 코드
> - C : Consuming (투입 인벤토리)
> - P : Producing (생산 인벤토리)
> - CA : Consuming Pool Material (사용 가능한 어떤 자재도 사용 사능)
> - CX : Consuming Exclusive or Material (사용 가능한 여러 자재들 중 수량이 모자라지 않는 특정 자재만 사용 가능)

#### BOM_RATE
> 투입 또는 생산 값

#### PRIORITY
> BOM_TP_CD = CA 또는 CX인 경우 투입 자재 우선 순위, 대체 공정 우선 순위

#### INPUT_TP_CD
> 생산 값 타입 코드
> - A : Absolute (***BOM_RATE에 정의된 절대 수량*** 그대로 사용)
> - R : Rate (***BOM_RATE에 정의된 수량 * 주문 수량*** 만큼 사용)

#### ALT_VAL
> 대체 공정 할당율 또는 대체 공정 할당 수량
