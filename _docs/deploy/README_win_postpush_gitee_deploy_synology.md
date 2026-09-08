# Windows Post-Push → Gitee Go → Synology Docker 배포 시나리오

## 📌 개요

```
개발자 PC (Windows)
  └─ git push
       └─ post-push hook (PowerShell)
            └─ deploy.ps1 -Target gitee
                 └─ Gitee WebHook API 또는 git push 이벤트 자동 감지
                      └─ Gitee Go Pipeline (.gitee/workflows/deploy.yml)
                           ├─ myapp1 : Spring Boot JAR 빌드 → Docker Image
                           ├─ myapp2 : Nuxt4 SSR 빌드      → Docker Image (Node.js 서버)
                           └─ myapp3 : Vue3 SPA 빌드        → Docker Image (Nginx 정적 파일)
                                └─ SSH → Synology Container Manager
```

> ⚠️ **Gitee 특이사항**  
> Gitee(码云)는 중국 Git 호스팅 서비스입니다. CI/CD는 **Gitee Go** (유료/무료 플랜)를 사용합니다.  
> Gitee Go Runner는 중국 서버에서 실행되므로 Synology가 내부망인 경우 **Self-hosted Runner 권장**합니다.

---

## 🏗️ 전체 아키텍처

| 구성요소 | 설명 |
|---|---|
| 개발 OS | Windows 10/11 |
| 소스관리 | Gitee (gitee.com) |
| CI/CD | Gitee Go Pipeline |
| 이미지 저장소 | Synology 내장 Docker Registry (5000포트) |
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
├── .gitee/
│   └── workflows/
│       └── deploy.yml          # Gitee Go Workflow (GitHub Actions 호환 문법)
├── docker-compose.yml          # Synology 배포용 Compose
├── .git/
│   └── hooks/
│       └── post-push
└── .vscode/
    └── tasks.json
```

---

## ⚙️ 1단계 — deploy.ps1 설정

Gitee Go는 `git push` 이벤트만으로 파이프라인이 자동 실행됩니다.  
`deploy.ps1`은 WebHook 수동 트리거 또는 상태 확인 목적으로 사용합니다.

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
    [string]$Target    = "gitee",
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
    "gitee" {
        # ── Gitee WebHook 수동 트리거 ────────────────────────
        # Gitee 저장소 → 管理(설정) → WebHooks 에서 등록한 WebHook URL
        $webhookUrl   = "YOUR_GITEE_WEBHOOK_URL"
        # WebHook 등록 시 설정한 시크릿 토큰 (Gitee가 요청 검증에 사용)
        $webhookToken = "YOUR_GITEE_WEBHOOK_TOKEN"

        Write-Output "Gitee WebHook 트리거: $webhookUrl"

        # Gitee WebHook push 이벤트 형식으로 페이로드 구성
        $body = @{
            ref         = "refs/heads/$Branch"
            # ref : "refs/heads/브랜치명" 형식 (Gitee push 이벤트 규격)
            before      = "0000000000000000000000000000000000000000"
            after       = "0000000000000000000000000000000000000001"
            pusher      = @{ login = $User }
            sender      = @{ login = $User }
            head_commit = @{ message = "Manual deploy trigger by $User" }
        } | ConvertTo-Json -Depth 5

        try {
            Invoke-WebRequest -Uri $webhookUrl -Method Post `
                -Headers @{
                    "Content-Type"  = "application/json"
                    "X-Gitee-Token" = $webhookToken
                    # X-Gitee-Token : Gitee가 WebHook 요청 검증에 사용하는 헤더
                } `
                -Body $body `
                -UseBasicParsing
            Write-Output "✅ Gitee WebHook 트리거 성공"
            Write-Output "💡 Gitee Go Pipeline이 자동으로 실행됩니다."
        } catch {
            Write-Error "❌ Gitee WebHook 트리거 실패: $_"
            Write-Output "💡 git push만으로도 Gitee Go Pipeline이 자동 실행됩니다."
        }
    }
    default {
        Write-Warning "알 수 없는 Target: $Target"
    }
}
```

> **수정 필요 항목**
> - `YOUR_GITEE_WEBHOOK_URL` : Gitee WebHook 등록 후 받은 URL
> - `YOUR_GITEE_WEBHOOK_TOKEN` : WebHook 시크릿 토큰

---

## ⚙️ 2단계 — Git Post-Push Hook 설정

```bash
#!/bin/sh
# .git/hooks/post-push
# git push 완료 직후 자동 실행
# Gitee Go는 push 자체로 파이프라인이 실행되므로
# 이 훅은 배포 상태 알림/확인 목적으로 활용 가능
SCRIPT_DIR=$(git rev-parse --show-toplevel)
# git rev-parse --show-toplevel : 저장소 루트 절대경로 반환
powershell.exe -ExecutionPolicy Bypass -File "$SCRIPT_DIR/deploy.ps1" -Target "gitee"
```

```bash
# chmod +x : 실행 권한 부여 (없으면 Git이 훅 실행 안 함)
chmod +x .git/hooks/post-push
```

> 💡 Gitee Go는 `git push` 만으로 파이프라인이 자동 실행됩니다.  
> hook에서 별도 API 호출 없이 `echo "Gitee Go Pipeline 자동 실행됨"` 만 넣어도 충분합니다.

---

## ⚙️ 3단계 — VS Code tasks.json 설정

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Deploy → Gitee (현재 브랜치 WebHook)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "gitee"
      ],
      "group": { "kind": "build", "isDefault": true },
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    },
    {
      "label": "🚀 Deploy → Gitee (브랜치 직접 입력)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "gitee",
        "-Branch", "${input:branchName}"
      ],
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    },
    {
      "label": "📤 Git Push to Gitee (master)",
      "type": "shell",
      "command": "git",
      "args": ["push", "origin", "master"],
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "branchName",
      "type": "promptString",
      "description": "배포할 브랜치 이름을 입력하세요",
      "default": "master"
    }
  ]
}
```

