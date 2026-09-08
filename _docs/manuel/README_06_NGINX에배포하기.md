# README_06 - NGINX에 배포하기

## 1. 사전 준비

- **서버**: Linux 등 Nginx가 설치 가능한 환경
- **Nuxt 빌드**: 로컬 또는 CI에서 `npm run build`(또는 `npm run generate`) 완료
- **배포 경로**: 서버 상의 디렉토리 (예: `/var/www/outstock`)

## 2. 빌드 산출물 업로드

### 2.1 정적 생성(SSG)인 경우

```bash
npm run generate
```

- `.output/public` 폴더 전체를 서버의 문서 루트로 복사  
  예: `/var/www/outstock` 에 index.html, _nuxt/ 등 모두 업로드

### 2.2 SSR(서버 모드)인 경우

- `.output` 폴더 전체를 서버에 업로드 (예: `/var/www/outstock`)
- 서버에 Node.js 설치 후, PM2 등으로 앱 실행:

  ```bash
  cd /var/www/outstock
  node .output/server/index.mjs
  ```

- Nuxt는 기본적으로 `PORT` 환경 변수 또는 `host`/`port` 설정 사용 (예: 3000 포트)

## 3. Nginx 설정 (Linux 서버)

### 3.1 정적(SSG) 배포

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/outstock;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /_nuxt/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.2 SSR 배포 (프록시)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Nuxt 앱은 같은 서버에서 3000 포트로 실행 중이어야 합니다 (PM2 등으로 데몬화 권장).

## 4. HTTPS (선택)

- Let's Encrypt + certbot 사용 예:

  ```bash
  sudo certbot --nginx -d your-domain.com
  ```

- Nginx에 `listen 443 ssl;` 및 `ssl_certificate` 지시어가 자동으로 추가됩니다.

## 5. 적용

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. 요약

| 배포 방식 | 빌드 명령 | 서버에 올릴 것 | Nginx 역할 |
|-----------|-----------|----------------|------------|
| SSG | `npm run generate` | `.output/public` → 문서 루트 | 정적 파일 서빙 |
| SSR | `npm run build` | `.output` + Node 실행 | 프록시 → Node(3000) |
