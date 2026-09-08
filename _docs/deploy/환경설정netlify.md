# Netlify 배포 환경설정 가이드 (ecFeFoNuxt4)

> 대상 프로젝트: **ecfefonuxt4** (Netlify) ← `github.com/illeesam4-cmd/ecFeFoNuxt4` (`main` 브랜치)
> 배포 방식: GitHub 저장소 연동 **Continuous Deployment** (Nuxt 4 SSR, Nitro `netlify` 프리셋)

```
개발자 PC
  └─ git push origin main
       └─ GitHub (main 브랜치 갱신)
            └─ Netlify Build Hook (GitHub App Webhook, 설정 불필요/자동)
                 └─ Netlify Build
                      ├─ 의존성 설치 (pnpm)
                      ├─ 빌드 명령 실행 (npm run build → nuxt build)
                      │     └─ Nitro가 preset: netlify 로 자동 빌드
                      │           ├─ 정적 자산 → dist/
                      │           └─ SSR 서버리스 함수 → .netlify/functions-internal/
                      └─ 배포 & CDN 반영 (Production: main 브랜치는 자동 Publish)
```

---

## 1. Netlify 프로젝트(사이트) 환경설정 방법

Netlify 대시보드 → 해당 프로젝트(ecfefonuxt4) → **Project configuration → Build & deploy → Continuous deployment → Build settings → Configure**

현재 이 프로젝트에 맞게 설정되어 있어야 하는 값 (2026-09-08 기준 정상 배포 확인됨):

| 항목                | 값                                           | 설명                                                                                                                                                                                  |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base directory      | _(비워둠, 즉 저장소 루트 `/`)_               | `package.json`, `nuxt.config.ts` 가 저장소 최상위에 있으므로 서브 디렉터리를 지정하면 안 됨                                                                                           |
| Package directory   | _(비워둠)_                                   | 모노레포가 아니므로 사용 안 함                                                                                                                                                        |
| Build command       | `npm run build`                              | 내부적으로`nuxt build` 실행. **비워두면 빌드가 아예 실행되지 않고 저장소 원본 파일이 그대로 배포되므로 반드시 지정해야 함**                                                           |
| Publish directory   | `dist`                                       | Nuxt4 + Nitro`netlify` 프리셋이 정적 자산(`_nuxt/*.js`, `_headers` 등)을 만드는 실제 경로. 비워두면 저장소 루트가 그대로 배포되어 화면이 빈 페이지로 나오거나 `_nuxt/*.js`가 404가 남 |
| Functions directory | _(비워둠 → 기본값 `netlify/functions` 사용)_ | Nitro가 SSR 핸들러를`.netlify/functions-internal/`에 별도 생성하며, Netlify 빌드 시스템이 이를 자동 인식(로그에 `Detected 1 framework(s): "nuxt"`, `1 function deployed`로 표시됨)    |
| Runtime             | Not set (선택 안 함)                         | Runtime 드롭다운에는 Angular/Gatsby/Next.js만 있고 Nuxt 항목은 없음. 선택하지 않아도 Nitro가 빌드 시점에 Netlify 환경을 자동 감지(`NETLIFY` 환경변수)해서 `netlify` 프리셋으로 빌드함 |

설정 후 반드시 **Save** 클릭.

### 환경 변수 (Environment variables)

경로: **Project configuration → Environment variables → Add a variable**

`.env.production` 파일에 있는 아래 항목들은 로컬 개발용 예시값(placeholder, 예: `NUXT_API_BASE_URL=http://localhost:3000`)이므로, **운영 배포 시에는 반드시 Netlify 환경 변수로 실제 운영 값을 등록**해야 API가 정상 동작합니다. (미등록 시 `/api/products`, `/api/category-tree` 등에서 500 에러 발생)

