### 개요
    거점 정보를 인터페이스 하여 IM/RP/MP 거점 정보를 일괄로 등록합니다.  
    `TB_IF_SITE` 테이블에 저장 시 거점 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    이 데이터를 생성하기 전에 반드시 일반 설정 화면의 `공급망 모델 - 거점 유형/레벨`을 먼저 설정하셔야 합니다.  
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 
    LGCY_PLANT_CD 컬럼은 생산 거점에서는 필수 값입니다. 생산 BOM 생성 시 동일 공장의 거점으로만 연결하기 위해 사용합니다.

### 관련 화면
- 데이터 통합 > 공급망 네트워크 > 일반 설정 > [일반 설정](#/dataintegration/network/generalconfig)
- 데이터 통합 > 공급망 네트워크 > [거점](#/dataintegration/network/site)

### 작업 테이블 정보

- #### TB_IF_SITE

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | LOCAT_CD                                         | 거점 코드                | STRING    |               |
| O  | LOCAT_NM                                         | 거점 명                  | STRING    |               |
| O  | LOCAT_TP_NM                                      | 거점 유형 명             | STRING    |               |
| O  | LOCAT_LV                                         | 거점 레벨                | NUMBER    |               |
|    | LGCY_PLANT_CD                                    | 레거시 공장 코드          | STRING    |               |
| O  | REGION_CD                                        | 지역 코드                | STRING    |               |
| O  | COUNTRY_CD                                       | 국가 코드                | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### LOCAT_CD
> 거점 코드  

#### LOCAT_NM
> 거점 명  

#### LOCAT_TP_NM
> 거점 유형 명  
> `TB_AD_COMN_GRP` 테이블의 그룹 코드는 `LOC_TP` 인 `TB_AD_COMN_CODE` 테이블의 `COMN_CD_NM` 컬럼의 값입니다.  
> 데이터 예시 입니다. (ex : SFG | FG | CDC | RDC | ACCOUNT | SALES)  
> SELECT A.COMN_CD_NM FROM TB_AD_COMN_CODE A, TB_AD_COMN_GRP B WHERE B.ID = A.SRC_ID AND B.GRP_CD = 'LOC_TP'  

#### LOCAT_LV
> 거점 레벨  
> 데이터 예시 입니다. (ex : 1 | 2)  
> SELECT B.COMN_CD_NM, A.LOCAT_LV FROM TB_CM_LOC_MST A, TB_AD_COMN_CODE B WHERE A.LOCAT_TP_ID = B.ID  

#### LGCY_PLANT_CD
> 레거시 공장 코드  
> 생산 거점에서는 필수값입니다. 생산 BOM 생성 시 동일 공장의 거점으로만 연결하기 위해 사용합니다.

#### REGION_CD
> 지역 코드  
> `TB_CM_CONFIGURATION` 테이블의 CONF_NM는 `CM_REGION` 인 `TB_CM_COMM_CONFIG` 테이블의 `CONF_CD` 컬럼의 값입니다.    
> 데이터 예시 입니다. (ex : ASIA | EUROPE | NORTH_AMERICA)  
> SELECT A.CONF_CD FROM TB_CM_COMM_CONFIG A, TB_CM_CONFIGURATION B WHERE B.ID = A.CONF_ID AND B.CONF_NM = 'CM_REGION'

#### COUNTRY_CD
> 국가 코드  
> `TB_CM_CONFIGURATION` 테이블의 CONF_NM는 `CM_COUNTRY` 인 `TB_CM_COMM_CONFIG` 테이블의 `CONF_CD` 컬럼의 값입니다.    
> 데이터 예시 입니다. (ex : KR | HK)  
> SELECT A.CONF_CD, A.CONF_NM FROM TB_CM_COMM_CONFIG A, TB_CM_CONFIGURATION B WHERE B.ID = A.CONF_ID AND B.CONF_NM = 'CM_COUNTRY'

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_LOC_DTL : 거점
- TB_CM_LOC_MGMT : 거점 관리