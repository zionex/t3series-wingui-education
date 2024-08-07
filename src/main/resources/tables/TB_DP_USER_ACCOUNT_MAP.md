### 개요
    사용자별 관리 거래처 정보를 등록합니다.
    각 사용자가 로그인해서 Demand 요청시 여기에 설정된 거래처와 사용자별 관리 품목정보에 설정된 품목정보의 전체 조합 정보만 관리가 가능합니다. 

### 주의 사항
    사용자별 관리 품목정보와 함께 설정되어야 합니다.
    거래처와 판매계층을 선택적으로 설정이 가능합니다.

### 관련 화면
- 데이터 통합 > 수요 계획 > [사용자 레벨 관계](#/dataintegration/demandplan/userlevelmap)   

### 작업 테이블 정보
- #### TB_DP_USER_ACCOUNT_MAP


| 필수 | 물리명                                   | 논리명     | 형식     |    기본값    | 
|:--:|:--------------------------------------|:--------|:-------|:---------:|
| O  | AUTH_TP_CD    | 권한유형    | STRING |           |
| O  | USER_ID    | 사용자아이디  | STRING |           |
| O  | SALES_LV_MGMT_CD | 판매레벨코드  | STRING |           |
| O  | SALES_LV_CD                | 판매레벨 코드 | STRING |           |
| O  | ACCOUNT_CD| 거래처코드   | STRING |           |
| O  | ACTV_YN | 사용여부    | STRING |           |
|    | CREATE_BY                  | 생성자     | STRING |           |
|    | MODIFY_BY                 | 수정자     | STRING |           |


#### AUTH_TP_CD
> 권한유형   
> `TB_DP_CONTROL_BOARD_MST` 테이블의 `LV_MGMT_ID` 컬럼의 값이 됩니다.   
> `TB_CM_LEVEL_MGMT` 테이블의 `LV_CD` 컬럼의 값이 됩니다.    

#### USER_ID
> 사용자 ID    
> `TB_AD_USER` 테이블의 `USERNAME` 컬럼의 값이 됩니다.

#### SALES_LV_MGMT_CD
> 레벨 중 판매레벨   
> `TB_CM_LEVEL_MGMT` 테이블의 `LV_CD` 컬럼의 값이 됩니다.


#### ACCOUNT_CD
> 거래처코드     
> `TB_DP_ACCOUNT_MST` 테이블의 `ACCOUNT_CD` 컬럼의 값이 됩니다.

#### SALES_LV_CD
> 품목 코드    
> `TB_CM_ITEM_MST` 테이블의 `ITEM_CD` 컬럼의 값이 됩니다.

#### ACTV_YN
> 사용여부 


#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블

- TB_DP_SALES_LEVEL_MGMT : 거래처 계층
- TB_DP_ACCOUNT_MST : 거래처
- TB_CM_LEVEL_MGMT : 레벨
- TB_DP_CONTROL_BOARD_MST : 레벨
