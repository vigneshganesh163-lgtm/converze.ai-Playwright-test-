const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const WORKSPACE_DIR = path.resolve(__dirname, '../Converze.ai -playwright test new');
const EXECUTION_DIR = fs.existsSync(path.join(WORKSPACE_DIR, 'node_modules')) ? WORKSPACE_DIR : PUBLIC_DIR;
const GITHUB_REPO = 'vigneshganesh163-lgtm/converze.ai-Playwright-test-';
const GITHUB_WORKFLOW = 'run-tests.yml';
const JOBS_FILE = path.join(PUBLIC_DIR, 'rerun-jobs.json');

// Persistent Re-run Jobs Queue
let rerunJobs = [];
try {
  if (fs.existsSync(JOBS_FILE)) {
    rerunJobs = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
  }
} catch (e) {
  rerunJobs = [];
}

function saveJobs() {
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(rerunJobs.slice(0, 100), null, 2), 'utf8');
  } catch (e) {
    console.warn('Failed to save jobs file:', e.message);
  }
}

// Current test execution state (in-memory tracker)
let currentTestRun = {
  running: false,
  jobId: null,
  scenario: null,
  startTime: null,
  endTime: null,
  status: 'idle',
  separateReportUrl: null,
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

function addLog(msg, jobId) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
  currentTestRun.logs.push(line);
  if (currentTestRun.logs.length > 500) {
    currentTestRun.logs.shift();
  }

  if (jobId) {
    const job = rerunJobs.find(j => j.id === jobId);
    if (job) {
      job.logs = job.logs || [];
      job.logs.push(line);
      if (job.logs.length > 500) job.logs.shift();
    }
  }
  saveJobs();
}

