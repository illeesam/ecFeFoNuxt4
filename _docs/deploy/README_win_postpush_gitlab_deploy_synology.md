# Windows Post-Push → GitLab CI/CD → Synology Docker 배포 시나리오

## 📌 개요

```
개발자 PC (Windows)
  └─ git push
       └─ post-push hook (PowerShell)
            └─ deploy.ps1 -Target gitlab
                 └─ GitLab Pipeline Trigger API
                      └─ .gitlab-ci.yml Pipeline
                           ├─ myapp1 : Spring Boot JAR 빌드 → Docker Image
                           ├─ myapp2 : Nuxt4 SSR 빌드      → Docker Image (Node.js 서버)
                           └─ myapp3 : Vue3 SPA 빌드        → Docker Image (Nginx 정적 파일)
                                └─ SSH → Synology Container Manager
```

---

## 🏗️ 전체 아키텍처

| 구성요소 | 설명 |
|---|---|
| 개발 OS | Windows 10/11 |
| CI/CD | GitLab CI/CD (.gitlab-ci.yml) |
| Runner | GitLab Runner (Docker executor) |
| 이미지 저장소 | GitLab Container Registry |
| 배포 대상 | Synology NAS — Container Manager |
| myapp1 | Spring Boot JAR → Docker (포트 8080) |
| myapp2 | Nuxt4 SSR → Docker Node.js 서버 (포트 3000) |
| myapp3 | Vue3 SPA → Docker Nginx 정적 서버 (포트 8090) |

---

## 💡 렌더링 방식 비교 — SSR vs SPA

### Nuxt4 SSR (Server-Side Rendering) — myapp2 방식

```
사용자 브라우저 ──요청──▶ Node.js 서버 (컨테이너 내부 상시 실행)
                              │
                              ├─ 서버에서 Vue 컴포넌트 실행하여 HTML 완성
                              ├─ 완성된 HTML을 브라우저에 응답 (SEO 크롤러가 읽을 수 있음)
                              └─ 이후 클라이언트에서 Vue가 hydration(이벤트 연결)
```

| 항목 | 내용 |
|---|---|
| 빌드 명령어 | `npm run build` → `.output/` 디렉터리 생성 |
| 실행 | `node .output/server/index.mjs` — Node.js 프로세스 상시 실행 |
| 컨테이너 | `node:20-alpine` (Node.js 런타임 필요) |
| 기본 포트 | `3000` |
| 장점 | SEO 최적화, 초기 화면 빠름, 서버 사이드 로직 가능 |
| 단점 | Node.js 프로세스 상시 필요, 서버 리소스 소비 |
| 적합 | 쇼핑몰, 블로그, 검색 노출이 중요한 서비스 |

### Vue3 SPA (Single Page Application) — myapp3 방식

```
사용자 브라우저 ──요청──▶ Nginx (정적 파일 서버, 매우 가벼움)
                              │
                              └─ 미리 빌드된 HTML/JS/CSS 파일을 그대로 응답
                                 (Vue Router가 클라이언트 브라우저에서 라우팅 처리)
```

| 항목 | 내용 |
|---|---|
| 빌드 명령어 | `npm run build` → `dist/` 디렉터리 생성 |
| 실행 | Nginx가 `dist/` 정적 파일 서빙 — Node.js 불필요 |
| 컨테이너 | `nginx:alpine` (~7MB) |
| 기본 포트 | `80` (docker-compose에서 8090으로 매핑) |
| 장점 | 서버 부하 없음, 배포 단순, 빌드 빠름 |
| 단점 | SEO 불리, 첫 로딩 시 JS 번들 다운로드 필요 |
| 적합 | 관리자 대시보드, 내부 ERP/CRM, 로그인 필요 내부 시스템 |

> **Nuxt4 Static (`npm run generate`)** : `.output/public/` 에 정적 파일 생성 → Nginx 서빙.  
> SSR 없이 Nuxt 파일 구조만 쓰고 싶을 때 사용.

