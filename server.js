'use strict';

require('dotenv').config();

const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PROXY_PORT = parseInt(process.env.PROXY_PORT || '8083', 10);
const FASTAPI_PORT = parseInt(process.env.FASTAPI_PORT || '8082', 10);
const FASTAPI_HOST = process.env.FASTAPI_HOST || 'localhost';
const FASTAPI_URL = `http://${FASTAPI_HOST}:${FASTAPI_PORT}`;
const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

function buildConfig() {
  return {
    API_BASE: '/api',
    WS_BASE: '/ws',
    PROXY_PORT,
    APP_ENV: process.env.APP_ENV || 'development',
  };
}

async function fetchBackendData(route, fallback = null) {
  try {
    const response = await fetch(`${FASTAPI_URL}${route}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
}

const app = express();
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(`window.AB_CONFIG = ${JSON.stringify(buildConfig(), null, 2)};`);
});

// Note: legacy EJS server-side rendering routes (/, /dashboard, /map,
// /wellness, /athlete/:id, /session/:id) were removed when the frontend
// migrated to a Vite/React SPA. All page routing is now client-side via
// TanStack Router; the catch-all at the end serves dist/index.html.

app.get('/api/status', async (req, res) => {
  const health = await fetchBackendData('/health', null);
  res.json({
    frontend: 'ok',
    backend: health ? health.status : 'offline',
    config: buildConfig(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', createProxyMiddleware({
  target: FASTAPI_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  timeout: 20000,
  proxyTimeout: 20000,
  on: {
    error(err, req, res) {
      if (res.headersSent) return;
      if (err.code === 'ECONNREFUSED') {
        res.status(503).json({ error: 'Backend offline', detail: 'Run: python api_server.py' });
      } else {
        res.status(502).json({ error: err.message });
      }
    },
  },
}));

app.use('/', createProxyMiddleware({
  target: FASTAPI_URL,
  changeOrigin: true,
  pathFilter: (pathname, req) => {
    if (pathname.startsWith('/api') || pathname.startsWith('/ws') || pathname === '/config.js') {
      return false;
    }
    return req.method !== 'GET';
  },
  timeout: 20000,
  proxyTimeout: 20000,
  on: {
    error(err, req, res) {
      if (res.headersSent) return;
      if (err.code === 'ECONNREFUSED') {
        res.status(503).json({ error: 'Backend offline', code: 503 });
      } else {
        res.status(502).json({ error: err.message, code: 502 });
      }
    },
  },
}));

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { index: false }));
}

// ── Coach inbox (broadcasts + 1:1 messages) ───────────────────────────────
app.get('/coach/:coachId/inbox', async (req, res) => {
  const { coachId } = req.params;
  const health = await fetchBackendData('/health', null);
  res.render('coach-inbox', { coachId, backendOnline: !!health });
});

// ── Coach billing dashboard ────────────────────────────────────────────────
app.get('/coach/:coachId/billing', async (req, res) => {
  const { coachId } = req.params;
  const health = await fetchBackendData('/health', null);
  res.render('coach-billing', { coachId, backendOnline: !!health });
});

// ── Athlete inbox (messages + drills + payment banner) ─────────────────────
app.get('/athlete/:athleteId/inbox', async (req, res) => {
  const { athleteId } = req.params;
  const health = await fetchBackendData('/health', null);
  res.render('athlete-inbox', { athleteId, backendOnline: !!health });
});

// ── Parent weekly digest (token-based, no login) ───────────────────────────
app.get('/digest/:token', async (req, res) => {
  const { token } = req.params;
  const data = await fetchBackendData(`/parent/${encodeURIComponent(token)}/weekly-digest`, null);
  if (!data) {
    return res.status(403).render('parent-digest', {
      digest: null,
      error: 'Link not found or expired. Ask your athlete to share a fresh link.',
    });
  }
  return res.render('parent-digest', { digest: data, error: null });
});

// ── Parent safety summary page ─────────────────────────────────────────────
// Fetches safety data from the backend using the parent's token, then renders
// a read-only, privacy-respecting view. No raw scores or session IDs exposed.
app.get('/parent/:consentId', async (req, res) => {
  const { consentId } = req.params;
  const { token } = req.query;

  if (!token) {
    return res.status(400).render('parent', {
      summary: null,
      error: 'Missing access token. Use the link provided by the athlete.',
    });
  }

  const data = await fetchBackendData(
    `/parent/${encodeURIComponent(consentId)}/safety-summary?token=${encodeURIComponent(token)}`,
    null,
  );

  if (!data) {
    return res.status(403).render('parent', {
      summary: null,
      error: 'Access denied or link expired. The athlete may have revoked access.',
    });
  }

  return res.render('parent', { summary: data, error: null });
});

app.get('*', (req, res) => {
  if (fs.existsSync(INDEX_FILE)) {
    res.sendFile(INDEX_FILE);
    return;
  }
  res.status(503).send(
    'Frontend build not found. Run "npm run build" in personal-health-frontend first.'
  );
});

const server = http.createServer(app);

const wsProxy = createProxyMiddleware({
  target: `ws://${FASTAPI_HOST}:${FASTAPI_PORT}`,
  changeOrigin: true,
  ws: true,
  pathRewrite: { '^/ws': '' },
  on: {
    error(err) {
      console.error('[WS Proxy] error:', err.message);
    },
  },
});

server.on('upgrade', wsProxy.upgrade);

server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`\n  Personal Health — TanStack Frontend`);
  console.log(`  ───────────────────────────────────────`);
  console.log(`  http://localhost:${PROXY_PORT}/`);
  console.log(`  Backend proxy: ${FASTAPI_URL}`);
  console.log(`  Static build: ${fs.existsSync(INDEX_FILE) ? 'ready' : 'missing'}\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server] Port ${PROXY_PORT} already in use.`);
  } else {
    console.error('[Server] Error:', err.message);
  }
  process.exit(1);
});
