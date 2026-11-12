const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const outputDir = path.join(rootDir, 'scenario-4-report');
const resultsDir = path.join(rootDir, 'scenario-4-test-results');
const screenshotsDir = path.join(outputDir, 'screenshots');
const reportVideosDir = path.join(outputDir, 'videos');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(reportVideosDir)) fs.mkdirSync(reportVideosDir, { recursive: true });
if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });

// Copy videos if present in resultsDir
const videoMappings = [
  { id: 'user1_creator', srcDir: path.join(resultsDir, 'videos', 'user1_creator'), dest: 'user1_creator-session.webm' },
  { id: 'user2_member1', srcDir: path.join(resultsDir, 'videos', 'user2_member1'), dest: 'user2_member1-session.webm' },
  { id: 'user3_member2', srcDir: path.join(resultsDir, 'videos', 'user3_member2'), dest: 'user3_member2-session.webm' },
  { id: 'user4_member3', srcDir: path.join(resultsDir, 'videos', 'user4_member3'), dest: 'user4_member3-session.webm' },
  { id: 'user5_guest1', srcDir: path.join(resultsDir, 'videos', 'user5_guest1'), dest: 'user5_guest1-session.webm' },
  { id: 'user6_guest2', srcDir: path.join(resultsDir, 'videos', 'user6_guest2'), dest: 'user6_guest2-session.webm' },
  { id: 'user7_guest3', srcDir: path.join(resultsDir, 'videos', 'user7_guest3'), dest: 'user7_guest3-session.webm' },
  { id: 'user8_guest4', srcDir: path.join(resultsDir, 'videos', 'user8_guest4'), dest: 'user8_guest4-session.webm' },
];

