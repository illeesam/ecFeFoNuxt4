# Windows Post-Push → GitHub Actions → Synology Docker 배포 시나리오

## 📌 개요

```
개발자 PC (Windows)
  └─ git push
       └─ post-push hook (PowerShell)
            └─ deploy.ps1 -Target github
                 └─ GitHub Actions workflow_dispatch API
                      └─ .github/workflows/deploy.yml
                           ├─ myapp1 : Spring Boot JAR 빌드 → Docker Image → GHCR
                           ├─ myapp2 : Nuxt4 SSR 빌드      → Docker Image → GHCR
                           └─ myapp3 : Vue3 SPA 빌드        → Docker Image → GHCR
                                └─ SSH → Synology Container Manager
```

---

## 🏗️ 전체 아키텍처

| 구성요소 | 설명 |
|---|---|
| 개발 OS | Windows 10/11 |
| CI/CD | GitHub Actions |
| 이미지 저장소 | GitHub Container Registry (`ghcr.io`) |
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
├── myapp1/                           # Spring Boot 프로젝트
│   ├── Dockerfile
│   └── build.gradle
├── myapp2/                           # Nuxt4 SSR 프로젝트
│   ├── Dockerfile
│   └── nuxt.config.ts
├── myapp3/                           # Vue3 SPA 프로젝트
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts
├── deploy.ps1                        # 배포 트리거 스크립트
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions Workflow
├── docker-compose.yml                # Synology 배포용 Compose
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
    [string]$Target    = "github",
    [string]$Branch    = $(git rev-parse --abbrev-ref HEAD),
    # git rev-parse --abbrev-ref HEAD : 현재 체크아웃된 브랜치 이름 반환
    [string]$RemoteUrl = $(git config --get remote.origin.url),
    # git config --get remote.origin.url : origin 원격 저장소 URL 읽어옴
    [string]$User      = $(git config user.name)
    # git config user.name : git 설정의 사용자 이름 읽어옴
)

Write-Output "========================================"
Write-Output " Deploy 요청"
Write-Output " Target  : $Target"
Write-Output " Branch  : $Branch"
Write-Output " Remote  : $RemoteUrl"
Write-Output " User    : $User"
Write-Output "========================================"

