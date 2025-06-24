## Zustand

### 개요

간단하고 가벼운 상태 관리 라이브러리로, 전역 상태 관리를 쉽게 구현할 수 있습니다. Redux에 비해 설정이 간편하고 코드가 적습니다.

### 특징

- **간단한 API**  
  최소한의 코드로 상태 관리 구현 가능
- **서버 사이드 렌더링 지원**  
  Next.js와 같은 프레임워크와 잘 동작
- **미들웨어 지원**  
  로깅, 디버깅, 비동기 로직 등 상태 관리 로직 확장 가능

### Context API vs Zustand

React의 `Context API`는 소규모 프로젝트나 상태 공유 범위가 제한적일 때는 유용하지만, 다음과 같은 상황에서 설계와 유지 관리가 복잡해질 수 있습니다:

- 상태 공유 범위가 넓어지면서 Context가 중첩되거나 계층이 깊어짐
- 컴포넌트 간 Props Drilling이 많아져서 로직이 분산되고 관리 포인트가 증가
- 상태 변경이 자주 일어나는 컴포넌트가 많을 경우 리렌더링 이슈 발생

이런 경우 `Zustand`는 다음과 같은 장점으로 대안이 될 수 있습니다:

- 전역 상태를 간결하게 정의하고 필요할 때만 구독하여 리렌더링 최소화
- 중첩된 Context 없이도 여러 컴포넌트에서 상태 공유 가능
- 커스텀 훅 기반이라 기존 React 구조와 자연스럽게 통합 가능
- Redux나 Recoil 대비 러닝 커브가 낮고 설정이 간단

### 실무에서 Zustand가 적합한 경우

- 화면 단위가 복잡하지 않으면서 전역 상태가 필요한 경우 (예: 모달 관리, 사용자 정보, 테마 설정 등)
- Context API로 관리하기에 컴포넌트 구조가 너무 깊거나 props 전달이 과도한 경우
- Redux를 도입하기엔 과한 경우, 가볍게 상태 관리를 도입하고 싶은 프로젝트
- 빠른 개발 속도가 필요한 프로토타입, 내부 도구 UI 등

### 사용 예시

```javascript
import create from 'zustand';

const useStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}));

function Counter() {
  const { count, increment } = useStore();
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```
