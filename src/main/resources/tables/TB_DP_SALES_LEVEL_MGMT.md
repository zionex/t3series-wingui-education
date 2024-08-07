### 개요
    판매 계층을  등록합니다.

### 주의 사항
    BF/DP 모듈을 사용하신다면 필수로 데이타를 구성하셔야 합니다.
    레벨이 구성된 이후에 데이터 생성이 가능합니다.
    여기에 등록된 최하단 계층의 정보가 거래처의 PARENT_SALES_LV_ID 와 연결됩니다.

### 관련 화면
- 데이터 통합 > 수요 계획 > [판매 계층](#/dataintegration/demandplan/saleshierarchy)

### 작업 테이블 정보

- #### TB_DP_SALES_LEVEL_MGMT


| 필수 | 물리명                                   | 논리명       | 형식     |    기본값    | 
|:--:|:--------------------------------------|:----------|:-------|:---------:|
| O  | SALES_LV_CD | 판매레벨코드    | STRING |           |
| O  | SALES_LV_NM                   | 판매레벨미름    | STRING |           |
| O  | SALES_LV_MGMT_CD                  | 레벨        | STRING |           |
| O  | PARENT_SALES_LV_CD                   | 상위 판매레벨코드 | STRING |           |
| O  | SEQ                   | 순서        | NUMBER |           |
| O  | VIRTUAL_YN                   | 승인여부      | STRING |           |
| O  | ACTV_YN                  | 사용여부      | STRING |           |
| O  | DEL_YN                   | 삭제여부      | STRING |           |
|    | CREATE_BY                  | 생성자       | STRING |           |
|    | MODIFY_BY                   | 수정자       | STRING |           |

#### SALES_LV_CD
> 품목레벨코드

#### SALES_LV_NM
> 품목레벨이름

#### SALES_LV_MGMT_CD
> 레벨 중 판매레벨   
> `TB_CM_LEVEL_MGMT` 테이블의 `LV_CD` 컬럼의 값이 됩니다.

#### PARENT_SALES_LV_CD
> 상위 품목 레벨 코드   
> `TB_CM_ITEM_LEVEL_MGMT` 테이블의 `ITEM_LV_CD` 컬럼의 값이 됩니다.

#### SEQ
> 화면 표시 순서

#### SEQ
> 화면 표시 순서

#### VIRTUAL_YN
> 가상 여부 : 승인레벨에서 제외 여부

#### DEL_YN
> 삭제여부

#### CREATE_BY
> 생성자

#### MODIFY_BY
> 수정자


### 연관 테이블

- TB_CM_LEVEL_MGMT : 레벨