---

## 📁 프로젝트 파일 구조

```
project-root/
├── myapp1/                     # Spring Boot 프로젝트
│   ├── Dockerfile
│   └── build.gradle
├── myapp2/                     # Nuxt4 SSR 프로젝트
│   ├── Dockerfile
│   └── nuxt.config.ts
├── myapp3/                     # Vue3 SPA 프로젝트
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
├── deploy.ps1                  # 배포 트리거 스크립트
├── .gitlab-ci.yml              # GitLab CI/CD Pipeline
├── docker-compose.yml          # Synology 배포용 Compose
├── .git/
│   └── hooks/
│       └── post-push
└── .vscode/
    └── tasks.json
```

---

## ⚙️ 1단계 — deploy.ps1 설정

```powershell
# deploy.ps1
# ──────────────────────────────────────────────────────────────
# 파라미터 설명
#   -Target    : 배포 플랫폼 선택 (jenkins / github / gitlab / gitee)
#   -Branch    : 배포할 Git 브랜치명 (기본값: 현재 브랜치 자동 감지)
#   -RemoteUrl : 원격 저장소 URL (기본값: origin URL 자동 감지)
#   -User      : 배포 요청자 이름 (기본값: git user.name 자동 감지)
# ──────────────────────────────────────────────────────────────
param(
    [string]$Target    = "gitlab",
    [string]$Branch    = $(git rev-parse --abbrev-ref HEAD),
    # git rev-parse --abbrev-ref HEAD
    #   : 현재 체크아웃된 브랜치 이름 반환 (예: main, develop)
    [string]$RemoteUrl = $(git config --get remote.origin.url),
    # git config --get remote.origin.url
    #   : .git/config 에서 origin 원격 저장소 URL 읽어옴
    [string]$User      = $(git config user.name)
    # git config user.name
    #   : .gitconfig 에 설정된 사용자 이름 읽어옴
)

Write-Output "========================================"
Write-Output " Deploy 요청"
Write-Output " Target  : $Target"
Write-Output " Branch  : $Branch"
Write-Output " Remote  : $RemoteUrl"
Write-Output " User    : $User"
Write-Output "========================================"

switch ($Target) {
    "gitlab" {
        $gitlabUrl    = "https://gitlab.com"           # Self-hosted 시 변경
        $projectId    = "YOUR_PROJECT_ID"              # GitLab 프로젝트 ID (숫자)
        $triggerToken = "YOUR_GITLAB_TRIGGER_TOKEN"    # Pipeline Trigger Token

        # GitLab Pipeline Trigger API 엔드포인트
        # /api/v4/projects/{id}/trigger/pipeline : 특정 프로젝트의 파이프라인을 외부에서 트리거
        $uri = "$gitlabUrl/api/v4/projects/$projectId/trigger/pipeline"

        Write-Output "GitLab Pipeline 트리거: $uri"

        $body = @{
            token     = $triggerToken
            ref       = $Branch
            # variables[] : 파이프라인에 전달할 커스텀 변수 (gitlab-ci.yml에서 $TRIGGERED_BY 로 사용)
            "variables[TRIGGERED_BY]" = $User
            "variables[DEPLOY_ENV]"   = "production"
        }

        try {
            # GitLab Trigger API는 form-data 방식으로 전송 (Content-Type 자동 처리)
            # -Body @{} : PowerShell 해시테이블 → application/x-www-form-urlencoded 자동 변환
            Invoke-WebRequest -Uri $uri -Method Post `
                -Body $body -UseBasicParsing
            Write-Output "✅ GitLab Pipeline 트리거 성공"
        } catch {
            Write-Error "❌ GitLab Pipeline 트리거 실패: $_"
        }
    }
    default {
        Write-Warning "알 수 없는 Target: $Target"
    }
}
```

> **수정 필요 항목**
> - `YOUR_PROJECT_ID` : GitLab 프로젝트 → 설정 → 일반 → 최상단 숫자 ID
> - `YOUR_GITLAB_TRIGGER_TOKEN` : GitLab → 설정 → CI/CD → Pipeline triggers

---

## ⚙️ 2단계 — Git Post-Push Hook 설정

```bash
#!/bin/sh
# .git/hooks/post-push
# git push 완료 직후 자동 실행
# git rev-parse --show-toplevel : 저장소 루트 절대경로 반환
SCRIPT_DIR=$(git rev-parse --show-toplevel)
# powershell.exe -ExecutionPolicy Bypass : 실행 정책 우회하여 ps1 스크립트 실행
powershell.exe -ExecutionPolicy Bypass -File "$SCRIPT_DIR/deploy.ps1" -Target "gitlab"
```

```bash
# 실행 권한 부여 (Git Bash / WSL에서 실행)
# chmod +x : 파일에 실행 권한 부여 (없으면 Git이 훅 실행 안 함)
chmod +x .git/hooks/post-push
```

---

## ⚙️ 3단계 — VS Code tasks.json 설정

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Deploy → GitLab (현재 브랜치)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "gitlab"
      ],
      "group": { "kind": "build", "isDefault": true },
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    },
    {
      "label": "🚀 Deploy → GitLab (브랜치 직접 입력)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "gitlab",
        "-Branch", "${input:branchName}"
      ],
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "branchName",
      "type": "promptString",
      "description": "배포할 브랜치 이름을 입력하세요",
      "default": "main"
    }
  ]
}
```

