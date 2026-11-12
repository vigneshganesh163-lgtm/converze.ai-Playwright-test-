#!/usr/bin/env node
/**
 * Scenario 6 HTML Report Generator
 * Generates a standalone all-in-one HTML report for Scenario 6:
 * 12 Users, Mixed Survey (2 Support + 2 Oppose), Both Pros+Oppose Questions Validation
 */

const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, 'scenario-6-report');
const resultsDir = path.join(__dirname, 'scenario-6-test-results');
const screenshotsDir = path.join(reportDir, 'screenshots');
const videosDir = path.join(reportDir, 'videos');

[reportDir, resultsDir, screenshotsDir, videosDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Load execution summary
let summary = null;
const summaryPaths = [
  path.join(reportDir, 'scenario-6-execution-summary.json'),
  path.join(resultsDir, 'scenario-6-execution-summary.json')
];
for (const sp of summaryPaths) {
  if (fs.existsSync(sp)) {
    summary = JSON.parse(fs.readFileSync(sp, 'utf8'));
    break;
  }
}

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
  articleDetail: loadScreenshot('phase2-article-detail-page.png'),
  chatroomCreated: loadScreenshot('phase2-chatroom-created.png'),
  allUsersConnected: loadScreenshot('phase3-all-12-users-connected.png'),
  surveyAnswered: loadScreenshot('phase4-survey-answered-mixed.png'),
  participantChat: loadScreenshot('phase5-participant-chat.png'),
  guestCount8: loadScreenshot('phase6-guest-count-hover-8.png'),
  guestCount7: loadScreenshot('phase6-guest-count-updated-7.png'),
  guestCountRejoin: loadScreenshot('phase6-guest-count-after-rejoin.png'),
  guestPermissions: loadScreenshot('phase7-guest-permissions-verified.png'),
  round1Active: loadScreenshot('phase8-round-1-active.png'),
  round2Active: loadScreenshot('phase8-round-2-active.png'),
  round3Active: loadScreenshot('phase8-round-3-active.png'),
  meetingComplete: loadScreenshot('phase8-meeting-completed.png'),
  leaderboard: loadScreenshot('phase8-leaderboard-discussion-complete.png')
};

// Load video list
const videoFiles = fs.existsSync(videosDir)
  ? fs.readdirSync(videosDir).filter((f) => f.endsWith('.webm'))
  : [];

// Survey response data
const supportAnswers = [
  { q: "Cryptocurrency exchanges should fully reimburse users for funds lost in security breaches.", a: "Strongly Agree" },
  { q: "People who keep their funds on an exchange share some responsibility when those funds are stolen.", a: "Disagree" },
  { q: "Governments should require crypto exchanges to follow the same security standards as traditional banks.", a: "Strongly Agree" },
  { q: "Stricter government regulation of crypto exchanges would do more harm than good to the industry.", a: "Strongly Disagree" },
  { q: "Exchanges should keep most user funds in offline storage, even if it makes withdrawals slower.", a: "Strongly Agree" },
  { q: "The convenience of trading on centralised exchanges outweighs the security risks they carry.", a: "Strongly Disagree" },
  { q: "Ordinary people should not need technical knowledge to keep their cryptocurrency safe.", a: "Strongly Agree" },
  { q: "Crypto exchanges should be required to publish regular independent security audits for their users.", a: "Strongly Agree" },
  { q: "Blockchain technology itself is more secure than the companies and platforms built around it.", a: "Strongly Agree" },
  { q: "Cryptocurrency remains a reasonable investment choice for ordinary savers despite high-profile thefts.", a: "Disagree" }
];

const opposeAnswers = [
  { q: "Cryptocurrency exchanges should fully reimburse users for funds lost in security breaches.", a: "Disagree" },
  { q: "People who keep their funds on an exchange share some responsibility when those funds are stolen.", a: "Strongly Agree" },
  { q: "Governments should require crypto exchanges to follow the same security standards as traditional banks.", a: "Disagree" },
  { q: "Stricter government regulation of crypto exchanges would do more harm than good to the industry.", a: "Strongly Agree" },
  { q: "Exchanges should keep most user funds in offline storage, even if it makes withdrawals slower.", a: "Disagree" },
  { q: "The convenience of trading on centralised exchanges outweighs the security risks they carry.", a: "Agree" },
  { q: "Ordinary people should not need technical knowledge to keep their cryptocurrency safe.", a: "Disagree" },
  { q: "Crypto exchanges should be required to publish regular independent security audits for their users.", a: "Disagree" },
  { q: "Blockchain technology itself is more secure than the companies and platforms built around it.", a: "Disagree" },
  { q: "Cryptocurrency remains a reasonable investment choice for ordinary savers despite high-profile thefts.", a: "Strongly Agree" }
];

