## webpack

### 개요

**Webpack**은 웹 애플리케이션의 "모듈 번들러"입니다. 쉽게 말해, 우리가 개발할 때 작성하는 여러 개의 JavaScript, CSS, 이미지 등을 브라우저가 이해할 수 있게 **하나의 파일 또는 여러 파일로 묶어주는 도구**입니다.

과거에는 HTML 파일에서 `<script>` 태그로 JavaScript 파일을 하나씩 불러왔습니다. 하지만 규모가 커지면 스크립트가 수십, 수백 개로 늘어나고 의존 관계가 복잡해져 관리가 매우 어려워졌습니다.

Webpack은 이런 문제를 해결해줍니다.

### 왜 필요한가요?

#### 예전 방식 (전통적인 웹 개발)

```html
<script src="jquery.js"></script>
<script src="utils.js"></script>
<script src="main.js"></script>
```

* 파일이 많아질수록 `<script>` 태그가 늘어나고 순서 관리가 중요해짐
* 모듈 개념이 없어 파일 간 의존성이 얽히고 복잡해짐
* 최종 사용자에게 많은 파일을 전달해야 하므로 로딩이 느려짐

#### Webpack 방식

* 모든 JS, CSS, 이미지, 폰트 등을 **하나의 dependency graph**로 관리
* 불필요한 파일을 제거하고 필요한 것만 번들에 포함
* 개발 중에는 빠르게, 배포 시에는 최적화하여 효율적으로 제공

### 어떻게 작동하나요?

1. **Entry**: 앱의 시작점 (예: `index.js`)
2. **의존성 분석**: 해당 파일이 `import`하거나 `require`하는 모든 파일을 탐색
3. **Loader**: JS 이외 파일(CSS, 이미지 등)도 이해할 수 있도록 변환
4. **Plugin**: 압축, HTML 생성, 환경 변수 삽입 등 추가 작업
5. **Output**: 모든 내용을 묶어 `bundle.js` 같은 결과물로 출력

> 💡 예: 우리가 `import`한 여러 모듈을 묶어 하나의 `bundle.js` 파일로 만들어주는 것

### 코드 예시 (webpack.config.js)

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    // 예: 번들에 HTML 자동 생성, 압축 등
  ]
};
```

### 주요 기능 요약

| 항목             | 설명                                |
| -------------- | --------------------------------- |
| Entry          | 번들링 시작점 (보통 `index.js`)           |
| Output         | 결과 파일 이름과 저장 경로 (`bundle.js`)     |
| Loaders        | JS 이외 파일(CSS, 이미지 등)을 해석하고 JS로 변환 |
| Plugins        | HTML 생성, 압축, 환경 변수 처리 등 추가 기능 수행  |
| Code Splitting | 필요한 시점에 필요한 코드만 로딩하여 성능 향상        |

### 번들링 결과 예시

* 여러 개의 모듈이 다음과 같이 묶입니다:

```
📁 src
├── index.js
├── utils.js
├── styles.css

⏬ Webpack 번들링 후
📁 dist
└── bundle.js (모든 내용이 합쳐짐)
```

### 마무리

Webpack은 단순히 파일을 합치는 역할뿐 아니라, **모던 프론트엔드 개발에서 효율적인 개발 환경을 구성하고 최적화된 결과물을 제공하는 핵심 도구**입니다. React, Vue, Angular와 같은 프레임워크와 함께 필수적으로 사용됩니다.
