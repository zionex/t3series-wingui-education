### 개요
    사용자별 관리 품목-거래처 정보를 등록합니다.
    각 사용자가 로그인해서 Demand 요청시 여기에 설정된 관리 Demand만 관리가 가능합니다. 

### 주의 사항
    사용자별 관리 주문정보관리는 품목-거래처 로 관리할 수도 있고
    사용자-품목, 사용자-거래처로 나눠서 할 수 도 있습니다.
    사용자 관리 관계데이타는 반드시 필수 데이터이지만 
    두가지 관계 정보중 한가지를 선택해서 사용할 수 있으므로 이 테이블이 항상 필수는 아닙니다.

### 관련 화면
- 데이터 통합 > 수요 계획 > [사용자 품목-거래처 관계](#/dataintegration/demandplan/useritemaccountmap)

### 작업 테이블 정보

- #### TB_DP_USER_ITEM_ACCOUNT_MAP


| 필수 | 물리명                                   | 논리명    | 형식     |    기본값    | 
|:--:|:--------------------------------------|:-------|:-------|:---------:|
| O  | AUTH_TP_CD     | 권한유형   | STRING |           |
| O  | USER_ID     | 사용자아이디 | STRING |           |
| O  | ACCOUNT_CD | 거래처코드  | STRING |           |
| O  | ITEM_CD                | 품목 코드  | STRING |           |
|    | CREATE_BY                  | 생성자    | STRING |           |
|    | MODIFY_BY                  | 수정자    | STRING |           |


#### AUTH_TP_CD
> 권한유형   
> `TB_DP_CONTROL_BOARD_MST` 테이블의 `LV_MGMT_ID` 컬럼의 값이 됩니다.   
> `TB_CM_LEVEL_MGMT` 테이블의 `LV_CD` 컬럼의 값이 됩니다.  

#### USER_ID
> 사용자 ID    
> `TB_AD_USER` 테이블의 `USERNAME` 컬럼의 값이 됩니다.

#### ACCOUNT_CD
> 거래처코드    
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.


#### ITEM_CD
> 품목 코드    
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.  

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  


### 연관 테이블

- TB_CM_ITEM_MST : 품목
- TB_DP_ACCOUNT_MST : 거래처
- TB_CM_LEVEL_MGMT : 레벨
- TB_DP_CONTROL_BOARD_MST : 레벨