**VS Code 수동 실행 방법:**
1. `Ctrl+Shift+B` → 기본 빌드 태스크 즉시 실행
2. `Ctrl+Shift+P` → `Tasks: Run Task` → 원하는 태스크 선택

---

## ⚙️ 4단계 — .gitlab-ci.yml 작성

```yaml
# .gitlab-ci.yml
# GitLab CI/CD 파이프라인 정의 파일
# push 이벤트 또는 Trigger API 호출 시 자동 실행

stages:
  - build    # 소스코드 빌드
  - docker   # Docker 이미지 빌드 & 레지스트리 푸시
  - deploy   # Synology NAS에 배포

variables:
  # GitLab Container Registry 주소 (GitLab이 자동 제공하는 CI 변수 활용)
  # 형식: registry.gitlab.com/네임스페이스/프로젝트명
  REGISTRY: "registry.gitlab.com/YOUR_NAMESPACE/YOUR_PROJECT"
  SYNOLOGY_HOST: "192.168.1.100"
  SYNOLOGY_USER: "admin"
  DEPLOY_PATH: "/volume1/docker/myapp"

# ── myapp1 빌드 (Spring Boot) ──────────────────────────────────
build-myapp1:
  stage: build
  # eclipse-temurin:21-jdk : JDK 21 포함 이미지 (빌드에는 JDK 필요, 실행은 JRE)
  image: eclipse-temurin:21-jdk
  script:
    - cd myapp1
    # ./gradlew clean bootJar
    #   clean   : 이전 빌드 결과물(build/) 삭제
    #   bootJar : Spring Boot 실행 가능 Fat JAR 생성
    - ./gradlew clean bootJar
  artifacts:
    # artifacts : 이후 스테이지에서 사용할 빌드 결과물 저장
    paths:
      - myapp1/build/libs/*.jar
    expire_in: 1 hour   # 1시간 후 아티팩트 자동 삭제 (저장소 공간 절약)
  only:
    - main
    - develop

# ── myapp2 빌드 (Nuxt4 SSR) ──────────────────────────────────
build-myapp2:
  stage: build
  image: node:20-alpine
  script:
    - cd myapp2
    # npm ci : package-lock.json 기반 정확한 버전으로 의존성 설치
    - npm ci
    # npm run build : Nuxt4 SSR 빌드 → .output/ 생성
    - npm run build
  artifacts:
    paths:
      - myapp2/.output/
    expire_in: 1 hour
  only:
    - main
    - develop

# ── myapp3 빌드 (Vue3 SPA) ───────────────────────────────────
build-myapp3:
  stage: build
  image: node:20-alpine
  script:
    - cd myapp3
    - npm ci
    # npm run build : Vite + Vue3 SPA 빌드 → dist/ 생성
    - npm run build
  artifacts:
    paths:
      - myapp3/dist/
    expire_in: 1 hour
  only:
    - main
    - develop

# ── Docker 이미지 빌드 & 푸시 ─────────────────────────────────
docker-myapp1:
  stage: docker
  image: docker:latest
  services:
    # docker:dind (Docker-in-Docker) : GitLab Runner 내부에서 docker 명령어 사용 가능하게 함
    - docker:dind
  script:
    # CI_REGISTRY_USER, CI_REGISTRY_PASSWORD : GitLab이 자동 제공하는 레지스트리 인증 변수
    # CI_REGISTRY : 현재 프로젝트의 Container Registry 주소 (자동 제공)
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    # $CI_COMMIT_SHORT_SHA : 현재 커밋의 짧은 해시 (예: a1b2c3d4)
    #   → 이미지 태그로 사용하면 특정 커밋으로 롤백 가능
    - docker build -t $REGISTRY/myapp1:$CI_COMMIT_SHORT_SHA -t $REGISTRY/myapp1:latest ./myapp1
    - docker push $REGISTRY/myapp1:$CI_COMMIT_SHORT_SHA
    - docker push $REGISTRY/myapp1:latest
  needs: [build-myapp1]   # build-myapp1 완료 후 실행
  only:
    - main

docker-myapp2:
  stage: docker
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $REGISTRY/myapp2:$CI_COMMIT_SHORT_SHA -t $REGISTRY/myapp2:latest ./myapp2
    - docker push $REGISTRY/myapp2:$CI_COMMIT_SHORT_SHA
    - docker push $REGISTRY/myapp2:latest
  needs: [build-myapp2]
  only:
    - main

docker-myapp3:
  stage: docker
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $REGISTRY/myapp3:$CI_COMMIT_SHORT_SHA -t $REGISTRY/myapp3:latest ./myapp3
    - docker push $REGISTRY/myapp3:$CI_COMMIT_SHORT_SHA
    - docker push $REGISTRY/myapp3:latest
  needs: [build-myapp3]
  only:
    - main

# ── Synology 배포 ────────────────────────────────────────────
deploy-synology:
  stage: deploy
  image: alpine:latest
  before_script:
    # OpenSSH 클라이언트 설치 (alpine 기본 이미지에는 없음)
    - apk add --no-cache openssh-client
    - mkdir -p ~/.ssh
    # Secrets에 저장된 SSH 개인키를 파일로 저장
    - echo "$SYNOLOGY_SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    # 개인키 파일 권한 600 설정 (SSH 보안 요구사항: 소유자만 읽기 가능)
    - chmod 600 ~/.ssh/id_rsa
    # ssh-keyscan : 원격 호스트의 공개키를 known_hosts에 추가 (최초 접속 시 확인 프롬프트 방지)
    - ssh-keyscan -H $SYNOLOGY_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh ${SYNOLOGY_USER}@${SYNOLOGY_HOST} "
        cd ${DEPLOY_PATH} &&
        docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY} &&
        docker-compose pull &&
        docker-compose up -d --remove-orphans &&
        docker image prune -f
      "
    # docker image prune -f
    #   : 태그가 없는(dangling) 이미지 강제 삭제 (Synology 디스크 공간 확보)
  needs: [docker-myapp1, docker-myapp2, docker-myapp3]
  environment:
    name: production   # GitLab Environments 페이지에 배포 이력 기록
  only:
    - main
```