switch ($Target) {
    "github" {
        $owner       = "YOUR_GITHUB_OWNER"    # GitHub 사용자명 또는 조직명
        $repo        = "YOUR_REPO_NAME"        # 저장소 이름
        $githubToken = "YOUR_GITHUB_PAT"       # Personal Access Token (repo + workflow 권한)
        $workflowId  = "deploy.yml"            # .github/workflows/ 의 파일명

        # GitHub Actions workflow_dispatch API
        # /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
        # : 특정 Workflow를 외부에서 수동으로 트리거하는 API 엔드포인트
        $uri = "https://api.github.com/repos/$owner/$repo/actions/workflows/$workflowId/dispatches"

        # 요청 Body 구성 (JSON)
        # ref    : 어느 브랜치/태그에서 Workflow를 실행할지 지정
        # inputs : workflow_dispatch.inputs 에 정의된 입력 파라미터 전달
        $body = @{
            ref    = $Branch
            inputs = @{
                triggered_by = $User
                deploy_env   = "production"
            }
        } | ConvertTo-Json -Depth 3
        # ConvertTo-Json -Depth 3 : 중첩 객체를 깊이 3까지 JSON으로 직렬화

        try {
            # GitHub API 인증: Bearer 토큰 방식 (PAT 또는 GitHub App 토큰)
            # Accept: application/vnd.github+json : GitHub API v3 JSON 응답 요청
            # X-GitHub-Api-Version : API 버전 고정 (Breaking change 방지)
            Invoke-WebRequest -Uri $uri -Method Post `
                -Headers @{
                    Authorization          = "token $githubToken"
                    Accept                 = "application/vnd.github+json"
                    "X-GitHub-Api-Version" = "2022-11-28"
                } `
                -Body $body `
                -ContentType "application/json" `
                -UseBasicParsing
            Write-Output "✅ GitHub Actions 트리거 성공"
        } catch {
            Write-Error "❌ GitHub Actions 트리거 실패: $_"
        }
    }
    default {
        Write-Warning "알 수 없는 Target: $Target"
    }
}
```

> **수정 필요 항목**
> - `YOUR_GITHUB_OWNER` : GitHub 사용자명 또는 조직명
> - `YOUR_REPO_NAME` : 저장소 이름
> - `YOUR_GITHUB_PAT` : GitHub PAT (권한: `repo` + `workflow`)

---

## ⚙️ 2단계 — Git Post-Push Hook 설정

```bash
#!/bin/sh
# .git/hooks/post-push
# git push 완료 직후 자동 실행
# git rev-parse --show-toplevel : 저장소 루트 절대경로 반환
SCRIPT_DIR=$(git rev-parse --show-toplevel)
# -ExecutionPolicy Bypass : 이 실행에 한해 PowerShell 실행 정책 우회
powershell.exe -ExecutionPolicy Bypass -File "$SCRIPT_DIR/deploy.ps1" -Target "github"
```

```bash
# chmod +x : 실행 권한 부여 (없으면 Git이 훅 실행 안 함)
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
      "label": "🚀 Deploy → GitHub Actions (현재 브랜치)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "github"
      ],
      "group": { "kind": "build", "isDefault": true },
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    },
    {
      "label": "🚀 Deploy → GitHub Actions (브랜치 직접 입력)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "github",
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

## ⚙️ 4단계 — GitHub Actions Workflow 작성

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Synology

on:
  push:
    branches: [main]
  # workflow_dispatch : 외부 API 또는 GitHub UI에서 수동으로 Workflow 실행 가능
  workflow_dispatch:
    inputs:
      triggered_by:
        description: '트리거한 사용자 (deploy.ps1에서 전달)'
        required: false
        default: 'manual'
      deploy_env:
        description: '배포 환경'
        required: false
        default: 'production'

env:
  # GHCR(GitHub Container Registry) : GitHub에서 제공하는 Docker Registry
  REGISTRY: ghcr.io
  # ${{ github.repository_owner }} : 저장소 소유자 이름 (자동 변수)
  IMAGE_MYAPP1: ghcr.io/${{ github.repository_owner }}/myapp1
  IMAGE_MYAPP2: ghcr.io/${{ github.repository_owner }}/myapp2
  IMAGE_MYAPP3: ghcr.io/${{ github.repository_owner }}/myapp3

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read    # 소스코드 읽기 권한
      packages: write   # GHCR 이미지 push 권한

    steps:
      # ── Checkout ────────────────────────────────────────────
      - name: 코드 체크아웃
        uses: actions/checkout@v4
        # actions/checkout : 현재 저장소의 코드를 Runner 워크스페이스로 다운로드

      # ── JDK 설정 ────────────────────────────────────────────
      - name: JDK 21 설정
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'   # Eclipse Temurin (OpenJDK)
          cache: gradle             # Gradle 의존성 캐시 (빌드 속도 향상)

      # ── Node.js 설정 ─────────────────────────────────────────
      - name: Node.js 20 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          # cache-dependency-path : 복수 package-lock.json 중 어느 것을 캐시 키로 사용할지 지정
          cache-dependency-path: |
            myapp2/package-lock.json
            myapp3/package-lock.json

      # ── myapp1 빌드 (Spring Boot) ────────────────────────────
      - name: myapp1 Spring Boot 빌드
        run: |
          cd myapp1
          # ./gradlew : Gradle Wrapper 실행 (로컬 Gradle 설치 불필요)
          # clean     : 이전 빌드 결과물 삭제
          # bootJar   : 내장 Tomcat 포함 실행 가능 JAR 생성
          ./gradlew clean bootJar

      # ── myapp2 빌드 (Nuxt4 SSR) ──────────────────────────────
      - name: myapp2 Nuxt4 빌드
        run: |
          cd myapp2
          # npm ci : package-lock.json 기준 정확한 버전 설치 (CI 환경 권장)
          npm ci
          # npm run build : Nuxt4 SSR 빌드 → .output/ 생성
          npm run build

      # ── myapp3 빌드 (Vue3 SPA) ───────────────────────────────
      - name: myapp3 Vue3 빌드
        run: |
          cd myapp3
          npm ci
          # npm run build (Vite) : Vue3 SPA → dist/ 생성
          npm run build

      # ── GHCR 로그인 ──────────────────────────────────────────
      - name: GHCR 로그인
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          # ${{ secrets.GITHUB_TOKEN }} : GitHub가 자동 발급하는 임시 토큰
          # packages:write 권한이 있으면 GHCR push 가능
          password: ${{ secrets.GITHUB_TOKEN }}

      # ── myapp1 Docker Build & Push ───────────────────────────
      - name: myapp1 Docker 이미지 빌드 & 푸시
        uses: docker/build-push-action@v5
        with:
          context: ./myapp1
          push: true
          tags: |
            ${{ env.IMAGE_MYAPP1 }}:latest
            ${{ env.IMAGE_MYAPP1 }}:${{ github.sha }}
            # ${{ github.sha }} : 전체 커밋 해시 → 태그로 사용하면 특정 커밋으로 롤백 가능

      # ── myapp2 Docker Build & Push ───────────────────────────
      - name: myapp2 Docker 이미지 빌드 & 푸시
        uses: docker/build-push-action@v5
        with:
          context: ./myapp2
          push: true
          tags: |
            ${{ env.IMAGE_MYAPP2 }}:latest
            ${{ env.IMAGE_MYAPP2 }}:${{ github.sha }}

      # ── myapp3 Docker Build & Push ───────────────────────────
      - name: myapp3 Docker 이미지 빌드 & 푸시
        uses: docker/build-push-action@v5
        with:
          context: ./myapp3
          push: true
          tags: |
            ${{ env.IMAGE_MYAPP3 }}:latest
            ${{ env.IMAGE_MYAPP3 }}:${{ github.sha }}

      # ── Synology SSH 배포 ────────────────────────────────────
      - name: Synology 배포
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SYNOLOGY_HOST }}
          username: ${{ secrets.SYNOLOGY_USER }}
          key: ${{ secrets.SYNOLOGY_SSH_KEY }}
          script: |
            cd /volume1/docker/myapp
            # GHCR에서 이미지를 pull하기 위해 Synology에서도 로그인 필요
            echo ${{ secrets.GHCR_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
            # docker-compose pull : 최신 이미지 다운로드
            docker-compose pull
            # docker-compose up -d : 백그라운드 기동, --remove-orphans : 삭제된 서비스 컨테이너 정리
            docker-compose up -d --remove-orphans
            # 사용하지 않는 이미지 삭제 (디스크 공간 확보)
            docker image prune -f
            echo "✅ 배포 완료: $(date)"
```

---

## ⚙️ 5단계 — Dockerfile 작성

### myapp1 — Spring Boot (JAR)

```dockerfile
# myapp1/Dockerfile
# eclipse-temurin:21-jre-alpine : JRE 21 + Alpine (실행 전용)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Gradle bootJar 결과물 복사
COPY build/libs/*.jar app.jar
EXPOSE 8080
# java -jar : Spring Boot 내장 Tomcat 포함 JAR 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### myapp2 — Nuxt4 SSR (Node.js 서버)

```dockerfile
# myapp2/Dockerfile
# SSR: Node.js 서버가 요청마다 Vue 컴포넌트 렌더링 → 완성된 HTML 반환

# ── 빌드 스테이지 ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# npm ci : 재현 가능한 정확한 버전 설치
RUN npm ci
COPY . .
# npm run build → .output/ 생성 (.output/server/index.mjs 가 서버 엔트리)
RUN npm run build

# ── 실행 스테이지 ────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
# 빌드 결과물(.output)만 복사 → 이미지 크기 최소화
COPY --from=builder /app/.output ./output
EXPOSE 3000
# Nuxt4 SSR 서버 시작 (Node.js 프로세스 상시 실행)
CMD ["node", "output/server/index.mjs"]
```

### myapp3 — Vue3 SPA (Nginx 정적 서버)

```dockerfile
# myapp3/Dockerfile
# SPA: Vite 빌드 결과물(dist/)을 Nginx가 정적 서빙 (Node.js 불필요)

# ── 빌드 스테이지 ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite 빌드 → dist/ (index.html + 해시 파일명 JS/CSS)
RUN npm run build

# ── 실행 스테이지 ────────────────────────────────────────────
# nginx:alpine : ~7MB 초경량 Nginx 이미지
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Vue Router History 모드 fallback 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# daemon off : 포그라운드 실행 (컨테이너 메인 프로세스 유지 필수)
CMD ["nginx", "-g", "daemon off;"]
```

**myapp3/nginx.conf:**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        # try_files : 파일 없으면 index.html fallback
        # Vue Router History 모드에서 직접 URL 접속/새로고침 시 정상 동작
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        # Vite 해시 파일명 → 1년 캐시, immutable 재검증 생략
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

---

## ⚙️ 6단계 — GitHub Secrets 설정

GitHub → 저장소 → **Settings** → **Secrets and variables** → **Actions**:

| Secret 이름 | 값 |
|---|---|
| `SYNOLOGY_HOST` | Synology NAS IP (예: `192.168.1.100`) |
| `SYNOLOGY_USER` | Synology SSH 사용자명 |
| `SYNOLOGY_SSH_KEY` | Synology SSH 개인키 전체 내용 (`-----BEGIN...END-----`) |
| `GHCR_TOKEN` | GHCR 접근용 PAT (`read:packages` 권한) |

---

## ⚙️ 7단계 — GitHub PAT 발급

**`deploy.ps1`용 PAT (workflow_dispatch 트리거):**
1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token** → 권한 체크:
   - ✅ `repo` (전체)
   - ✅ `workflow`
3. 생성된 토큰을 `deploy.ps1`의 `YOUR_GITHUB_PAT`에 입력

**Synology에서 GHCR pull용 PAT:**
1. 동일 경로에서 새 토큰 생성
2. 권한: ✅ `read:packages`
3. GitHub Secrets의 `GHCR_TOKEN`에 등록

---

## ⚙️ 8단계 — docker-compose.yml (Synology 배포용)

`/volume1/docker/myapp/docker-compose.yml`:

```yaml
version: "3.9"

services:

  # ── myapp1 : Spring Boot Backend ─────────────────────────────
  myapp1:
    image: ghcr.io/YOUR_GITHUB_OWNER/myapp1:latest
    # ghcr.io : GitHub Container Registry (GitHub Actions로 push한 이미지)
    container_name: myapp1
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:mysql://db:3306/myapp
      # "db" : 같은 docker-compose 네트워크 내 서비스명을 호스트명으로 사용
      - DB_USER=myapp
      - DB_PASS=secret
    depends_on:
      - db
    networks:
      - myapp-net

  # ── myapp2 : Nuxt4 SSR Frontend ──────────────────────────────
  myapp2:
    image: ghcr.io/YOUR_GITHUB_OWNER/myapp2:latest
    container_name: myapp2
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NUXT_PUBLIC_API_BASE=http://192.168.1.100:8080
      # NUXT_PUBLIC_ : Nuxt4 공개 환경변수 (클라이언트+서버 양쪽 접근 가능)
    networks:
      - myapp-net

  # ── myapp3 : Vue3 SPA Frontend (Nginx) ───────────────────────
  myapp3:
    image: ghcr.io/YOUR_GITHUB_OWNER/myapp3:latest
    container_name: myapp3
    restart: unless-stopped
    ports:
      - "8090:80"
      # Nginx는 컨테이너 내부 80번, 호스트에서는 8090번으로 접근
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
3. deploy.ps1 -Target github 실행
      ↓
4. GitHub Actions workflow_dispatch API 호출
      ↓
5. deploy.yml Workflow 실행
   ├── myapp1: ./gradlew clean bootJar
   ├── myapp2: npm ci && npm run build (SSR)
   ├── myapp3: npm ci && npm run build (SPA)
   ├── docker build × 3 → ghcr.io 푸시
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
| 4 | **푸시** | `git push origin main` | GitHub 원격 저장소로 전송 | 터미널: `Writing objects: 100%` |
| 5 | **훅 자동 실행** | (자동) | `.git/hooks/post-push` → `deploy.ps1 -Target github` | 터미널: `Target: github / Branch: main` 출력 |
| 6 | **Workflow 트리거** | (자동) | GitHub API `workflow_dispatch` POST 요청 | 터미널: `✅ GitHub Actions 트리거 성공` |
| 7 | **Actions 시작** | (자동) | ubuntu-latest Runner에서 코드 체크아웃 | GitHub → Actions 탭 → 실행 중 Workflow 확인 |
| 8 | **myapp1 빌드** | (자동) | `./gradlew clean bootJar` | Actions 로그: `BUILD SUCCESSFUL` |
| 9 | **myapp2 빌드** | (자동) | `npm ci && npm run build` (Nuxt4 SSR) | Actions 로그: `✓ You can now deploy .output/` |
| 10 | **myapp3 빌드** | (자동) | `npm ci && npm run build` (Vue3 Vite) | Actions 로그: `✓ built in Xs` |
| 11 | **GHCR 로그인** | (자동) | `GITHUB_TOKEN`으로 ghcr.io 인증 | Actions 로그: `Login Succeeded` |
| 12 | **이미지 빌드/푸시** | (자동) | `docker build & push` × 3 → ghcr.io | Actions 로그: `digest: sha256:...` × 3 |
| 13 | **Synology 배포** | (자동) | SSH → `docker-compose pull && up -d` | Actions 로그: `✅ 배포 완료` |
| 14 | **컨테이너 기동** | (자동) | Synology에서 3개 컨테이너 갱신 시작 | Synology DSM → Container Manager → `실행 중` ✅ |
| 15 | **서비스 확인** | 브라우저 접속 | — | `http://NAS_IP:8080` / `:3000` / `:8090` 각각 접속 |
| 16 | **API 헬스체크** | 터미널 실행 | — | `curl http://NAS_IP:8080/actuator/health` → `{"status":"UP"}` |
| 17 | **이미지 확인** | GitHub 접속 | — | GitHub → **Packages** 탭 → myapp1/2/3 이미지 및 태그 확인 |
| 18 | **배포 이력 확인** | GitHub Actions 접속 | — | **Actions** 탭 → Deploy to Synology → 각 실행 이력 |

### 수동 배포 흐름 (VS Code에서 직접 실행)

| # | 단계 | 개발자 행동 | 결과 확인 방법 |
|---|---|---|---|
| 1 | **태스크 실행** | `Ctrl+Shift+B` | 태스크 선택 드롭다운 표시 |
| 2 | **태스크 선택** | `🚀 Deploy → GitHub Actions (현재 브랜치)` | VS Code 하단 터미널 열림 |
| 3 | **실행 출력** | (자동) | 터미널: `Target: github / Branch: main` 출력 |
| 4 | **트리거 성공** | (자동) | 터미널: `✅ GitHub Actions 트리거 성공` |
| 5 | **Actions 확인** | GitHub 브라우저 접속 | `https://github.com/OWNER/REPO/actions` |
| 6 | **배포 완료** | (자동) | Workflow 모든 스텝 녹색 체크 ✅ |
| 7 | **서비스 확인** | 브라우저 접속 | 각 URL에서 최신 코드 반영 확인 |

---

## 🛠️ 트러블슈팅

| 문제 | 원인 | 해결 |
|---|---|---|
| 422 Unprocessable Entity | 브랜치가 원격에 없음 | `git push` 후 Workflow 트리거 또는 브랜치명 확인 |
| 404 Not Found | owner/repo 또는 workflow 파일명 오류 | `deploy.ps1` 변수값 재확인 |
| GHCR push 실패 | `packages:write` 권한 없음 | PAT에 `packages:write` 권한 추가 후 재발급 |
| Synology docker pull 실패 | `read:packages` 권한 없음 | `GHCR_TOKEN` Secret에 `read:packages` PAT 재등록 |
| SSH 연결 실패 | Synology SSH 비활성화 | DSM → 터미널 및 SNMP → SSH 서비스 활성화 |
| myapp3 새로고침 404 | Nginx SPA fallback 미설정 | `nginx.conf` `try_files $uri /index.html` 확인 |
| myapp2 API 연결 실패 | `NUXT_PUBLIC_API_BASE` 오류 | `docker-compose.yml` 환경변수 NAS IP 확인 |
| PowerShell 실행 오류 | ExecutionPolicy 제한 | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
