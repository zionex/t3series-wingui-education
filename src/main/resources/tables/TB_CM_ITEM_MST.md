### 개요
    품목을  등록합니다.

### 주의 사항
    데이터 삭제 시 연관 테이블과 하위 단계의 모든 데이터를 함께 삭제합니다.   
    품목과 연관된 테이블은 많습니다. 삭제에 유의하세요

### 관련 화면
- 데이터 통합 > 수요 계획 > [품목](#/dataintegration/demandplan/item)  
- 데이터 통합 > 공급망 네트워크 > [품목](#/dataintegration/network/item)

### 작업 테이블 정보

- #### TB_CM_ITEM_MST


| 필수 | 물리명                                     | 논리명         | 형식     |    기본값    | 
|:--:|:----------------------------------------|:------------|:-------|:---------:|
| O  | ITEM_CD                    | 거래처코드       | STRING |           |
| O  | ITEM_NM                    | 품목 이름       | STRING |           |
| O  | ITEM_TP_CD               | 품목타입코드      | STRING |           |
|    | UOM_CD                     | UOM         | STRING |           |
|   | RTS                            | 판매시작일자      | DATE   |           |
|   | EOS                             | 판매종료일자      | DATE   |           |
|   | DESCRIP                    | 설명          | STRING |           |
|   | PARENT_ITEM_LV_CD | 상위 품목 그룹 코드 | STRING |           |
|   | DP_PLAN_YN             | 수요계획대상여부    | STRING |           |
|   | MIN_ORDER_SIZE       | 최소주문크기      | NUMBER |           |
|   | MAX_ORDER_SIZE     | 최대주문크기      | NUMBER |           |
|   | DISPLAY_COLOR        | 화면표시색       | STRING |           |
|   | GRADE_YN                  | 등급산정대상 여부   | STRING |           |
|   | GRADE_MODIFY_BY         | 등급산정대상 수정자  | STRING |           |
|   | GRADE_MODIFY_DTTM         | 등급산정대상 수정일시 | DATE   |           |
|   | DEL_YN                     | 삭제여부        | STRING |           |
|    | CREATE_BY               | 생성자         | STRING |           |
|    | MODIFY_BY            | 수정자         | STRING |           |


#### ITEM_CD
> 품목 코드  

#### ITEM_NM
> 픔목이름  

#### ITEM_TP_CD
> 품목타입코드   
> `TB_CM_ITEM_TYPE` 테이블의 `ITEM_TP` 컬럼의 값이 됩니다.

#### UOM_CD
> UOM   
> `TB_CM_UOM` 테이블의 `UOM_CD` 컬럼의 값이 됩니다.

#### RTS
> 판매시작일자

#### EOS
> 판매종료일자

#### DESCRIP
> 설명

#### PARENT_ITEM_LV_CD
> 상위 품목 그룹 코드   
> BF/DP 모듈을 사용하신다면 필수항목입니다.   
> `TB_CM_ITEM_LEVEL_MGMT` 테이블의 `ITEM_LV_CD` 컬럼의 값이 됩니다.

#### MIN_ORDER_SIZE
> 최소주문크기

#### MAX_ORDER_SIZE
> 최대주문크기

#### MAX_ORDER_SIZE
> 최대주문크기

#### DISPLAY_COLOR
> 화면 표시색

#### GRADE_YN
> 등급산정대상 여부

#### GRADE_MODIFY_BY
> 등급산정대상 수정자

#### GRADE_MODIFY_DTTM
> 등급산정대상 수정일시

#### DEL_YN
> 삭제여부

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블
- TB_CM_ITEM_TYPE : 품목타입
- TB_CM_UOM : uom