---

## ⚙️ 5단계 — Dockerfile 작성

### myapp1 — Spring Boot (JAR)

```dockerfile
# myapp1/Dockerfile
# eclipse-temurin:21-jre-alpine : JRE 21 + Alpine (실행 전용, 빌드 도구 제외)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# .gitlab-ci.yml의 artifacts로 저장된 JAR 파일이 빌드 컨텍스트에 존재
COPY build/libs/*.jar app.jar
EXPOSE 8080
# java -jar : Spring Boot 내장 Tomcat 포함 JAR 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### myapp2 — Nuxt4 SSR (Node.js 서버)

```dockerfile
# myapp2/Dockerfile
# ──────────────────────────────────────────────────────────────
# SSR: Node.js 서버가 요청마다 Vue 컴포넌트 렌더링 → 완성된 HTML 반환
# ──────────────────────────────────────────────────────────────

# ── 빌드 스테이지 ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# npm ci : package-lock.json 기준 정확한 버전 설치 (재현 가능한 빌드)
RUN npm ci
COPY . .
# npm run build → .output/ 생성
#   .output/server/index.mjs : Node.js H3 서버 시작 파일
#   .output/public/          : 정적 에셋 (JS, CSS, 이미지)
RUN npm run build

# ── 실행 스테이지 ────────────────────────────────────────────
# 빌드 도구 없이 실행 파일만 포함한 최소 이미지
FROM node:20-alpine
WORKDIR /app
# --from=builder : 빌드 스테이지에서 .output 만 복사 (이미지 크기 감소)
COPY --from=builder /app/.output ./output
EXPOSE 3000
# node output/server/index.mjs : Nitro 기반 Node.js SSR 서버 시작
CMD ["node", "output/server/index.mjs"]
```

### myapp3 — Vue3 SPA (Nginx 정적 서버)

```dockerfile
# myapp3/Dockerfile
# ──────────────────────────────────────────────────────────────
# SPA: 빌드 시 모든 파일 생성 → Nginx가 단순 파일 서빙 (Node.js 불필요)
# ──────────────────────────────────────────────────────────────

