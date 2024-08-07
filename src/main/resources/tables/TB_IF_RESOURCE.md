### 개요
    생산 거점의 자원 정보를 등록합니다.
    `TB_IF_RESOURCE` 테이블에 저장 시 자원 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다.

### 관련 화면
- 데이터 통합 > 공급계획 > [자원](#/dataintegration/masterplan/resource)

### 작업 테이블 정보

- #### TB_IF_RESOURCE

| 필수 | 물리명                           | 논리명         | 형식      | 기본값        | 
|:--:|:------------------------------|:------------|:----------|:-------------:|
| O  | LOCAT_CD                      | 거점 코드       | STRING    |               |
| O  | RES_CD                        | 자원 코드       | STRING    |               |
|    | RES_NM                        | 자원 설명       | STRING    |               |
| O  | RES_GRP_CD                    | 자원 그룹 코드    | STRING    |               |
|    | RES_GRP_NM                    | 자원 그룹 설명    | STRING    |               |
| O  | CAPA_VAL                      | 자원 능력       | NUMBER    |               |
|    | OVER_CAPA_VAL                 | 추가 자원 능력    | NUMBER    |               |
| O  | EFFICY_VAL                    | 작업 효율       | NUMBER    |               |
|    | CREATE_BY                     | 생성자         | USER_ID   |               |
|    | CREATE_DTTM                   | 생성일시        | NOW       |               |
|    | MODIFY_BY                     | 수정자         | USER_ID   |               |
|    | MODIFY_DTTM                   | 수정일시        | NOW       |               |


#### LOCAT_CD
> 거점 코드</br>
> `거점` 화면의 `거점 코드`로 입력합니다.</br>
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### RES_CD
> 자원 코드

#### RES_NM
> 자원 설명

#### RES_GRP_CD
> 자원 그룹 코드
> 자원 그룹이 없는 경우 자원 코드와 동일하게 입력합니다.

#### RES_GRP_NM
> 자원 그룹 설명

#### CAPA_VAL
> 자원 능력

#### OVER_CAPA_VAL
> 추가 자원 능력

#### EFFICY_VAL
> 작업 효율
> 단위 : %

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시


### 연관 테이블

- TB_CM_RES_GROUP : 자원 그룹
- TB_MP_RES_MGMT_MST : 자원 관리 Master
- TB_MP_RES_MGMT_DTL : 자원 관리 Detail