/**
 * [DEV ONLY] 파일을 에디터에서 열기
 * GET /api/__xdev/open-editor?file=app/components/...&editor=vscode|cursor
 *
 * editor 기본값: vscode
 * Cursor가 PATH에서 `code` 명령을 덮어쓰는 문제를 우회하기 위해
 * VS Code/Cursor 실제 설치 경로를 직접 찾아서 실행합니다.
 */
import { exec } from "node:child_process";
import { logger } from "~~/server/utils/logger";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

function getVSCodeCli(): string {
  const localAppData = process.env.LOCALAPPDATA ?? "";
  const programFiles = process.env.ProgramFiles ?? "C:\\Program Files";
  const programFilesX86 = process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)";

  const candidates = [
    `${localAppData}\\Programs\\Microsoft VS Code\\bin\\code.cmd`,
    `${programFiles}\\Microsoft VS Code\\bin\\code.cmd`,
    `${programFilesX86}\\Microsoft VS Code\\bin\\code.cmd`,
  ];

  for (const p of candidates) {
    if (existsSync(p)) return `"${p}"`;
  }
  return "code";
}

function getCursorCli(): string {
  const localAppData = process.env.LOCALAPPDATA ?? "";
  const candidates = [
    `${localAppData}\\Programs\\Cursor\\resources\\app\\bin\\cursor.cmd`,
    `${localAppData}\\Programs\\cursor\\resources\\app\\bin\\cursor.cmd`,
  ];
  for (const p of candidates) {
    if (existsSync(p)) return `"${p}"`;
  }
  return "cursor";
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const file = query.file;
  const editor = (query.editor as string)?.toLowerCase() === "cursor" ? "cursor" : "vscode";

  if (!file || typeof file !== "string") {
    throw createError({ statusCode: 400, statusMessage: "file 파라미터 필요" });
  }
  const absPath = resolve(process.cwd(), file);
  const cli = editor === "cursor" ? getCursorCli() : getVSCodeCli();
  exec(`${cli} --goto "${absPath}"`, (err) => {
    if (err) logger.error("[__xdev/open-editor] 오류:", err.message);
  });
  return { ok: true, path: absPath, editor };
});
