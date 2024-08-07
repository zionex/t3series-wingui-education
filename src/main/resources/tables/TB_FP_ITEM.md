### 개요
    원재료(부자재), 반제품(중간재), 완제품 등 모든 품목의 기준 정보를 정의합니다.

### 주의 사항
    아이템을 삭제할 경우, 직접적으로 연관된 Inventory는 없는 Item 정보를 가지고 있으므로
    관련된 Bom, Order 등에도 영향을 미치게 됩니다. 삭제에 유의해 주세요. 

### 관련 화면
- 데이터 통합 > 생산 계획 > [품목 - 품목 탭](#/dataintegration/factoryplan/item)

### 작업 테이블 정보
- #### TB_FP_ITEM


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT    |
| O  | ITEM_CD        | 품목 코드    | STRING |           |
|    | ITEM_NM | 품목 명칭     | STRING |           |
|    | ITEM_PARENT_GRP_CD       | 품목 상위 그룹 코드 | STRING |           |
|    | ITEM_GRP_CD        | 품목 그룹 코드    | STRING |           |
| O  | ITEM_CLASS_CD        | 품목 구분    | STRING | M      |
|    | ITEM_UOM        | 단위 구분자    | STRING |           |
|    | PRIORITY        | 우선 순위    | NUMBER | 1        |
| O  | WO_SIZE_MIN        | 최소 작업 주문 수량 크기    | NUMBER | 1          |
| O  | WO_SIZE_MAX        | 최대 작업 주문 수량 크기    | NUMBER | 1          |
| O  | WO_SIZE_MULTIPLR        | 배수 작업 주문 수량 크기    | NUMBER | 0          |
|    | BASE_LT        | 기준 LT (일)    | NUMBER | 1          |
|    | NPI        | 제품 출시일    | DATE |           |
|    | EOL        | 제품 단종일    | DATE |           |
|    | PRODTN_LIMIT_CD        | 생산 한계 코드    | STRING |           |
|    | DISPLAY_COLOR        | 표시 색상    | STRING | 1          |
|    | DISPLAY_SEQ        | 표시 순번    | NUMBER | 2147483647 |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### PLAN_SCOPE
> 계획 범위

#### ITEM_CD
> 품목 코드

#### ITEM_NM
> 품목 명칭

#### ITEM_PARENT_GRP_CD
> 품목 상위 그룹 코드  
> `TB_FP_ITEM_PARENT_GRP` 테이블의 `ITEM_PARENT_GRP_CD`

#### ITEM_GRP_CD
> 품목 그룹 코드  
> `TB_FP_ITEM_GRP` 테이블의 `ITEM_GRP_CD`

#### ITEM_CLASS_CD
> 품목 구분 코드
> - M : Material (원재로/부자재)
> - I : Item (중간재/반제품)
> - P : Product (완제품)

#### ITEM_UOM
> 품목 단위 구분자 (개수, kg 등)

#### PRIORITY
> 우선 순위    
> 주문 이나 재고 사용시 정렬 순서로 사용

#### WO_SIZE_MIN
> 최소 작업 주문 수량 크기
> - ITEM_CLASS = M (Material) 이면 무의미 함
> - ITEM (Product) 기준 최소 작업 주문 사이즈를 뜻함
> > - 기본 적인 작업 주문 분할 규칙에서는 FP Demand의 잔량이 WO_SIZE_MIN 보다 적을 경우, 잔량 대신 WO_SIZE_MIN으로 작업 주문을 생성함.

#### WO_SIZE_MAX
> 최대 작업 주문 수량 크기
> - ITEM_CLASS = M (Material) 이면 무의미 함
> - ITEM (Product) 기준 최대 작업 주문 사이즈를 뜻함
> > - 기본 적인 작업 주문 분할 규칙에서는 FP Demand의 잔량이 WO_SIZE_MIN 보다 많고, WO_SIZE_MAX 보다 적을 경우, 잔량으로 작업 주문을 생성함.
> > - 기본 적인 작업 주문 분할 규칙에서는 FP Demand의 잔량이 WO_SIZE_MAX 보다 많을 경우, WO_SIZE_MAX 로 작업 주문을 생성함.

#### WO_SIZE_MULTIPLR
> 배수 작업 주문 수량 크기
> - 주문 수량이 WO_SIZE_MIN/WO_SIZE_MAX 사이일 경우 주문 수량을 만족 할 수 있도록 WO_SIZE_MULTIPLR 단위로 증가 시켜 작업 주문을 생성함
> > **ex)**    
> > FP Demand 수량 : 210    
> > WO_SIZE_MIN : 5    
> > WO_SIZE_MAX : 40    
> > WO_SIZE_MULTIPLR : 20    
> > 인 경우 다음과 같은 작업 주문이 생성 됨 
> > - WO-1 : 40 (WO_SIZE_MAX 기준) -> 잔여 수량 : 170
> > - WO-2 : 40 (WO_SIZE_MAX 기준) -> 잔여 수량 : 130
> > - WO-3 : 40 (WO_SIZE_MAX 기준) -> 잔여 수량 : 90
> > - WO-4 : 40 (WO_SIZE_MAX 기준) -> 잔여 수량 : 50
> > - WO-5 : 40 (WO_SIZE_MAX 기준) -> 잔여 수량 : 10
> > - WO-6 : 5 (WO_SIZE_MIN 기준) + 20 (WO_SIZE_MULTIPLR 기준) -> 추가 생산 수량 : 25

#### BASE_LT
> 품목에 대한 관리 Lead Time 의 일수

#### NPI
> 제품 출시일 ()

#### EOL
> 제품 단종일 (End Of Life)

#### PRODTN_LIMIT_CD
> 생산 한계 코드  
> `TB_FP_PRODTN_LIMIT` 테이블의 `PRODTN_LIMIT_CD`

#### DISPLAY_COLOR
> UI 상에 표시할 색상

#### DISPLAY_SEQ
> UI 상에 표시할 순서

#### DESC_TXT
> 부연 설명
