/**
 * SQL 문자열을 읽기 쉽게 포맷 (Prisma 쿼리 로그용).
 * 키워드 앞에서 줄바꿈 후 들여쓰기합니다.
 */
const INDENT = "  ";

/** 대문자 키워드 앞에서 줄 나누기 (순서 유지) */
const BREAK_BEFORE = [
  " FROM ",
  " WHERE ",
  " ORDER BY ",
  " GROUP BY ",
  " LIMIT ",
  " OFFSET ",
  " RETURNING ",
  " LEFT JOIN ",
  " INNER JOIN ",
  " RIGHT JOIN ",
  " JOIN ",
  " ON ",
  " AND ",
  " OR ",
  " SET ",
  " VALUES ",
];

export function formatSql(sql: string): string {
  if (!sql || typeof sql !== "string") return sql;
  let s = sql.trim().replace(/\s+/g, " ");
  for (const kw of BREAK_BEFORE) {
    const re = new RegExp(kw.replace(/\s+/g, "\\s+"), "gi");
    s = s.replace(re, "\n" + kw.trim() + " ");
  }
  return s
    .split("\n")
    .map((line, i) => (i === 0 ? line.trim() : INDENT + line.trim()))
    .join("\n")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}
