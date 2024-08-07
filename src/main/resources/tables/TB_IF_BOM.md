### 개요
    생산 BOM 정보를 인터페이스 하여 IM/RP/MP 글로벌 생산 BOM 정보를 일괄로 등록합니다.
    다음 단계인 `거점 품목` 진행 시 글로벌 생산 BOM 화면의 데이터를 일괄 생성 합니다.

### 주의 사항
    테이블 삭제시 관련 테이블 및 하위 단계의 테이블은 모두 초기화 됩니다.

### 관련 화면
- 데이터 통합 > 공급망 네트워크 > [글로벌 생산 BOM](#/dataintegration/network/productionbom)

### 작업 테이블 정보

- #### TB_IF_BOM

| 필수 | 물리명                                          | 논리명                   | 형식      | 기본값        | 
|:--:|:-------------------------------------------------|:------------------------|:----------|:-------------:|
| O  | ITEM_CD                                          | 품목 코드                | STRING    |               |
| O  | BOM_LV                                           | BOM 레벨                 | NUMBER    |               |
| O  | BASE_QTY                                         | 완성수량                 | NUMBER    |               |
| O  | BASE_YIELD                                       | 수율                     | NUMBER    | 100           |
| O  | CPNT_CD                                          | 구성 품목 코드            | STRING    |               |
| O  | BOM_VER_ID                                       | BOM 버전 ID              | STRING    |               |
| O  | VER_ACTV_YN                                      | 버전 활성화 여부          | STRING    | Y             |
| O  | BASE_BOM_YN                                      | 기본 BOM 여부            | STRING    | Y             |
| O  | CPNT_QTY                                         | 소요량                   | NUMBER    |               |
| O  | CPNT_BOM_RATE                                    | 소요 비율                | STRING    | 1             |
|    | CREATE_BY                                        | 생성자                   | USER_ID   |               |
|    | CREATE_DTTM                                      | 생성일시                 | NOW       |               |
|    | MODIFY_BY                                        | 수정자                   | USER_ID   |               |
|    | MODIFY_DTTM                                      | 수정일시                 | NOW       |               |


#### ITEM_CD
> 품목 코드  
> `품목` 화면의 `품목 코드`로 입력합니다.  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST  

#### BOM_LV
> BOM 레벨

#### BASE_QTY
> 완성수량

#### BASE_YIELD
> 수율

#### CPNT_CD
> 구성 품목 코드  
> SELECT ITEM_CD FROM TB_CM_ITEM_MST

#### BOM_VER_ID
> BOM 버전 ID

#### VER_ACTV_YN
> 버전 활성화 여부

#### BASE_BOM_YN
> 기본 BOM 여부

#### CPNT_QTY
> 소요량

#### CPNT_BOM_RATE
> 소요 비율

#### CREATE_BY
> 생성자

#### CREATE_DTTM
> 생성일

#### MODIFY_BY
> 수정자

#### MODIFY_DTTM
> 수정일시

### 연관 테이블

- TB_CM_GLOBAL_BOM_MST : 글로벌 생산 BOM Master
- TB_CM_GLOBAL_BOM_DTL : 글로벌 생산 BOM Detail