// Trigger GitHub Actions workflow_dispatch via GitHub API
function triggerGitHubWorkflow(scenario, token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      ref: 'main',
      inputs: {
        scenario: scenario || 'scenario-9'
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

// Helper to spawn a local test and create a separate report
function executeLocalTestWithSeparateReport(job) {
  const scenario = job.scenario;
  const jobId = job.id;

  currentTestRun.running = true;
  currentTestRun.jobId = jobId;
  currentTestRun.scenario = scenario;
  currentTestRun.startTime = new Date().toISOString();
  currentTestRun.endTime = null;
  currentTestRun.status = 'running';
  currentTestRun.separateReportUrl = null;
  currentTestRun.logs = [];

  job.status = 'running';
  job.startedAt = new Date().toISOString();
  addLog(`⚡ [Antigravity Local Engine] Executing Playwright automated test for ${scenario}...`, jobId);

  const scriptName = `test:${scenario}`;
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  const child = spawn(npmCmd, ['run', scriptName], {
    cwd: EXECUTION_DIR,
    shell: true
  });

  child.stdout.on('data', (d) => {
    const text = d.toString().trim();
    if (text) {
      text.split('\n').forEach(line => addLog(line.trim(), jobId));
    }
  });

  child.stderr.on('data', (d) => {
    const text = d.toString().trim();
    if (text) {
      text.split('\n').forEach(line => addLog(`[ERR] ${line.trim()}`, jobId));
    }
  });

  child.on('close', (code) => {
    currentTestRun.running = false;
    currentTestRun.endTime = new Date().toISOString();
    const passed = code === 0;
    currentTestRun.status = passed ? 'passed' : 'failed';
    job.status = passed ? 'passed' : 'failed';
    job.completedAt = new Date().toISOString();
    addLog(`Test process exited with code ${code}. Status: ${currentTestRun.status.toUpperCase()}`, jobId);

    // Regenerate Base HTML report
    const reportScript = `report:${scenario}-html`;
    addLog(`Compiling HTML report via ${reportScript}...`, jobId);
    const reportChild = spawn(npmCmd, ['run', reportScript], {
      cwd: EXECUTION_DIR,
      shell: true
    });

    reportChild.on('close', () => {
      try {
        // Create an isolated, separate report directory for this specific run
        const baseReportDir = path.join(EXECUTION_DIR, `${scenario}-report`);
        const separateRunsDir = path.join(PUBLIC_DIR, 'runs');
        const workspaceRunsDir = path.join(EXECUTION_DIR, 'runs');
        if (!fs.existsSync(separateRunsDir)) fs.mkdirSync(separateRunsDir, { recursive: true });
        if (!fs.existsSync(workspaceRunsDir)) fs.mkdirSync(workspaceRunsDir, { recursive: true });

        const targetRunDir = path.join(separateRunsDir, `${scenario}-${jobId}`);
        const targetWorkspaceRunDir = path.join(workspaceRunsDir, `${scenario}-${jobId}`);
        if (fs.existsSync(baseReportDir)) {
          // Copy directory recursively
          fs.cpSync(baseReportDir, targetRunDir, { recursive: true });
          fs.cpSync(baseReportDir, targetWorkspaceRunDir, { recursive: true });
          
          // Inject run-specific execution badge into separate report
          const separateReportFile = path.join(targetRunDir, 'all-in-one-report.html');
          if (fs.existsSync(separateReportFile)) {
            let html = fs.readFileSync(separateReportFile, 'utf8');
            const runBanner = `
            <div style="background: linear-gradient(90deg, #1e3a8a, #065f46); color: #fff; padding: 14px 24px; font-weight: 600; text-align: center; border-bottom: 2px solid #10b981;">
              🚀 SEPARATE RE-RUN EXECUTION ARCHIVE &bull; Job ID: <code>${jobId}</code> &bull; Scenario: <strong>${scenario.toUpperCase()}</strong> &bull; Executed at: ${new Date().toLocaleString()}
            </div>
            `;
            html = html.replace('<body>', `<body>\n${runBanner}`);
            fs.writeFileSync(separateReportFile, html, 'utf8');
            fs.writeFileSync(path.join(targetWorkspaceRunDir, 'all-in-one-report.html'), html, 'utf8');
          }

          const relativeReportUrl = `runs/${scenario}-${jobId}/all-in-one-report.html`;
          job.separateReportUrl = relativeReportUrl;
          currentTestRun.separateReportUrl = relativeReportUrl;
          addLog(`✓ Separate report generated successfully at: ${relativeReportUrl}`, jobId);
          saveJobs();

          // Push to GitHub so Render updates
          try {
            const { execSync } = require('child_process');
            execSync('git add -A && git commit -m "feat(rerun): add separate report for ' + jobId + '" && git push origin main', {
              cwd: PUBLIC_DIR,
              stdio: 'pipe'
            });
            addLog(`✓ Pushed separate report to GitHub (Render auto-deploy triggered).`, jobId);
          } catch(e) {
            addLog(`Git sync notice: ${e.message}`, jobId);
          }
        }
      } catch (err) {
        addLog(`Warning during separate report generation: ${err.message}`, jobId);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Set CORS headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- API: Test Execution Status ---
  if (pathname === '/api/test-status') {
    const jobId = parsedUrl.query.jobId;
    let targetJob = null;
    if (jobId) {
      targetJob = rerunJobs.find(j => j.id === jobId);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ...currentTestRun,
      job: targetJob,
      githubRepo: GITHUB_REPO,
      workflowUrl: `https://github.com/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}`
    }));
  }

  // --- API: Check Pending Jobs Queue (For Antigravity Daemon) ---
  if (pathname === '/api/pending-jobs') {
    const pending = rerunJobs.filter(j => j.status === 'queued');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      count: pending.length,
      jobs: pending
    }));
  }

  // --- API: Claim Job (Antigravity Daemon Claims Execution) ---
  if (pathname === '/api/claim-job' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body || '{}'); } catch(e) {}
      const job = rerunJobs.find(j => j.id === parsed.jobId);
      if (job) {
        job.status = 'running';
        job.startedAt = new Date().toISOString();
        addLog(`[Antigravity Agent] Claimed job ${job.id} for automated execution.`, job.id);
        saveJobs();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, job }));
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: 'Job not found' }));
    });
    return;
  }

  // --- API: Append Log to Job ---
  if (pathname === '/api/job-log' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body || '{}'); } catch(e) {}
      if (parsed.jobId && parsed.log) {
        addLog(parsed.log, parsed.jobId);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // --- API: Complete Job ---
  if (pathname === '/api/complete-job' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body || '{}'); } catch(e) {}
      const job = rerunJobs.find(j => j.id === parsed.jobId);
      if (job) {
        job.status = parsed.status || 'passed';
        job.completedAt = new Date().toISOString();
        if (parsed.separateReportUrl) {
          job.separateReportUrl = parsed.separateReportUrl;
        }
        addLog(`[Antigravity Agent] Job ${job.id} completed. Status: ${job.status.toUpperCase()}`, job.id);
        saveJobs();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, job }));
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: false, error: 'Job not found' }));
    });
    return;
  }

  // --- API: Get Job Status by ID ---
  if (pathname === '/api/job-status') {
    const jobId = parsedUrl.query.id;
    const job = rerunJobs.find(j => j.id === jobId);
    if (job) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ success: true, job }));
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: false, error: 'Job not found' }));
  }

  // --- API: List All Recent Runs ---
  if (pathname === '/api/recent-runs') {
    const scenario = parsedUrl.query.scenario;
    let filtered = rerunJobs;
    if (scenario) {
      filtered = rerunJobs.filter(j => j.scenario === scenario);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      total: filtered.length,
      runs: filtered.slice(0, 30)
    }));
  }

  // --- API: Re-run Test Trigger (Queue a Job for Antigravity) ---
  if (pathname === '/api/run-test' || pathname === '/api/queue-rerun') {
    const handleTrigger = async (scenario, token) => {
      scenario = scenario || 'scenario-9';

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

      // 2. Queue Job for Antigravity Automated Engine
      const jobId = `run_${Date.now()}`;
      const newJob = {
        id: jobId,
        scenario: scenario,
        status: 'queued',
        requestedAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
        separateReportUrl: null,
        logs: [`[${new Date().toLocaleTimeString()}] Re-run request queued for ${scenario} (Job ID: ${jobId})`]
      };

      rerunJobs.unshift(newJob);
      saveJobs();
      addLog(`Job ${jobId} placed into Antigravity execution queue for ${scenario}.`, jobId);

      // 3. If running locally with package scripts present, spawn local test immediately
      const isLocalWithNpm = fs.existsSync(path.join(PUBLIC_DIR, 'package.json'));
      if (isLocalWithNpm && !currentTestRun.running) {
        executeLocalTestWithSeparateReport(newJob);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        success: true,
        jobId: jobId,
        mode: 'antigravity_queue',
        scenario: scenario,
        message: `Re-run queued successfully. Antigravity will execute testing and generate a separate report.`
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
  console.log(`🚀 Converze.AI Test Results & Antigravity Live Runner Server on http://localhost:${PORT}`);
});
