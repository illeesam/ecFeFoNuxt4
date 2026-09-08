# Windows Post-Push → Jenkins → Synology Docker 배포 시나리오

## 📌 개요

```
개발자 PC (Windows)
  └─ git push
       └─ post-push hook (PowerShell)
            └─ deploy.ps1 -Target jenkins
                 └─ Jenkins CI/CD Pipeline
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
| CI/CD 서버 | Jenkins (별도 서버 또는 Docker) |
| 배포 대상 | Synology NAS — Container Manager (Docker) |
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
| 컨테이너 | `nginx:alpine` (매우 가벼움 ~7MB) |
| 기본 포트 | `80` (docker-compose에서 8090으로 매핑) |
| 장점 | 서버 부하 없음, 배포 단순, 빌드 빠름 |
| 단점 | SEO 불리, 첫 로딩 시 JS 번들 다운로드 필요 |
| 적합 | 관리자 대시보드, 내부 ERP/CRM, 로그인 필요 내부 시스템 |

> **Nuxt4 Static (npm run generate)** : Nuxt4를 정적 파일로 빌드하는 방식도 있습니다.  
> `npm run generate` → `.output/public/` 생성 → Nginx로 서빙. SSR 없이 Nuxt 파일 구조만 쓸 때 사용.

---

## 📁 프로젝트 파일 구조

```
project-root/
├── myapp1/                     # Spring Boot 프로젝트
│   ├── Dockerfile
│   ├── build.gradle
│   └── src/
├── myapp2/                     # Nuxt4 SSR 프로젝트
│   ├── Dockerfile
│   ├── nuxt.config.ts
│   └── pages/
├── myapp3/                     # Vue3 SPA 프로젝트
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   └── src/
├── deploy.ps1                  # 배포 트리거 스크립트 (Windows PowerShell)
├── Jenkinsfile                 # Jenkins Pipeline 정의
├── docker-compose.yml          # Synology 배포용 Compose 파일
├── .git/
│   └── hooks/
│       └── post-push           # git push 완료 후 자동 실행되는 Git 클라이언트 훅
└── .vscode/
    └── tasks.json              # VS Code 수동 배포 태스크 (Ctrl+Shift+B)
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
    [string]$Target    = "jenkins",
    [string]$Branch    = $(git rev-parse --abbrev-ref HEAD),
    # git rev-parse --abbrev-ref HEAD
    #   : 현재 체크아웃된 브랜치 이름을 반환 (예: main, develop, feature/login)
    [string]$RemoteUrl = $(git config --get remote.origin.url),
    # git config --get remote.origin.url
    #   : .git/config 에서 origin 원격 저장소 URL을 읽어옴
    [string]$User      = $(git config user.name)
    # git config user.name
    #   : .gitconfig 에 설정된 사용자 이름을 읽어옴
)

Write-Output "========================================"
Write-Output " Deploy 요청"
Write-Output " Target  : $Target"
Write-Output " Branch  : $Branch"
Write-Output " Remote  : $RemoteUrl"
Write-Output " User    : $User"
Write-Output "========================================"

