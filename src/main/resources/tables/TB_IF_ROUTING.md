### 개요
    대체 공정 모델이 필요한 경우 공정별 우선순위를 등록합니다.
    `TB_IF_ROUTING` 테이블에 저장 시 공정 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다.

### 관련 화면
- 데이터 통합 > 공급계획 > [공정](#/dataintegration/masterplan/routing)

### 작업 테이블 정보

- #### TB_IF_ROUTING

| 필수 | 물리명                                   | 논리명       | 형식      | 기본값        | 
|:--:|:--------------------------------------|:----------|:----------|:-------------:|
| O  | LOCAT_CD                              | 거점 코드     | STRING    |               |
| O  | ITEM_CD                               | 품목 코드     | STRING    |               |
| O  | ROUTE_CD                              | 공정 코드     | STRING    |               |
|    | ROUTE_DESCRIP                         | 공정 설명     | STRING    |               |
|    | ROUTE_SEQ                             | 공정 순서     | STRING    |               |
|    | BASE_ALLOC_RULE                       | 공정 할당 규칙  | STRING    |               |
|    | BASE_ALLOW_PRIORT                     | 할당 우선순위 값 | NUMBER    |               |
|    | BASE_ALLOC_PROPTN                     | 할당 비율 값   | NUMBER    |               |
|    | CREATE_BY                             | 생성자       | USER_ID   |               |
|    | CREATE_DTTM                           | 생성일시      | NOW       |               |
|    | MODIFY_BY                             | 수정자       | USER_ID   |               |
|    | MODIFY_DTTM                           | 수정일시      | NOW       |               |


#### LOCAT_CD
> 거점 코드  
> `거점` 화면의 `거점 코드`로 등록합니다.  
> SELECT LOCAT_CD FROM TB_CM_LOC_DTL

#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `자원 코드`로 등록합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST

#### ROUTE_CD
> 공정 코드

#### ROUTE_DESCRIP
> 공정 설명

#### ROUTE_SEQ
> 공정 순서

#### BASE_ALLOC_RULE
> 공정 할당 규칙  
> `PRIORITY` | `PROPORTION`

#### BASE_ALLOW_PRIORT
> 공정 할당 우선순위

#### BASE_ALLOC_PROPTN
> 공정 할당 비율

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시


### 연관 테이블

- TB_MP_ROUTE : 공정
- TB_MP_ROUTING : 공정 할당