
## React

### 개요

Facebook에서 개발한 오픈 소스 JavaScript 라이브러리로, 사용자 인터페이스(UI)를 구축할 때 사용됩니다. React는 **컴포넌트 기반 아키텍처**를 제공하여 UI를 작은 단위로 나누고 재사용할 수 있게 해 줍니다.

### 기존 UI 개발과의 차이점

1. **컴포넌트 기반 아키텍처**\
   UI를 독립적이고 재사용 가능한 컴포넌트로 분할하여 관리할 수 있어 유지보수가 쉬움.

2. **Virtual DOM**\
   변경된 내용을 실제 DOM에 적용하기 전, 메모리 상의 가상 DOM에서 먼저 처리하여 변경이 필요한 최소한의 부분만 실제 DOM에 적용 → 성능 향상.

3. **단방향 데이터 흐름**\
   데이터는 부모 → 자식 방향으로 흐르며, 예측 가능성이 높고 디버깅이 쉬움.

### React Hook

React 16.8부터 도입된 기능으로, **함수형 컴포넌트에서도 상태 관리나 생명주기 관련 기능**을 사용할 수 있게 해줍니다. 이전에는 이러한 기능을 클래스형 컴포넌트에서만 사용할 수 있었지만, Hook을 사용하면 더 간단한 함수형 컴포넌트로도 강력한 기능을 구현할 수 있습니다.

#### 🔧 주요 Hook 소개 및 쉬운 예시

---

1. **useState – 상태(state) 관리**

컴포넌트 안에서 값을 저장하고 변경할 수 있는 상태를 선언할 때 사용합니다.

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // count는 현재 값, setCount는 값 변경 함수

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

📌 상태값이 변경되면 컴포넌트는 다시 렌더링됩니다.

---

2. **useEffect – 부수 효과(side effect) 처리**

API 호출, 구독 설정, 타이머 등록 등 컴포넌트 외부와 상호작용하는 작업을 처리할 때 사용합니다.

```javascript
import { useEffect } from 'react';

function Example() {
  useEffect(() => {
    console.log('컴포넌트가 마운트되었습니다!');

    return () => {
      console.log('컴포넌트가 언마운트됩니다.');
    };
  }, []); // 빈 배열이면 컴포넌트 처음 렌더링될 때만 실행

  return <div>Hello, World!</div>;
}
```

📌 두 번째 인자인 배열(`[]`)에 따라 실행 시점이 달라집니다. 의존성 값이 변경될 때만 실행되도록 설정할 수 있습니다.

---

3. **useCallback – 함수 재생성 방지**

컴포넌트가 다시 렌더링될 때 함수를 새로 만들지 않고 메모이제이션하여 성능을 최적화합니다.

```javascript
import { useCallback, useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('클릭!', count);
  }, [count]); // count가 바뀔 때만 함수가 새로 생성됨

  return <button onClick={handleClick}>Click Me</button>;
}
```

📌 `useCallback`은 주로 자식 컴포넌트에 콜백을 넘길 때 유용합니다. 자식 컴포넌트가 불필요하게 렌더링되는 것을 방지할 수 있습니다.

---

4. **useMemo – 값 재계산 방지**

값 계산에 시간이 오래 걸리는 작업을 반복하지 않도록 결과를 메모이제이션하여 성능을 개선합니다.

```javascript
import { useMemo, useState } from 'react';

function ExpensiveComponent({ input }) {
  const result = useMemo(() => {
    console.log('무거운 계산 실행 중...');
    return input * 1000;
  }, [input]);

  return <p>결과: {result}</p>;
}
```

📌 `useMemo`는 특정 값이 바뀔 때만 계산이 수행되도록 하여 렌더링 성능을 향상시킵니다.

---

### 🔍 정리

| Hook 이름       | 기능 요약                 |
| ------------- | --------------------- |
| `useState`    | 컴포넌트 내부 상태 관리         |
| `useEffect`   | 부수 효과(예: 데이터 가져오기) 처리 |
| `useCallback` | 함수 재생성 방지 (성능 최적화)    |
| `useMemo`     | 계산 결과 메모이제이션 (성능 최적화) |

이러한 Hook들을 조합해서 React 컴포넌트를 더 간결하고 효율적으로 만들 수 있습니다.


### React Context API

#### 개요

React의 전역 상태 관리 도구로, **props를 일일이 전달하지 않아도 컴포넌트 트리 전체에서 데이터를 공유**할 수 있게 해 줍니다. `useContext` Hook과 함께 사용됩니다.

#### 사용 사례

- 테마 설정 (예: 다크 모드, 라이트 모드)
- 사용자 인증 정보
- 다국어 지원 (언어 설정)

#### 장점

- `props drilling`(하위 컴포넌트로 props 계속 전달)을 방지
- 코드 가독성과 유지보수성 향상

#### 예시

```javascript
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = React.useContext(ThemeContext);
  return <button style={{ background: theme === 'dark' ? '#333' : '#FFF' }}>Button</button>;
}
```