**VS Code 수동 실행 방법:**
1. `Ctrl+Shift+B` → 기본 빌드 태스크 즉시 실행
2. `Ctrl+Shift+P` → `Tasks: Run Task` → 원하는 태스크 선택

---

## ⚙️ 4단계 — Gitee Go Workflow 작성

`.gitee/workflows/deploy.yml` (GitHub Actions 호환 문법):

```yaml
# .gitee/workflows/deploy.yml
# Gitee Go CI/CD Pipeline (GitHub Actions 문법과 유사)
name: Deploy to Synology

on:
  push:
    branches:
      - master   # Gitee 기본 브랜치명은 master
      - main

env:
  # Synology 내장 Docker Registry 주소
  REGISTRY: "192.168.1.100:5000"
  SYNOLOGY_HOST: "192.168.1.100"
  SYNOLOGY_USER: "admin"
  DEPLOY_PATH: "/volume1/docker/myapp"

jobs:
  build-and-deploy:
    # runs-on: self-hosted 를 강력 권장
    # Gitee Go 공용 Runner는 중국 서버 → Synology(내부망) 접근 불가
    runs-on: self-hosted
    # self-hosted Runner를 내부 서버 또는 Synology에 설치하면
    # 내부망 직접 접근 + npm/gradle 캐시 재활용 → 빌드 속도 향상

    steps:
      # ── Checkout ────────────────────────────────────────────
      - name: 코드 체크아웃
        uses: actions/checkout@v4
        # actions/checkout : 현재 저장소 코드를 Runner 워크스페이스로 다운로드

      # ── JDK 설정 ────────────────────────────────────────────
      - name: JDK 21 설정
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: gradle   # Gradle 의존성 캐시 (빌드 속도 향상)

      # ── Node.js 설정 ─────────────────────────────────────────
      - name: Node.js 20 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # ── myapp1 빌드 (Spring Boot) ────────────────────────────
      - name: myapp1 Spring Boot 빌드
        run: |
          cd myapp1
          # chmod +x : Gradle Wrapper 실행 권한 부여 (Linux Runner에서 필요)
          chmod +x ./gradlew
          # clean     : 이전 빌드 결과물 삭제
          # bootJar   : 실행 가능한 Fat JAR 생성
          ./gradlew clean bootJar

      # ── myapp2 빌드 (Nuxt4 SSR) ──────────────────────────────
      - name: myapp2 Nuxt4 빌드
        run: |
          cd myapp2
          # npm ci : package-lock.json 기준 정확한 버전 설치
          npm ci
          # npm run build : Nuxt4 SSR 빌드 → .output/ 생성
          npm run build

      # ── myapp3 빌드 (Vue3 SPA) ───────────────────────────────
      - name: myapp3 Vue3 빌드
        run: |
          cd myapp3
          npm ci
          # Vite 빌드 → dist/ 생성 (index.html + 해시 JS/CSS)
          npm run build

      # ── Docker 이미지 빌드 & Synology Registry 푸시 ──────────
      - name: Docker 이미지 빌드 및 푸시
        env:
          REGISTRY_USER: ${{ secrets.REGISTRY_USER }}
          REGISTRY_PASS: ${{ secrets.REGISTRY_PASS }}
        run: |
          # Synology 내장 Registry 로그인
          echo "$REGISTRY_PASS" | docker login ${{ env.REGISTRY }} -u "$REGISTRY_USER" --password-stdin

          # myapp1 (Spring Boot JAR → JRE 이미지)
          # docker build -t : 이미지에 Registry주소/이름:태그 형식으로 이름 지정
          docker build -t ${{ env.REGISTRY }}/myapp1:latest ./myapp1
          # docker push : 이미지를 Registry 서버에 업로드
          docker push ${{ env.REGISTRY }}/myapp1:latest

          # myapp2 (Nuxt4 SSR → Node.js 서버 이미지)
          docker build -t ${{ env.REGISTRY }}/myapp2:latest ./myapp2
          docker push ${{ env.REGISTRY }}/myapp2:latest

          # myapp3 (Vue3 SPA → Nginx 정적 파일 이미지)
          docker build -t ${{ env.REGISTRY }}/myapp3:latest ./myapp3
          docker push ${{ env.REGISTRY }}/myapp3:latest

      # ── Synology SSH 배포 ────────────────────────────────────
      - name: Synology 배포
        env:
          SYNOLOGY_KEY: ${{ secrets.SYNOLOGY_SSH_KEY }}
        run: |
          # SSH 키 파일 준비
          mkdir -p ~/.ssh
          echo "$SYNOLOGY_KEY" > ~/.ssh/id_rsa
          # chmod 600 : SSH 보안 요구사항 (소유자만 읽기 가능, 없으면 SSH 거부)
          chmod 600 ~/.ssh/id_rsa
          # ssh-keyscan : 원격 호스트 공개키를 known_hosts에 추가
          #               (최초 접속 시 "Are you sure?" 프롬프트 방지)
          ssh-keyscan -H ${{ env.SYNOLOGY_HOST }} >> ~/.ssh/known_hosts

          ssh ${{ env.SYNOLOGY_USER }}@${{ env.SYNOLOGY_HOST }} "
            cd ${{ env.DEPLOY_PATH }} &&
            docker-compose pull &&
            docker-compose up -d --remove-orphans &&
            docker image prune -f &&
            echo '✅ 배포 완료'
          "
          # docker-compose pull        : Registry에서 최신 이미지 다운로드
          # docker-compose up -d       : 백그라운드로 모든 서비스 기동/재기동
          # --remove-orphans           : compose 파일에서 제거된 컨테이너 자동 삭제
          # docker image prune -f      : 사용하지 않는 이미지 삭제 (디스크 공간 확보)
```

