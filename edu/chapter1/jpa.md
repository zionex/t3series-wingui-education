## JPA (Java Persistence API)

### 개요

Java에서 관계형 데이터베이스를 쉽게 다룰 수 있게 해주는 ORM 기반 API입니다.

### 주요 특징

- **ORM 지원**  
  객체 지향적인 방식으로 데이터베이스 테이블과 매핑할 수 있습니다.
- **데이터베이스 독립성**  
  SQL 쿼리를 직접 작성하지 않고도 다양한 DBMS에 대응할 수 있습니다.
- **트랜잭션 관리**  
  트랜잭션 처리 기능이 내장되어 있어 안정적인 데이터 처리에 유리합니다.
- **JPQL 지원**  
  객체를 대상으로 한 질의 언어인 JPQL(Java Persistence Query Language)을 지원합니다.

### 표준 기능 위주의 사용 정책

현재 프로젝트에서는 JPA의 **표준 기능만을 제한적으로 사용**하고 있습니다. 그 이유는 다음과 같습니다:

- JPA는 **도메인 모델 설계가 매우 중요**하며, 초기에 이를 잘못 설계하면 전체 구조 변경이 어려워집니다.
- 현장에서는 다양한 화면 요구사항이 빈번하게 변경되거나 예외적인 데이터 처리 로직이 많아, 정형화된 JPA 방식보다는 유연한 SQL 기반 접근이 더 현실적인 경우가 많습니다.
- 따라서 **솔루션 표준 기능 에는 JPA를 활용**하지만, 현장에서는 SP 중심으로 사용하고 있습니다. 

### 간단한 예시

```java
@Entity
public class User {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String email;
    // getters/setters
}
```

```java
EntityManager em = emf.createEntityManager();
em.getTransaction().begin();
User user = new User();
user.setName("John");
user.setEmail("john@example.com");
em.persist(user);
em.getTransaction().commit();
```
