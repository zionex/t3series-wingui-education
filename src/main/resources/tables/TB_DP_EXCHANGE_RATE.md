### 개요
    환율을  등록합니다.

### 주의 사항
  금액을 계산할 때 환율정보를 반영할 때만 필요합니다. 환율반영이 필요없다면 데이타 구성은 필요없습니다.   
  거래처의 currency 정보를 기준으로 계산이 됩니다.   
  환율이 변경되는 날짜를 기준으로 데이타를 관리하면 해당 버킷에서 가장 가까운 앞 날짜를 찾아서 반영하게 됩니다.    
  KRW - USD/ USD - KRW 양방향으로 데이타를 넣어주셔야 전체 KRW 또는 전체 USD로 계산이 가능합니다.   

### 관련 화면
- 데이터 통합 > 수요 계획 > [환율](#/dataintegration/demandplan/exchangerate) 

### 작업 테이블 정보

- #### TB_DP_EXCHANGE_RATE


| 필수 | 물리명                                   | 논리명   | 형식     |    기본값    | 
|:--:|:--------------------------------------|:------|:-------|:---------:|
| O  | CURCY_TP_CD | 통화타입  | STRING |           |
| O  | FROM_CURCY_CD                  | 통화 코드 | STRING |           |
| O  | TO_CURCY_CD                   | 통화코드  | STRING |           |
| O  | BASE_DATE                  | 기준날짜  | DATE   |           |
| O  | EXCHANGE_RATE                   | 환율    | NUMBER |           |
|    | CREATE_BY                   | 생성자   | STRING |           |
|    | MODIFY_BY                  | 수정자   | STRING |           |

#### CURCY_TP_CD
> 통화타입     
> `TB_CM_COMM_CONFIG` 테이블의 `CONF_CD` 컬럼의 값이 됩니다.   
   'TYPE1'을 기본으로 넣어주시면 됩니다.

#### FROM_CURCY_CD
> CURCY_CD     
> `TB_AD_COMN_CODE` 테이블의 `COMN_CD` 컬럼의 값이 됩니다.     

#### TO_CURCY_CD
> CURCY_CD     
> `TB_AD_COMN_CODE` 테이블의 `COMN_CD` 컬럼의 값이 됩니다.  

#### BASE_DATE
> 기준날짜

#### EXCHANGE_RATE
> 환율

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  


### 연관 테이블

- TB_AD_COMN_CODE : 공통코드
- TB_CM_COMM_CONFIG : 일반환경설정 