---

## ⚙️ 5단계 — Dockerfile 작성

### myapp1 — Spring Boot (JAR)

```dockerfile
# myapp1/Dockerfile
# eclipse-temurin:21-jre-alpine : JRE 21 + Alpine (실행 전용)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Gradle bootJar 결과물 복사 (build/libs/*.jar)
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
# npm ci : 재현 가능한 정확한 버전 설치 (package-lock.json 기준)
RUN npm ci
COPY . .
# npm run build → .output/
#   .output/server/index.mjs : Node.js H3 서버 엔트리포인트
#   .output/public/          : 정적 에셋 (JS, CSS, 이미지)
RUN npm run build

# ── 실행 스테이지 ────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
# 빌드 결과물(.output)만 복사 → 이미지 크기 최소화
COPY --from=builder /app/.output ./output
EXPOSE 3000
# node output/server/index.mjs : Nuxt4 Nitro 기반 SSR 서버 시작
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
# Vite 빌드 → dist/index.html + dist/assets/*.{js,css}
RUN npm run build

# ── 실행 스테이지 ────────────────────────────────────────────
# nginx:alpine : ~7MB 초경량 Nginx 이미지
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Vue Router History 모드 fallback 설정 (없으면 새로고침 시 404)
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
        # Vue Router History 모드: 파일 없으면 index.html fallback
        # /user/123 같은 URL 직접 접속/새로고침 시 정상 동작
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        # Vite 해시 파일명 → 1년 캐시, immutable로 재검증 생략
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

---

## ⚙️ 6단계 — Gitee Go Secrets 설정

Gitee → 저장소 → **流水线(Go)** → **设置** → **密钥变量(Secrets)**:

| 변수명 | 값 |
|---|---|
| `SYNOLOGY_HOST` | Synology NAS IP (예: `192.168.1.100`) |
| `SYNOLOGY_USER` | Synology SSH 사용자명 |
| `SYNOLOGY_SSH_KEY` | Synology SSH 개인키 전체 내용 |
| `REGISTRY_USER` | Synology Docker Registry 사용자명 |
| `REGISTRY_PASS` | Synology Docker Registry 비밀번호 |

---

## ⚙️ 7단계 — Gitee WebHook 설정

Gitee → 저장소 → **管理(설정)** → **WebHooks** → **添加 WebHook**:

| 항목 | 값 |
|---|---|
| URL | 수신 서버 URL 또는 중계 서버 URL |
| 密码(시크릿) | `YOUR_GITEE_WEBHOOK_TOKEN` |
| 触发事件 | ✅ Push 이벤트 |

---

## ⚙️ 8단계 — docker-compose.yml (Synology 배포용)

`/volume1/docker/myapp/docker-compose.yml`:

```yaml
version: "3.9"