- `DATABASE_URL` (Prisma PostgreSQL 운영 DB 접속 문자열)
- `REDIS_URL`, `USE_REDIS` (세션/리프레시 토큰 보관용)
- `AUTH_JWT_SECRET`, `AUTH_ACCESS_TOKEN_TTL_MINUTES`, `AUTH_REFRESH_TOKEN_TTL_DAYS`
- `NUXT_API_BASE_URL`, `NUXT_PUBLIC_API_BASE` (운영 API 서버 주소로 교체, `localhost` 금지)
- `NUXT_PUBLIC_CDN_BASE` (운영 CDN 주소)
- `TOSSPAYMENTS_SECRET_KEY`, `NUXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY` (라이브 키로 교체)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`, `KAKAO_CLIENT_ID` / `KAKAO_CLIENT_SECRET`, `APPLE_*` (소셜 로그인 운영 앱 키)
- `NUXT_PUBLIC_GA_MEASUREMENT_ID` (GA4 운영 측정 ID)

> ⚠️ 민감정보(DB 접속정보, 시크릿 키 등)는 절대 GitHub 저장소에 실제 값으로 커밋하지 말고, Netlify 환경 변수로만 등록하세요. 등록 후에는 반드시 **Trigger deploy**로 재배포해야 반영됩니다 (환경 변수 변경은 자동 재배포를 트리거하지 않음).

---

## 2. 배포 결과 확인하는 방법

1. Netlify 대시보드 → 프로젝트 → **Deploys** 탭에서 배포 목록 확인
   - `Published` (초록색): 정상 배포 및 Production 반영 완료
   - `Building` / `In progress`: 진행 중
   - `Failed` (빨간색): 실패 — 클릭하면 실패 단계(`Failed during stage '...'`)가 표시됨
2. 배포 항목 클릭 → **Deploy details** 페이지에서
   - **Deploy summary**: 업로드된 파일 수, 빌드/배포 소요 시간
   - **Deploy log** → **Maximize log**: 각 단계(Initializing / Building / Deploying / Cleanup / Post-processing) 펼쳐서 상세 로그 확인. 실패 시 `Why did it fail?` 버튼을 누르면 Netlify AI가 원인을 자동 분석해줌 (참고용, 100% 정확하지는 않으므로 실제 로그도 같이 확인할 것)
   - **Deploy file browser** → **Browse files**: 실제로 어떤 파일이 배포됐는지(정적 자산이 `dist/` 하위에 잘 들어갔는지 등) 직접 확인 가능
3. 실제 사이트 접속 확인: **Open production deploy** 버튼 또는 `https://ecfefonuxt4.netlify.app` 직접 접속
   - 브라우저 개발자도구 Console/Network 탭에서 JS 파일 404, API 500 등 런타임 에러 여부 확인
4. **Functions** 탭 (Deploy details 상단 `Functions` 링크): SSR 서버리스 함수가 정상 배포됐는지, 함수 실행 로그(런타임 에러)는 없는지 확인

---

## 3. 재배포하는 방법 (코드 변경 없이 수동으로 다시 빌드)

Netlify 대시보드 → 프로젝트 → **Deploys** 탭 → 우측 상단 **Trigger deploy** 드롭다운

- **Deploy project**: 기존 빌드 캐시(의존성 등)를 재사용해서 다시 배포 (빠름)
- **Deploy project without cache**: 캐시를 지우고 완전히 새로 클론/설치/빌드 (환경설정 변경, 의존성 문제 의심 시 권장)

이 외에도:

- 실패한 배포 상세 페이지에서 **Retry** 버튼으로 동일 커밋 재시도 가능
- Build & deploy 설정(빌드 명령어, Publish directory, 환경 변수 등)을 변경한 뒤에는 **자동으로 재배포되지 않으므로** 반드시 위 방법으로 수동 재배포해야 변경사항이 반영됨

---

## 4. 소스를 push 하면 자동 배포되는 방법 (Continuous Deployment)

이 프로젝트는 이미 GitHub 저장소(`illeesam4-cmd/ecFeFoNuxt4`)와 연동되어 있고, **Production branch가 `main`으로 지정**되어 있으며 **Auto publishing(자동 배포)이 켜져 있는 상태**입니다. 즉:

```
git add .
git commit -m "커밋 메시지"
git push origin main
```

위처럼 `main` 브랜치에 push 하면 GitHub → Netlify로 자동 등록된 웹훅이 즉시 Netlify에 알리고, **별도 조작 없이 자동으로 빌드가 시작되고, 빌드가 성공하면 자동으로 Production에 반영**됩니다. Deploys 탭에 새 커밋 해시(`main@<커밋해시>`)로 된 배포가 자동으로 생성되는 것을 확인하면 됩니다.

### 확인/변경 위치

