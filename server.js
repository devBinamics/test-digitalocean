// Servidor de prueba: sirve una SPA en /app y una API en /api, todo desde el mismo backend.
// Sin dependencias: solo Node (http, fs, path).
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const APP_HTML = path.join(__dirname, "app", "index.html");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // API: el mismo backend expone datos que la SPA consume
  if (url.pathname === "/api/hello" && req.method === "GET") {
    return sendJson(res, 200, { message: "Hola desde el backend", time: new Date().toISOString() });
  }

  // SPA: /app y cualquier subruta de /app devuelven el mismo index.html
  if (url.pathname === "/app" || url.pathname.startsWith("/app/")) {
    return fs.readFile(APP_HTML, (err, data) => {
      if (err) return sendJson(res, 500, { error: "No se pudo leer la app" });
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  }

  if (url.pathname === "/") {
    res.writeHead(302, { Location: "/app" });
    return res.end();
  }

  sendJson(res, 404, { error: "No encontrado", path: url.pathname });
});

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

server.listen(PORT, () => {
  console.log(`Servidor de prueba en http://localhost:${PORT}/app`);
});