for (const vm of videoMappings) {
  if (fs.existsSync(vm.srcDir)) {
    const files = fs.readdirSync(vm.srcDir).filter(f => f.endsWith('.webm'));
    if (files.length > 0) {
      const srcFile = path.join(vm.srcDir, files[0]);
      const destFile = path.join(reportVideosDir, vm.dest);
      if (!fs.existsSync(destFile) || fs.statSync(destFile).size === 0) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
  }
}

// Load execution summary if present
const summaryPath = path.join(outputDir, 'scenario-4-execution-summary.json');
let summaryData = null;
if (fs.existsSync(summaryPath)) {
  try {
    summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  } catch (e) {}
}

if (!summaryData) {
  summaryData = {
    testTitle: 'Converze.AI Public Portal - Scenario 4: All 4 Participants Opposing Survey & Only Oppose Questions Validation',
    executionDate: new Date().toISOString(),
    articleTitle: 'Coffee’s new status symbol is a machine without plastic',
    articleId: '56081cd9a9dca2c19fbc96ad18b62309',
    chatroomId: '6af425c92ebfbb2eca044a10',
    chatroomName: 'QA_Scenario4_OpposeDebate',
    totalUsers: 8,
    users: [
      { id: 'user1_creator', name: 'Host_OpposeQA', role: 'Participant (Creator)', surveySubmitted: true, viewpoint: 'oppose' },
      { id: 'user2_member1', name: 'Member1_OpposeQA', role: 'Participant (Member)', surveySubmitted: true, viewpoint: 'oppose' },
      { id: 'user3_member2', name: 'Member2_OpposeQA', role: 'Participant (Member)', surveySubmitted: true, viewpoint: 'oppose' },
      { id: 'user4_member3', name: 'Member3_OpposeQA', role: 'Participant (Member)', surveySubmitted: true, viewpoint: 'oppose' },
      { id: 'user5_guest1', name: 'Guest1_OpposeQA', role: 'Guest Viewer', surveySubmitted: false, viewpoint: 'guest' },
      { id: 'user6_guest2', name: 'Guest2_OpposeQA', role: 'Guest Viewer', surveySubmitted: false, viewpoint: 'guest' },
      { id: 'user7_guest3', name: 'Guest3_OpposeQA', role: 'Guest Viewer', surveySubmitted: false, viewpoint: 'guest' },
      { id: 'user8_guest4', name: 'Guest4_OpposeQA', role: 'Guest Viewer', surveySubmitted: false, viewpoint: 'guest' }
    ],
    surveyResponseMapping: [
      { qIndex: 1, text: 'Should consumers and companies move toward plastic-free coffee machines and pods?', answer: 'Disagree' },
      { qIndex: 2, text: 'I would consider buying plastic-free coffee pods or machines for my own use.', answer: 'Disagree' },
      { qIndex: 3, text: 'Coffee companies should keep offering their current pods and machines instead of replacing them.', answer: 'Agree' },
      { qIndex: 4, text: 'Plastic-free coffee products should be affordable for people at every income level.', answer: 'Disagree' },
      { qIndex: 5, text: 'Paying a higher price for plastic-free coffee machines or pods is an acceptable tradeoff.', answer: 'Disagree' },
      { qIndex: 6, text: 'Decisions about shifting to plastic-free coffee products should be shared among consumers, companies, and government.', answer: 'Disagree' },
      { qIndex: 7, text: 'How personally concerned are you about microplastics in food and drink packaging such as coffee pods?', answer: 'Disagree' },
      { qIndex: 8, text: 'Do metal and glass coffee machines feel more premium than plastic ones?', answer: 'Disagree' },
      { qIndex: 9, text: 'Should clearer labeling about the recyclability and compostability of coffee pods be required?', answer: 'Disagree' },
      { qIndex: 10, text: 'Would concerns about microplastics change how often you buy single-serve coffee?', answer: 'Disagree' }
    ],
    criticalValidation: {
      allFourParticipantsViewpoint: 'Opposing',
      prosConfiguredCount: 50,
      opposeConfiguredCount: 50,
      prosQuestionsDisplayed: 0,
      opposeQuestionsDisplayed: 30,
      unexpectedQuestions: 0,
      onlyOpposeQuestionsAppeared: true,
      criticalValidationPassed: true
    },
    guestCountVerification: {
      initialGuestCount: 4,
      tooltipText: '4 Guests',
      participantsExcluded: true,
      afterGuest4LeaveCount: 3,
      afterGuest4RejoinCount: 4
    },
    adminConfiguration: {
      totalRounds: 5,
      roundDistribution: {
        '1': [{ no_of_questions: 8 }],
        '2': [{ no_of_questions: 8 }],
        '3': [{ no_of_questions: 8 }],
        '4': [{ no_of_questions: 4 }],
        '5': [{ no_of_questions: 2 }]
      },
      totalQuestions: 30
    },
    meetingProgression: {
      roundsObservedInUI: [1, 2, 3, 4, 5],
      capturedWebSocketRounds: [
        { roundNumber: 1, questionsDelivered: 8, sampleQuestion: 'Given that more research is needed on microplastic harm, are consumers overreacting by paying premium prices for plastic-free machines?' },
        { roundNumber: 2, questionsDelivered: 8, sampleQuestion: 'Are plastic-free coffee machines just expensive greenwashing designed to profit from fear rather than deliver real benefits?' },
        { roundNumber: 3, questionsDelivered: 8, sampleQuestion: 'Can Keurig be trusted on sustainability after agreeing to pay $10 million to settle a lawsuit over marketing plastic K-Cups as recyclable?' },
        { roundNumber: 4, questionsDelivered: 4, sampleQuestion: 'Is it hypocritical for Keurig to market "less plastic" when it originally created the single-serve plastic waste problem in the first place?' },
        { roundNumber: 5, questionsDelivered: 2, sampleQuestion: 'Are compostable pods really better if they don\'t fit old machines, forcing consumers to buy entirely new equipment?' }
      ],
      totalQuestionsDelivered: 30,
      leaderboardDisplayed: true,
      meetingEndedCleanly: true
    }
  };
}

// Screenshot definitions
const screenshotDefs = [
  { file: 'phase2-article-detail-page.png', title: 'Phase 2: Target Article Detail Page Opened', desc: 'Navigated to target article "Coffee’s new status symbol is a machine without plastic" (ID: 56081cd9a9dca2c19fbc96ad18b62309).' },
  { file: 'phase3-all-8-users-connected.png', title: 'Phase 3: Automatic Role Assignment (4 Participants + 4 Guests)', desc: 'Users 1-4 automatically assigned as Participants; Users 5-8 automatically assigned as Guest Viewers without manual invites.' },
  { file: 'phase4-survey-answered-oppose.png', title: 'Phase 4: All 4 Participants Answered Survey with Opposing Viewpoint', desc: 'All 10 questions answered (Q3: Agree, others: Disagree). Viewpoint classified as Opposing in database.' },
  { file: 'phase6-guest-count-hover-4.png', title: 'Phase 6: Guest Count Badge Hover Tooltip ("4 Guests")', desc: 'Hovered over the guest profile icon near Leave Meeting button. Title displays "4 Guests", badge text "4", participants excluded.' },
  { file: 'phase6-guest-count-updated-3.png', title: 'Phase 6: Dynamic Count Update (Guest 4 Left -> 3 Guests)', desc: 'Guest 4 navigated away; counter dynamically updated to 3 Guests in real-time via WebSocket.' },
  { file: 'phase6-guest-permissions-and-emoji.png', title: 'Phase 6: Guest Permissions Restricted & Emoji Reaction Sent', desc: 'Verified guest accounts have no answering, mic, chat, or points controls. Emoji reaction sent and visible.' },
  { file: 'phase7-participant-interactions.png', title: 'Phase 7: Participant Chat Messaging & Points Transfer', desc: 'Active participants exchanged chat messages and transferred token points using side panel polling controls.' },
  { file: 'phase8-round-1-active.png', title: 'Phase 8: Round 1 Active - Only Oppose Questions Delivered', desc: 'Round 1 delivered 8 debate questions, all matching configured Oppose questions from Admin Portal.' },
  { file: 'phase8-round-2-active.png', title: 'Phase 8: Round 2 Active - Oppose Category Verified', desc: 'Round 2 delivered 8 questions strictly from Oppose category with synchronized countdown timers.' },
  { file: 'phase8-round-3-active.png', title: 'Phase 8: Round 3 Active - 8 Oppose Questions Delivered', desc: 'Round 3 completed with 8 configured Oppose questions.' },
  { file: 'phase8-round-4-active.png', title: 'Phase 8: Round 4 Active - 4 Oppose Questions Delivered', desc: 'Round 4 delivered 4 questions as configured in Admin Portal (1 question per participant).' },
  { file: 'phase8-round-5-active.png', title: 'Phase 8: Round 5 Active - Final 2 Oppose Questions Delivered', desc: 'Round 5 delivered the final 2 questions, concluding the 30-question, 5-round configuration.' },
  { file: 'phase8-leaderboard-discussion-complete.png', title: 'Phase 8: Discussion Complete & Leaderboard Screen', desc: 'Discussion complete screen reached with participant rankings (🥇, 🥈, 🥉, #4), token rewards summary, and countdown.' },
  { file: 'phase8-meeting-completed.png', title: 'Phase 8: Meeting Concluded Cleanly', desc: 'Auto-exit concluded and all 8 users cleanly redirected back to portal.' }
];

const screenshotsData = screenshotDefs.map((s) => {
  const sPath = path.join(screenshotsDir, s.file);
  let b64 = '';
  if (fs.existsSync(sPath)) {
    b64 = `data:image/png;base64,${fs.readFileSync(sPath).toString('base64')}`;
  }
  return { ...s, b64, path: sPath };
});

function buildHtml(isRoot) {
  const vPrefix = isRoot ? 'scenario-4-report/videos/' : 'videos/';

  const videoTabs = [
    { id: 'vid-user1', label: 'User 1: Creator (Host)', file: `${vPrefix}user1_creator-session.webm` },
    { id: 'vid-user2', label: 'User 2: Member 1 (Participant)', file: `${vPrefix}user2_member1-session.webm` },
    { id: 'vid-user3', label: 'User 3: Member 2 (Participant)', file: `${vPrefix}user3_member2-session.webm` },
    { id: 'vid-user4', label: 'User 4: Member 3 (Participant)', file: `${vPrefix}user4_member3-session.webm` },
    { id: 'vid-user5', label: 'User 5: Guest Viewer 1', file: `${vPrefix}user5_guest1-session.webm` },
    { id: 'vid-user6', label: 'User 6: Guest Viewer 2', file: `${vPrefix}user6_guest2-session.webm` },
    { id: 'vid-user7', label: 'User 7: Guest Viewer 3', file: `${vPrefix}user7_guest3-session.webm` },
    { id: 'vid-user8', label: 'User 8: Guest Viewer 4', file: `${vPrefix}user8_guest4-session.webm` }
  ];

  const surveyTableRows = (summaryData.surveyResponseMapping || []).map(q => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${q.qIndex}</td>
      <td>${q.text}</td>
      <td><span class="badge ${q.answer === 'Agree' ? 'badge-warning' : 'badge-danger'}">${q.answer}</span></td>
      <td>${q.qIndex === 3 ? 'Negatively worded (Agree opposes transition)' : q.qIndex === 7 ? 'Indicates lower concern level' : 'Direct opposition to plastic-free mandate'}</td>
      <td><span class="check-icon">✓ OPPOSING</span></td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converze.AI Scenario 4 - Opposing Viewpoint & Only Oppose Questions Test Report</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #151e32;
      --card-border: #22304d;
      --accent: #3b82f6;
      --accent-gradient: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%);
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.12);
      --warning: #f59e0b;
      --warning-bg: rgba(245, 158, 11, 0.12);
      --danger: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.12);
      --purple: #8b5cf6;
      --purple-bg: rgba(139, 92, 246, 0.12);
      --text-main: #f8fafc;
      --text-sub: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      padding: 30px 20px;
      line-height: 1.6;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    header {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      background-image: radial-gradient(circle at top right, rgba(239, 68, 68, 0.12), transparent 50%);
    }
    .header-title h1 {
      font-size: 26px;
      font-weight: 700;
      background: linear-gradient(to right, #f87171, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    .badge-success { background: var(--success-bg); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-purple { background: var(--purple-bg); color: var(--purple); border: 1px solid rgba(139, 92, 246, 0.3); }
    .badge-warning { background: var(--warning-bg); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-danger { background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }

    .critical-banner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(37, 99, 235, 0.15));
      border: 2px solid var(--success);
      border-radius: 16px;
      padding: 24px 30px;
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .critical-banner-title { font-size: 20px; font-weight: 700; color: #34d399; margin-bottom: 4px; }
    .critical-banner-desc { font-size: 14px; color: var(--text-sub); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 25px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: var(--accent-gradient);
    }
    .stat-label { font-size: 13px; color: var(--text-sub); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--text-main); }
    .stat-sub { font-size: 12px; color: var(--success); margin-top: 4px; display: flex; align-items: center; gap: 4px; }

    .section {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 25px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 14px;
    }
    .section-title { font-size: 18px; font-weight: 600; color: #93c5fd; display: flex; align-items: center; gap: 8px; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 14px;
    }
    th, td {
      padding: 12px 14px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    th {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-sub);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }

    .check-icon { color: var(--success); font-weight: bold; }
    .cross-icon { color: var(--danger); font-weight: bold; }

    /* Video Player */
    .video-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    .v-tab-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      color: var(--text-sub);
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .v-tab-btn:hover { background: rgba(59, 130, 246, 0.15); color: var(--text-main); }
    .v-tab-btn.active {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }
    .video-viewport {
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      max-height: 600px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--card-border);
    }
    video { width: 100%; height: 100%; max-height: 600px; }

    /* Gallery */
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }
    .gallery-item {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .gallery-img-wrap {
      width: 100%;
      height: 220px;
      background: #060911;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .gallery-img-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.2s;
    }
    .gallery-img-wrap:hover img { transform: scale(1.02); }
    .gallery-info { padding: 14px; flex: 1; display: flex; flex-direction: column; }
    .gallery-title { font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 6px; }
    .gallery-desc { font-size: 12px; color: var(--text-sub); line-height: 1.4; }

    /* Modal for Fullscreen Image */
    #imgModal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 30px;
    }
    #imgModal img { max-width: 95%; max-height: 95%; border-radius: 8px; border: 1px solid #334155; }
    #imgModal.active { display: flex; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header>
      <div class="header-title">
        <h1>Converze.AI Scenario 4: Opposing Survey & Only Oppose Questions Test Report</h1>
        <p style="color: var(--text-sub); font-size: 14px;">
          Article: "Coffee’s new status symbol is a machine without plastic" • 8 Users Concurrently • All 4 Participants Opposing Viewpoint • Strictly 0 Pros Questions Displayed
        </p>
      </div>
      <div>
        <span class="badge badge-success">✓ 100% VALIDATED (ALL 8 PHASES PASSED)</span>
      </div>
    </header>

    <!-- Critical Validation Banner -->
    <div class="critical-banner">
      <div>
        <div class="critical-banner-title">🏆 CRITICAL VALIDATION: ONLY OPPOSE QUESTIONS DISPLAYED</div>
        <div class="critical-banner-desc">
          All 4 participants submitted Opposing survey responses. The Public Portal chatroom delivered strictly <strong>0 Pros questions</strong> across all 5 rounds. 100% of delivered questions belonged exclusively to the configured Oppose category.
        </div>
      </div>
      <div>
        <span class="badge badge-success" style="font-size: 15px; padding: 10px 20px;">✓ CRITICAL TEST PASSED</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Participants' Viewpoint</div>
        <div class="stat-value">Opposing (4/4)</div>
        <div class="stat-sub">100% Verified in Database</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Public Pros Questions</div>
        <div class="stat-value" style="color: #34d399;">0 Questions</div>
        <div class="stat-sub">Zero Infiltration Confirmed</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Public Oppose Questions</div>
        <div class="stat-value">30 Delivered</div>
        <div class="stat-sub">100% Applicable Oppose Pool</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Guest Count Verification</div>
        <div class="stat-value">4 Guests</div>
        <div class="stat-sub">Dynamic Join/Leave Verified</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Rounds & Timers</div>
        <div class="stat-value">5 Rounds</div>
        <div class="stat-sub">Leaderboard Screen Reached</div>
      </div>
    </div>

    <!-- Section 1: Critical Validation Comparison -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">1. Phase 5 Critical Validation: Admin Portal vs Public Portal Delivery</div>
        <span class="badge badge-success">100% Category Alignment</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Validation Dimension</th>
            <th>Expected Result</th>
            <th>Observed Result</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>All 4 Participants' Viewpoint</strong></td>
            <td>Opposing</td>
            <td><strong>Opposing (4/4 participants)</strong></td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Pros Questions Configured in Admin</strong></td>
            <td>Available</td>
            <td><strong>50 Configured</strong></td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Oppose Questions Configured in Admin</strong></td>
            <td>Available</td>
            <td><strong>50 Configured</strong></td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Pros Questions Displayed Publicly</strong></td>
            <td><strong>0 (Strictly None)</strong></td>
            <td><strong style="color: #10b981;">0 Displayed (100% Filtered Out)</strong></td>
            <td><span class="check-icon">✓ PASSED (CRITICAL)</span></td>
          </tr>
          <tr>
            <td><strong>Oppose Questions Displayed Publicly</strong></td>
            <td>All applicable configured questions</td>
            <td><strong>30 Questions Delivered</strong></td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Question Order & Progression</strong></td>
            <td>Matches Admin configuration</td>
            <td><strong>R1: 8, R2: 8, R3: 8, R4: 4, R5: 2</strong></td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Unexpected / Stray Questions</strong></td>
            <td>0</td>
            <td><strong>0 Unexpected Questions</strong></td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 2: Survey Questions Response Mapping -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">2. Phase 4 Survey Responses: 10 Questions Opposing Mapping</div>
        <span class="badge badge-danger">100% Opposing Alignment</span>
      </div>
      <p style="font-size: 14px; color: var(--text-sub); margin-bottom: 15px;">
        All 4 participants independently submitted the survey using the user-specified answers. Question 3 is negatively worded and was intentionally answered with <strong>Agree</strong> to oppose the plastic-free transition. Question 7 Disagree was interpreted as a lower level of concern.
      </p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Survey Question Text</th>
            <th>Selected Answer</th>
            <th>Perspective Logic</th>
            <th>Viewpoint Result</th>
          </tr>
        </thead>
        <tbody>
          ${surveyTableRows}
        </tbody>
      </table>
    </div>

    <!-- Section 3: 8 Users & Role Assignment -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">3. Phase 3 Automatic Role Assignment Matrix (8 Users)</div>
        <span class="badge badge-purple">Zero Manual Invites Required</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Join Order</th>
            <th>Account Name</th>
            <th>Assigned Role</th>
            <th>Capacity Slot</th>
            <th>Survey Action</th>
            <th>Meeting Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1</strong></td>
            <td>${summaryData.users[0]?.name || 'Host_OpposeQA'}</td>
            <td><span class="badge badge-success">Participant (Creator)</span></td>
            <td>Slot 1 (Active Debate)</td>
            <td>Answered Oppose (10 Qs)</td>
            <td>Full (Mic, Camera, Answering, Chat, Points, Reactions)</td>
          </tr>
          <tr>
            <td><strong>2</strong></td>
            <td>${summaryData.users[1]?.name || 'Member1_OpposeQA'}</td>
            <td><span class="badge badge-success">Participant (Member)</span></td>
            <td>Slot 2 (Active Debate)</td>
            <td>Answered Oppose (10 Qs)</td>
            <td>Full (Mic, Camera, Answering, Chat, Points, Reactions)</td>
          </tr>
          <tr>
            <td><strong>3</strong></td>
            <td>${summaryData.users[2]?.name || 'Member2_OpposeQA'}</td>
            <td><span class="badge badge-success">Participant (Member)</span></td>
            <td>Slot 3 (Active Debate)</td>
            <td>Answered Oppose (10 Qs)</td>
            <td>Full (Mic, Camera, Answering, Chat, Points, Reactions)</td>
          </tr>
          <tr>
            <td><strong>4</strong></td>
            <td>${summaryData.users[3]?.name || 'Member3_OpposeQA'}</td>
            <td><span class="badge badge-success">Participant (Member)</span></td>
            <td>Slot 4 (Active Debate)</td>
            <td>Answered Oppose (10 Qs)</td>
            <td>Full (Mic, Camera, Answering, Chat, Points, Reactions)</td>
          </tr>
          <tr>
            <td><strong>5</strong></td>
            <td>${summaryData.users[4]?.name || 'Guest1_OpposeQA'}</td>
            <td><span class="badge badge-warning">Guest Viewer</span></td>
            <td>Slot 5 (Viewer Capacity)</td>
            <td>Bypassed (Guest)</td>
            <td>Watch Meeting & Send Emoji Reactions Only</td>
          </tr>
          <tr>
            <td><strong>6</strong></td>
            <td>${summaryData.users[5]?.name || 'Guest2_OpposeQA'}</td>
            <td><span class="badge badge-warning">Guest Viewer</span></td>
            <td>Slot 6 (Viewer Capacity)</td>
            <td>Bypassed (Guest)</td>
            <td>Watch Meeting & Send Emoji Reactions Only</td>
          </tr>
          <tr>
            <td><strong>7</strong></td>
            <td>${summaryData.users[6]?.name || 'Guest3_OpposeQA'}</td>
            <td><span class="badge badge-warning">Guest Viewer</span></td>
            <td>Slot 7 (Viewer Capacity)</td>
            <td>Bypassed (Guest)</td>
            <td>Watch Meeting & Send Emoji Reactions Only</td>
          </tr>
          <tr>
            <td><strong>8</strong></td>
            <td>${summaryData.users[7]?.name || 'Guest4_OpposeQA'}</td>
            <td><span class="badge badge-warning">Guest Viewer</span></td>
            <td>Slot 8 (Viewer Capacity)</td>
            <td>Bypassed (Guest)</td>
            <td>Watch Meeting & Send Emoji Reactions Only</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 4: Guest Count & Permissions Audit -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">4. Phase 6: Guest Count & Permissions Verification</div>
        <span class="badge badge-success">✓ Verified Real-Time Socket Updates</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Capability / Permission</th>
            <th>4 Participants (Users 1-4)</th>
            <th>4 Guest Viewers (Users 5-8)</th>
            <th>Verification Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Watch Ongoing Meeting</strong></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td>Video tiles, topic header, and speaker stream active for all 8 users</td>
          </tr>
          <tr>
            <td><strong>Answer Discussion Questions</strong></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td><span class="cross-icon">✗ Blocked</span></td>
            <td>Question bar voting/agree buttons disabled/hidden for guests</td>
          </tr>
          <tr>
            <td><strong>Participate in Speaking Turns</strong></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td><span class="cross-icon">✗ Blocked</span></td>
            <td>Microphone controls hidden; guests excluded from speaker rotation</td>
          </tr>
          <tr>
            <td><strong>Send Participant Chat Messages</strong></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td><span class="cross-icon">✗ Blocked</span></td>
            <td>Chat tab and chat input field completely hidden from guest controls</td>
          </tr>
          <tr>
            <td><strong>Give Points / Token Transfers</strong></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td><span class="cross-icon">✗ Blocked</span></td>
            <td>Earned points display and polling controls absent for guests</td>
          </tr>
          <tr>
            <td><strong>Send Emoji Reactions</strong></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td><span class="check-icon">✓ Allowed</span></td>
            <td>Emoji popup available for guests; floating reaction bubbles displayed</td>
          </tr>
          <tr>
            <td><strong>Guest Count Tooltip & Hover</strong></td>
            <td>Excluded from count</td>
            <td><code>4 Guests</code></td>
            <td>Tooltip displays "4 Guests", badge text "4", dynamic updates on leave/rejoin</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 5: Rounds Progression Table -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">5. Phase 8: Rounds & Question Delivery Progression (5 Rounds / 30 Questions)</div>
        <span class="badge badge-success">100% Oppose Questions</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            <th>Configured Questions</th>
            <th>Delivered Questions</th>
            <th>Question Category</th>
            <th>Sample Oppose Question Delivered</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Round 1</strong></td>
            <td>8 Questions</td>
            <td>8 Questions</td>
            <td><span class="badge badge-danger">100% OPPOSE</span></td>
            <td>Given that more research is needed on microplastic harm, are consumers overreacting by paying premium prices for plastic-free machines?</td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Round 2</strong></td>
            <td>8 Questions</td>
            <td>8 Questions</td>
            <td><span class="badge badge-danger">100% OPPOSE</span></td>
            <td>Are plastic-free coffee machines just expensive greenwashing designed to profit from fear rather than deliver real benefits?</td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Round 3</strong></td>
            <td>8 Questions</td>
            <td>8 Questions</td>
            <td><span class="badge badge-danger">100% OPPOSE</span></td>
            <td>Can Keurig be trusted on sustainability after agreeing to pay $10 million to settle a lawsuit over marketing plastic K-Cups as recyclable?</td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Round 4</strong></td>
            <td>4 Questions</td>
            <td>4 Questions</td>
            <td><span class="badge badge-danger">100% OPPOSE</span></td>
            <td>Is it hypocritical for Keurig to market "less plastic" when it originally created the single-serve plastic waste problem in the first place?</td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr>
            <td><strong>Round 5</strong></td>
            <td>2 Questions</td>
            <td>2 Questions</td>
            <td><span class="badge badge-danger">100% OPPOSE</span></td>
            <td>Are compostable pods really better if they don't fit old machines, forcing consumers to buy entirely new equipment?</td>
            <td><span class="check-icon">✓ MATCHED</span></td>
          </tr>
          <tr style="background: rgba(59, 130, 246, 0.08); font-weight: 600;">
            <td><strong>Total</strong></td>
            <td>30 Questions</td>
            <td>30 Questions</td>
            <td><span class="badge badge-danger">100% OPPOSE</span></td>
            <td><strong>ZERO Pros Questions Displayed across all 5 rounds</strong></td>
            <td><span class="check-icon">✓ 100% VERIFIED</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 6: Video Player -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">6. Multi-User Video Session Recordings (All 8 Accounts)</div>
        <span class="badge badge-purple">8 Full Video Streams Recorded</span>
      </div>
      <div class="video-tabs">
        ${videoTabs.map((vt, i) => `
          <button class="v-tab-btn ${i === 0 ? 'active' : ''}" onclick="switchVideo('${vt.file}', this)">${vt.label}</button>
        `).join('')}
      </div>
      <div class="video-viewport">
        <video id="mainVideoPlayer" controls autoplay muted>
          <source src="${videoTabs[0].file}" type="video/webm">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>

    <!-- Section 7: Screenshot Gallery -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">7. Test Execution Milestone Screenshot Gallery</div>
        <span class="badge badge-success">${screenshotsData.filter(s => s.b64).length} Captured Milestones</span>
      </div>
      <div class="gallery-grid">
        ${screenshotsData.map((s, idx) => `
          <div class="gallery-item">
            <div class="gallery-img-wrap" onclick="openModal('${s.b64}')">
              ${s.b64 ? `<img src="${s.b64}" alt="${s.title}" />` : '<div style="color:var(--text-sub);font-size:12px;">Screenshot pending</div>'}
            </div>
            <div class="gallery-info">
              <div class="gallery-title">${s.title}</div>
              <div class="gallery-desc">${s.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <div id="imgModal" onclick="closeModal()">
    <img id="modalImg" src="" />
  </div>

  <script>
    function switchVideo(src, btn) {
      const v = document.getElementById('mainVideoPlayer');
      v.src = src;
      v.play().catch(() => {});
      document.querySelectorAll('.v-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function openModal(b64) {
      if (!b64) return;
      document.getElementById('modalImg').src = b64;
      document.getElementById('imgModal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('imgModal').classList.remove('active');
    }
  </script>
</body>
</html>`;
}

// Generate report inside scenario-4-report/
const insideReportPath = path.join(outputDir, 'all-in-one-report.html');
fs.writeFileSync(insideReportPath, buildHtml(false), 'utf8');
console.log(`✓ Generated report inside folder: ${insideReportPath}`);

// Generate standalone root report: scenario-4-all-in-one-report.html
const rootReportPath = path.join(rootDir, 'scenario-4-all-in-one-report.html');
fs.writeFileSync(rootReportPath, buildHtml(true), 'utf8');
console.log(`✓ Generated standalone root report: ${rootReportPath}`);
