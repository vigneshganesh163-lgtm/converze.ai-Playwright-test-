const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const GITHUB_REPO = 'vigneshganesh163-lgtm/converze.ai-Playwright-test-';
const GITHUB_WORKFLOW = 'run-tests.yml';

// Test execution state
let currentTestRun = {
  running: false,
  scenario: null,
  startTime: null,
  endTime: null,
  status: 'idle',
  logs: []
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.zip': 'application/zip'
};

function addLog(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
  currentTestRun.logs.push(line);
  if (currentTestRun.logs.length > 500) {
    currentTestRun.logs.shift();
  }
}

// Trigger GitHub Actions workflow_dispatch via GitHub API
function triggerGitHubWorkflow(scenario, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      ref: 'main',
      inputs: {
        scenario: scenario || 'scenario-6'
      }
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
      method: 'POST',
      headers: {
        'User-Agent': 'Converze-Test-Dashboard',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 204) {
          resolve({ success: true, message: `Successfully dispatched GitHub Action workflow for ${scenario}` });
        } else {
          resolve({ success: false, statusCode: res.statusCode, error: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Set CORS headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- API: Test Execution Status ---
  if (pathname === '/api/test-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ...currentTestRun,
      githubRepo: GITHUB_REPO,
      workflowUrl: `https://github.com/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}`
    }));
  }

  // --- API: Re-run Test Trigger ---
  if (pathname === '/api/run-test') {
    const handleTrigger = async (scenario, token) => {
      scenario = scenario || 'scenario-6';

      // 1. If GitHub Token provided, trigger GitHub Actions Cloud runner
      const githubToken = token || process.env.GITHUB_TOKEN;
      if (githubToken) {
        addLog(`Initiating GitHub Actions cloud run for ${scenario}...`);
        try {
          const ghRes = await triggerGitHubWorkflow(scenario, githubToken);
          if (ghRes.success) {
            currentTestRun.status = 'dispatched_github';
            currentTestRun.scenario = scenario;
            addLog(`GitHub Actions workflow dispatched! Tests running in cloud on Ubuntu runner.`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
              success: true,
              mode: 'github_actions',
              scenario,
              message: 'Workflow successfully queued in GitHub Actions. Reports will auto-refresh upon completion.',
              actionsUrl: `https://github.com/${GITHUB_REPO}/actions`
            }));
          } else {
            addLog(`GitHub API response: ${ghRes.statusCode} - ${ghRes.error}`);
          }
        } catch (err) {
          addLog(`GitHub dispatch error: ${err.message}`);
        }
      }

      // 2. If running locally with Node & Playwright installed, spawn local test
      if (currentTestRun.running) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          error: `Test '${currentTestRun.scenario}' is already in progress.`
        }));
      }

      currentTestRun.running = true;
      currentTestRun.scenario = scenario;
      currentTestRun.startTime = new Date().toISOString();
      currentTestRun.endTime = null;
      currentTestRun.status = 'running';
      currentTestRun.logs = [];

      addLog(`⚡ Starting test execution for ${scenario}...`);

      const scriptName = `test:${scenario}`;
      const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

      const child = spawn(npmCmd, ['run', scriptName], {
        cwd: PUBLIC_DIR,
        shell: true
      });

      child.stdout.on('data', (d) => {
        const text = d.toString().trim();
        if (text) {
          text.split('\n').forEach(line => addLog(line.trim()));
        }
      });

      child.stderr.on('data', (d) => {
        const text = d.toString().trim();
        if (text) {
          text.split('\n').forEach(line => addLog(`[ERR] ${line.trim()}`));
        }
      });

      child.on('close', (code) => {
        currentTestRun.running = false;
        currentTestRun.endTime = new Date().toISOString();
        currentTestRun.status = code === 0 ? 'passed' : 'failed';
        addLog(`Test process exited with code ${code}. Status: ${currentTestRun.status}`);

        // Regenerate HTML report
        const reportScript = `report:${scenario}-html`;
        addLog(`Regenerating report via ${reportScript}...`);
        const reportChild = spawn(npmCmd, ['run', reportScript], {
          cwd: PUBLIC_DIR,
          shell: true
        });
        reportChild.on('close', () => {
          addLog(`Report regeneration complete.`);
        });
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: true,
        mode: 'local_spawn',
        scenario,
        message: `Started test runner for ${scenario}`
      }));
    };

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        let parsed = {};
        try { parsed = JSON.parse(body || '{}'); } catch(e) {}
        handleTrigger(parsed.scenario, parsed.token);
      });
      return;
    } else {
      // GET method query support
      const scenario = parsedUrl.query.scenario;
      const token = parsedUrl.query.token;
      return handleTrigger(scenario, token);
    }
  }

  // Default to index.html if root
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  // Check if file exists
  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end(`404 Not Found: ${pathname}`);
    }

    // If directory, look for index.html or all-in-one-report.html
    let filePath = safePath;
    if (stats.isDirectory()) {
      filePath = path.join(safePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(safePath, 'all-in-one-report.html');
      }
    }

    // Check if file exists after directory check
    fs.stat(filePath, (fileErr, fileStats) => {
      if (fileErr || !fileStats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end(`404 Not Found: ${pathname}`);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Support byte ranges for video streaming
      const range = req.headers.range;
      if (range && (ext === '.webm' || ext === '.mp4')) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileStats.size - 1;
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileStats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': contentType
        });

        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': fileStats.size,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Converze.AI Test Results & Live Runner Server on http://localhost:${PORT}`);
});