# ── 빌드 스테이지 ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# npm run build (Vite) → dist/
#   dist/index.html      : SPA 진입점
#   dist/assets/*.js     : 번들된 Vue 앱 (파일명에 해시 포함)
#   dist/assets/*.css    : 번들된 CSS
RUN npm run build

# ── 실행 스테이지 ────────────────────────────────────────────
FROM nginx:alpine
# Vite 빌드 결과물을 Nginx 웹루트로 복사
COPY --from=builder /app/dist /usr/share/nginx/html
# Vue Router History 모드 fallback 설정 (없으면 새로고침 시 404)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# daemon off : 포그라운드 실행 (컨테이너 메인 프로세스 유지)
CMD ["nginx", "-g", "daemon off;"]
```

**myapp3/nginx.conf:**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        # Vue Router History 모드: 파일 없으면 index.html fallback
        # /user/123 같은 URL 직접 접속/새로고침 시 정상 동작
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        # Vite 해시 파일명 → 1년 캐시 가능, immutable로 재검증 생략
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

---

## ⚙️ 6단계 — CI/CD 변수 설정

GitLab → 프로젝트 → **설정** → **CI/CD** → **Variables**:

| 변수명 | 값 | Masked | Protected |
|---|---|---|---|
| `SYNOLOGY_SSH_PRIVATE_KEY` | Synology SSH 개인키 전체 내용 | ✅ | ✅ |

> `CI_REGISTRY`, `CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD` 는 GitLab이 자동 제공합니다.

---

## ⚙️ 7단계 — Pipeline Trigger Token 발급

1. GitLab → 프로젝트 → **설정** → **CI/CD** → **Pipeline triggers**
2. **Add trigger** → 설명 입력 → 토큰 복사
3. `deploy.ps1`의 `YOUR_GITLAB_TRIGGER_TOKEN`에 입력
4. `YOUR_PROJECT_ID` : 프로젝트 → **설정** → **일반** 최상단 숫자 확인

---

## ⚙️ 8단계 — docker-compose.yml (Synology 배포용)

`/volume1/docker/myapp/docker-compose.yml`:

```yaml
version: "3.9"

