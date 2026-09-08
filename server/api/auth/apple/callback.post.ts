/**
 * Apple Sign In 콜백 (POST): Apple이 form_post로 code, id_token 전달.
 * id_token JWT payload에서 sub, email 추출 후 앱 토큰 발급.
 */
import { createOAuthToken } from "~~/server/utils/oauthToken";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1]!, "base64url").toString("utf8");
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event).catch(() => ({})) as {
    code?: string;
    id_token?: string;
    user?: string;
    state?: string;
  };
  const idToken = body.id_token;
  if (!idToken) {
    return sendRedirect(event, "/login?error=no_id_token", 302);
  }
  const payload = decodeJwtPayload(idToken);
  if (!payload || !payload.sub) {
    return sendRedirect(event, "/login?error=decode", 302);
  }
  const sub = String(payload.sub);
  const email = (payload.email as string) || "";
  let name = "User";
  if (body.user) {
    try {
      const userObj = JSON.parse(body.user) as { name?: { firstName?: string; lastName?: string } };
      const first = userObj?.name?.firstName ?? "";
      const last = userObj?.name?.lastName ?? "";
      name = [first, last].filter(Boolean).join(" ") || "User";
    } catch {
      /**/
    }
  }
  const token = createOAuthToken({ provider: "apple", id: sub, email, name });
  return sendRedirect(event, `/login/oauth-success?token=${encodeURIComponent(token)}`, 302);
});
