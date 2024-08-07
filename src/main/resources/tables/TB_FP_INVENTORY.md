### 개요
    스테이지 내의 품목 정보인 인벤토리 정보를 설정합니다.

### 주의 사항
    인벤토리를 삭제할 경우, 관련된 Bom, Order 등에도 영향을 미치게 됩니다.
    삭제에 유의해 주세요. 

### 관련 화면
- 데이터 통합 > 생산 계획 > [품목 - 인벤토리 탭](#/dataintegration/factoryplan/item)

### 작업 테이블 정보
- #### TB_FP_INVENTORY 


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT  |
| O  | INVENTORY_CD        | 인벤토리 코드    | STRING |           |
|    | INVENTORY_NM | 인벤토리 명칭     | STRING |           |
| O  | INVENTORY_GRP_CD       | 인벤토리 그룹 코드 | STRING |           |
| O  | STAGE_CD        | 스테이지 코드    | STRING |           |
| O  | ITEM_CD        | 품목 코드    | STRING |           |
| O  | ITEM_TP_CD        | 품목 구분 타입    | STRING | M   |
|    | INV_KEEPING_TIME        | 재고 가용 시간    | NUMBER |           |
|    | INV_FENCE_TIME        | 재고 속성 변경 시간    | NUMBER |           |
|    | TIME_UOM        | 시간 측정 단위    | STRING |           |
|    | STOCK_SPLIT_COMBINATION        | 재고 분할 수량 조합    | STRING | SC     |
|    | ALT_ROUTE_POLICY        | 대채 공정 생산 할당 정책    | STRING |           |
|    | STOCK_SELECT_TP_CD        | 재고 선택 적용 순서    | DATE |           |

#### INVENTORY_CD
> 인벤토리 코드

#### INVENTORY_NM
> 인벤토리 명칭

#### INVENTORY_GRP_CD
> 인벤토리 그룹 코드

#### STAGE_CD
> 스테이지 코드
> `TB_FP_STAGE` 테이블의 `STAGE_CD`

#### ITEM_CD
> 품목 코드
> `TB_FP_ITEM` 테이블의 `ITEM_CD`

#### ITEM_TP_CD
> 품목 구분 타입   
> 품목의 품목 유형(ITEM_CLASS) 에 따라 구분 적용
> - ITEM_CLASS = M (Material) 일 때
>   - M : 무한 자재
>   - L : 유한 자재
>   - E : 만기성 자재 (Expirable Material)
>   - S : 정해진 기간까지는 유한 자재로 사용 되다가 정해진 기간이 지나면 무한 자재로 사용 (Switchable Material)
>   - R : S 타입의 반대로 무한 자재에서 유한 자재로 사용되는 자재
> - TEM_CLASS = I (Item) 일 때
>   - W : 필요 수량만큼 생산하는 품목
>   - X : 지정한 Lot size와 필요수량을 각각 고려하여 생산하는 품목
>   - D : 지정한 Lot size와 필요수량을 함께 고려하여 생산하는 품목
> - TEM_CLASS = P (Product) 일 때
>   - P : Product

#### INV_KEEPING_TIME `OBP`
> 재고 가용 시간  
> ITEM_TP_CD = E (만기성 자재) 일 경우 에만 의미가 있음  
> 자재가 입고된 시점 부터 사용 가능한 시간을 정의 (정해진 시간 동안만 사용 가능)

#### INV_FENCE_TIME `OBP`
> 재고 속성 변경 시간  
> ITEM_TP_CD = S (유한 자재 -> 무한 자재) 또는 R (무한 자재 -> 유한 자재) 일 경우 에만 의미가 있음  
> 자재가 입고된 시점 부터 속성이 변경 되는 시간을 정의 (정해진 시간 이후 특성이 바뀌게 됨)

#### TIME_UOM `OBP`
> Time-Bucket 시간 단위
> - SECOND
> - MINUTE
> - HOUR
> - DAY
> - WEEK
> - MONTH

#### STOCK_SPLIT_COMBINATION
> 재고 분할 수량 조합  
> Transfer Batch 공정에 대해 앞 공정의 생산 재고를 분할 하여 생성 하는 기능  
> ***STOCK을 생성 하는 작업 주문 에만 적용 된다.***
> > **ex)**  
> > `5 + 10 + 15`로 설정 시 다음 공정의 작업은 5가 생산되는 시점부터 진행 할 수 있으며, 각 5개, 10개, 15개의 작업으로 분할 되어 생산 된다.

#### ALT_ROUTE_POLICY `OBP`
> 대채 공정 생산 할당 정책
> - P : 비율 (Percent)
> - A : 수량 (Amount)

#### STOCK_SELECT_TP_CD `OBP`
> 재고 선택 적용 순서  
> 재고 선택 시 정렬 또는 사용 가능 여부를 적용 하는 순서 지정  
> S : 정렬 (Sequencer)  
> C : 사용 가능 여부 (Checker)  
> SC 또는 CS로 설정
