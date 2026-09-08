# npm 경고 정리

## 해결한 항목

### 1. Unknown project config (제거됨)
- **원인**: `.npmrc`에 pnpm 전용 옵션(`shamefully-hoist`, `strict-peer-dependencies`)이 있어 npm이 인식하지 못함.
- **조치**: 해당 옵션을 제거해 npm 호환 상태로 정리함.

### 2. @koa/router deprecated
- **원인**: `@nuxtjs/tailwindcss` → `tailwind-config-viewer`가 `@koa/router@12` 사용.
- **조치**: `package.json`의 `overrides`에 `"@koa/router": "^15.0.0"` 추가해 상위 버전으로 사용.

## 상위 패키지 개선 전까지 남는 경고

다음은 **직접 수정할 수 없는** 하위/간접 의존성 때문에 남는 경고입니다.

| 경고 | 경로 | 대응 |
|------|------|------|
| **inflight** deprecated | @nuxtjs/tailwindcss → tailwind-config-viewer → replace-in-file → glob → inflight | `@nuxtjs/tailwindcss` 또는 tailwind-config-viewer 쪽 업데이트 대기 |
| **glob** (7.x, 10.x) deprecated | 위와 동일 + 기타 | 동일 |
| **unplugin-vue-router** deprecated | nuxt → unplugin-vue-router | Nuxt가 vuejs/router 쪽으로 이전할 때까지 대기 |

peer dependency 관련 `ERESOLVE overriding peer dependency` 메시지는 npm이 자동으로 의존성을 조정했다는 의미이며, 설치 자체는 정상 동작합니다.
