#!/usr/bin/env node
/**
 * Antigravity Automated Re-Run Daemon
 * Listens for on-demand test execution triggers from the Render website / Dashboard
 * Executes the targeted scenario locally with Playwright and creates a separate isolated report.
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');
const https = require('https');

const WORKSPACE_DIR = __dirname;
const TEST_RESULT_DIR = path.resolve('c:/Users/parip/OneDrive/Documents/Vignesh/Test result');
const JOBS_FILE = path.join(TEST_RESULT_DIR, 'rerun-jobs.json');
const RENDER_BASE_URL = process.env.RENDER_URL || 'http://localhost:3000';

console.log('====================================================');
console.log('🤖 Antigravity Automated Test & Report Runner Daemon');
console.log(`📂 Workspace: ${WORKSPACE_DIR}`);
console.log(`📂 Test Result Repo: ${TEST_RESULT_DIR}`);
console.log(`🌐 Server Target: ${RENDER_BASE_URL}`);
console.log(`📄 Queue File: ${JOBS_FILE}`);
console.log('====================================================');

let isProcessing = false;

function loadJobs() {
  try {
    if (fs.existsSync(JOBS_FILE)) {
      return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading jobs file:', e.message);
  }
  return [];
}

function saveJobs(jobs) {
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs.slice(0, 100), null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving jobs file:', e.message);
  }
}

function appendJobLog(jobId, logText) {
  const line = `[${new Date().toLocaleTimeString()}] ${logText}`;
  console.log(`[${jobId}] ${logText}`);
  const jobs = loadJobs();
  const job = jobs.find(j => j.id === jobId);
  if (job) {
    job.logs = job.logs || [];
    job.logs.push(line);
    if (job.logs.length > 500) job.logs.shift();
    saveJobs(jobs);
  }
}

// Check remote Render server or local endpoint for pending jobs
async function fetchRemotePendingJobs() {
  return new Promise((resolve) => {
    try {
      const u = new URL('/api/pending-jobs', RENDER_BASE_URL);
      const client = u.protocol === 'https:' ? https : http;
      const req = client.get(u.href, { timeout: 3000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.jobs || []);
          } catch (e) {
            resolve([]);
          }
        });
      });
      req.on('error', () => resolve([]));
      req.on('timeout', () => { req.destroy(); resolve([]); });
    } catch (e) {
      resolve([]);
    }
  });
}

// Update index.html to register separate report on scenario card
function registerSeparateReportInIndexHtml(scenario, jobId, relativeReportUrl) {
  try {
    const indexPath = path.join(TEST_RESULT_DIR, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    let content = fs.readFileSync(indexPath, 'utf8');
    const runTimestamp = new Date().toLocaleString();
    const runPill = `\n          <a class="btn btn-sm btn-outline-info me-1 mb-1" href="${relativeReportUrl}" target="_blank" title="Executed at ${runTimestamp}">⚡ Run ${jobId.replace('run_', '')} (${runTimestamp.split(',')[1].trim()})</a>`;

    // Locate the scenario card actions
    const scenarioMarker = `href="${scenario}-report/all-in-one-report.html"`;
    if (content.includes(scenarioMarker)) {
      const targetAnchor = content.indexOf(scenarioMarker);
      const cardActionsEnd = content.indexOf('</div>', targetAnchor);
      if (cardActionsEnd !== -1) {
        content = content.slice(0, cardActionsEnd) + runPill + content.slice(cardActionsEnd);
        fs.writeFileSync(indexPath, content, 'utf8');
        console.log(`✓ Registered separate report pill in index.html for ${scenario}`);
      }
    }
  } catch (err) {
    console.warn('Failed to update index.html with separate run:', err.message);
  }
}

// Execute test job and generate separate report
async function processJob(job) {
  isProcessing = true;
  const scenario = job.scenario || 'scenario-9';
  const jobId = job.id;

  appendJobLog(jobId, `▶ Antigravity initiated execution for scenario: ${scenario}`);

  // Mark job as running
  const jobs = loadJobs();
  const currentJob = jobs.find(j => j.id === jobId);
  if (currentJob) {
    currentJob.status = 'running';
    currentJob.startedAt = new Date().toISOString();
    saveJobs(jobs);
  }

  // Step 1: Run Playwright test
  const scriptName = `test:${scenario}`;
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  appendJobLog(jobId, `Executing command: npm run ${scriptName}`);

  await new Promise((resolve) => {
    const child = spawn(npmCmd, ['run', scriptName], {
      cwd: WORKSPACE_DIR,
      shell: true
    });

    child.stdout.on('data', (d) => {
      const lines = d.toString().split('\n');
      lines.forEach(l => {
        if (l.trim()) appendJobLog(jobId, l.trim());
      });
    });

    child.stderr.on('data', (d) => {
      const lines = d.toString().split('\n');
      lines.forEach(l => {
        if (l.trim()) appendJobLog(jobId, `[ERR] ${l.trim()}`);
      });
    });

    child.on('close', (code) => {
      appendJobLog(jobId, `Playwright test execution finished with exit code: ${code}`);
      resolve(code);
    });
  });

  // Step 2: Compile Report
  const reportScript = `report:${scenario}-html`;
  appendJobLog(jobId, `Compiling HTML report via: npm run ${reportScript}`);

  await new Promise((resolve) => {
    const reportChild = spawn(npmCmd, ['run', reportScript], {
      cwd: WORKSPACE_DIR,
      shell: true
    });
    reportChild.stdout.on('data', (d) => {
      const lines = d.toString().split('\n');
      lines.forEach(l => {
        if (l.trim()) appendJobLog(jobId, l.trim());
      });
    });
    reportChild.on('close', (code) => {
      appendJobLog(jobId, `Report compiler exited with code: ${code}`);
      resolve(code);
    });
  });

  // Step 3: Create Separate Isolated Report Directory
  appendJobLog(jobId, `Creating separate isolated report for run ${jobId}...`);
  const baseReportDir = path.join(WORKSPACE_DIR, `${scenario}-report`);
  const separateDirName = `runs/${scenario}-${jobId}`;
  const targetRunsDirInWorkspace = path.join(WORKSPACE_DIR, 'runs', `${scenario}-${jobId}`);
  const targetRunsDirInTestResult = path.join(TEST_RESULT_DIR, 'runs', `${scenario}-${jobId}`);

  [path.dirname(targetRunsDirInWorkspace), path.dirname(targetRunsDirInTestResult)].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  if (fs.existsSync(baseReportDir)) {
    // Copy base report to separate directory in both workspace and test result
    fs.cpSync(baseReportDir, targetRunsDirInWorkspace, { recursive: true });
    fs.cpSync(baseReportDir, targetRunsDirInTestResult, { recursive: true });

    // Inject Run Header Banner
    const separateHtmlPath = path.join(targetRunsDirInTestResult, 'all-in-one-report.html');
    if (fs.existsSync(separateHtmlPath)) {
      let html = fs.readFileSync(separateHtmlPath, 'utf8');
      const runBanner = `
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #065f46 100%); color: #ffffff; padding: 16px 24px; font-weight: 600; text-align: center; border-bottom: 3px solid #10b981; font-family: -apple-system, sans-serif; box-shadow: 0 4px 16px rgba(0,0,0,0.6);">
        <div style="font-size: 1.15rem; margin-bottom: 4px;">🚀 SEPARATE RE-RUN EXECUTION REPORT &bull; Antigravity Autonomous Engine</div>
        <div style="font-size: 0.85rem; opacity: 0.95;">Job ID: <code style="background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; color: #67e8f9;">${jobId}</code> &bull; Scenario: <strong>${scenario.toUpperCase()}</strong> &bull; Generated: ${new Date().toLocaleString()}</div>
      </div>
      `;
      html = html.replace('<body>', `<body>\n${runBanner}`);
      fs.writeFileSync(separateHtmlPath, html, 'utf8');
      fs.writeFileSync(path.join(targetRunsDirInWorkspace, 'all-in-one-report.html'), html, 'utf8');
    }

    const relativeReportUrl = `runs/${scenario}-${jobId}/all-in-one-report.html`;
    appendJobLog(jobId, `✓ Separate report successfully created at: ${relativeReportUrl}`);

    // Update index.html
    registerSeparateReportInIndexHtml(scenario, jobId, relativeReportUrl);

    // Update job status
    const allJobs = loadJobs();
    const j = allJobs.find(item => item.id === jobId);
    if (j) {
      j.status = 'passed';
      j.completedAt = new Date().toISOString();
      j.separateReportUrl = relativeReportUrl;
      saveJobs(allJobs);
    }

    // Step 4: Push to Git to update Render published website
    appendJobLog(jobId, `Pushing separate report to GitHub to update Render...`);
    try {
      execSync('git add -A && git commit -m "feat(rerun): add separate report for ' + jobId + '" && git push origin main', {
        cwd: TEST_RESULT_DIR,
        stdio: 'pipe'
      });
      appendJobLog(jobId, `✓ GitHub & Render sync complete!`);
    } catch (gitErr) {
      appendJobLog(jobId, `Git push notice: ${gitErr.message}`);
    }
  } else {
    appendJobLog(jobId, `Error: Base report directory not found at ${baseReportDir}`);
  }

  appendJobLog(jobId, `🎉 All tasks complete for job ${jobId}. Antigravity ready for next run.`);
  isProcessing = false;
}

// Polling Loop
async function pollQueue() {
  if (isProcessing) return;

  // 1. Check local file queue
  const localJobs = loadJobs();
  const pendingLocal = localJobs.find(j => j.status === 'queued');
  if (pendingLocal) {
    console.log(`[Queue] Detected local pending job: ${pendingLocal.id} (${pendingLocal.scenario})`);
    await processJob(pendingLocal);
    return;
  }

  // 2. Check remote Render queue
  const remoteJobs = await fetchRemotePendingJobs();
  const pendingRemote = remoteJobs.find(j => j.status === 'queued');
  if (pendingRemote) {
    console.log(`[Queue] Detected remote pending job from Render: ${pendingRemote.id} (${pendingRemote.scenario})`);
    // Merge into local jobs
    const current = loadJobs();
    if (!current.some(j => j.id === pendingRemote.id)) {
      current.unshift(pendingRemote);
      saveJobs(current);
    }
    await processJob(pendingRemote);
    return;
  }
}

// Start continuous polling loop every 3 seconds
console.log('👀 Antigravity Re-Run Daemon is active and listening for re-run requests...');
setInterval(pollQueue, 3000);
pollQueue();