services:

  # ── myapp1 : Spring Boot Backend ─────────────────────────────
  myapp1:
    image: registry.gitlab.com/YOUR_NAMESPACE/YOUR_PROJECT/myapp1:latest
    container_name: myapp1
    restart: unless-stopped
    # unless-stopped : 비정상 종료 시 자동 재시작, 수동 stop은 재시작 안 함
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:mysql://db:3306/myapp
      # "db" : 같은 네트워크 내 서비스명이 호스트명으로 동작 (DNS 자동 해석)
      - DB_USER=myapp
      - DB_PASS=secret
    depends_on:
      - db
    networks:
      - myapp-net

  # ── myapp2 : Nuxt4 SSR Frontend ──────────────────────────────
  myapp2:
    image: registry.gitlab.com/YOUR_NAMESPACE/YOUR_PROJECT/myapp2:latest
    container_name: myapp2
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE=http://192.168.1.100:8080
      # NUXT_PUBLIC_ : 클라이언트/서버 양쪽에서 접근 가능한 Nuxt4 공개 환경변수
    networks:
      - myapp-net

  # ── myapp3 : Vue3 SPA Frontend (Nginx) ───────────────────────
  myapp3:
    image: registry.gitlab.com/YOUR_NAMESPACE/YOUR_PROJECT/myapp3:latest
    container_name: myapp3
    restart: unless-stopped
    ports:
      - "8090:80"
      # 컨테이너 Nginx는 80번, 호스트에서는 8090번으로 접근
    networks:
      - myapp-net

  # ── Database : MySQL ──────────────────────────────────────────
  db:
    image: mysql:8.0
    container_name: myapp-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: myapp
      MYSQL_USER: myapp
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: rootsecret
    volumes:
      - db-data:/var/lib/mysql
      # Named Volume : 컨테이너 재생성 시에도 DB 데이터 영구 보존
    networks:
      - myapp-net

networks:
  myapp-net:
    # bridge 네트워크: 서비스끼리 이름으로 통신 가능

volumes:
  db-data:
```

---

## 🔄 전체 흐름 요약

```
1. 코드 수정 후 git push origin main
      ↓
2. .git/hooks/post-push 자동 실행
      ↓
3. deploy.ps1 -Target gitlab 실행
      ↓
4. GitLab Pipeline Trigger API POST 요청
      ↓
5. .gitlab-ci.yml Pipeline 실행
   ├── myapp1: ./gradlew clean bootJar
   ├── myapp2: npm ci && npm run build (SSR)
   ├── myapp3: npm ci && npm run build (SPA)
   ├── docker build × 3 → GitLab Container Registry 푸시
   └── SSH → docker-compose pull && up -d
      ↓
6. Synology 컨테이너 기동
   ├── myapp1 → http://NAS_IP:8080  (Spring Boot API)
   ├── myapp2 → http://NAS_IP:3000  (Nuxt4 SSR)
   └── myapp3 → http://NAS_IP:8090  (Vue3 SPA)
