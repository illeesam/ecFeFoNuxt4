/**
 * 인증(Auth) Pinia 스토어.
 * localStorage + Cookie의 token을 읽어 사용자 정보를 관리합니다.
 * 데모 계정: demo1@mail.com ~ demo99@mail.com / 비밀번호: 123456
 */
import { defineStore } from "pinia";
import { axiosCsr } from "~/utils/axiosCsr";
import { setCookie, deleteCookie } from "~/utils/cmUtil";

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

/** 데모 사용자 객체 생성 */
function buildDemoUser(num: number): AuthUser {
  return {
    userId: num,
    username: `홍길동${num}`,
    email: `demo${num}@mail.com`,
    role: "user",
    phone: `010-1234-${num.toString().padStart(4, "0")}`,
    address: `성남시 중원구 성남대로 997-${num}`,
  };
}


export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null as string | null,
    user: null as AuthUser | null,
    initialized: false,
  }),

  actions: {
    /** localStorage + Cookie에서 토큰 로드 */
    loadStToken() {
      if (!import.meta.client) return;
      this.token = localStorage.getItem("auth_token");
    },

    /** 토큰 저장 (로그인 성공 시 호출). refreshToken 있으면 함께 보관(Redis 사용 시) */
    setToken(token: string, refreshToken?: string) {
      this.token = token;
      if (import.meta.client) {
        localStorage.setItem("auth_token", token);
        setCookie("auth_token", token);
        if (refreshToken !== undefined) {
          localStorage.setItem("auth_refresh_token", refreshToken);
        }
      }
    },

    /** OAuth 로그인 성공: 토큰과 사용자 정보를 한 번에 설정 (oauth_ 토큰용) */
    setOAuthUser(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      this.initialized = true;
      if (import.meta.client) {
        localStorage.setItem("auth_token", token);
        setCookie("auth_token", token);
      }
    },

    /**
     * 로그인
     * - 데모 계정(demo1~99@mail.com / 123456): 즉시 처리, 토큰 생성
     * - 실제 계정: /api/auth/login API 호출
     */
    async login(email: string, password: string): Promise<{ ok: boolean; message?: string }> {
      // 데모 사용자 체크
      const match = email.trim().match(/^demo(\d+)@mail\.com$/);
      if (match && password === "123456") {
        const num = parseInt(match[1]!);
        if (num >= 1 && num <= 99) {
          const token = `demo_token_${num.toString().padStart(3, "0")}`;
          this.setToken(token);
          this.user = buildDemoUser(num);
          this.initialized = true;
          return { ok: true };
        }
      }

      // API 로그인 (Redis 사용 시 refreshToken 포함)
      try {
        const res = await axiosCsr.post<{ token: string; refreshToken?: string; user: AuthUser }>("/api/auth/login", {
          email,
          password,
        });
        this.setToken(res.data.token, res.data.refreshToken);
        this.user = res.data.user;
        this.initialized = true;
        return { ok: true };
      } catch {
        return { ok: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
      }
    },

    /** 토큰으로 사용자 정보 조회 */
    async loadStAuthInfo() {
      if (!this.token) {
        this.initialized = true;
        return;
      }

      // 데모 토큰 처리 (API 호출 없이 로컬에서 복원)
      const demoMatch = this.token.match(/^demo_token_(\d+)$/);
      if (demoMatch) {
        this.user = buildDemoUser(parseInt(demoMatch[1]!));
        this.initialized = true;
        return;
      }

      // OAuth 토큰 처리 (oauth_ 로 시작하는 토큰은 payload에서 사용자 복원)
      if (this.token.startsWith("oauth_")) {
        try {
          let base64 = this.token.slice(6).replace(/-/g, "+").replace(/_/g, "/");
          const pad = base64.length % 4;
          if (pad) base64 += "=".repeat(4 - pad);
          const json = atob(base64);
          const payload = JSON.parse(json) as { email?: string; name?: string; id?: string };
          this.user = {
            userId: 0,
            username: payload.name || payload.email || "User",
            email: payload.email || "",
            role: "user",
          };
        } catch {
          this.setStLogout();
        }
        this.initialized = true;
        return;
      }

      try {
        const res = await axiosCsr.get<AuthUser>("/api/auth/me", {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.user = res.data;
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        const refreshToken = import.meta.client ? localStorage.getItem("auth_refresh_token") : null;
        if (status === 401 && refreshToken) {
          try {
            const refreshRes = await axiosCsr.post<{ token: string; refreshToken?: string; user: AuthUser }>("/api/auth/refresh", { refreshToken });
            this.setToken(refreshRes.data.token, refreshRes.data.refreshToken);
            this.user = refreshRes.data.user;
          } catch {
            this.setStLogout();
          }
        } else {
          console.warn("[useAuthStore] 인증 실패, 토큰 제거:", err);
          this.setStLogout();
        }
      } finally {
        this.initialized = true;
      }
    },

    /** 로그아웃 (API 토큰이면 서버에 로그아웃 요청 후 클라이언트 정리) */
    async setStLogout() {
      const token = this.token;
      this.token = null;
      this.user = null;
      if (import.meta.client) {
        const isApiToken = token && token.includes(".") && !token.startsWith("demo_token_") && !token.startsWith("oauth_");
        if (isApiToken && token) {
          try {
            await axiosCsr.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
          } catch {
            /** 무시 */
          }
        }
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_refresh_token");
        deleteCookie("auth_token");
      }
    },
  },

  getters: {
    isStLoggedIn: (state) => !!state.token && !!state.user,
    isStAdmin: (state) => state.user?.role === "admin",
  },
});
