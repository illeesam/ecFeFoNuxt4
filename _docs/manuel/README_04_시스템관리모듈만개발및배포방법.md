# README_04 - 시스템 관리 모듈만 개발 및 배포 방법

## 1. 개요

본 프로젝트는 프론트엔드(쇼핑몰) 템플릿이며, **시스템 관리 모듈(관리자 페이지)**은 별도 프로젝트로 두고 개발·배포하는 구성을 가정합니다. 관리 모듈만 따로 빌드·배포하는 방법을 안내합니다.

## 2. 관리 모듈을 같은 저장소에 두는 경우

### 2.1 구조 예시

```
outstock_vue_nuxt4_tailwind/
├── app/              # 쇼핑몰 (고객용)
├── admin/            # 관리 모듈 (Nuxt 또는 Vite+Vue 별도 앱)
│   ├── pages/
│   ├── nuxt.config.ts  또는 vite.config.ts
│   └── package.json
├── docs/
└── ...
```

- `admin`이 별도 Nuxt/Vite 앱이면 `admin/`에서만 `npm run build` 실행 후, 생성된 결과물만 배포합니다.

### 2.2 관리 모듈만 개발

```bash
cd admin
npm install
npm run dev
```

- 관리자용 포트를 다르게 사용 (예: `nuxt dev --port 3001`).

### 2.3 관리 모듈만 빌드

```bash
cd admin
npm run build
```

- Nuxt: `.output` 생성 → 서버에서는 `node .output/server/index.mjs` 또는 정적 배포 시 `.output/public` 사용
- Vite: `dist/` 생성 → 웹 서버에서 `dist` 디렉토리 정적 호스팅

### 2.4 관리 모듈만 배포

- **같은 서버, 다른 경로**: Nginx에서 예) `/admin` → `admin/.output/public` 또는 `admin/dist` 로 라우팅
- **별도 서브도메인**: 예) `admin.example.com` → 관리 앱 루트로 연결

자세한 Nginx 설정은 **README_05**(로컬 Windows Nginx), **README_06**(NGINX 배포)를 참고하여, 문서 루트만 관리 모듈 빌드 결과로 지정하면 됩니다.

## 3. 관리 모듈을 완전히 별도 저장소에 두는 경우

- 관리용 저장소를 별도로 클론한 뒤, 해당 저장소에서만 `npm run build` 및 배포 스크립트/CI를 실행합니다.
- 배포 절차는 README_06과 동일하게, 배포 대상 경로만 관리 앱의 빌드 결과로 설정합니다.

## 4. 요약

| 목적 | 작업 |
|------|------|
| 관리 모듈만 개발 | `admin/`(또는 관리 전용 저장소)에서 `npm run dev` |
| 관리 모듈만 빌드 | 해당 디렉토리에서 `npm run build` |
| 관리 모듈만 배포 | 빌드 산출물(.output/public 또는 dist)만 웹 서버에 배치하고, Nginx 등에서 해당 경로만 서비스 |