```

---

## 👣 개발자 순차적 동작 시나리오

### 자동 배포 흐름 (git push → 자동 트리거)

| # | 단계 | 개발자 행동 | 시스템 자동 동작 | 결과 확인 방법 |
|---|---|---|---|---|
| 1 | **코드 수정** | VS Code에서 소스 편집 | — | — |
| 2 | **스테이징** | `git add .` | 변경 파일을 Git 인덱스에 추가 | `git status` → 녹색 파일 목록 |
| 3 | **커밋** | `git commit -m "feat: 기능명"` | 로컬 커밋 객체 생성 | `git log --oneline` → 최신 커밋 확인 |
| 4 | **푸시** | `git push origin main` | GitLab 원격 저장소로 전송 | 터미널: `Writing objects: 100%` |
| 5 | **훅 자동 실행** | (자동) | `.git/hooks/post-push` → `deploy.ps1 -Target gitlab` | 터미널: `Target: gitlab / Branch: main` 출력 |
| 6 | **Pipeline 트리거** | (자동) | GitLab Trigger API POST → Pipeline 큐에 추가 | 터미널: `✅ GitLab Pipeline 트리거 성공` |
| 7 | **Pipeline 시작** | (자동) | GitLab Runner가 코드 체크아웃 | GitLab → CI/CD → Pipelines → 실행 중 파이프라인 확인 |
| 8 | **myapp1 빌드** | (자동) | `./gradlew clean bootJar` | GitLab 파이프라인 → build-myapp1 잡 → `BUILD SUCCESSFUL` |
| 9 | **myapp2 빌드** | (자동) | `npm ci && npm run build` (Nuxt4 SSR) | build-myapp2 잡 → `✓ You can now deploy .output/` |
| 10 | **myapp3 빌드** | (자동) | `npm ci && npm run build` (Vue3) | build-myapp3 잡 → `✓ built in Xs` |
| 11 | **이미지 빌드/푸시** | (자동) | `docker build & push` × 3 → GitLab Registry | docker-myapp1/2/3 잡 → `Successfully pushed` |
| 12 | **Synology 배포** | (자동) | SSH → `docker-compose pull && up -d` | deploy-synology 잡 → 성공 (녹색 체크) |
| 13 | **컨테이너 기동** | (자동) | Synology에서 3개 컨테이너 신규 시작 | Synology DSM → Container Manager → `실행 중` ✅ |
| 14 | **서비스 확인** | 브라우저 접속 | — | `http://NAS_IP:8080` / `:3000` / `:8090` 각각 접속 |
| 15 | **API 헬스체크** | 터미널 실행 | — | `curl http://NAS_IP:8080/actuator/health` → `{"status":"UP"}` |
| 16 | **배포 이력 확인** | GitLab 접속 | — | GitLab → **Deployments** → **Environments** → production 배포 이력 |

### 수동 배포 흐름 (VS Code에서 직접 실행)

| # | 단계 | 개발자 행동 | 결과 확인 방법 |
|---|---|---|---|
| 1 | **태스크 실행** | `Ctrl+Shift+B` | 태스크 선택 드롭다운 표시 |
| 2 | **태스크 선택** | `🚀 Deploy → GitLab (현재 브랜치)` | VS Code 하단 터미널 열림 |
| 3 | **실행 출력** | (자동) | 터미널: `Target: gitlab / Branch: main` 출력 |
| 4 | **트리거 성공** | (자동) | 터미널: `✅ GitLab Pipeline 트리거 성공` |
| 5 | **Pipeline 확인** | GitLab 브라우저 접속 | `https://gitlab.com/YOUR_NS/YOUR_PROJECT/-/pipelines` |
| 6 | **배포 완료** | (자동) | 모든 스테이지 녹색 체크 ✅ |
| 7 | **서비스 확인** | 브라우저 접속 | 각 URL에서 최신 코드 반영 확인 |

---

## 🛠️ 트러블슈팅

| 문제 | 원인 | 해결 |
|---|---|---|
| 401 Unauthorized | Trigger Token 오류 | GitLab에서 새 Trigger Token 발급 |
| Pipeline 실행 안됨 | 브랜치 조건 불일치 | `.gitlab-ci.yml`의 `only` 브랜치 확인 |
| Docker push 실패 | Registry 인증 실패 | GitLab CI/CD Variables에 `CI_REGISTRY_PASSWORD` 재확인 |
| SSH 연결 실패 | known_hosts 미등록 | `ssh-keyscan -H NAS_IP` 재실행 |
| myapp3 새로고침 404 | Nginx SPA fallback 미설정 | `nginx.conf` `try_files $uri /index.html` 확인 |
| myapp2 API 연결 실패 | `NUXT_PUBLIC_API_BASE` 오류 | `docker-compose.yml` 환경변수 NAS IP 확인 |
| PowerShell 실행 오류 | ExecutionPolicy 제한 | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