switch ($Target) {
    "jenkins" {
        $jenkinsUrl   = "http://YOUR_JENKINS_SERVER:8080"  # Jenkins 서버 IP:포트
        $jobName      = "dev-deploy"                        # Jenkins에서 생성한 Pipeline Job 이름
        $triggerToken = "YOUR_JENKINS_TOKEN"                # Jenkins Job에 설정한 빌드 트리거 토큰

        # Jenkins 원격 빌드 URL 조합
        # /job/{이름}/build  : 해당 Job을 빌드 큐에 추가하는 API 엔드포인트
        # ?token=            : Job에 설정된 빌드 토큰 (인증용)
        # &cause=            : Jenkins 빌드 히스토리에 표시될 트리거 원인 메시지
        $uri = "$jenkinsUrl/job/$jobName/build?token=$triggerToken&cause=$User+pushed+$Branch"

        Write-Output "Jenkins 빌드 트리거: $uri"

        try {
            # Jenkins는 Basic 인증(ID:API토큰)을 Base64 인코딩하여 Authorization 헤더에 포함
            $cred = [Convert]::ToBase64String(
                [Text.Encoding]::ASCII.GetBytes("JENKINS_USER:JENKINS_API_TOKEN")
            )
            # Invoke-WebRequest : PowerShell HTTP 클라이언트 (curl 동등)
            # -Method Post       : HTTP POST 방식으로 빌드 트리거 요청
            # -Headers           : Authorization 헤더에 Base64 인증 정보 포함
            # -UseBasicParsing   : DOM 파서 사용 안 함 (서버/헤드리스 환경 호환성)
            Invoke-WebRequest -Uri $uri -Method Post `
                -Headers @{ Authorization = "Basic $cred" } `
                -UseBasicParsing
            Write-Output "✅ Jenkins 빌드 요청 성공"
        } catch {
            Write-Error "❌ Jenkins 빌드 요청 실패: $_"
        }
    }
    default {
        Write-Warning "알 수 없는 Target: $Target"
    }
}
```

> **수정 필요 항목**
> - `YOUR_JENKINS_SERVER` : Jenkins 서버 IP 또는 호스트명
> - `dev-deploy` : Jenkins에서 만든 Pipeline Job 이름
> - `YOUR_JENKINS_TOKEN` : Jenkins Job 빌드 트리거 토큰
> - `JENKINS_USER` / `JENKINS_API_TOKEN` : Jenkins 계정명 및 API 토큰

---

## ⚙️ 2단계 — Git Post-Push Hook 설정

`.git/hooks/post-push` 파일 생성 (확장자 없음).

```bash
#!/bin/sh
# .git/hooks/post-push
# ──────────────────────────────────────────────────────────────
# git push 가 원격 저장소에 성공적으로 완료된 직후 자동 실행되는 Git 클라이언트 훅
# post-push 는 push 성공 후에만 실행 (실패 시 실행 안 됨)
#
# git rev-parse --show-toplevel
#   : 현재 git 저장소의 루트 디렉터리 절대경로를 반환
#     예) /c/Users/username/projects/myapp
#
# powershell.exe -ExecutionPolicy Bypass
#   : Windows PowerShell 실행 정책을 이 실행 시에만 우회
#     시스템 전체 설정을 변경하지 않고 스크립트 실행 허용
# ──────────────────────────────────────────────────────────────
SCRIPT_DIR=$(git rev-parse --show-toplevel)
powershell.exe -ExecutionPolicy Bypass -File "$SCRIPT_DIR/deploy.ps1" -Target "jenkins"
```

**실행 권한 부여 (Git Bash 또는 WSL에서 실행):**

```bash
# chmod +x : 파일에 실행(execute) 권한 부여
# Git 훅은 반드시 실행 권한이 있어야 동작함
chmod +x .git/hooks/post-push
```

> ⚠️ `.git/hooks/` 는 git 추적 대상이 아닙니다. 팀원 공유 시 `scripts/hooks/` 에 원본 보관 후  
> 별도 설치 스크립트(`install-hooks.sh`)로 복사하는 방식을 권장합니다.

---

## ⚙️ 3단계 — VS Code tasks.json 설정

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Deploy → Jenkins (현재 브랜치)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "jenkins"
      ],
      "group": { "kind": "build", "isDefault": true },
      "presentation": { "echo": true, "reveal": "always", "focus": true, "panel": "shared" },
      "problemMatcher": []
    },
    {
      "label": "🚀 Deploy → Jenkins (브랜치 직접 입력)",
      "type": "shell",
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "${workspaceFolder}/deploy.ps1",
        "-Target", "jenkins",
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
1. `Ctrl+Shift+B` → 기본 빌드 태스크(현재 브랜치) 즉시 실행
2. `Ctrl+Shift+P` → `Tasks: Run Task` → 원하는 태스크 선택

---

## ⚙️ 4단계 — Jenkinsfile (Pipeline) 작성

```groovy
pipeline {
    agent any

    environment {
        SYNOLOGY_HOST    = "192.168.1.100"
        SYNOLOGY_USER    = "admin"
        // credentials('id') : Jenkins Credential 저장소에서 SSH 키를 안전하게 불러옴
        SYNOLOGY_SSH_KEY = credentials('synology-ssh-key')

        // Synology 내장 Docker Registry (DSM > Container Manager > Registry 활성화 필요)
        REGISTRY = "192.168.1.100:5000"

        IMAGE_MYAPP1 = "${REGISTRY}/myapp1"   // Spring Boot 이미지
        IMAGE_MYAPP2 = "${REGISTRY}/myapp2"   // Nuxt4 SSR 이미지
        IMAGE_MYAPP3 = "${REGISTRY}/myapp3"   // Vue3 SPA 이미지
    }

    triggers {
        // GenericTrigger : Generic Webhook Trigger 플러그인
        // deploy.ps1에서 보내는 HTTP POST 요청을 수신하여 파이프라인 실행
        GenericTrigger(
            causeString: 'Triggered by $cause',
            token: 'YOUR_JENKINS_TOKEN'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                // checkout scm : Jenkinsfile이 위치한 저장소를 자동으로 체크아웃
                checkout scm
            }
        }

        // ── myapp1 : Spring Boot ─────────────────────────────────
        stage('Build myapp1 (Spring Boot)') {
            steps {
                dir('myapp1') {
                    // ./gradlew clean bootJar
                    //   clean   : build/ 디렉터리 삭제 (이전 빌드 산출물 제거)
                    //   bootJar : Spring Boot 실행 가능한 Fat JAR 생성
                    //             결과: myapp1/build/libs/myapp1-*.jar
                    sh './gradlew clean bootJar'
                }
            }
        }

        // ── myapp2 : Nuxt4 SSR ───────────────────────────────────
        stage('Build myapp2 (Nuxt4 SSR)') {
            steps {
                dir('myapp2') {
                    // npm ci (clean install)
                    //   : package-lock.json에 고정된 정확한 버전으로 node_modules 설치
                    //   : npm install과 달리 lock 파일을 절대 수정하지 않음 (CI 환경에 적합)
                    sh 'npm ci'
                    // npm run build (Nuxt4 SSR 빌드)
                    //   결과물: .output/
                    //     .output/server/index.mjs  : Node.js SSR 서버 엔트리포인트
                    //     .output/server/chunks/    : SSR 처리 모듈
                    //     .output/public/           : 정적 에셋 (JS, CSS, 이미지)
                    sh 'npm run build'
                }
            }
        }

        // ── myapp3 : Vue3 SPA ────────────────────────────────────
        stage('Build myapp3 (Vue3 SPA)') {
            steps {
                dir('myapp3') {
                    sh 'npm ci'
                    // npm run build (Vite + Vue3 SPA 빌드)
                    //   결과물: dist/
                    //     dist/index.html       : SPA 진입점 (모든 라우트가 이 파일 사용)
                    //     dist/assets/index.js  : 번들된 Vue 애플리케이션 JS
                    //     dist/assets/index.css : 번들된 CSS
                    sh 'npm run build'
                }
            }
        }

        // ── Docker Build & Push ──────────────────────────────────
        stage('Docker Build & Push') {
            steps {
                script {
                    // docker build -t 이미지이름:태그 빌드컨텍스트경로
                    //   -t 192.168.1.100:5000/myapp1:latest
                    //      : 이미지에 Registry주소/이름:태그 형식으로 이름 지정
                    //      : :latest 는 최신 버전을 나타내는 관례적 태그
                    sh "docker build -t ${IMAGE_MYAPP1}:latest ./myapp1"
                    // docker push : 빌드된 이미지를 Registry 서버에 업로드
                    sh "docker push ${IMAGE_MYAPP1}:latest"

                    sh "docker build -t ${IMAGE_MYAPP2}:latest ./myapp2"
                    sh "docker push ${IMAGE_MYAPP2}:latest"

                    sh "docker build -t ${IMAGE_MYAPP3}:latest ./myapp3"
                    sh "docker push ${IMAGE_MYAPP3}:latest"
                }
            }
        }

        // ── Synology 배포 ────────────────────────────────────────
        stage('Deploy to Synology') {
            steps {
                // sshagent(['id']) : SSH Agent 플러그인으로 개인키 인증 관리
                // Jenkins Credentials에 등록된 SSH 키로 Synology에 접속
                sshagent(['synology-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${SYNOLOGY_USER}@${SYNOLOGY_HOST} '
                            cd /volume1/docker/myapp &&
                            docker-compose pull &&
                            docker-compose up -d --remove-orphans
                        '
                    """
                    // ssh -o StrictHostKeyChecking=no
                    //   : 최초 접속 시 호스트 키 확인 프롬프트를 자동으로 건너뜀
                    //     (CI 자동화 환경에서 대화형 입력 방지)
                    // docker-compose pull
                    //   : docker-compose.yml에 정의된 모든 서비스의 최신 이미지를 Registry에서 다운로드
                    // docker-compose up -d
                    //   : 모든 서비스 컨테이너를 백그라운드(-d, detach)로 시작/재시작
                    // --remove-orphans
                    //   : docker-compose.yml에서 제거된 서비스의 잔여 컨테이너 자동 삭제
                }
            }
        }
    }

    post {
        success { echo "✅ 배포 성공! myapp1/myapp2/myapp3 컨테이너 기동 완료" }
        failure { echo "❌ 배포 실패! Jenkins 콘솔 로그를 확인하세요." }
    }
}
```

---

## ⚙️ 5단계 — Dockerfile 작성

### myapp1 — Spring Boot (JAR)

```dockerfile
# myapp1/Dockerfile
# ──────────────────────────────────────────────────────────────
# Multi-stage build 패턴 사용 안 함 (Jenkinsfile에서 이미 Gradle 빌드 완료)
# Jenkinsfile에서 bootJar 실행 → Jenkins 워크스페이스의 build/libs/*.jar 를 Docker에 복사
# ──────────────────────────────────────────────────────────────

# eclipse-temurin:21-jre-alpine
#   eclipse-temurin : Eclipse 재단의 OpenJDK 배포판 (가장 널리 쓰이는 공식 JDK)
#   21               : Java 21 LTS 버전
#   jre              : JRE만 포함 (JDK 빌드 도구 제외 → 이미지 크기 절감)
#   alpine           : Alpine Linux 기반 (최소 OS, ~5MB)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
# WORKDIR : 컨테이너 내부 작업 디렉터리 설정 (없으면 자동 생성)

# Gradle bootJar 빌드 결과물 복사
# build/libs/*.jar : Spring Boot Gradle 기본 출력 경로
# app.jar          : 컨테이너 내부에서 사용할 고정 파일명
COPY build/libs/*.jar app.jar

EXPOSE 8080
# EXPOSE : 컨테이너가 사용하는 포트 명시 (문서화 목적)
#          실제 포트 개방은 docker-compose.yml의 ports: 설정이 담당

ENTRYPOINT ["java", "-jar", "app.jar"]
# ENTRYPOINT : 컨테이너 시작 시 실행될 메인 명령
# java -jar app.jar : Spring Boot 내장 Tomcat 포함 JAR 실행
# CMD와 달리 docker run 시 덮어쓰기가 어려워 메인 프로세스에 적합
```

---

### myapp2 — Nuxt4 SSR (Node.js 서버)

```dockerfile
# myapp2/Dockerfile
# ──────────────────────────────────────────────────────────────
# SSR(Server-Side Rendering) 방식
# 사용자 요청 → Node.js 서버가 Vue 컴포넌트 실행 → 완성된 HTML 반환
# 검색엔진 최적화(SEO)에 유리, 서버 프로세스 상시 필요
# ──────────────────────────────────────────────────────────────

# ── 빌드 스테이지 ────────────────────────────────────────────
# node:20-alpine : Node.js 20 LTS + Alpine Linux (빌드 환경)
FROM node:20-alpine AS builder
# AS builder : 이 스테이지에 이름 부여 → 하단 스테이지에서 --from=builder 로 참조

WORKDIR /app

# package.json, package-lock.json 먼저 복사 (Docker 레이어 캐시 최적화)
# 소스코드만 바뀌고 의존성이 같으면 이 레이어를 캐시에서 재사용 → 빌드 시간 단축
COPY package*.json ./
RUN npm ci
# npm ci (clean install)
#   : package-lock.json 기준으로 정확한 버전 설치
#   : node_modules/ 를 완전히 새로 생성 (재현 가능한 빌드 보장)

COPY . .
RUN npm run build
# nuxt build 실행 결과:
#   .output/
#   ├── server/
#   │   ├── index.mjs        ← Node.js H3 서버 시작 파일
#   │   └── chunks/          ← SSR 처리 모듈 (코드 분할)
#   └── public/              ← 정적 에셋 (브라우저가 직접 다운로드)
#       ├── _nuxt/           ← JS 번들, CSS
#       └── favicon.ico

# ── 실행 스테이지 ────────────────────────────────────────────
# 빌드 도구(npm 캐시, node_modules 전체 등) 없이 실행 파일만 포함한 최소 이미지 생성
FROM node:20-alpine
WORKDIR /app

# 빌드 스테이지에서 .output/ 만 복사 (소스코드, node_modules 제외)
# 결과: 이미지 크기 대폭 감소 (빌드 시 수백MB → 실행 시 수십MB)
COPY --from=builder /app/.output ./output

EXPOSE 3000
# Nuxt4 기본 서버 포트: 3000
# nuxt.config.ts 에서 runtimeConfig.nitro.port 로 변경 가능

CMD ["node", "output/server/index.mjs"]
# node output/server/index.mjs
#   : Nitro(Nuxt4 서버 엔진) 기반 Node.js HTTP 서버 시작
#   : 이 프로세스가 살아있어야 서비스 동작 (상시 실행 필요)
#   : 요청마다 Vue 컴포넌트를 서버에서 렌더링하여 HTML 반환
```

---

### myapp3 — Vue3 SPA (Nginx 정적 서버)

```dockerfile
# myapp3/Dockerfile
# ──────────────────────────────────────────────────────────────
# SPA(Single Page Application) 방식
# 빌드 시점에 모든 HTML/JS/CSS 생성 → Nginx가 단순 파일 서빙
# Node.js 서버 불필요 → 매우 가볍고 빠름
# ──────────────────────────────────────────────────────────────

# ── 빌드 스테이지 ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# vite build 실행 결과:
#   dist/
#   ├── index.html            ← SPA 진입점 (Vue Router가 모든 라우트 처리)
#   └── assets/
#       ├── index-[hash].js   ← 번들된 Vue 앱 (파일명에 해시 포함 → 캐시 무효화 자동)
#       └── index-[hash].css  ← 번들된 CSS

# ── 실행 스테이지 ────────────────────────────────────────────
# nginx:alpine : 공식 Nginx 이미지 + Alpine Linux (~7MB, 매우 가벼움)
FROM nginx:alpine

# Vite 빌드 결과물을 Nginx 기본 웹루트로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Vue Router History 모드 전용 Nginx 설정 복사
# (없으면 /about 같은 URL 직접 접속 시 404 발생)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# nginx -g "daemon off;"
#   : Nginx를 포그라운드 모드로 실행
#   : Docker 컨테이너는 메인 프로세스가 종료되면 함께 종료되므로
#     백그라운드(daemon) 실행 시 컨테이너가 즉시 종료됨 → 포그라운드 필수
CMD ["nginx", "-g", "daemon off;"]
```

**myapp3/nginx.conf — Vue Router History 모드 설정:**

```nginx
# myapp3/nginx.conf
server {
    listen 80;
    server_name localhost;

    # 웹루트: Vite 빌드 결과물 위치
    root /usr/share/nginx/html;
    index index.html;

    location / {
        # try_files $uri $uri/ /index.html
        #   1. 요청된 경로의 파일이 실제로 존재하면 그 파일을 서빙
        #   2. 디렉터리가 존재하면 디렉터리 인덱스 서빙
        #   3. 둘 다 없으면 index.html 반환 (Vue Router가 클라이언트에서 라우팅 처리)
        #   → /user/123, /dashboard/settings 같은 URL 직접 접속/새로고침 정상 동작
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        # Vite 빌드 파일명에는 해시값 포함 (예: index-a1b2c3d4.js)
        # 내용이 바뀌면 해시가 달라져 파일명 변경 → 캐시 무효화 자동
        # 따라서 assets/ 는 1년(31536000초) 동안 브라우저 캐시 가능
        # immutable : 이 파일은 절대 변경되지 않음을 브라우저에 알림 → 재검증 생략
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # gzip 압축으로 JS/CSS 전송 크기 절감
    gzip on;
    gzip_types text/css application/javascript application/json;
    gzip_min_length 1024;
}
```

---

## ⚙️ 6단계 — docker-compose.yml (Synology 배포용)

`/volume1/docker/myapp/docker-compose.yml`:

```yaml
version: "3.9"

services:

  # ── myapp1 : Spring Boot Backend ─────────────────────────────
  myapp1:
    image: 192.168.1.100:5000/myapp1:latest
    # image : Synology 내장 Docker Registry에서 이미지 pull
    #         192.168.1.100:5000 : Registry 주소 (NAS IP:5000)
    container_name: myapp1
    restart: unless-stopped
    # unless-stopped : 컨테이너 비정상 종료 시 자동 재시작
    #                  단, docker stop 으로 수동 정지한 경우에는 재시작 안 함
    ports:
      - "8080:8080"
      # "호스트포트:컨테이너포트"
      # 외부에서 NAS_IP:8080 접속 → 컨테이너 내부 8080 포트로 전달
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      # Spring Boot가 application-prod.yml 설정 파일을 활성화
      - DB_URL=jdbc:mysql://db:3306/myapp
      # "db" : 같은 docker-compose 네트워크 내 서비스명을 호스트명으로 사용 가능
      #        DNS 해석: db → myapp-db 컨테이너의 내부 IP로 자동 변환
      - DB_USER=myapp
      - DB_PASS=secret
    depends_on:
      - db
      # db 서비스가 시작된 후에 myapp1을 시작 (시작 순서 보장)
      # 단, DB가 완전히 준비될 때까지 대기하지는 않음
      # → Spring Boot의 재시도 설정 또는 healthcheck 조합 권장
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
      # NUXT_PUBLIC_ 접두사 : Nuxt4에서 클라이언트/서버 양쪽에서 접근 가능한 공개 환경변수
      # SSR 시 서버에서도, 브라우저에서도 이 URL로 myapp1 API를 호출
    networks:
      - myapp-net

  # ── myapp3 : Vue3 SPA Frontend (Nginx) ───────────────────────
  myapp3:
    image: 192.168.1.100:5000/myapp3:latest
    container_name: myapp3
    restart: unless-stopped
    ports:
      - "8090:80"
      # 컨테이너 내부 Nginx는 80번 포트
      # 호스트에서는 8090번으로 접근 (myapp1:8080, myapp2:3000과 중복 방지)
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
      # Named Volume : 컨테이너 재생성/업데이트 시에도 DB 데이터 유지
      # 실제 저장 위치: /volume1/@docker/volumes/myapp_db-data/
    networks:
      - myapp-net

networks:
  myapp-net:
    # bridge 드라이버 기반 내부 네트워크 자동 생성
    # 같은 네트워크의 서비스끼리 서비스명으로 통신 가능
    # 예: myapp1 컨테이너에서 "db" 호스트명으로 MySQL 접속 가능

volumes:
  db-data:
    # Docker가 관리하는 영구 볼륨 (컨테이너 삭제 시에도 데이터 유지)
```

---

## ⚙️ 7단계 — Jenkins 서버 설정

### 빌드 토큰 등록
1. Jenkins → 해당 Job → **구성** → **빌드 트리거** → ☑ **원격으로 빌드 유발**
2. **인증 토큰** : `YOUR_JENKINS_TOKEN` 입력 (deploy.ps1과 동일값)

### Credentials 등록
| ID | 종류 | 값 |
|---|---|---|
| `synology-ssh-key` | SSH Username with private key | Synology SSH 개인키 전체 내용 |

### 필수 플러그인
- **Generic Webhook Trigger Plugin** : deploy.ps1의 HTTP POST 수신
- **SSH Agent Plugin** : Synology SSH 배포
- **Docker Pipeline Plugin** : docker 명령어 Pipeline 지원

### API 토큰 발급
1. Jenkins → 우측 상단 사용자명 → **설정** → **API Token** → **Add new Token**
2. `deploy.ps1`의 `JENKINS_API_TOKEN`에 입력

---

## 🔄 전체 흐름 요약

```
1. 코드 수정 후 git push origin main
      ↓
2. .git/hooks/post-push 자동 실행
      ↓
3. deploy.ps1 -Target jenkins 실행
      ↓
4. Jenkins HTTP API 호출 (빌드 트리거)
      ↓
5. Jenkins Pipeline 실행
   ├── myapp1: ./gradlew clean bootJar
   ├── myapp2: npm ci && npm run build (SSR)
   ├── myapp3: npm ci && npm run build (SPA)
   ├── docker build × 3 → docker push × 3 → Synology Registry
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
| 4 | **푸시** | `git push origin main` | Git이 원격 저장소로 변경사항 전송 | 터미널: `Writing objects: 100%` |
| 5 | **훅 자동 실행** | (자동) | `.git/hooks/post-push` → `deploy.ps1 -Target jenkins` 호출 | 터미널: `Target: jenkins / Branch: main` 출력 |
| 6 | **Jenkins 트리거** | (자동) | Jenkins REST API POST 요청 전송 | 터미널: `✅ Jenkins 빌드 요청 성공` 출력 |
| 7 | **Jenkins 시작** | (자동) | SCM에서 최신 코드 체크아웃 | Jenkins WebUI → Job 페이지에서 `#빌드번호` 파란색 진행 표시 |
| 8 | **myapp1 빌드** | (자동) | `./gradlew clean bootJar` | Jenkins 콘솔: `BUILD SUCCESSFUL` |
| 9 | **myapp2 빌드** | (자동) | `npm ci && npm run build` (Nuxt4 SSR) | Jenkins 콘솔: `✓ You can now deploy .output/` |
| 10 | **myapp3 빌드** | (자동) | `npm ci && npm run build` (Vue3 Vite) | Jenkins 콘솔: `✓ built in Xs, gzip: XX kB` |
| 11 | **이미지 빌드** | (자동) | `docker build` × 3 (myapp1/2/3) | Jenkins 콘솔: `Successfully built xxxxxxxx` × 3 |
| 12 | **Registry 푸시** | (자동) | `docker push` → Synology Registry 업로드 | Jenkins 콘솔: `latest: digest: sha256:...` |
| 13 | **Synology 배포** | (자동) | SSH → `docker-compose pull && up -d` | Jenkins 콘솔: `✅ 배포 성공!` |
| 14 | **컨테이너 기동** | (자동) | Synology에서 myapp1/2/3 신규 컨테이너 시작 | Synology DSM → Container Manager → 3개 컨테이너 `실행 중` ✅ |
| 15 | **서비스 확인** | 브라우저 접속 | — | `http://NAS_IP:8080` / `:3000` / `:8090` 각각 접속 |
| 16 | **API 헬스체크** | 터미널에서 실행 | — | `curl http://NAS_IP:8080/actuator/health` → `{"status":"UP"}` |
| 17 | **로그 확인** | Synology DSM 접속 | — | Container Manager → 컨테이너 선택 → **로그** 탭에서 기동 로그 확인 |

### 수동 배포 흐름 (VS Code에서 직접 실행)

| # | 단계 | 개발자 행동 | 결과 확인 방법 |
|---|---|---|---|
| 1 | **태스크 실행** | `Ctrl+Shift+B` 또는 `Ctrl+Shift+P` → `Tasks: Run Task` | 태스크 선택 드롭다운 표시 |
| 2 | **태스크 선택** | `🚀 Deploy → Jenkins (현재 브랜치)` 선택 | VS Code 하단 터미널 패널 열림 |
| 3 | **실행 출력** | (자동) | 터미널: `Target: jenkins / Branch: main / User: 홍길동` 출력 |
| 4 | **트리거 성공** | (자동) | 터미널: `✅ Jenkins 빌드 요청 성공` 출력 |
| 5 | **Jenkins 확인** | 브라우저로 Jenkins 접속 | `http://JENKINS_IP:8080/job/dev-deploy/` 빌드 진행 확인 |
| 6 | **배포 완료** | (자동) | Jenkins 빌드 결과 `SUCCESS` (파란 구슬) 표시 |
| 7 | **서비스 확인** | 브라우저에서 각 URL 접속 | 최신 코드 반영 확인 (버전 정보, UI 변경사항 등) |

---

## 🛠️ 트러블슈팅

| 문제 | 원인 | 해결 |
|---|---|---|
| hook 실행 안됨 | 실행 권한 없음 | `chmod +x .git/hooks/post-push` |
| Jenkins 401 오류 | API 토큰 오류 | Jenkins API 토큰 재발급 후 `deploy.ps1` 갱신 |
| Docker push 실패 | Registry 인증 없음 | `docker login 192.168.1.100:5000` 실행 후 재시도 |
| Synology SSH 실패 | SSH 비활성화 또는 키 미등록 | DSM → 터미널 및 SNMP → SSH 서비스 활성화, `authorized_keys` 등록 |
| PowerShell 실행 오류 | ExecutionPolicy 제한 | `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| myapp3 새로고침 404 | Nginx SPA fallback 미설정 | `nginx.conf`에 `try_files $uri /index.html` 추가 확인 |
| myapp2 API 연결 실패 | 환경변수 NAS IP 오류 | `docker-compose.yml` `NUXT_PUBLIC_API_BASE` 값 확인 |
| DB 연결 오류 (myapp1) | MySQL 초기화 중 앱 시작 | Spring Boot `spring.datasource.hikari.connection-timeout` 늘리거나 `depends_on` + healthcheck 조합 |
