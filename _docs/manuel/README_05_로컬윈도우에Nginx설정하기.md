# README_05 - 로컬 Windows에 Nginx 설정하기

## 1. Nginx 다운로드 (Windows)

1. [nginx.org](https://nginx.org/en/download.html) 접속
2. **Stable version**의 **nginx/Windows-xxx** 압축 파일 다운로드
3. 원하는 폴더에 압축 해제 (예: `C:\nginx`)

## 2. 디렉토리 구조 (예시)

```
C:\nginx\
├── conf\
│   └── nginx.conf    # 메인 설정 파일
├── html\              # 기본 문서 루트
├── logs\              # access.log, error.log
└── nginx.exe
```

## 3. Nuxt 빌드 결과물 연결 (로컬 테스트)

### 3.1 Nuxt 프로젝트 빌드

```bash
cd C:\p2602_outstock_vue_nuxt4\outstock_vue_nuxt4_tailwind
npm run build
```

- **SSR(서버 모드)**: `.output` 폴더 생성 → Node로 서버 실행 후 Nginx는 프록시로 사용
- **정적(SSG)**: `npm run generate` 시 `.output/public`에 정적 파일 생성 → Nginx 문서 루트로 지정 가능

### 3.2 정적 사이트인 경우 (generate 사용)

`conf/nginx.conf`에서 `server` 블록의 `root`를 Nuxt 출력 경로로 변경:

```nginx
http {
    # ...
    server {
        listen       80;
        server_name  localhost;
        root   C:/p2602_outstock_vue_nuxt4/outstock_vue_nuxt4_tailwind/.output/public;
        index  index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

- 경로는 슬래시(`/`)로 통일해도 Nginx가 처리합니다.

### 3.3 SSR인 경우 (Node 서버 + Nginx 프록시)

1. Nuxt 서버 실행 (같은 PC 또는 다른 포트):

   ```bash
   npm run preview
   # 또는 .output/server/index.mjs 직접 실행 (기본 3000 포트)
   ```

2. Nginx에서 80 포트로 들어온 요청을 해당 포트로 프록시:

```nginx
server {
    listen       80;
    server_name  localhost;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 4. Nginx 실행 (Windows)

- **실행**: `C:\nginx\nginx.exe`
- **중지**: `nginx -s stop`
- **재로드**: `nginx -s reload` (설정 변경 후)
- **관리자 권한**이 필요할 수 있음 (80 포트 사용 시)

## 5. 방화벽

- Windows 방화벽에서 80 포트 인바운드 허용 (필요 시).

## 6. 확인

- 브라우저에서 `http://localhost` 접속하여 Nuxt 앱이 보이면 설정이 적용된 것입니다.
