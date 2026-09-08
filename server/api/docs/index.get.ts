/**
 * Swagger UI HTML (CDN)
 * OpenAPI 스펙은 /api/docs/openapi 에서 제공
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const specUrl = `${url.origin}/api/docs/openapi`;
  setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Docs - Swagger</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: "#swagger-ui",
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ]
      });
    };
  </script>
</body>
</html>`;
});
