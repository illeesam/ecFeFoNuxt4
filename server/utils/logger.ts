/**
 * 서버용 로거 (Nuxt 4 내장 로거와 동일한 consola 기반).
 * server/ 아래에서 자동 임포트되어 logger.info(), logger.error() 등으로 사용.
 * 로그 메시지 끝에 호출 위치(파일:행:열)를 붙여 터미널에서 클릭 시 해당 소스로 이동 가능.
 * .nuxt 번들 경로는 소스맵으로 원본 server/ 경로로 변환.
 */
import { createConsola } from "consola";
import { readFile } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { RawSourceMap } from "source-map";
import { SourceMapConsumer } from "source-map";

const consola = createConsola({ defaults: { tag: "server" } }).withTag("server");

const sourceMapCache = new Map<string, Promise<SourceMapConsumer>>();

function pathToFileSystem(file: string): string {
  const s = file.trim();
  if (s.startsWith("file:")) {
    try {
      const url = s.replace(/^file:\/*/, "file:///").replace(/\\/g, "/");
      return fileURLToPath(url);
    } catch {
      return s.replace(/\\/g, "/");
    }
  }
  return s.replace(/\\/g, "/");
}

function loadConsumer(mapPath: string): Promise<SourceMapConsumer> {
  let p = sourceMapCache.get(mapPath);
  if (!p) {
    p = readFile(mapPath, "utf-8")
      .then((raw) => JSON.parse(raw) as RawSourceMap)
      .then((rawMap) => new SourceMapConsumer(rawMap));
    sourceMapCache.set(mapPath, p);
  }
  return p;
}

async function resolveViaSourceMap(bundlePath: string, line: number, column: number): Promise<string | null> {
  try {
    const dir = dirname(bundlePath);
    const mapPath = join(dir, basename(bundlePath) + ".map");
    const consumer = await loadConsumer(mapPath);
    const pos = consumer.originalPositionFor({ line, column });
    if (!pos?.source) return null;
    let source = pos.source.replace(/\\/g, "/");
    if (source.startsWith("/") || /^[A-Z]:/i.test(source)) {
      source = relative(process.cwd(), source).replace(/\\/g, "/");
    }
    return `${source}:${pos.line ?? line}:${pos.column ?? column}`;
  } catch {
    return null;
  }
}

function getCallSiteFrame(): { file: string; line: number; column: number } | null {
  const e = new Error();
  const stack = e.stack?.split("\n");
  if (!stack || stack.length < 3) return null;
  for (let i = 2; i < stack.length; i++) {
    const line = stack[i];
    if (!line) continue;
    const m =
      line.match(/\(([^)]+):(\d+):(\d+)\)/) ||
      line.match(/\s+at\s+(?:async\s+)?(?:.*?\s+)?\(?([^\s)]+):(\d+):(\d+)\)?/);
    if (m && m[1] && m[2] && m[3]) {
      const file = pathToFileSystem(m[1]);
      if (file.includes("logger") && file.includes("server/utils")) continue;
      return { file, line: Number(m[2]), column: Number(m[3]) };
    }
  }
  return null;
}

function getCallSiteSync(): string | null {
  const frame = getCallSiteFrame();
  if (!frame) return null;
  const { file, line, column } = frame;
  if (file.includes(".nuxt")) return null;
  try {
    const rel = relative(process.cwd(), file).replace(/\\/g, "/");
    return `${rel}:${line}:${column}`;
  } catch {
    return file.replace(/\\/g, "/") + ":" + line + ":" + column;
  }
}

function withSourceAsync(args: unknown[], cb: (out: unknown[]) => void): void {
  const frame = getCallSiteFrame();
  if (!frame) {
    cb(args);
    return;
  }
  const { file, line, column } = frame;
  if (!file.includes(".nuxt")) {
    const site = getCallSiteSync();
    cb(site ? [...args, "\n  " + site] : args);
    return;
  }
  resolveViaSourceMap(file, line, column).then((resolved) => {
    cb(resolved ? [...args, "\n  " + resolved] : args);
  });
}

const spread = (args: unknown[]) => args as [string, ...unknown[]];

export const logger = {
  info(...args: unknown[]) {
    withSourceAsync(args, (out) => consola.info(...spread(out)));
  },
  warn(...args: unknown[]) {
    withSourceAsync(args, (out) => consola.warn(...spread(out)));
  },
  error(...args: unknown[]) {
    withSourceAsync(args, (out) => consola.error(...spread(out)));
  },
  debug(...args: unknown[]) {
    withSourceAsync(args, (out) => consola.debug(...spread(out)));
  },
  trace(...args: unknown[]) {
    withSourceAsync(args, (out) => consola.trace(...spread(out)));
  },
};
