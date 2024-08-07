### 개요
    거점-품목의 자재 제약 정보를 인터페이스 하여 MP 거점-품목의 자재 제약 정보를 일괄로 등록합니다.
    `TB_IF_MTRL_CONST` 테이블에 저장 시 자재 제약 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다. 

### 관련 화면
- 데이터 통합 > 공급계획 > [자재 제약](#/dataintegration/masterplan/materialconstraint)

### 작업 테이블 정보

- #### TB_IF_MTRL_CONST

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | LOCAT_CD                                         | 거점 코드                | STRING    |               |
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
| O  | KEY_MAT_YN                                       | KEY 자재 여부            | STRING    | N             |
|    | LGDY_MAT_YN                                      | 장납기 자재 여부          | STRING    | N             |
|    | MAT_CONST_TP_CD                                  | 자재 제약 타입 코드       | STRING    |               |
|    | CONST_TP_CHNG_PERIOD                             | 자재 제약 변경 구간       | NUMBER    |               |
|    | UOM_CD                                           | 시간 단위                | STRING    |               |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 입력합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### KEY_MAT_YN
> KEY 자재 여부

#### LGDY_MAT_YN
> 장납기 자재 여부

#### MAT_CONST_TP_CD
> 자재 제약 타입 코드  
> SELECT CONF_CD FROM TB_CM_COMM_CONFIG A, TB_CM_CONFIGURATION B WHERE A.CONF_ID = B.ID AND B.CONF_NM = 'MP_BASE_MAT_CONST_TP'

#### CONST_TP_CHNG_PERIOD
> 자재 제약 변경 구간

#### UOM_CD
> 시간 단위  
> SELECT UOM_CD FROM TB_CM_UOM WHERE BASE_PLAN_UOM_YN = 'Y'

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_SITE_ITEM : 거점-품목