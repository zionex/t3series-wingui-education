### 개요
    품목 계층을  등록합니다.

### 주의 사항
    BF/DP 모듈을 사용하신다면 필수로 데이타를 구성하셔야 합니다.
    레벨이 구성된 이후에 데이터 생성이 가능합니다.
    여기에 등록된 최하단 계층의 정보가 품목의 PARENT_ITEM_LV_ID 와 연결됩니다.
    

### 관련 화면
- 데이터 통합 > 수요 계획 > [품목 계층](#/dataintegration/demandplan/itemhierarchy)  

### 작업 테이블 정보

- #### TB_CM_ITEM_LEVEL_MGMT


| 필수 | 물리명                                   | 논리명      | 형식     |    기본값    | 
|:--:|:--------------------------------------|:---------|:-------|:---------:|
| O  | ITEM_LV_CD | 품목레벨코드   | STRING |           |
| O  | ITEM_LV_NM                   | 품목레벨이름   | STRING |           |
| O  | ITEM_LV_MGMT_CD                   | 레벨       | STRING   |           |
| O  | PARENT_ITEM_LV_CD                   | 상위품목레벨코드 | STRING |           |
| O  | SEQ                   | 순서       | NUMBER |           |
| O  | ACTV_YN                   | 사용여부     | STRING |           |
| O  | DEL_YN                   | 삭제여부     | STRING |           |
|    | CREATE_BY                   | 생성자      | STRING |           |
|    | MODIFY_BY                   | 수정자      | STRING |           |

#### ITEM_LV_CD
> 품목레벨코드  

#### ITEM_LV_NM
> 품목레벨이름  

#### ITEM_LV_MGMT_CD
> 레벨 중 품목레벨   
> `TB_CM_LEVEL_MGMT` 테이블의 `LV_CD` 컬럼의 값이 됩니다.

#### PARENT_ITEM_LV_CD
> 상위 품목 레벨 코드   
> `TB_CM_ITEM_LEVEL_MGMT` 테이블의 `ITEM_LV_CD` 컬럼의 값이 됩니다.

#### SEQ
> 화면 표시 순서

#### ACTV_YN
> 사용여부

#### DEL_YN
> 삭제여부

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_CM_LEVEL_MGMT : 레벨
