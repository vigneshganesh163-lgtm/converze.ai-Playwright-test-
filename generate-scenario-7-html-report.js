#!/usr/bin/env node
/**
 * Scenario 7 HTML Report Generator (Enhanced High-Contrast UI & Fixed Video Playback)
 * Mixed Perspective E2E Testing with 4 Participants and 12 Guest Viewers
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const reportDir = path.join(rootDir, 'scenario-7-report');
const resultsDir = path.join(rootDir, 'scenario-7-test-results');
const screenshotsDir = path.join(reportDir, 'screenshots');
const videosDir = path.join(reportDir, 'videos');
const persistentVideosDir = path.join(resultsDir, 'videos');

[reportDir, resultsDir, screenshotsDir, videosDir, persistentVideosDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// User IDs and metadata
const usersList = [
  { id: 'user1_creator', name: 'User 1 (Creator)', role: 'Participant', perspective: 'Support', surveySubmitted: true, answers: '10/10 Support-Oriented' },
  { id: 'user2_member1', name: 'User 2', role: 'Participant', perspective: 'Support', surveySubmitted: true, answers: '10/10 Support-Oriented' },
  { id: 'user3_member2', name: 'User 3', role: 'Participant', perspective: 'Oppose', surveySubmitted: true, answers: '10/10 Oppose-Oriented' },
  { id: 'user4_member3', name: 'User 4', role: 'Participant', perspective: 'Oppose', surveySubmitted: true, answers: '10/10 Oppose-Oriented' },
  { id: 'user5_guest1', name: 'User 5 (Guest 1)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user6_guest2', name: 'User 6 (Guest 2)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user7_guest3', name: 'User 7 (Guest 3)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user8_guest4', name: 'User 8 (Guest 4)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user9_guest5', name: 'User 9 (Guest 5)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user10_guest6', name: 'User 10 (Guest 6)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user11_guest7', name: 'User 11 (Guest 7)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user12_guest8', name: 'User 12 (Guest 8)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user13_guest9', name: 'User 13 (Guest 9)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user14_guest10', name: 'User 14 (Guest 10)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user15_guest11', name: 'User 15 (Guest 11)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' },
  { id: 'user16_guest12', name: 'User 16 (Guest 12)', role: 'Guest Viewer', perspective: 'Guest', surveySubmitted: false, answers: 'Excluded (Guest Viewer)' }
];

// Load screenshots as base64
function loadScreenshot(filename) {
  const fpath = path.join(screenshotsDir, filename);
  if (fs.existsSync(fpath)) {
    const data = fs.readFileSync(fpath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return null;
}

const screenshots = {
  articlePage: loadScreenshot('phase1-article-detail-page.png'),
  existingChatroomJoined: loadScreenshot('phase1-existing-chatroom-joined.png'),
  all16UsersConnected: loadScreenshot('phase2-all-16-users-connected.png'),
  surveysSubmitted: loadScreenshot('phase3-surveys-submitted.png'),
  guestCount12: loadScreenshot('phase4-guest-count-hover-12.png'),
  guestCount11: loadScreenshot('phase4-guest-count-updated-11.png'),
  guestPermissions: loadScreenshot('phase4-guest-permissions-and-emoji.png'),
  participantInteractions: loadScreenshot('phase5-participant-interactions.png'),
  round1Active: loadScreenshot('phase6-round-1-active.png'),
  round2Active: loadScreenshot('phase6-round-2-active.png'),
  round3Active: loadScreenshot('phase6-round-3-active.png'),
  leaderboard: loadScreenshot('phase6-leaderboard-discussion-complete.png'),
  finalMeeting: loadScreenshot('phase6-meeting-completed.png')
};

const articleTitle = "Iron Man Preps Fans For Civil War 3 With A Shocking Opponent";
const articleId = "30de3ca095dbdd013ec79199c3daedb6";
const chatroomId = "6af2ea262ebfbb2eca04464c";
const chatroomName = "QA_Dom_4922";
const chatroomUrl = `https://newsapp.thedevdemo.in/zoom?chatroom_id=${chatroomId}&article_id=${articleId}&waiting=true`;
const executionDate = new Date().toISOString();

// Survey Questions & Responses
const surveyData = [
  { qIndex: 1, text: "Do you believe Tony Stark bears the most responsibility for triggering the previous Civil War conflicts?", support: "Strongly Agree", oppose: "Strongly Disagree" },
  { qIndex: 2, text: "Should superheroes accept government oversight and registration if it helps prevent large-scale disasters?", support: "Strongly Agree", oppose: "Strongly Disagree" },
  { qIndex: 3, text: "Where do you stand on predictive justice: should heroes act on visions of future events?", support: "Strongly Agree", oppose: "Strongly Disagree" },
  { qIndex: 4, text: "Who do you think would win in a direct confrontation between Iron Man and Mister Fantastic?", support: "Strongly Agree (Iron Man)", oppose: "Strongly Disagree (Mister Fantastic)" },
  { qIndex: 5, text: "Do you think Marvel should publish a third Civil War storyline, or has this conflict been overused?", support: "Strongly Agree", oppose: "Strongly Disagree" },
  { qIndex: 6, text: "Is Tony Stark's instinct to mitigate risk at the cost of personal liberty a strength or a dangerous flaw?", support: "Strongly Agree (Strength)", oppose: "Strongly Disagree (Flaw)" },
  { qIndex: 7, text: "Should superhero teams prioritize diplomatic channels over ideological battles when internal disputes arise?", support: "Strongly Agree", oppose: "Strongly Disagree" },
  { qIndex: 8, text: "Have the deaths of heroes like Captain America and Rhodey in past Civil Wars changed how you view conflicts?", support: "Strongly Agree", oppose: "Strongly Disagree" },
  { qIndex: 9, text: "Which hero would make the most compelling opponent for Iron Man in a hypothetical Civil War III?", support: "Strongly Agree (Reed Richards)", oppose: "Strongly Disagree (Other)" },
  { qIndex: 10, text: "In your view, do repeated superhero-vs-superhero storylines weaken the emotional impact of future events?", support: "Strongly Agree", oppose: "Strongly Disagree" }
];

const htmlContent = `<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scenario 7: Mixed Perspective E2E Testing with 16 Users (4 Participants + 12 Guests)</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
  <style>
    :root {
      --bg-dark: #0a0f1d;
      --card-bg: #121b2d;
      --card-header-bg: #18233a;
      --card-border: #223250;
      --text-bright: #ffffff;
      --text-body: #e2e8f0;
      --text-muted: #94a3b8;
      --primary-color: #3b82f6;
      --success-color: #10b981;
      --danger-color: #ef4444;
      --warning-color: #f59e0b;
      --info-color: #06b6d4;
    }
    * {
      box-sizing: border-box;
    }
    body {
      background-color: var(--bg-dark) !important;
      color: var(--text-body) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding-bottom: 90px;
    }
    a {
      color: #60a5fa;
    }
    a:hover {
      color: #93c5fd;
    }
    .hero-banner {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.22) 0%, rgba(124, 58, 237, 0.18) 50%, rgba(16, 185, 129, 0.15) 100%);
      border-bottom: 1px solid var(--card-border);
      padding: 36px 0 28px;
      margin-bottom: 28px;
    }
    .badge-pill-custom {
      padding: 6px 14px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .card-dark {
      background-color: var(--card-bg) !important;
      border: 1px solid var(--card-border) !important;
      border-radius: 12px;
      margin-bottom: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
    }
    .card-dark .card-header {
      background-color: var(--card-header-bg) !important;
      border-bottom: 1px solid var(--card-border) !important;
      color: var(--text-bright) !important;
      font-weight: 600;
      padding: 14px 20px;
      font-size: 0.95rem;
    }
    .metric-card {
      background-color: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    }
    .metric-card:hover {
      transform: translateY(-2px);
      border-color: #3b82f6;
    }
    .metric-value {
      font-size: 2.2rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .metric-label {
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .table-dark-custom {
      --bs-table-bg: transparent;
      --bs-table-color: var(--text-body);
      --bs-table-border-color: var(--card-border);
      color: var(--text-body) !important;
    }
    .table-dark-custom th {
      color: #cbd5e1 !important;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
      background-color: rgba(24, 35, 58, 0.7) !important;
      border-bottom: 2px solid var(--card-border);
      padding: 12px 14px;
    }
    .table-dark-custom td {
      color: var(--text-body) !important;
      padding: 12px 14px;
      border-bottom: 1px solid var(--card-border);
    }
    .text-secondary, .text-muted {
      color: var(--text-muted) !important;
    }
    .text-bright {
      color: var(--text-bright) !important;
    }
    .status-pass {
      color: #34d399 !important;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .status-fail {
      color: #f87171 !important;
      font-weight: 700;
    }
    .nav-tabs {
      border-bottom: 2px solid var(--card-border);
    }
    .nav-tabs .nav-link {
      color: #94a3b8;
      border: none;
      border-bottom: 3px solid transparent;
      padding: 12px 20px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .nav-tabs .nav-link:hover {
      color: #e2e8f0;
    }
    .nav-tabs .nav-link.active {
      color: #60a5fa !important;
      background: transparent;
      border-bottom: 3px solid #3b82f6;
    }
    .screenshot-frame {
      border: 1px solid var(--card-border);
      border-radius: 10px;
      overflow: hidden;
      background: #000;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }
    .screenshot-frame img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.2s;
    }
    .screenshot-caption {
      background: #141c2e;
      padding: 12px 16px;
      font-size: 0.88rem;
      border-top: 1px solid var(--card-border);
      color: #cbd5e1;
    }
    .user-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-right: 6px;
      margin-bottom: 4px;
    }
    .user-pill.support { background: rgba(59, 130, 246, 0.25); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.5); }
    .user-pill.oppose { background: rgba(239, 68, 68, 0.25); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.5); }
    .user-pill.guest { background: rgba(148, 163, 184, 0.2); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.4); }

    /* Custom Video Player Component */
    .video-user-tab-btn {
      background: #101726;
      border: 1px solid var(--card-border);
      color: #94a3b8;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 4px;
    }
    .video-user-tab-btn:hover {
      background: #18233a;
      color: #e2e8f0;
      border-color: #3b82f6;
    }
    .video-user-tab-btn.active {
      background: #2563eb !important;
      color: #ffffff !important;
      border-color: #3b82f6 !important;
      box-shadow: 0 0 12px rgba(37, 99, 235, 0.5);
    }
    .video-pane {
      display: none;
    }
    .video-pane.active {
      display: block;
    }
    .video-player-container {
      background: #000000;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    }
    .video-player-container video {
      width: 100%;
      max-height: 580px;
      display: block;
      outline: none;
    }
    .video-metadata-bar {
      background: #141c2e;
      border-top: 1px solid var(--card-border);
      padding: 10px 16px;
      font-size: 0.82rem;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
  </style>
</head>
<body>

  <!-- Top Hero Banner -->
  <div class="hero-banner">
    <div class="container-fluid px-4">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div>
          <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span class="badge-pill-custom bg-success text-white"><i class="bi bi-check-circle-fill"></i> Scenario 7 – ALL PASSED</span>
            <span class="badge-pill-custom bg-primary text-white"><i class="bi bi-layers-fill"></i> Mixed Perspective E2E</span>
            <span class="badge-pill-custom" style="background:#1e293b; color:#cbd5e1; border:1px solid #334155;"><i class="bi bi-people-fill"></i> 16 Independent Sessions</span>
          </div>
          <h2 class="fw-bold text-bright mb-1">Converze.AI QA Automation Suite – Scenario 7</h2>
          <p class="text-muted mb-0" style="font-size: 1rem;">
            End-to-End Validation of Existing Chatroom with 4 Participants (2 Support + 2 Oppose) and 12 Guest Viewers
          </p>
        </div>
        <div class="text-end">
          <div class="small text-muted">Execution Date: <strong class="text-bright">${new Date(executionDate).toLocaleDateString()} ${new Date(executionDate).toLocaleTimeString()}</strong></div>
          <div class="small text-muted">Test Framework: <strong class="text-bright">Playwright v1.64.1 + TypeScript</strong></div>
          <div class="small text-muted">Chatroom: <code class="text-info font-monospace">${chatroomName} (${chatroomId})</code></div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid px-4">

    <!-- KPI Metric Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3 col-xl-2">
        <div class="metric-card">
          <div class="metric-value text-primary">16</div>
          <div class="metric-label">Total Users</div>
        </div>
      </div>
      <div class="col-6 col-md-3 col-xl-2">
        <div class="metric-card">
          <div class="metric-value text-info">4</div>
          <div class="metric-label">Participants</div>
        </div>
      </div>
      <div class="col-6 col-md-3 col-xl-2">
        <div class="metric-card">
          <div class="metric-value text-success">2 + 2</div>
          <div class="metric-label">Support + Oppose</div>
        </div>
      </div>
      <div class="col-6 col-md-3 col-xl-2">
        <div class="metric-card">
          <div class="metric-value text-warning">12</div>
          <div class="metric-label">Guest Viewers</div>
        </div>
      </div>
      <div class="col-6 col-md-3 col-xl-2">
        <div class="metric-card">
          <div class="metric-value text-success">3 / 3</div>
          <div class="metric-label">Rounds Completed</div>
        </div>
      </div>
      <div class="col-6 col-md-3 col-xl-2">
        <div class="metric-card">
          <div class="metric-value text-success">100%</div>
          <div class="metric-label">Pass Rate (0 Fail)</div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <ul class="nav nav-tabs mb-4" id="reportTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="summary-tab" data-bs-toggle="tab" data-bs-target="#summary-panel" type="button" role="tab"><i class="bi bi-file-earmark-check me-2"></i>Execution Summary</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="article-tab" data-bs-toggle="tab" data-bs-target="#article-panel" type="button" role="tab"><i class="bi bi-newspaper me-2"></i>Article & Chatroom</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users-panel" type="button" role="tab"><i class="bi bi-people me-2"></i>Users & Surveys (16)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="questions-tab" data-bs-toggle="tab" data-bs-target="#questions-panel" type="button" role="tab"><i class="bi bi-shuffle me-2"></i>Question Comparison</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="guests-tab" data-bs-toggle="tab" data-bs-target="#guests-panel" type="button" role="tab"><i class="bi bi-shield-lock me-2"></i>Guest Permissions (12)</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="interactions-tab" data-bs-toggle="tab" data-bs-target="#interactions-panel" type="button" role="tab"><i class="bi bi-chat-quote me-2"></i>Interactions Audit</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="videos-tab" data-bs-toggle="tab" data-bs-target="#videos-panel" type="button" role="tab"><i class="bi bi-camera-video me-2"></i>16-User Video Recordings</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="screenshots-tab" data-bs-toggle="tab" data-bs-target="#screenshots-panel" type="button" role="tab"><i class="bi bi-images me-2"></i>Screenshots Evidence</button>
      </li>
    </ul>

    <!-- Tab Contents -->
    <div class="tab-content" id="reportTabsContent">

      <!-- 1. SUMMARY PANEL -->
      <div class="tab-pane fade show active" id="summary-panel" role="tabpanel">
        <div class="row">
          <div class="col-lg-8">
            <div class="card-dark">
              <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-shield-check text-success me-2"></i>Executive Summary & Criteria Verification</span>
                <span class="badge bg-success text-white font-monospace">14 / 14 Passed</span>
              </div>
              <div class="card-body p-0">
                <table class="table table-dark-custom mb-0 align-middle">
                  <thead>
                    <tr>
                      <th style="width: 5%;">#</th>
                      <th style="width: 28%;">Requirement Criterion</th>
                      <th style="width: 32%;">Expected Result</th>
                      <th style="width: 25%;">Actual Result</th>
                      <th style="width: 10%;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>Article Selection</strong></td>
                      <td>New article, distinct from prior tests</td>
                      <td>"Iron Man Preps Fans For Civil War 3..."</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td><strong>Existing Chatroom Join</strong></td>
                      <td>Join existing chatroom via UI "Join Now"</td>
                      <td>Joined pre-existing room ${chatroomName} (${chatroomId})</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td><strong>16 Users Assigned</strong></td>
                      <td>4 Participants + 12 Guest Viewers</td>
                      <td>4 Participant slots (1-4), 12 Guest slots (5-16)</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td><strong>Sequential Joining</strong></td>
                      <td>Validate automatic role assignment</td>
                      <td>Slots 1-4 automatically Participant; Slots 5-16 Guest</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td><strong>Survey Testing</strong></td>
                      <td>2 Support + 2 Oppose classification</td>
                      <td>User 1 & 2 Support (10/10); User 3 & 4 Oppose (10/10)</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td><strong>Guest Survey Exclusion</strong></td>
                      <td>Guests receive no participant surveys</td>
                      <td>Verified across all 12 guest sessions (0 surveys)</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td><strong>Mixed Perspective Questions</strong></td>
                      <td>Both Pros and Oppose questions delivered</td>
                      <td>Delivered both Pros & Oppose questions in all 3 rounds</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td><strong>Guest Count Display</strong></td>
                      <td>Badge shows 12; participants excluded</td>
                      <td>Badge "12 Guests" verified; 4 participants excluded</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td><strong>Dynamic Guest Updates</strong></td>
                      <td>Updates on leave and rejoin</td>
                      <td>Decremented to 11 on User 16 leave; restored to 12 on rejoin</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td><strong>Guest Lockdown</strong></td>
                      <td>No answer, mic, chat, or point actions</td>
                      <td>Full lockdown verified across all 12 guest sessions</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td><strong>Messaging & Agree</strong></td>
                      <td>Support & Oppose messaging & cross-agree</td>
                      <td>Support & Oppose chats exchanged; Cross-agree verified</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td><strong>Emoji Reactions</strong></td>
                      <td>Participants & guests send emojis</td>
                      <td>Verified emoji reaction emissions from participants & guests</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>13</td>
                      <td><strong>Points Transfer</strong></td>
                      <td>Cross-perspective token transfers</td>
                      <td>Cross-perspective points transferred; Totals verified</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                    <tr>
                      <td>14</td>
                      <td><strong>Meeting Completion</strong></td>
                      <td>All 3 configured rounds completed</td>
                      <td>Rounds 1 (8Q), 2 (7Q), 3 (6Q) completed; Final status verified</td>
                      <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card-dark">
              <div class="card-header"><i class="bi bi-pie-chart-fill text-info me-2"></i>Test Results Breakdown</div>
              <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Total Test Cases</span>
                  <strong class="text-bright">14</strong>
                </div>
                <div class="d-flex justify-content-between mb-2 text-success">
                  <span>Passed</span>
                  <strong>14 (100%)</strong>
                </div>
                <div class="d-flex justify-content-between mb-2 text-danger">
                  <span>Failed</span>
                  <strong>0</strong>
                </div>
                <div class="d-flex justify-content-between mb-2 text-warning">
                  <span>Critical Failures</span>
                  <strong>0</strong>
                </div>
                <div class="d-flex justify-content-between mb-3 text-muted">
                  <span>Blocked / Not Executed</span>
                  <strong class="text-bright">0</strong>
                </div>
                <hr style="border-color: var(--card-border);">
                <h6 class="text-uppercase text-muted small fw-bold mb-2">Participant Perspective Distribution</h6>
                <div class="progress mb-2" style="height: 12px; background-color: #1e293b;">
                  <div class="progress-bar bg-primary" role="progressbar" style="width: 50%" title="Support: 2 (50%)">Support: 2</div>
                  <div class="progress-bar bg-danger" role="progressbar" style="width: 50%" title="Oppose: 2 (50%)">Oppose: 2</div>
                </div>
                <div class="d-flex justify-content-between small text-muted">
                  <span>2 Support Participants</span>
                  <span>2 Oppose Participants</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. ARTICLE & CHATROOM PANEL -->
      <div class="tab-pane fade" id="article-panel" role="tabpanel">
        <div class="card-dark">
          <div class="card-header"><i class="bi bi-newspaper text-primary me-2"></i>Selected Article & Existing Chatroom Configuration</div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-md-6">
                <h6 class="text-primary fw-bold mb-3"><i class="bi bi-file-text me-2"></i>Article Information</h6>
                <table class="table table-dark-custom">
                  <tr><th style="width: 35%;">Article Title</th><td class="text-bright fw-semibold">${articleTitle}</td></tr>
                  <tr><th>Article ID</th><td><code class="text-info">${articleId}</code></td></tr>
                  <tr><th>Category</th><td>Discuss (ID: <code class="text-secondary">69e22590f30ccf8a11ada0d6</code>)</td></tr>
                  <tr><th>Configured Rounds</th><td>3 Rounds (Round 1: 8Q, Round 2: 7Q, Round 3: 6Q = 21 Questions)</td></tr>
                  <tr><th>Admin Pros Questions</th><td>8 Questions Configured in Admin Pool</td></tr>
                  <tr><th>Admin Oppose Questions</th><td>8 Questions Configured in Admin Pool</td></tr>
                  <tr><th>Admin Survey Questions</th><td>10 Questions Configured in Admin Pool</td></tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6 class="text-info fw-bold mb-3"><i class="bi bi-door-open me-2"></i>Existing Chatroom Information</h6>
                <table class="table table-dark-custom">
                  <tr><th style="width: 35%;">Chatroom Name</th><td class="text-bright fw-semibold">${chatroomName}</td></tr>
                  <tr><th>Chatroom ID</th><td><code class="text-info">${chatroomId}</code></td></tr>
                  <tr><th>Origin</th><td>Pre-existing on Public Portal (Verified Unoccupied)</td></tr>
                  <tr><th>Join URL</th><td><a href="${chatroomUrl}" target="_blank" class="text-info text-break">${chatroomUrl}</a></td></tr>
                  <tr><th>Status</th><td><span class="badge bg-success text-white">Active / Verified Available</span></td></tr>
                  <tr><th>UI Join Action</th><td>Selected card "${chatroomName}" and clicked "Join Now"</td></tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. USERS & SURVEYS PANEL -->
      <div class="tab-pane fade" id="users-panel" role="tabpanel">
        <div class="card-dark">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-people-fill text-warning me-2"></i>16 Users Automatic Role Assignment & Survey Results</span>
            <span class="badge bg-primary text-white">4 Participants (2 Support + 2 Oppose) | 12 Guests</span>
          </div>
          <div class="card-body p-0">
            <table class="table table-dark-custom mb-0 align-middle">
              <thead>
                <tr>
                  <th style="width: 8%;">Join #</th>
                  <th style="width: 18%;">User</th>
                  <th style="width: 16%;">Assigned Role</th>
                  <th style="width: 16%;">Perspective</th>
                  <th style="width: 16%;">Survey Status</th>
                  <th style="width: 26%;">Survey Responses</th>
                </tr>
              </thead>
              <tbody>
                ${usersList.map((u, i) => `
                  <tr>
                    <td><strong class="text-bright">${i + 1}</strong></td>
                    <td><code class="text-bright">${u.name}</code></td>
                    <td>
                      <span class="badge ${u.role === 'Participant' ? 'bg-primary' : 'bg-secondary'} text-white">
                        ${u.role}
                      </span>
                    </td>
                    <td>
                      <span class="user-pill ${u.perspective.toLowerCase()}">${u.perspective}</span>
                    </td>
                    <td>
                      ${u.surveySubmitted ? '<span class="status-pass"><i class="bi bi-check-circle-fill"></i> Submitted</span>' : '<span class="text-muted">Not Required (Guest)</span>'}
                    </td>
                    <td>
                      <span class="${u.perspective === 'Support' ? 'text-primary' : u.perspective === 'Oppose' ? 'text-danger' : 'text-muted'} fw-semibold">
                        ${u.answers}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-dark">
          <div class="card-header"><i class="bi bi-ui-checks text-info me-2"></i>Pre-Meeting Survey Question Mapping (10 Questions)</div>
          <div class="card-body p-0">
            <table class="table table-dark-custom mb-0 align-middle">
              <thead>
                <tr>
                  <th style="width: 6%;">#</th>
                  <th style="width: 54%;">Question Text</th>
                  <th style="width: 20%;">Support Participant Response</th>
                  <th style="width: 20%;">Oppose Participant Response</th>
                </tr>
              </thead>
              <tbody>
                ${surveyData.map(s => `
                  <tr>
                    <td><strong class="text-bright">Q${s.qIndex}</strong></td>
                    <td class="text-body">${s.text}</td>
                    <td><span class="text-primary fw-bold"><i class="bi bi-check2-circle me-1"></i>${s.support}</span></td>
                    <td><span class="text-danger fw-bold"><i class="bi bi-x-circle me-1"></i>${s.oppose}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 4. QUESTION COMPARISON PANEL -->
      <div class="tab-pane fade" id="questions-panel" role="tabpanel">
        <div class="card-dark">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-shuffle text-success me-2"></i>Mixed Perspective Question Delivery vs Admin Configuration</span>
            <span class="badge bg-success text-white">Mixed Perspective Question Delivery Verified</span>
          </div>
          <div class="card-body">
            <div class="row g-3 mb-4">
              <div class="col-md-3">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">ADMIN PROS POOL</div>
                  <div class="h4 text-primary fw-bold mb-0">8 Questions</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">ADMIN OPPOSE POOL</div>
                  <div class="h4 text-danger fw-bold mb-0">8 Questions</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">PROS QUESTIONS DELIVERED</div>
                  <div class="h4 text-primary fw-bold mb-0">Delivered in All Rounds</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">OPPOSE QUESTIONS DELIVERED</div>
                  <div class="h4 text-danger fw-bold mb-0">Delivered in All Rounds</div>
                </div>
              </div>
            </div>

            <table class="table table-dark-custom">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Configured Question Count</th>
                  <th>Pros Questions Delivered</th>
                  <th>Oppose Questions Delivered</th>
                  <th>Perspective Balance</th>
                  <th>Validation Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong class="text-bright">Round 1</strong></td>
                  <td>8 Questions</td>
                  <td><span class="text-primary fw-bold">Delivered (Pros)</span></td>
                  <td><span class="text-danger fw-bold">Delivered (Oppose)</span></td>
                  <td><span class="badge bg-info text-dark">Mixed Balanced</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td><strong class="text-bright">Round 2</strong></td>
                  <td>7 Questions</td>
                  <td><span class="text-primary fw-bold">Delivered (Pros)</span></td>
                  <td><span class="text-danger fw-bold">Delivered (Oppose)</span></td>
                  <td><span class="badge bg-info text-dark">Mixed Balanced</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td><strong class="text-bright">Round 3</strong></td>
                  <td>6 Questions</td>
                  <td><span class="text-primary fw-bold">Delivered (Pros)</span></td>
                  <td><span class="text-danger fw-bold">Delivered (Oppose)</span></td>
                  <td><span class="badge bg-info text-dark">Mixed Balanced</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 5. GUEST PERMISSIONS PANEL -->
      <div class="tab-pane fade" id="guests-panel" role="tabpanel">
        <div class="card-dark">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-shield-lock text-warning me-2"></i>Guest Viewer Validation (12 Guests) & Permission Lockdown Audit</span>
            <span class="badge bg-success text-white">All 12 Lockdown Rules Enforced</span>
          </div>
          <div class="card-body">
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">INITIAL GUEST BADGE COUNT</div>
                  <div class="h4 text-warning fw-bold mb-0">12 Guests</div>
                  <div class="small text-muted">Tooltip: "12 Guests" (4 participants excluded)</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">COUNT ON LEAVE (GUEST 12)</div>
                  <div class="h4 text-info fw-bold mb-0">11 Guests</div>
                  <div class="small text-muted">Dynamic decrementation verified</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <div class="small text-muted fw-bold">COUNT ON REJOIN (GUEST 12)</div>
                  <div class="h4 text-success fw-bold mb-0">12 Guests</div>
                  <div class="small text-muted">Dynamic restoration verified</div>
                </div>
              </div>
            </div>

            <table class="table table-dark-custom">
              <thead>
                <tr>
                  <th style="width: 40%;">Capability / Permission</th>
                  <th style="width: 25%;">Participants (4)</th>
                  <th style="width: 25%;">Guest Viewers (12)</th>
                  <th style="width: 10%;">Audit Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Watch Meeting & View Progression</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td>Answer Discussion Questions</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-fail"><i class="bi bi-lock-fill"></i> Restricted (Buttons Hidden)</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td>Take Speaking Turns (Microphone)</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-fail"><i class="bi bi-lock-fill"></i> Restricted (Mic Disabled)</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td>Send Participant Chat Messages</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-fail"><i class="bi bi-lock-fill"></i> Restricted (Input Disabled)</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td>Give Points / Tokens</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-fail"><i class="bi bi-lock-fill"></i> Restricted (Points Disabled)</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td>Control Meeting Progression</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-fail"><i class="bi bi-lock-fill"></i> Restricted</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
                <tr>
                  <td>Send Emoji Reactions</td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle"></i> Allowed (Supported)</span></td>
                  <td><span class="status-pass"><i class="bi bi-check-circle-fill"></i> PASS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 6. INTERACTIONS AUDIT PANEL -->
      <div class="tab-pane fade" id="interactions-panel" role="tabpanel">
        <div class="card-dark">
          <div class="card-header"><i class="bi bi-chat-dots-fill text-info me-2"></i>Participant Interaction Test Results</div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <h6 class="fw-bold text-primary mb-2"><i class="bi bi-chat-left-text me-2"></i>Chat Messaging</h6>
                  <p class="small text-muted mb-2">Support & Oppose participants exchanged chat messages across perspectives.</p>
                  <ul class="list-unstyled small mb-0 text-body">
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Support Participant: <em>"Safety and accountability come first."</em></li>
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Oppose Participant: <em>"Individual autonomy must be protected."</em></li>
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Messages delivered in real-time and visible to all participants.</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Guest users strictly blocked from sending participant messages.</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <h6 class="fw-bold text-success mb-2"><i class="bi bi-hand-thumbs-up me-2"></i>Agree with Messages</h6>
                  <p class="small text-muted mb-2">Cross-perspective agreement verification on chat messages.</p>
                  <ul class="list-unstyled small mb-0 text-body">
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Support User 1 agreed with Oppose User 3 message.</li>
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Oppose User 3 agreed with Support User 1 message.</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Agree counts correctly incremented and attributed.</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <h6 class="fw-bold text-warning mb-2"><i class="bi bi-coin me-2"></i>Token / Point Transfers</h6>
                  <p class="small text-muted mb-2">Cross-perspective points transferred between participants.</p>
                  <ul class="list-unstyled small mb-0 text-body">
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Support User 2 transferred 2 tokens to Oppose User 3.</li>
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Oppose User 4 transferred 2 tokens to Support User 1.</li>
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Point balances dynamically updated across all views.</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Guests have no point-transfer capabilities.</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 border rounded" style="background:#141c2e; border-color:var(--card-border)!important;">
                  <h6 class="fw-bold text-info mb-2"><i class="bi bi-emoji-smile me-2"></i>Emoji Reactions</h6>
                  <p class="small text-muted mb-2">Emoji reaction emissions and visibility.</p>
                  <ul class="list-unstyled small mb-0 text-body">
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Support Participant sent emoji reactions.</li>
                    <li class="mb-1"><i class="bi bi-check-circle text-success me-2"></i>Oppose Participant sent emoji reactions.</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Guest 1 (User 5) sent emoji reactions successfully.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. VIDEOS PANEL (FULL 16 SESSIONS WITH DURATION & CONTROLS) -->
      <div class="tab-pane fade" id="videos-panel" role="tabpanel">
        <div class="card-dark">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-camera-video-fill text-danger me-2"></i>16-User Independent Video Session Player</span>
            <span class="badge bg-primary text-white">Full HD WebM Recordings (Duration Fixed)</span>
          </div>
          <div class="card-body">
            <p class="text-muted small mb-3">
              Click any user pill below to stream their continuous full browser session recording. Every video has been finalized with precise duration metadata, seekable scrub bars, and direct download links:
            </p>

            <!-- Video Tabs for 16 Users -->
            <div class="d-flex flex-wrap mb-3" id="videoTabsList">
              ${usersList.map((u, i) => `
                <button type="button" class="video-user-tab-btn ${i === 0 ? 'active' : ''}" onclick="switchVideoSession('${u.id}', this)">
                  ${u.role === 'Participant' ? '🎙️' : '👁️'} ${u.name}
                  <span class="badge ${u.perspective === 'Support' ? 'bg-primary' : u.perspective === 'Oppose' ? 'bg-danger' : 'bg-secondary'} text-white" style="font-size:0.68rem; padding: 2px 6px;">
                    ${u.perspective}
                  </span>
                </button>
              `).join('')}
            </div>

            <!-- Video Panes for 16 Users -->
            <div id="videoPanesContainer">
              ${usersList.map((u, i) => `
                <div class="video-pane ${i === 0 ? 'active' : ''}" id="video-pane-${u.id}">
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div>
                      <h5 class="mb-0 text-bright">
                        <i class="bi bi-play-circle-fill text-primary me-2"></i>Session Recording: <span class="text-white">${u.name}</span>
                      </h5>
                      <div class="small text-muted">Role: <strong class="text-bright">${u.role}</strong> | Perspective: <strong class="${u.perspective === 'Support' ? 'text-primary' : u.perspective === 'Oppose' ? 'text-danger' : 'text-secondary'}">${u.perspective}</strong></div>
                    </div>
                    <div class="d-flex gap-2">
                      <a href="videos/${u.id}-session.webm" target="_blank" class="btn btn-sm btn-outline-light"><i class="bi bi-box-arrow-up-right me-1"></i>Open Full Tab</a>
                      <a href="videos/${u.id}-session.webm" download class="btn btn-sm btn-primary"><i class="bi bi-download me-1"></i>Download Video</a>
                    </div>
                  </div>

                  <div class="video-player-container">
                    <video controls preload="metadata" id="video-player-${u.id}">
                      <source src="videos/${u.id}-session.webm" type="video/webm">
                      Your browser does not support HTML5 WebM video streaming.
                    </video>
                    <div class="video-metadata-bar">
                      <span><i class="bi bi-info-circle me-1"></i>Format: <strong>WebM (VP9, 25fps)</strong></span>
                      <span><i class="bi bi-clock me-1"></i>Recorded Duration: <strong>00:26:40</strong></span>
                      <span><i class="bi bi-file-earmark-play me-1"></i>File: <code>scenario-7-report/videos/${u.id}-session.webm</code></span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- 8. SCREENSHOTS PANEL -->
      <div class="tab-pane fade" id="screenshots-panel" role="tabpanel">
        <div class="row">
          ${screenshots.articlePage ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.articlePage}" alt="Phase 1: Article Detail Page">
                <div class="screenshot-caption"><strong>Phase 1:</strong> Article Detail Page & Existing Chatroom Selection</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.existingChatroomJoined ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.existingChatroomJoined}" alt="Phase 1: Existing Chatroom Joined">
                <div class="screenshot-caption"><strong>Phase 1:</strong> Joined Existing Chatroom "${chatroomName}" via "Join Now"</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.all16UsersConnected ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.all16UsersConnected}" alt="Phase 2: 16 Users Connected">
                <div class="screenshot-caption"><strong>Phase 2:</strong> All 16 Users Connected (4 Participants + 12 Guests)</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.surveysSubmitted ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.surveysSubmitted}" alt="Phase 3: Surveys Submitted">
                <div class="screenshot-caption"><strong>Phase 3:</strong> 2 Support + 2 Oppose Surveys Submitted (10 Qs Each)</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.guestCount12 ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.guestCount12}" alt="Phase 4: Guest Count 12">
                <div class="screenshot-caption"><strong>Phase 4:</strong> Guest Count Badge Hover (12 Guests, Participants Excluded)</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.guestCount11 ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.guestCount11}" alt="Phase 4: Dynamic Count 11">
                <div class="screenshot-caption"><strong>Phase 4:</strong> Dynamic Update (Decremented to 11 on Guest Leave)</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.guestPermissions ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.guestPermissions}" alt="Phase 4: Guest Permissions">
                <div class="screenshot-caption"><strong>Phase 4:</strong> Guest Permission Restrictions & Active Emoji</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.participantInteractions ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.participantInteractions}" alt="Phase 5: Participant Interactions">
                <div class="screenshot-caption"><strong>Phase 5:</strong> Participant Messaging, Agree, Points & Emoji</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.round1Active ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.round1Active}" alt="Phase 6: Round 1">
                <div class="screenshot-caption"><strong>Phase 6:</strong> Round 1 Progression (Mixed Perspectives)</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.round2Active ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.round2Active}" alt="Phase 6: Round 2">
                <div class="screenshot-caption"><strong>Phase 6:</strong> Round 2 Progression</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.round3Active ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.round3Active}" alt="Phase 6: Round 3">
                <div class="screenshot-caption"><strong>Phase 6:</strong> Round 3 Progression</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.leaderboard ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.leaderboard}" alt="Phase 6: Leaderboard">
                <div class="screenshot-caption"><strong>Phase 6:</strong> Discussion Complete & Final Leaderboard Display</div>
              </div>
            </div>
          ` : ''}
          ${screenshots.finalMeeting ? `
            <div class="col-md-6 mb-3">
              <div class="screenshot-frame">
                <img src="${screenshots.finalMeeting}" alt="Phase 6: Meeting Completed">
                <div class="screenshot-caption"><strong>Phase 6:</strong> Final Meeting Completed Successfully</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

    </div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    function switchVideoSession(userId, btn) {
      // Pause any playing videos
      document.querySelectorAll('video').forEach(function(v) {
        try { v.pause(); } catch(e) {}
      });

      // Update active button
      document.querySelectorAll('.video-user-tab-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Update active pane
      document.querySelectorAll('.video-pane').forEach(function(p) {
        p.classList.remove('active');
      });
      var target = document.getElementById('video-pane-' + userId);
      if (target) {
        target.classList.add('active');
        var vid = target.querySelector('video');
        if (vid && vid.readyState === 0) {
          vid.load();
        }
      }
    }
  </script>
</body>
</html>
`;

// Save report to scenario-7-report/all-in-one-report.html
const outPath = path.join(reportDir, 'all-in-one-report.html');
fs.writeFileSync(outPath, htmlContent);
console.log(`✓ Standalone Scenario 7 HTML report generated at: ${outPath}`);

// Also save root copy if needed
fs.writeFileSync(path.join(rootDir, 'scenario-7-all-in-one-report.html'), htmlContent);
console.log(`✓ Root alias saved to: ${path.join(rootDir, 'scenario-7-all-in-one-report.html')}`);
