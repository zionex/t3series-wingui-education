### 개요
- 생산 공정에 필요한 자원(설비, 인력 등)의 명세를 정의합니다.

### 주의 사항
    삭제시 공정과 자원들 간의 관계가 없는 것으로 계획을 수립할 수 없습니다.

### 관련 화면
- 데이터 통합 > 생산 계획 > [BOR](#/dataintegration/factoryplan/bor)

### 작업 테이블 정보
- #### TB_FP_BOR


| 필수 | 물리명            | 논리명       | 형식     |    기본값    |
|:--:|:---------------|:----------|:-------|:---------:|
| O  | PLAN_SCOPE        | 계획 범위    | STRING | DEFAULT    |
| O  | ROUTE_CD        | 공정 코드    | STRING |           |
|    | RESOURCE_CD | 자원 코드     | STRING |           |
|    | ALT_RESOURCE_PRIORITY       | 대체 자원 사용 우선 순위 | NUMBER | 1          |
|    | EFFICIENCY        | 공정 효율    | NUMBER | 1          |
|    | QUEUE_TIME        | 작업 전 대기 시간    | NUMBER | 0          |
|    | SETUP_TIME        | 작업 준비 시간    | NUMBER | 0          |
|    | PROCESS_TIME        | 작업 시간    | NUMBER | 0          |
|    | WAIT_TIME        | 작업 후 대기 시간    | NUMBER | 0          |
|    | MOVE_TIME        | 작업 후 이동 시간    | NUMBER | 0         |
|    | TRANSFER_BATCH_TIME        | 트랜스퍼 배치 시간    | NUMBER | 0          |
|    | STD_PROCESS_TIME        | 표준 작업 시간    | NUMBER | 0          |
|    | TIME_UOM        | 시간 측정 단위    | STRING |           |
|    | PROCESS_TIME_TP_CD        | 작업 시간 적용 유형    | STRING | N          |
|    | LOT_SIZE_MIN        | 최소 로트 크기    | NUMBER | 0          |
|    | LOT_SIZE_MAX        | 최대 로트 크기    | NUMBER | 0          |
|    | LOT_SIZE_MULTIPLR        | 배수 로트 크기    | NUMBER | 0          |
|    | DIVIDE_TP_CD        | 작업 분할 유형    | STRING |           |
|    | DESC_TXT        | 부연 설명    | STRING |           |

#### ROUTE_CD
> 공정 코드  
> `TB_FP_ROUTE` 테이블의 `ROUTE_CD`

#### RESOURCE_CD
> 자원 코드
> `TB_FP_RESOURCE` 테이블의 `RESOURCE_CD`

#### ALT_RESOURCE_PRIORITY `OBP`
> 대체 자원의 경우 사용 우선 순위

#### EFFICIENCY
> 공정의 효율 (0보다 큰 값)

#### QUEUE_TIME
> 작업 전 대기 시간 - 수동 진행되는 작업으로 ***휴일 구간에서는 진행 안됨***

#### SETUP_TIME
> 작업 준비 시간 - 자동 진행되는 작업으로 ***휴일 구간에서도 진행됨***

#### PROCESS_TIME
> 공정 작업 시간

#### WAIT_TIME
> 작업 후 대기 시간 - 자동 진행되는 작업으로 ***휴일 구간에서도 진행됨***

#### MOVE_TIME
> 작업 후 이동 시간 - 수동 진행되는 작업으로 ***휴일 구간에서는 진행 안됨***

#### TRANSFER_BATCH_TIME
> Transfer Batch Time

#### STD_PROCESS_TIME
> 표준 프로세스 타임 (수량과 상관없이 적용되는 Process Time을 설정)

#### TIME_UOM
> Time-Bucket 시간 단위
> - SECOND
> - MINUTE
> - HOUR
> - DAY
> - WEEK
> - MONTH

#### PROCESS_TIME_TP_CD
> 계산된 프로세스 타임이 표준 프로세스 타임과 차이가 나는 경우 어떻게 동작할지를 결정
> - M : More (계산된 프로세스 타임이 표준 프로세스 타임보다 클 경우 표준 프로세스 타임을 적용)
> - L : Less (계산된 프로세스 타임이 표준 프로세스 타임보다 작을 경우 표준 프로세스 타임을 적용)
> - U : Use Standard Only (계산된 프로세스 타임과 관계 없이 항상 표준 프로세스 타임을 적용)
> - N : Not Use Standard (표준프로세스 타임을 무시하고 항상 계산된 프로세스 타임을 적용)

#### LOT_SIZE_MIN `OBP`
> BOR 별 최소 로트 크기
> - 수량이 MAX_LOT_SIZE 보다 작고 MIN_LOT_SIZE 보다 작다면 MIN_LOT_SIZE를 적용한다.
>   - LOT_SIZE_MAX 보다 큰 값을 가질 수 없다.
>   - 0 이면 LOT_SIZE_MIN이 설정 되지 않은 경우와 같다.
>   - Stock Projection WorkOrder에는 적용되지 않는다.

#### LOT_SIZE_MAX `OBP`
> BOR 별 최대 로트 크기
> - 품목의 WO_LOT_SIZE_MAX 보다 우선 한다.
> - 0이면 LOT_SIZ_MAX가 설정 되지 않은 경우와 같다.
> - Stock Projection WorkOrder에는 적용되지 않는다.

#### LOT_SIZE_MULTIPLR `OBP`
> BOR 별 배수 로트 크기
> - 생산 가능 배수
> - 0이면 LOT_SIZE_MULTIPLR가 설정 되지 않은 경우와 같다.

#### DIVIDE_TP_CD
> 작업(Activity)를 휴일 구간에 Overlapping 할 것인지 여부 결정
> - Y : 휴일 구간 전후로 연속 작업 (휴일 구간을 점유는 하지만 작업 상태는 아님)
> - N :  휴일 구간 작업 불가
> - I : 휴일 구간에서 종료만 가능
> > I Type은 휴일 시작 시간과 동시에 작업을 시작할 수 있음

#### DESC_TXT
> 부연 설명