services:

  # ── myapp1 : Spring Boot Backend ─────────────────────────────
  myapp1:
    image: 192.168.1.100:5000/myapp1:latest
    # 192.168.1.100:5000 : Synology 내장 Docker Registry 주소
    container_name: myapp1
    restart: unless-stopped
    # unless-stopped : 비정상 종료 시 자동 재시작 (수동 stop 제외)
    ports:
      - "8080:8080"
      # "호스트포트:컨테이너포트" 형식
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:mysql://db:3306/myapp
      # "db" : 같은 docker-compose 네트워크 내 서비스명을 호스트명으로 사용
      - DB_USER=myapp
      - DB_PASS=secret
    depends_on:
      - db   # db 서비스 시작 후 myapp1 시작
    networks:
      - myapp-net

  # ── myapp2 : Nuxt4 SSR Frontend ──────────────────────────────
  myapp2:
    image: 192.168.1.100:5000/myapp2:latest
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
    image: 192.168.1.100:5000/myapp3:latest
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
    # bridge 네트워크: 서비스끼리 서비스명으로 통신 가능

volumes:
  db-data:
```

---

## ⚙️ 9단계 — Synology Docker Registry 활성화

1. Synology DSM → **Container Manager** 열기
2. **레지스트리** → **설정** → ✅ **활성화** 체크
3. 포트: `5000` (기본값 유지)
4. Synology 방화벽 → 포트 `5000` 허용 규칙 추가

---

## ⚙️ 10단계 — Self-hosted Runner 설치 (권장)

Gitee Go 공용 Runner는 중국 서버이므로 내부망 Synology에 접근 불가.  
내부 서버 또는 Synology에 Self-hosted Runner를 설치합니다.

```bash
# Gitee → 저장소 → 流水线(Go) → 设置(설정) → Runner → 添加 Runner
# 안내에 따라 Runner 에이전트 다운로드 및 등록
```

**deploy.yml에서 Self-hosted Runner 사용:**

```yaml
jobs:
  build-and-deploy:
    runs-on: self-hosted   # 공용 Runner 대신 Self-hosted Runner 사용
```

---

## 🔄 전체 흐름 요약

```
1. 코드 수정 후 git push origin master
      ↓
2. .git/hooks/post-push 자동 실행
      ↓
3. deploy.ps1 -Target gitee 실행 (WebHook 알림)
      ↓
4. Gitee push 이벤트 감지 → Gitee Go Pipeline 자동 실행
      ↓
