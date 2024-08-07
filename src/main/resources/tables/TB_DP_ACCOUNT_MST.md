### 개요
    거래처를 등록합니다.
    주문의 필수 구성정보(품목, 거래처)입니다.

### 주의 사항
    데이터 삭제 시 연관 테이블과 하위 단계의 모든 데이터를 함께 삭제합니다.   
    거래처와 연관된 테이블은 많습니다. 삭제에 유의하세요

### 관련 화면
- 데이터 통합 > 수요 계획 > [거래처](#/dataintegration/demandplan/account) 

### 작업 테이블 정보

- #### TB_DP_ACCOUNT_MST


| 필수 | 물리명                                       | 논리명         | 형식     |    기본값    | 
|:--:|:------------------------------------------|:------------|:-------|:---------:|
| O  | ACCOUNT_CD                 | 거래처코드       | STRING |           |
| O  | ACCOUNT_NM                 | 거래처 이름      | STRING |           |
| O  | PARENT_SALES_LV_CD | 상위 판매 계층 코드 | STRING |           |
| O  | CURCY_CD               | 통화          | STRING |           |
|    | COUNTRY_CD                 | 국가코드        | STRING |           |
|    | CHANNEL_NM                | 채널          | STRING |           |
|    | INCOTERMS             | 인코텀스        | STRING |           |
|    | PRIORT                         | 우선순위        | NUMBER |           |
|    | LATITUDE                     | 위도          | NUMBER |           |
|    | LONGITUDE                   | 경도          | NUMBER |           |
|    | ACTV_YN                       | 사용여부        | STRING |           |
|    | DEL_YN                         | 삭제여부        | STRING |           |
|    | CREATE_BY                   | 생성자         | STRING |           |
|    | MODIFY_BY                   | 수정자         | STRING |           |

#### ACCOUNT_CD
> 거래처코드  

#### ACCOUNT_NM
> 거래처 이름  

#### PARENT_SALES_LV_CD
> 상위 판매계층 코드  
> BF/DP 모듈을 사용하신다면 필수항목입니다.   
> `TB_DP_SALES_LEVEL_MGMT` 테이블의 `SALES_LV_CD` 컬럼의 값이 됩니다.

#### CURCY_CD
> 통화   
> 환율을 적용될때 기준 항목입니다.     
> `TB_AD_COMN_CODE` 테이블의 `COMN_CD` 컬럼의 값이 됩니다.


#### COUNTRY_CD
> 국가코드   
> `TB_CM_COMM_CONFIG` 테이블의 `CONF_CD` 컬럼의 값이 됩니다.

#### CHANNEL_NM
> 채널명   
> `TB_CM_CHANNEL_TYPE` 테이블의 `CHANNEL_NM` 컬럼의 값이 됩니다.

#### INCOTERMS
> 인코텀스   
> `TB_CM_INCOTERMS` 테이블의 `INCOTERMS` 컬럼의 값이 됩니다.

#### LATITUDE
> 위도   
> 지도에 표시 위치 

#### LONGITUDE
> 경도   
> 지도에 표시 위치

#### PRIORT
> 우선순위

#### ACTV_YN
> 사용여부

#### DEL_YN
> 삭제여부

#### CREATE_BY
> 생성자  

#### MODIFY_BY
> 수정자  

### 연관 테이블
- TB_AD_COMN_CODE : 공용코드
- TB_CM_COMM_CONFIG : 일반환경설정
- TB_CM_CHANNEL_TYPE : 채널
- TB_CM_INCOTERMS : 인코텀스