- **Project configuration → Build & deploy → Continuous deployment → Manage repository**: 연동된 GitHub 저장소 확인/변경
- **Deploys** 탭 상단 **"Lock to stop auto publishing"**: 자동 배포를 일시적으로 막고 싶을 때 사용 (락 걸면 push 해도 빌드는 되지만 Production에는 반영 안 되고, 수동으로 Publish 눌러야 함)
- **Project configuration → Build & deploy → Continuous deployment → Branches and deploy contexts**: Production 브랜치, PR별 Deploy Preview 생성 여부 등 설정

### 주의사항

- `main`이 아닌 다른 브랜치에 push하면 기본 설정상 Production에는 반영되지 않고 별도의 Branch deploy/Deploy preview URL로만 빌드됨
- push 후 빌드가 실패하면 Production 사이트는 **이전에 마지막으로 성공한 배포 그대로 유지**되므로 서비스가 갑자기 죽지는 않음 (실패한 배포만 Deploys 탭에 `Failed`로 남음)
- 커밋에 `[skip ci]` 또는 `[netlify skip]`을 메시지에 포함하면 해당 커밋은 빌드를 건너뜀

---

## 5. 트러블슈팅 (과거 발생했던 실제 장애 사례)

2026-09-08 배포 장애 시 아래 4가지 문제가 순차적으로 있었고, 모두 수정하여 정상 배포 확인함. 유사한 문제 재발 시 참고.

1. **`Base directory does not exist: /opt/build/repo/ecFeFoNuxt4`**
   - 원인: Build settings의 Base/Package/Publish/Functions directory가 전부 `ecFeFoNuxt4/`로 잘못 지정되어 있었음 (저장소 루트에 프로젝트가 있는데 서브폴더인 것처럼 설정됨)
   - 해결: 위 항목들을 모두 비움(저장소 루트 기준으로 동작)

2. **`ERR_PNPM_OUTDATED_LOCKFILE` (dependency_installation script returned non-zero exit code: 1)**
   - 원인: `package.json`에 새 의존성(`chart.js`)이 추가됐는데 `pnpm-lock.yaml`이 갱신되지 않아 `pnpm install --frozen-lockfile`(CI 기본 동작)이 실패
   - 해결: 로컬에서 `pnpm install --no-frozen-lockfile` 실행 후 갱신된 `pnpm-lock.yaml`을 커밋/push
   - 예방: **의존성을 추가/변경할 때마다 반드시 `pnpm install`을 실행해서 `pnpm-lock.yaml`도 함께 커밋할 것**

3. **`No build steps found, continuing to publishing`**
   - 원인: Build command가 비어 있어서 Netlify가 빌드 자체를 실행하지 않고 저장소 원본 파일을 그대로 배포함 (사이트가 404 또는 빈 화면)
   - 해결: Build command를 `npm run build`로 지정

4. **정적 자산 404 (`/_nuxt/*.js` 404, 화면 빈 페이지)**
   - 원인: 빌드는 성공했지만 Publish directory가 비어 있어 저장소 루트가 그대로 배포되고, 실제 빌드 산출물(`dist/`)은 서빙되지 않음
   - 해결: Publish directory를 `dist`로 지정

이 문서에 기록된 4가지 설정값(Base/Build command/Publish/Functions directory)이 다시 초기화되거나 잘못 바뀌면 위와 동일한 증상이 재발할 수 있으므로, Build & deploy 설정을 변경할 때는 이 문서의 표(1번 항목)와 대조해서 확인할 것.

---

## 6. 참고: 로컬에서 운영 빌드와 동일하게 미리 확인하는 방법

```bash
pnpm install
NETLIFY=true NITRO_PRESET=netlify npm run build
```

빌드 후 `dist/` 폴더가 정상 생성되고(`_nuxt/`, `_headers`, `_redirects` 등 포함), `.netlify/functions-internal/` 에 SSR 서버 함수가 생성되면 정상입니다. Netlify Functions/서버 라우트(예: `/api/products`)를 로컬에서 실제로 확인하려면 `NUXT_API_BASE_URL`, `DATABASE_URL` 등 운영값과 유사한 환경 변수를 `.env.production`(로컬 전용, 커밋 금지)에 채운 뒤 `npm run preview:prod`로 확인하는 것을 권장합니다.