5. .gitee/workflows/deploy.yml 실행
   ├── myapp1: ./gradlew clean bootJar
   ├── myapp2: npm ci && npm run build (SSR)
   ├── myapp3: npm ci && npm run build (SPA)
   ├── docker build × 3 → Synology Registry 푸시
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
| 4 | **푸시** | `git push origin master` | Gitee 원격 저장소로 전송 | 터미널: `Writing objects: 100%` |
| 5 | **훅 자동 실행** | (자동) | `.git/hooks/post-push` → `deploy.ps1 -Target gitee` | 터미널: `Target: gitee / Branch: master` 출력 |
| 6 | **WebHook 트리거** | (자동) | Gitee WebHook POST 요청 전송 | 터미널: `✅ Gitee WebHook 트리거 성공` |
| 7 | **Pipeline 시작** | (자동) | Gitee Go가 push 이벤트 감지 → Runner에서 코드 체크아웃 | Gitee → 流水线(CI/CD) → 실행 중 파이프라인 확인 |
| 8 | **myapp1 빌드** | (자동) | `chmod +x gradlew && ./gradlew clean bootJar` | Pipeline 로그: `BUILD SUCCESSFUL` |
| 9 | **myapp2 빌드** | (자동) | `npm ci && npm run build` (Nuxt4 SSR) | Pipeline 로그: `✓ You can now deploy .output/` |
| 10 | **myapp3 빌드** | (자동) | `npm ci && npm run build` (Vue3 Vite) | Pipeline 로그: `✓ built in Xs` |
| 11 | **Registry 로그인** | (자동) | Synology Registry에 docker login | Pipeline 로그: `Login Succeeded` |
| 12 | **이미지 빌드/푸시** | (자동) | `docker build & push` × 3 → Synology Registry | Pipeline 로그: `Successfully pushed` × 3 |
| 13 | **Synology 배포** | (자동) | SSH → `docker-compose pull && up -d` | Pipeline 로그: `✅ 배포 완료` |
| 14 | **컨테이너 기동** | (자동) | Synology에서 3개 컨테이너 신규 시작 | Synology DSM → Container Manager → `실행 중` ✅ |
| 15 | **서비스 확인** | 브라우저 접속 | — | `http://NAS_IP:8080` / `:3000` / `:8090` 각각 접속 |
| 16 | **API 헬스체크** | 터미널 실행 | — | `curl http://NAS_IP:8080/actuator/health` → `{"status":"UP"}` |
| 17 | **Pipeline 이력 확인** | Gitee 접속 | — | Gitee → **流水线** → 실행 이력 및 로그 확인 |

### 수동 배포 흐름 (VS Code에서 직접 실행)

| # | 단계 | 개발자 행동 | 결과 확인 방법 |
|---|---|---|---|
| 1 | **태스크 실행** | `Ctrl+Shift+B` | 태스크 선택 드롭다운 표시 |
| 2 | **태스크 선택** | `🚀 Deploy → Gitee (현재 브랜치 WebHook)` | VS Code 하단 터미널 열림 |
| 3 | **실행 출력** | (자동) | 터미널: `Target: gitee / Branch: master` 출력 |
| 4 | **트리거 성공** | (자동) | 터미널: `✅ Gitee WebHook 트리거 성공` |
| 5 | **Pipeline 확인** | Gitee 브라우저 접속 | Gitee → 저장소 → **流水线** 탭 |
| 6 | **배포 완료** | (자동) | 모든 스텝 성공 (녹색 체크) |
| 7 | **서비스 확인** | 브라우저 접속 | 각 URL에서 최신 코드 반영 확인 |

---

## 🌐 Gitee 특수 고려사항

### 네트워크 접근 문제

Gitee Go 공용 Runner는 중국 서버에서 실행됩니다. Synology가 내부망에 있다면:

| 방법 | 설명 | 난이도 |
|---|---|---|
| **Self-hosted Runner** (권장) | 내부 서버에 Runner 설치 → 내부망 직접 접근 | ⭐⭐ |
| 공인 IP + 포트포워딩 | 라우터에서 Synology SSH 포트 외부 노출 | ⭐⭐⭐ (보안 위험) |
| frp / ngrok 터널링 | 내부 Synology를 외부에서 접근 가능하게 터널 | ⭐⭐⭐ |

---

## 🛠️ 트러블슈팅

| 문제 | 원인 | 해결 |
|---|---|---|
| Pipeline 실행 안됨 | `.gitee/workflows/` 경로 오류 | 디렉터리명 정확히 `.gitee/workflows/` 확인 |
| WebHook 서명 오류 | 시크릿 토큰 불일치 | Gitee WebHook 설정의 密码 값 재확인 |
| SSH 연결 실패 (내부망) | 공용 Runner가 내부망 접근 불가 | Self-hosted Runner 설치 |
| Docker Registry 인증 실패 | Synology Registry 비활성화 | DSM Container Manager → Registry 활성화 확인 |
| myapp3 새로고침 404 | Nginx SPA fallback 미설정 | `nginx.conf` `try_files $uri /index.html` 확인 |
| myapp2 API 연결 실패 | `NUXT_PUBLIC_API_BASE` 오류 | `docker-compose.yml` NAS IP 확인 |
| PowerShell 실행 오류 | ExecutionPolicy 제한 | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| gradlew 권한 없음 | Linux Runner에서 실행 권한 부재 | Workflow에 `chmod +x ./gradlew` 추가 |
