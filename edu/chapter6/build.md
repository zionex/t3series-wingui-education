## Web Application Build

Visual Studio Code(이하 VS Code) 개발 툴을 기준으로 설명합니다.

모든 작업에 앞서, 최신의 source를 유지해야 합니다.

- mvnw command 가 없다면 maven 을 PC에 별도로 설치해야합니다. [다운로드링크](https://maven.apache.org/download.cgi)
### Build 절차
1. **VS Code의 Terminal 열기**
   
2. **명령어 입력**
```sh
   .\mvnw clean package
```
2. **배포 환경 별 Profile 적용**
- 배포 환경 별로 application.yaml을 작성해놨다가 빌드 시 원하는 환경의 profile로 설정하여 빌드할 수 있습니다.
- 프로파일 설정을 하지 않고 빌드 시 기본 local 폴더의 profile이 포함되어 빌드가 되며 “-P 배포환경 ID” 명령어로 설정 가능합니다.

| 환경   | 파일 경로                     | profile ID | 명령어                          |
| ------ | ----------------------------- | ---------- | ------------------------------- |
| 로컬   | local > application.yaml      | local      | .\mvnw clean package            |
| 개발   | develop > application.yaml    | dev        | .\mvnw clean package -P dev     |
| 운영   | production > application.yaml | prod       | .\mvnw clean package -P prod    |

- 예시) 운영 환경에 배포할 profile로 적용하고 싶을 경우, 아래 명령어로 실행 


```
.\mvnw clean package -P prod
```

4. **WAR(Web application ARchive) 파일 생성 확인**  
  - target 폴더 하위에 `T3series-wingui-버전.war` 파일이 생성되어야 합니다.