/**
 * 서버 전역 예외 핸들러 (Nitro error hook).
 * API/SSR 처리 중 발생한 미처리 예외를 한 곳에서 로깅합니다.
 */
import { logger } from "~~/server/utils/logger";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("error", (error, context) => {
    const event = context?.event;
    const method = event?.method ?? "-";
    const path = event?.path ?? "-";
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;

    logger.error(
      "[ExceptionHandler]",
      method,
      path,
      "→",
      statusCode,
      error?.message ?? String(error)
    );
    if (error?.stack && process.env.NODE_ENV !== "production") {
      logger.error("[ExceptionHandler] stack:", error.stack);
    }
  });
});