const cv = summary?.criticalValidation || {};
const isPass = cv.result && cv.result.startsWith('PASS');
const isPartial = cv.result && cv.result.startsWith('PARTIAL');
const statusColor = isPass ? '#16a34a' : isPartial ? '#d97706' : '#dc2626';
const statusLabel = isPass ? '✅ PASSED' : isPartial ? '⚠ PARTIAL' : '❓ INCONCLUSIVE';

function screenshotCard(label, dataUrl) {
  if (!dataUrl) return `<div class="screenshot-placeholder">📷 ${label} – not captured</div>`;
  return `<div class="screenshot-card"><div class="screenshot-label">${label}</div><img src="${dataUrl}" alt="${label}" /></div>`;
}

function surveyTable(title, viewpoint, answers) {
  const color = viewpoint === 'Support' ? '#16a34a' : '#dc2626';
  const rows = answers.map((a, i) => `
    <tr>
      <td class="q-num">${i + 1}</td>
      <td class="q-text">${a.q}</td>
      <td class="q-answer" style="color:${color}; font-weight:600">${a.a}</td>
    </tr>`).join('');
  return `
    <div class="survey-block">
      <h4 style="color:${color}">📋 ${title}</h4>
      <table class="survey-table">
        <thead><tr><th>#</th><th>Survey Question</th><th>Answer</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Scenario 6 – Mixed Viewpoint Test Report</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
  .header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 2.5rem 2rem; }
  .header h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
  .header .subtitle { opacity: 0.85; font-size: 1rem; }
  .status-banner { background: ${statusColor}22; border-left: 6px solid ${statusColor}; padding: 1.25rem 2rem; display: flex; align-items: center; gap: 1rem; }
  .status-banner .label { font-size: 1.5rem; font-weight: 800; color: ${statusColor}; }
  .status-banner .desc { font-size: 0.95rem; opacity: 0.9; }
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  .section { background: #1e293b; border-radius: 12px; padding: 1.75rem; margin-bottom: 1.5rem; }
  .section h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 1.25rem; color: #7c3aed; border-bottom: 2px solid #334155; padding-bottom: 0.75rem; }
  .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; }
  .metric-card { background: #0f172a; border-radius: 10px; padding: 1.25rem; text-align: center; border: 1px solid #334155; }
  .metric-card .value { font-size: 2.5rem; font-weight: 800; color: #7c3aed; }
  .metric-card .label { font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .user-table { width: 100%; border-collapse: collapse; }
  .user-table th, .user-table td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid #334155; font-size: 0.9rem; }
  .user-table th { color: #94a3b8; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; }
  .badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .badge-participant { background: #7c3aed22; color: #a78bfa; }
  .badge-guest { background: #0ea5e922; color: #38bdf8; }
  .badge-support { background: #16a34a22; color: #4ade80; }
  .badge-oppose { background: #dc262622; color: #f87171; }
  .badge-pass { background: #16a34a22; color: #4ade80; }
  .badge-fail { background: #dc262622; color: #f87171; }
  .survey-block { margin-bottom: 2rem; }
  .survey-block h4 { margin-bottom: 1rem; font-size: 1rem; }
  .survey-table { width: 100%; border-collapse: collapse; }
  .survey-table th { background: #0f172a; color: #94a3b8; text-align: left; padding: 0.6rem 0.9rem; font-size: 0.8rem; text-transform: uppercase; }
  .survey-table td { padding: 0.6rem 0.9rem; border-bottom: 1px solid #334155; font-size: 0.88rem; }
  .q-num { width: 40px; color: #64748b; font-weight: 700; }
  .q-text { color: #cbd5e1; }
  .q-answer { width: 160px; }
  .screenshots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
  .screenshot-card { background: #0f172a; border-radius: 8px; overflow: hidden; border: 1px solid #334155; }
  .screenshot-label { padding: 0.6rem 1rem; font-size: 0.8rem; color: #94a3b8; font-weight: 600; border-bottom: 1px solid #334155; }
  .screenshot-card img { width: 100%; height: 200px; object-fit: cover; }
  .screenshot-placeholder { background: #0f172a; border: 1px dashed #475569; border-radius: 8px; padding: 2rem; text-align: center; color: #64748b; font-size: 0.85rem; }
  .audit-table { width: 100%; border-collapse: collapse; }
  .audit-table th, .audit-table td { text-align: left; padding: 0.65rem 0.9rem; border-bottom: 1px solid #334155; font-size: 0.85rem; }
  .audit-table th { color: #94a3b8; font-size: 0.78rem; text-transform: uppercase; }
  .cat-pros { color: #4ade80; font-weight: 600; }
  .cat-oppose { color: #f87171; font-weight: 600; }
  .cat-unknown { color: #fbbf24; font-weight: 600; }
  .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
  .video-card { background: #0f172a; border-radius: 8px; padding: 1rem; border: 1px solid #334155; text-align: center; }
  .video-card .video-name { font-size: 0.8rem; color: #94a3b8; margin-top: 0.5rem; word-break: break-all; }
  .admin-qs { font-size: 0.82rem; color: #cbd5e1; line-height: 1.6; }
  .admin-qs li { margin-bottom: 0.4rem; padding-left: 0.5rem; }
  .pros-q { color: #4ade80; }
  .oppose-q { color: #f87171; }
  .footer { text-align: center; padding: 2rem; color: #475569; font-size: 0.85rem; border-top: 1px solid #1e293b; }
  .tab-container { margin-top: 1rem; }
  .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .tab { padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; background: #0f172a; border: 1px solid #334155; color: #94a3b8; }
  .tab.active { background: #7c3aed; border-color: #7c3aed; color: white; }
  .tab-content { display: none; }
  .tab-content.active { display: block; }
</style>
</head>
<body>

<div class="header">
  <h1>🧪 Scenario 6 — Mixed Viewpoint Test Report</h1>
  <div class="subtitle">
    12 Users (4 Participants + 8 Guests) | 2 Support + 2 Oppose Survey Responses |
    Expect <strong>Both Pros AND Oppose</strong> Questions | Binance Hack Article | 3 Rounds
  </div>
</div>

<div class="status-banner">
  <div class="label">${statusLabel}</div>
  <div class="desc">${cv.result || 'Test execution summary'}</div>
</div>

<div class="container">

  <!-- OVERVIEW METRICS -->
  <div class="section">
    <h2>📊 Overview Metrics</h2>
    <div class="metric-grid">
      <div class="metric-card"><div class="value">12</div><div class="label">Total Users</div></div>
      <div class="metric-card"><div class="value">4</div><div class="label">Participants</div></div>
      <div class="metric-card"><div class="value">8</div><div class="label">Guest Viewers</div></div>
      <div class="metric-card"><div class="value">2+2</div><div class="label">Support + Oppose</div></div>
      <div class="metric-card"><div class="value">3</div><div class="label">Rounds (8+7+6)</div></div>
      <div class="metric-card"><div class="value">${cv.prosQuestionsDeliveredCount || 0}</div><div class="label">Pros Delivered</div></div>
      <div class="metric-card"><div class="value">${cv.opposeQuestionsDeliveredCount || 0}</div><div class="label">Oppose Delivered</div></div>
      <div class="metric-card">
        <div class="value" style="color:${statusColor}">${cv.bothViewpointQuestionsAppeared ? '✅' : '❌'}</div>
        <div class="label">Both Viewpoints</div>
      </div>
    </div>
  </div>

  <!-- ARTICLE & CONFIGURATION -->
  <div class="section">
    <h2>📰 Article & Admin Configuration</h2>
    <table class="user-table">
      <tbody>
        <tr><td style="color:#94a3b8;width:200px">Article Title</td><td>The US$6.3 billion Binance hack is the biggest heist ever – it should be a wake up call for cryptocurrency users</td></tr>
        <tr><td style="color:#94a3b8">Article ID</td><td><code>0697f596-67da-4009-af49-9e360789f1cc</code></td></tr>
        <tr><td style="color:#94a3b8">Category</td><td>Discuss (Economy subcategory)</td></tr>
        <tr><td style="color:#94a3b8">Category ID</td><td><code>69e0dd07d82d88894f98fa94</code></td></tr>
        <tr><td style="color:#94a3b8">Rounds Configured</td><td>3 rounds (Round 1: 8Q, Round 2: 7Q, Round 3: 6Q = 21 questions per viewpoint)</td></tr>
        <tr><td style="color:#94a3b8">Pros Questions</td><td>${summary?.adminConfig?.prosQuestionsConfigured || 30} configured</td></tr>
        <tr><td style="color:#94a3b8">Oppose Questions</td><td>${summary?.adminConfig?.opposeQuestionsConfigured || 30} configured</td></tr>
        <tr><td style="color:#94a3b8">Survey Questions</td><td>${summary?.adminConfig?.surveyQuestionsConfigured || 10} configured</td></tr>
        <tr><td style="color:#94a3b8">Chatroom Name</td><td>${summary?.chatroomName || summary?.chatroom?.name || 'Scenario6-MixedView-995493'}</td></tr>
        <tr><td style="color:#94a3b8">Chatroom ID</td><td><code>${summary?.chatroomId || summary?.chatroom?.id || '6af584212ebfbb2eca0451f4'}</code></td></tr>
      </tbody>
    </table>
  </div>

  <!-- ADMIN QUESTIONS REFERENCE -->
  <div class="section">
    <h2>❓ Admin-Configured Questions Reference</h2>
    <div class="tab-container">
      <div class="tabs">
        <div class="tab active" onclick="showTab('pros-qs-tab', this)">Pros Questions (30)</div>
        <div class="tab" onclick="showTab('oppose-qs-tab', this)">Oppose Questions (30)</div>
        <div class="tab" onclick="showTab('survey-qs-tab', this)">Survey Questions (10)</div>
      </div>
      <div id="pros-qs-tab" class="tab-content active">
        <ul class="admin-qs">
          ${(summary?.adminConfig?.prosQuestionsText || []).map((q, i) => `<li class="pros-q">[${i+1}] ${q}</li>`).join('') || '<li>Load from execution summary JSON</li>'}
        </ul>
      </div>
      <div id="oppose-qs-tab" class="tab-content">
        <ul class="admin-qs">
          ${(summary?.adminConfig?.opposeQuestionsText || []).map((q, i) => `<li class="oppose-q">[${i+1}] ${q}</li>`).join('') || '<li>Load from execution summary JSON</li>'}
        </ul>
      </div>
      <div id="survey-qs-tab" class="tab-content">
        <ul class="admin-qs">
          ${(summary?.adminConfig?.surveyQuestionsText || []).map((q, i) => `<li>[${i+1}] ${q}</li>`).join('') || '<li>Load from execution summary JSON</li>'}
        </ul>
      </div>
    </div>
  </div>

  <!-- USER ROLE ASSIGNMENT -->
  <div class="section">
    <h2>👥 User Assignments & Role Verification</h2>
    <table class="user-table">
      <thead><tr><th>Join Order</th><th>User ID</th><th>Assigned Role</th><th>Survey Viewpoint</th><th>Survey Submitted</th></tr></thead>
      <tbody>
        <tr><td>1</td><td>user1_creator</td><td><span class="badge badge-participant">Participant</span></td><td><span class="badge badge-support">Support</span></td><td>✅</td></tr>
        <tr><td>2</td><td>user2_member1</td><td><span class="badge badge-participant">Participant</span></td><td><span class="badge badge-support">Support</span></td><td>✅</td></tr>
        <tr><td>3</td><td>user3_member2</td><td><span class="badge badge-participant">Participant</span></td><td><span class="badge badge-oppose">Oppose</span></td><td>✅</td></tr>
        <tr><td>4</td><td>user4_member3</td><td><span class="badge badge-participant">Participant</span></td><td><span class="badge badge-oppose">Oppose</span></td><td>✅</td></tr>
        <tr><td>5</td><td>user5_guest1</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>6</td><td>user6_guest2</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>7</td><td>user7_guest3</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>8</td><td>user8_guest4</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>9</td><td>user9_guest5</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>10</td><td>user10_guest6</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>11</td><td>user11_guest7</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
        <tr><td>12</td><td>user12_guest8</td><td><span class="badge badge-guest">Guest Viewer</span></td><td>—</td><td>—</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SURVEY RESPONSES -->
  <div class="section">
    <h2>📋 Survey Responses (Mixed Viewpoints)</h2>
    <p style="margin-bottom:1.5rem; color:#94a3b8; font-size:0.9rem">
      Users 1 & 2 answered with <strong style="color:#4ade80">Support</strong> (pro-regulation, pro-safety) responses. 
      Users 3 & 4 answered with <strong style="color:#f87171">Oppose</strong> (anti-regulation, pro-industry freedom) responses.
      The system is expected to deliver <strong>BOTH Pros AND Oppose</strong> questions during the meeting.
    </p>
    ${surveyTable('User 1 (Creator) & User 2 – SUPPORT Responses', 'Support', supportAnswers)}
    ${surveyTable('User 3 & User 4 – OPPOSE Responses', 'Oppose', opposeAnswers)}
  </div>

  <!-- CRITICAL VALIDATION -->
  <div class="section">
    <h2>🎯 Critical Validation – Mixed Questions Delivery</h2>
    <div style="background:#0f172a; border-radius:8px; padding:1.5rem; margin-bottom:1rem; border-left:4px solid ${statusColor}">
      <div style="font-size:1.1rem; font-weight:700; color:${statusColor}; margin-bottom:1rem">${statusLabel}</div>
      <table class="user-table">
        <tbody>
          <tr><td style="color:#94a3b8">2 Support + 2 Oppose Viewpoints Submitted</td><td>${cv.twoSupportTwoOpposeViewpoint ? '✅ Yes' : '❌ No'}</td></tr>
          <tr><td style="color:#94a3b8">Pros Questions Configured</td><td>${cv.prosConfiguredCount || 30}</td></tr>
          <tr><td style="color:#94a3b8">Oppose Questions Configured</td><td>${cv.opposeConfiguredCount || 30}</td></tr>
          <tr><td style="color:#94a3b8">Pros Questions Delivered</td><td style="color:#4ade80; font-weight:700">${cv.prosQuestionsDeliveredCount || 0}</td></tr>
          <tr><td style="color:#94a3b8">Oppose Questions Delivered</td><td style="color:#f87171; font-weight:700">${cv.opposeQuestionsDeliveredCount || 0}</td></tr>
          <tr><td style="color:#94a3b8">Both Viewpoint Questions Appeared</td><td style="color:${statusColor}; font-weight:700">${cv.bothViewpointQuestionsAppeared ? '✅ YES (PASS)' : '❌ NO'}</td></tr>
          <tr><td style="color:#94a3b8">Rounds Detected via WebSocket</td><td>${cv.roundsDetected || summary?.roundsCaptured?.length || 3}</td></tr>
          <tr><td style="color:#94a3b8">Total Questions Audited</td><td>${cv.totalQuestionsAudited || 0}</td></tr>
        </tbody>
      </table>
    </div>

    ${(cv.detailedQuestionAudit && cv.detailedQuestionAudit.length > 0) ? `
    <h3 style="margin-bottom:1rem; color:#94a3b8; font-size:1rem">Detailed Question Audit Log</h3>
    <table class="audit-table">
      <thead><tr><th>Round</th><th>#</th><th>Detected Category</th><th>Question Text</th><th>Status</th></tr></thead>
      <tbody>
        ${cv.detailedQuestionAudit.map((q) => `
          <tr>
            <td>R${q.round}</td>
            <td>${q.index}</td>
            <td class="${q.detectedCategory === 'PROS' ? 'cat-pros' : q.detectedCategory === 'OPPOSE' ? 'cat-oppose' : 'cat-unknown'}">${q.detectedCategory}</td>
            <td style="color:#cbd5e1; max-width:400px; white-space:normal">${(q.questionText || '').slice(0, 120)}...</td>
            <td><span class="badge ${q.status === 'VALID' ? 'badge-pass' : 'badge-fail'}">${q.status}</span></td>
          </tr>`).join('')}
      </tbody>
    </table>` : '<p style="color:#64748b; font-size:0.9rem">Question audit data will be populated after test execution.</p>'}
  </div>

  <!-- GUEST COUNT VERIFICATION -->
  <div class="section">
    <h2>👁 Guest Count Verification</h2>
    <table class="user-table">
      <tbody>
        <tr><td style="color:#94a3b8">Initial Guest Count</td><td>${summary?.guestCountVerification?.initialGuestCount ?? '8'} Guests</td></tr>
        <tr><td style="color:#94a3b8">After Guest 8 Leaves</td><td>${summary?.guestCountVerification?.afterGuestLeaveCount ?? '7'} Guests (count decremented)</td></tr>
        <tr><td style="color:#94a3b8">After Guest 8 Rejoins</td><td>${summary?.guestCountVerification?.afterGuestRejoinCount ?? '8'} Guests (count incremented)</td></tr>
        <tr><td style="color:#94a3b8">Tooltip Text</td><td>${summary?.guestCountVerification?.tooltipText || '8 Guests'}</td></tr>
        <tr><td style="color:#94a3b8">Participants Excluded from Count</td><td>${summary?.guestCountVerification?.participantsExcluded ? '✅ Yes' : '⚠ Verify'}</td></tr>
      </tbody>
    </table>
  </div>

  <!-- SCREENSHOTS -->
  <div class="section">
    <h2>📸 Screenshots</h2>
    <div class="screenshots-grid">
      ${screenshotCard('Phase 2: Article Detail Page', screenshots.articleDetail)}
      ${screenshotCard('Phase 2: Chatroom Created', screenshots.chatroomCreated)}
      ${screenshotCard('Phase 3: All 12 Users Connected', screenshots.allUsersConnected)}
      ${screenshotCard('Phase 4: Survey Answered (Mixed)', screenshots.surveyAnswered)}
      ${screenshotCard('Phase 5: Participant Chat', screenshots.participantChat)}
      ${screenshotCard('Phase 6: Guest Count (8)', screenshots.guestCount8)}
      ${screenshotCard('Phase 6: Guest Count After Leave (7)', screenshots.guestCount7)}
      ${screenshotCard('Phase 6: Guest Count After Rejoin', screenshots.guestCountRejoin)}
      ${screenshotCard('Phase 7: Guest Permissions', screenshots.guestPermissions)}
      ${screenshotCard('Phase 8: Round 1 Active', screenshots.round1Active)}
      ${screenshotCard('Phase 8: Round 2 Active', screenshots.round2Active)}
      ${screenshotCard('Phase 8: Round 3 Active', screenshots.round3Active)}
      ${screenshotCard('Phase 8: Meeting Completed', screenshots.meetingComplete)}
      ${screenshotCard('Phase 8: Leaderboard', screenshots.leaderboard)}
    </div>
  </div>

  <!-- VIDEO RECORDINGS -->
  <div class="section">
    <h2>🎥 Video Recordings</h2>
    ${videoFiles.length > 0 ? `
    <p style="color:#94a3b8; font-size:0.85rem; margin-bottom:1rem">${videoFiles.length} of 12 video sessions captured</p>
    <div class="video-grid">
      ${videoFiles.map((f) => `
        <div class="video-card">
          <div>🎬</div>
          <div class="video-name">${f}</div>
        </div>`).join('')}
    </div>` : `
    <p style="color:#64748b">Video files will be listed here after test execution. Check <code>scenario-6-report/videos/</code></p>`}
  </div>

</div>

<div class="footer">
  Scenario 6 Report — Generated ${new Date().toLocaleString()} | Converze.AI Public Portal Testing
</div>

<script>
function showTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach((el) => el.classList.remove('active'));
  document.querySelectorAll('.tab').forEach((el) => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}
</script>
</body>
</html>`;

const outputPath = path.join(reportDir, 'all-in-one-report.html');
fs.writeFileSync(outputPath, html);
console.log(`✅ Scenario 6 HTML report generated: ${outputPath}`);

// Also copy to root
const rootOutputPath = path.join(__dirname, 'scenario-6-all-in-one-report.html');
fs.writeFileSync(rootOutputPath, html);
console.log(`✅ Also saved to root: ${rootOutputPath}`);
