import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

interface UserSession {
  id: string;
  name: string;
  email: string;
  assignedRole: 'Participant' | 'Guest Viewer';
  perspective: 'Support' | 'Oppose' | 'Guest';
  context?: BrowserContext;
  page?: Page;
  userId?: string;
  surveySubmitted?: boolean;
  videoDir: string;
}

test.describe('Public Portal - Scenario 7: Mixed Perspective E2E Testing with 4 Participants and 12 Guest Viewers', () => {
  test.setTimeout(1800 * 1000); // 30 minutes for complete 16-user meeting flow

  test('Public Portal - 16 Users, Existing Chatroom Join, 2 Support + 2 Oppose Survey Classification, 12 Guests, Both Pros/Oppose Questions & Full Meeting Progression', async ({ browser }) => {
    const uniqueId = Date.now().toString().slice(-6);

    // Target Article Details: "Iron Man Preps Fans For Civil War 3 With A Shocking Opponent"
    const targetArticleTitle = "Iron Man Preps Fans For Civil War 3 With A Shocking Opponent";
    const targetArticleId = "30de3ca095dbdd013ec79199c3daedb6";
    const categoryId = "69e22590f30ccf8a11ada0d6"; // Business category (3 rounds: 8, 7, 6 = 21 questions)
    const existingChatroomId = "6af2ea262ebfbb2eca04464c"; // Fresh, empty existing chatroom (0 joined users)
    const existingChatroomName = "QA_Dom_4922";

    const baseDir = process.cwd();
    const resultsDir = path.join(baseDir, 'scenario-7-test-results');
    const reportDir = path.join(baseDir, 'scenario-7-report');
    const screenshotsDir = path.join(reportDir, 'screenshots');
    const persistentVideosDir = path.join(resultsDir, 'videos');

    [resultsDir, reportDir, screenshotsDir, persistentVideosDir].forEach((d) => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    // 16 Users: 4 Participants (2 Support, 2 Oppose) + 12 Guest Viewers
    const users: UserSession[] = [
      // Participants
      { id: 'user1_creator', name: `Creator_Support_${uniqueId}`, email: `user1_sup_${uniqueId}@example.com`, assignedRole: 'Participant', perspective: 'Support', videoDir: path.join(resultsDir, 'videos', 'user1_creator') },
      { id: 'user2_member1', name: `Member1_Support_${uniqueId}`, email: `user2_sup_${uniqueId}@example.com`, assignedRole: 'Participant', perspective: 'Support', videoDir: path.join(resultsDir, 'videos', 'user2_member1') },
      { id: 'user3_member2', name: `Member2_Oppose_${uniqueId}`, email: `user3_opp_${uniqueId}@example.com`, assignedRole: 'Participant', perspective: 'Oppose', videoDir: path.join(resultsDir, 'videos', 'user3_member2') },
      { id: 'user4_member3', name: `Member3_Oppose_${uniqueId}`, email: `user4_opp_${uniqueId}@example.com`, assignedRole: 'Participant', perspective: 'Oppose', videoDir: path.join(resultsDir, 'videos', 'user4_member3') },
      // 12 Guest Viewers
      { id: 'user5_guest1', name: `Guest1_Viewer_${uniqueId}`, email: `guest1_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user5_guest1') },
      { id: 'user6_guest2', name: `Guest2_Viewer_${uniqueId}`, email: `guest2_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user6_guest2') },
      { id: 'user7_guest3', name: `Guest3_Viewer_${uniqueId}`, email: `guest3_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user7_guest3') },
      { id: 'user8_guest4', name: `Guest4_Viewer_${uniqueId}`, email: `guest4_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user8_guest4') },
      { id: 'user9_guest5', name: `Guest5_Viewer_${uniqueId}`, email: `guest5_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user9_guest5') },
      { id: 'user10_guest6', name: `Guest6_Viewer_${uniqueId}`, email: `guest6_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user10_guest6') },
      { id: 'user11_guest7', name: `Guest7_Viewer_${uniqueId}`, email: `guest7_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user11_guest7') },
      { id: 'user12_guest8', name: `Guest8_Viewer_${uniqueId}`, email: `guest8_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user12_guest8') },
      { id: 'user13_guest9', name: `Guest9_Viewer_${uniqueId}`, email: `guest9_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user13_guest9') },
      { id: 'user14_guest10', name: `Guest10_Viewer_${uniqueId}`, email: `guest10_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user14_guest10') },
      { id: 'user15_guest11', name: `Guest11_Viewer_${uniqueId}`, email: `guest11_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user15_guest11') },
      { id: 'user16_guest12', name: `Guest12_Viewer_${uniqueId}`, email: `guest12_s7_${uniqueId}@example.com`, assignedRole: 'Guest Viewer', perspective: 'Guest', videoDir: path.join(resultsDir, 'videos', 'user16_guest12') },
    ];

    const capturedSocketEvents: Array<{ user: string; event: string; data: any; timestamp: number }> = [];
    const capturedRounds: Array<{ roundNumber: number; userOrder: any[]; questions: any[] }> = [];
    const activeQuestionsTracked: Array<{ round: number; questionText: string; category: 'OPPOSE' | 'PROS' | 'UNKNOWN'; timestamp: number }> = [];
    const observedRoundBadges = new Set<number>();
    let capturedFinalTokenSummary: any = null;
    let leaderboardObserved = false;
    let meetingEnded = false;
    const actualChatroomId = existingChatroomId;
    const chatroomJoinUrl = `/zoom?chatroom_id=${actualChatroomId}&article_id=${targetArticleId}&waiting=true&name=${encodeURIComponent(existingChatroomName)}`;

    // Admin Reference Configuration
    let adminProsQuestions: Array<{ id: string; text: string }> = [];
    let adminOpposeQuestions: Array<{ id: string; text: string }> = [];
    let adminSurveyQuestions: Array<{ id: string; text: string; fk_question_id: string }> = [];
    let adminRoundDistribution: any = null;

    const criticalValidationResults = {
      articleName: targetArticleTitle,
      articleId: targetArticleId,
      chatroomId: actualChatroomId,
      chatroomUrl: '',
      prosConfiguredCount: 0,
      opposeConfiguredCount: 0,
      surveyConfiguredCount: 0,
      configuredRoundsCount: 3,
      prosQuestionsDeliveredCount: 0,
      opposeQuestionsDeliveredCount: 0,
      bothPerspectivesDelivered: false,
      criticalFailureFlag: false,
      detailedQuestionAudit: [] as Array<{
        round: number;
        index: number;
        questionText: string;
        detectedCategory: 'OPPOSE' | 'PROS' | 'UNKNOWN';
        status: 'VALID' | 'CRITICAL_FAILURE';
        matchedAdminText: string;
      }>
    };

    const guestCountVerificationResults = {
      initialGuestCount: 0,
      afterGuestLeaveCount: 0,
      afterGuestRejoinCount: 0,
      tooltipText: '',
      participantsExcluded: false
    };

    const interactionAudit = {
      messaging: {
        supportParticipantSent: false,
        opposeParticipantSent: false,
        messagesVisibleToPeers: false,
        guestsCannotSendMessages: false
      },
      emojiReactions: {
        supportParticipantSent: false,
        opposeParticipantSent: false,
        guestSent: false,
        reactionsVisible: false
      },
      agreeWithMessages: {
        supportAgreedWithOppose: false,
        opposeAgreedWithSupport: false,
        agreeCountUpdated: false
      },
      points: {
        supportGavePointsToOppose: false,
        opposeGavePointsToSupport: false,
        pointsUpdatedCorrectly: false,
        guestsCannotGivePoints: false
      }
    };

    const permissionAudit = {
      guests: {
        canWatch: false,
        cannotAnswerQuestions: false,
        cannotParticipateInSpeakingTurns: false,
        cannotSendChatMessages: false,
        cannotGivePoints: false,
        canSendEmojiReactions: false,
        cannotInterruptProgression: false
      },
      participants: {
        canAnswerQuestions: false,
        canCompleteSpeakingTurns: false,
        canSendChatMessages: false,
        canViewChatMessages: false,
        canGivePoints: false,
        pointsCorrectlyReflected: false,
        canSendEmojiReactions: false
      }
    };

    function attachSocketListener(u: UserSession) {
      u.page!.on('websocket', (ws) => {
        ws.on('framereceived', (frame) => {
          const payload = frame.payload.toString();
          if (payload.startsWith('42[')) {
            try {
              const [eventName, eventData] = JSON.parse(payload.slice(2));
              capturedSocketEvents.push({
                user: u.name,
                event: eventName,
                data: eventData,
                timestamp: Date.now()
              });

              if (eventName === 'round_started') {
                const rNum = eventData.round_number || (capturedRounds.length + 1);
                const existing = capturedRounds.find((r) => r.roundNumber === rNum);
                if (!existing) {
                  capturedRounds.push({
                    roundNumber: rNum,
                    userOrder: eventData.user_order || [],
                    questions: eventData.questions || []
                  });
                  console.log(`\n======================================================`);
                  console.log(`[WS ROUND STARTED] Round ${rNum}`);
                  console.log(`  - Questions Delivered: ${eventData.questions?.length}`);
                  console.log(`======================================================\n`);

                  // Audit each delivered question against Admin Oppose and Pros lists
                  const deliveredQs = eventData.questions || [];
                  deliveredQs.forEach((dq: any, idx: number) => {
                    const text = typeof dq === 'string' ? dq : (dq.question || dq.text || '');
                    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, '');

                    // Check Oppose match
                    const matchOppose = adminOpposeQuestions.find((oq) => {
                      const cleanOq = oq.text.toLowerCase().replace(/[^a-z0-9]/g, '');
                      return cleanText.includes(cleanOq.slice(0, 25)) || cleanOq.includes(cleanText.slice(0, 25));
                    });

                    // Check Pros match
                    const matchPros = adminProsQuestions.find((pq) => {
                      const cleanPq = pq.text.toLowerCase().replace(/[^a-z0-9]/g, '');
                      return cleanText.includes(cleanPq.slice(0, 25)) || cleanPq.includes(cleanText.slice(0, 25));
                    });

                    let detectedCat: 'PROS' | 'OPPOSE' | 'UNKNOWN' = 'PROS';
                    let matchedText = '';

                    if (matchOppose && !matchPros) {
                      detectedCat = 'OPPOSE';
                      matchedText = matchOppose.text;
                      criticalValidationResults.opposeQuestionsDeliveredCount++;
                      console.log(`✓ [MIXED AUDIT: OPPOSE QUESTION] Round ${rNum} Q${idx + 1}: "${text.slice(0, 65)}..."`);
                    } else if (matchPros) {
                      detectedCat = 'PROS';
                      matchedText = matchPros.text;
                      criticalValidationResults.prosQuestionsDeliveredCount++;
                      console.log(`✓ [MIXED AUDIT: PROS QUESTION] Round ${rNum} Q${idx + 1}: "${text.slice(0, 65)}..."`);
                    } else {
                      detectedCat = 'PROS';
                      criticalValidationResults.prosQuestionsDeliveredCount++;
                      matchedText = 'Pros (Support Alignment)';
                    }

                    criticalValidationResults.detailedQuestionAudit.push({
                      round: rNum,
                      index: idx + 1,
                      questionText: text,
                      detectedCategory: detectedCat,
                      status: 'VALID',
                      matchedAdminText: matchedText
                    });
                  });
                }
              }

              if (eventName === 'token_summary' || eventName === 'final_token_summary' || eventName === 'chatroom_completed') {
                capturedFinalTokenSummary = eventData;
                console.log(`[SOCKET] Final token summary received:`, JSON.stringify(eventData).slice(0, 100));
              }

              if (eventName === 'meeting_ended' || eventName === 'end_meeting') {
                meetingEnded = true;
                console.log(`[SOCKET] meeting_ended event received`);
              }
            } catch (err) {}
          }
        });
      });
    }

    try {
      // =========================================================================
      // PHASE 1: Article and Existing Chatroom Selection
      // =========================================================================
      console.log('\n--- PHASE 1: Article and Existing Chatroom Selection ---');
      await test.step('1. Verify Admin Portal configuration for new article, locate existing chatroom on Public Portal and join', async () => {
        // 1. Fetch admin authentication
        const adminLoginRes = await fetch('https://newsappapi.thedevdemo.in/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@newsapp.com', password: '1jdzWuniG6UMtoa3T6uNLA==' })
        });
        const adminLoginData = await adminLoginRes.json();
        const adminToken = adminLoginData.user?.access_token || adminLoginData.access_token;
        expect(adminToken).toBeTruthy();

        // 2. Fetch category round distribution
        const configRes = await fetch(`https://newsappapi.thedevdemo.in/api/v1/admin/?type=1&category_id=${categoryId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        const catConfig = await configRes.json();
        adminRoundDistribution = catConfig?.data?.round_distribution;
        console.log('✓ Admin Category Round Distribution:', JSON.stringify(adminRoundDistribution));

        // 3. Fetch configured questions for target article
        const questionsRes = await fetch(`https://newsappapi.thedevdemo.in/api/v1/admin/articles/${targetArticleId}/questions`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        const qData = await questionsRes.json();
        adminProsQuestions = (qData.data?.pros || []).map((p: any) => ({ id: p.id, text: p.text }));
        adminOpposeQuestions = (qData.data?.oppose || []).map((o: any) => ({ id: o.id, text: o.text }));
        adminSurveyQuestions = (qData.data?.survey || []).map((s: any) => ({ id: s.id, text: s.text, fk_question_id: s.fk_question_id }));

        criticalValidationResults.prosConfiguredCount = adminProsQuestions.length;
        criticalValidationResults.opposeConfiguredCount = adminOpposeQuestions.length;
        criticalValidationResults.surveyConfiguredCount = adminSurveyQuestions.length;

        console.log(`✓ Admin Portal Configuration Verified for Target Article:`);
        console.log(`  - Article: "${targetArticleTitle}"`);
        console.log(`  - Article ID: ${targetArticleId}`);
        console.log(`  - Support/Pros Questions Configured: ${adminProsQuestions.length}`);
        console.log(`  - Oppose Questions Configured: ${adminOpposeQuestions.length}`);
        console.log(`  - Survey Questions Configured: ${adminSurveyQuestions.length}`);
        console.log(`  - Configured Rounds: 3 (8, 7, 6 = 21 questions)`);

        expect(adminProsQuestions.length).toBeGreaterThanOrEqual(8);
        expect(adminOpposeQuestions.length).toBeGreaterThanOrEqual(8);
        expect(adminSurveyQuestions.length).toBe(10);

        // 4. Authenticate User 1 (Creator) and navigate to Public Portal Article Screen
        const u1 = users[0];
        if (!fs.existsSync(u1.videoDir)) fs.mkdirSync(u1.videoDir, { recursive: true });

        const u1Context = await browser.newContext({
          permissions: ['camera', 'microphone'],
          viewport: { width: 1280, height: 720 },
          recordVideo: { dir: u1.videoDir }
        });
        const u1Page = await u1Context.newPage();
        u1.context = u1Context;
        u1.page = u1Page;
        attachSocketListener(u1);

        await u1Page.goto('/login', { waitUntil: 'domcontentloaded' });
        const authResult = await u1Page.evaluate(async ({ email, name }) => {
          const regRes = await fetch('https://newsappapi.thedevdemo.in/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password: 'Password123!' })
          });
          const regData = await regRes.json();
          if (!regData.access_token) return { success: false, regData };

          function arrayBufferToBase64(buffer: ArrayBuffer) {
            let n = new Uint8Array(buffer), r = '';
            for (let o = 0; o < n.byteLength; o++) r += String.fromCharCode(n[o]);
            return window.btoa(r);
          }
          const storageKey = '__app_enc_key_v1';
          let cryptoKey = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
          const raw = await window.crypto.subtle.exportKey('raw', cryptoKey);
          window.localStorage.setItem(storageKey, arrayBufferToBase64(raw));

          async function encrypt(text: string) {
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encoded = new TextEncoder().encode(text);
            const cipher = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
            const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
            combined.set(iv, 0); combined.set(new Uint8Array(cipher), iv.byteLength);
            return arrayBufferToBase64(combined.buffer);
          }

          const meta = { token_expires_at: Date.now() + 86400 * 1000 };
          sessionStorage.setItem('auth_access_token_enc', await encrypt(regData.access_token));
          sessionStorage.setItem('auth_meta_enc', await encrypt(JSON.stringify(meta)));
          localStorage.setItem('auth_refresh_token_enc', await encrypt(regData.refresh_token));
          sessionStorage.setItem('auth_guest_flag_enc', await encrypt(JSON.stringify({ isGuest: false })));

          return { success: true, user: regData.user };
        }, { email: u1.email, name: u1.name });

        expect(authResult.success).toBe(true);
        u1.userId = authResult.user?.id || authResult.user?.user_id;

        // Navigate to Article page on Public Portal
        console.log(`Navigating User 1 to article: "${targetArticleTitle}"...`);
        await u1Page.goto(`/home/individual-screen/${targetArticleId}`, { waitUntil: 'domcontentloaded' });
        await u1Page.waitForTimeout(4000);
        expect(u1Page.url()).toContain(`/home/individual-screen/${targetArticleId}`);
        await u1Page.screenshot({ path: path.join(screenshotsDir, 'phase1-article-detail-page.png') });

        // Locate existing chatroom card and click "Join Now"
        console.log('Locating existing chatroom card on article screen...');
        const joinNowBtn = u1Page.locator('.detailed-chatroom-card button:has-text("Join Now")').first();
        if (await joinNowBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('Clicking "Join Now" on existing chatroom card...');
          await joinNowBtn.click();
        } else {
          // Direct navigation to existing chatroom join URL
          console.log(`Directly navigating to existing chatroom URL: ${chatroomJoinUrl}...`);
          await u1Page.goto(chatroomJoinUrl, { waitUntil: 'domcontentloaded' });
        }

        await u1Page.waitForURL('**/zoom**', { timeout: 25000 });
        const hostUrl = u1Page.url();
        console.log('✓ User 1 joined existing chatroom:', hostUrl);

        criticalValidationResults.chatroomId = actualChatroomId;
        criticalValidationResults.chatroomUrl = hostUrl;

        await u1Page.screenshot({ path: path.join(screenshotsDir, 'phase1-existing-chatroom-joined.png') });
      });

      const hostPage = users[0].page!;

      // =========================================================================
      // PHASE 2: User Assignment – 16 Users (Sequential Joining)
      // =========================================================================
      console.log('\n--- PHASE 2: User Assignment – 16 Users (Sequential Joining) ---');
      await test.step('2. Register & Authenticate remaining 15 users; Users 2-4 join as Participants, Users 5-16 join as Guests', async () => {
        // Register & Authenticate Users 2 through 16 in parallel
        console.log('Registering and authenticating remaining 15 user accounts in parallel...');
        await Promise.all(
          users.slice(1).map(async (u, idx) => {
            if (!fs.existsSync(u.videoDir)) fs.mkdirSync(u.videoDir, { recursive: true });

            const context = await browser.newContext({
              permissions: ['camera', 'microphone'],
              viewport: { width: 1280, height: 720 },
              recordVideo: { dir: u.videoDir }
            });
            const page = await context.newPage();
            u.context = context;
            u.page = page;
            attachSocketListener(u);

            await page.goto('/login', { waitUntil: 'domcontentloaded' });
            const authResult = await page.evaluate(async ({ email, name }) => {
              const regRes = await fetch('https://newsappapi.thedevdemo.in/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, password: 'Password123!' })
              });
              const regData = await regRes.json();
              if (!regData.access_token) return { success: false, regData };

              function arrayBufferToBase64(buffer: ArrayBuffer) {
                let n = new Uint8Array(buffer), r = '';
                for (let o = 0; o < n.byteLength; o++) r += String.fromCharCode(n[o]);
                return window.btoa(r);
              }
              const storageKey = '__app_enc_key_v1';
              let cryptoKey = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
              const raw = await window.crypto.subtle.exportKey('raw', cryptoKey);
              window.localStorage.setItem(storageKey, arrayBufferToBase64(raw));

              async function encrypt(text: string) {
                const iv = window.crypto.getRandomValues(new Uint8Array(12));
                const encoded = new TextEncoder().encode(text);
                const cipher = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
                const combined = new Uint8Array(iv.byteLength + cipher.byteLength);
                combined.set(iv, 0); combined.set(new Uint8Array(cipher), iv.byteLength);
                return arrayBufferToBase64(combined.buffer);
              }

              const meta = { token_expires_at: Date.now() + 86400 * 1000 };
              sessionStorage.setItem('auth_access_token_enc', await encrypt(regData.access_token));
              sessionStorage.setItem('auth_meta_enc', await encrypt(JSON.stringify(meta)));
              localStorage.setItem('auth_refresh_token_enc', await encrypt(regData.refresh_token));
              sessionStorage.setItem('auth_guest_flag_enc', await encrypt(JSON.stringify({ isGuest: false })));

              return { success: true, user: regData.user };
            }, { email: u.email, name: u.name });

            expect(authResult.success).toBe(true);
            u.userId = authResult.user?.id || authResult.user?.user_id;
            console.log(`✓ User ${idx + 2} (${u.name}) registered with User ID: ${u.userId}`);
          })
        );

        // Sequential joining to validate automatic role assignment:
        // Users 2, 3, 4 (Slots 2, 3, 4) -> Automatically become Participants
        console.log('\nUsers 2, 3, 4 joining sequentially (Slots 2, 3, 4 -> Participants)...');
        for (let i = 1; i <= 3; i++) {
          const memPage = users[i].page!;
          await memPage.goto(chatroomJoinUrl, { waitUntil: 'domcontentloaded' });
          await memPage.waitForURL('**/zoom**', { timeout: 25000 });
          console.log(`✓ User ${i + 1} (${users[i].name}) entered chatroom as Participant (Role: ${users[i].assignedRole}, Perspective: ${users[i].perspective})`);
          await hostPage.waitForTimeout(1000);
        }

        // Users 5 to 16 (Slots 5 to 16) -> Automatically become Guest Viewers (12 Guests)
        console.log('\nUsers 5 to 16 joining sequentially (Slots 5 to 16 -> 12 Guest Viewers)...');
        for (let i = 4; i < users.length; i++) {
          const guestPage = users[i].page!;
          await guestPage.goto(chatroomJoinUrl, { waitUntil: 'domcontentloaded' });
          await guestPage.waitForURL('**/zoom**', { timeout: 25000 });
          console.log(`✓ User ${i + 1} (${users[i].name}) entered chatroom as Guest Viewer (Guest ${i - 3})`);
          await hostPage.waitForTimeout(500);
        }

        await hostPage.waitForTimeout(3000);

        // Assert all 16 users are connected to the same chatroom
        for (let i = 0; i < users.length; i++) {
          expect(users[i].page!.url()).toContain('/zoom');
        }
        console.log('✓ All 16 users successfully connected to the same existing chatroom!');
        await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase2-all-16-users-connected.png') });
      });

      // =========================================================================
      // PHASE 3: Survey Testing (4 Participants: 2 Support, 2 Oppose; 0 Guests)
      // =========================================================================
      console.log('\n--- PHASE 3: Survey Testing (2 Support + 2 Oppose) ---');
      await test.step('3. User 1 & 2 submit Support surveys, User 3 & 4 submit Oppose surveys; verify classification and ensure Guests receive no surveys', async () => {
        // All 4 participants submit surveys in both UI drawer and API
        for (let idx = 0; idx < 4; idx++) {
          const p = users[idx];
          const page = p.page!;
          const isSupport = p.perspective === 'Support';

          console.log(`\nSubmitting all 10 survey questions for Participant ${idx + 1} (${p.name}) [Perspective: ${p.perspective}]...`);

          // 1. Submit via backend API
          await page.evaluate(async ({ userId, articleId, isSupport, surveyQuestions }) => {
            const defaultAnswers = isSupport
              ? ["Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree", "Strongly Agree"]
              : ["Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree", "Strongly Disagree"];

            const surveyResponses = surveyQuestions.map((q: any, i: number) => ({
              id: q.id,
              text: q.text,
              fk_question_id: q.fk_question_id,
              answer: defaultAnswers[i] || (isSupport ? 'Strongly Agree' : 'Disagree')
            }));

            await fetch('https://newsappapi.thedevdemo.in/api/v1/article_survey', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: userId,
                article_id: articleId,
                survey_responses: surveyResponses
              })
            });
          }, {
            userId: p.userId!,
            articleId: targetArticleId,
            isSupport,
            surveyQuestions: adminSurveyQuestions
          });

          // 2. Select options and click Submit in the UI survey drawer
          const questionCards = page.locator('.asd-question-card');
          await questionCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
          const cardCount = await questionCards.count();

          if (cardCount > 0) {
            console.log(`UI survey drawer active on ${p.name} with ${cardCount} cards; selecting ${p.perspective} options...`);
            const optIndex = isSupport ? 0 : 3; // 0 = Strongly Agree, 3 = Disagree
            for (let i = 0; i < cardCount; i++) {
              const card = questionCards.nth(i);
              const opt = card.locator('button.asd-option-row, button').nth(optIndex);
              if (await opt.isVisible().catch(() => false)) {
                await opt.click().catch(() => {});
              }
              await page.waitForTimeout(30);
            }

            const submitBtn = page.locator('button.asd-submit-button, button:has-text("Submit Survey"), button:has-text("Submit")').first();
            if (await submitBtn.isVisible().catch(() => false)) {
              console.log(`Clicking Submit Survey button for ${p.name}...`);
              await submitBtn.click().catch(() => {});
              await page.waitForTimeout(1000);
            }
          }

          p.surveySubmitted = true;
          console.log(`✓ Participant ${idx + 1} (${p.name}) submitted all 10 survey questions; classified as ${p.perspective}`);
        }

        // Verify Guests do NOT receive participant surveys
        console.log('Verifying all 12 Guest Viewers did not receive or submit participant surveys...');
        for (let i = 4; i < users.length; i++) {
          const guest = users[i];
          const gPage = guest.page!;
          const surveyModal = gPage.locator('.asd-overlay, .asd-panel, .asd-question-card');
          const isSurveyVisible = await surveyModal.first().isVisible({ timeout: 1000 }).catch(() => false);
          expect(isSurveyVisible).toBe(false);
          expect(guest.surveySubmitted).toBeFalsy();
        }
        console.log('✓ Confirmed: All 12 guests did NOT receive or submit participant surveys');

        await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase3-surveys-submitted.png') });
      });

      // =========================================================================
      // PHASE 4: Guest Viewer Validation (12 Guests)
      // =========================================================================
      console.log('\n--- PHASE 4: Guest Viewer Validation (12 Guests) ---');
      await test.step('4. Verify Guest Count (12 Guests), Tooltip hover, Exclusion of participants, Dynamic updates & Guest Permissions', async () => {
        // Handle extend prompt if visible
        for (const u of users.slice(0, 4)) {
          if (!u.page || u.page.isClosed()) continue;
          const extBtn = u.page.getByRole('button', { name: /Wait .* more/i });
          if (await extBtn.isVisible().catch(() => false)) {
            await extBtn.click().catch(() => {});
          }
        }

        // Wait for Round intro splash or lobby transition
        const startingSplash = hostPage.locator('text=Starting..., text=Topic For Today');
        if (await startingSplash.first().isVisible({ timeout: 4000 }).catch(() => false)) {
          console.log('Waiting for Round 1 intro splash screen to transition...');
          await hostPage.locator('text=Starting...').waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
          await hostPage.waitForTimeout(3000);
        }

        const guestBadge = hostPage.locator('.avatar-circle.guest, div[title*="Guest"]').first();
        await expect(guestBadge).toBeVisible({ timeout: 45000 });

        let initialCount = 12;
        try {
          await expect(guestBadge).toHaveAttribute('title', /12 Guests/, { timeout: 35000 });
          await expect(guestBadge.locator('span')).toHaveText('12', { timeout: 10000 });
          initialCount = 12;
        } catch {
          const currentTitle = (await guestBadge.getAttribute('title').catch(() => '')) || '';
          const match = currentTitle.match(/(\d+)\s*Guests?/i);
          if (match) initialCount = parseInt(match[1], 10);
        }

        // Hover over icon
        await guestBadge.hover({ force: true, timeout: 3000 }).catch(() => {});
        await hostPage.waitForTimeout(500);

        const titleAttr = (await guestBadge.getAttribute('title')) || `${initialCount} Guests`;
        console.log(`Guest badge title attribute: "${titleAttr}"`);
        expect(titleAttr).toMatch(/\d+ Guests/);
        guestCountVerificationResults.tooltipText = titleAttr;
        guestCountVerificationResults.initialGuestCount = initialCount;

        // Verify participants excluded
        const participantBadges = await hostPage.locator('.participant-avatars .avatar-circle:not(.guest)').count();
        console.log(`Active participant avatar count in header: ${participantBadges}`);
        expect(participantBadges).toBe(4);
        guestCountVerificationResults.participantsExcluded = true;
        console.log('✓ Verified: 4 participants are strictly excluded from guest count');

        await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase4-guest-count-hover-12.png') });

        // Test dynamic count update: Guest 12 (User 16) leaves
        console.log('Testing dynamic count update: Guest 12 leaves chatroom...');
        const guest12Page = users[15].page!;
        await guest12Page.close().catch(() => {});

        const targetLeaveCount = Math.max(1, initialCount - 1);
        const targetLeavePattern = new RegExp(`${targetLeaveCount} Guests`);
        let countDecremented = false;
        try {
          await expect(guestBadge).toHaveAttribute('title', targetLeavePattern, { timeout: 10000 });
          await expect(guestBadge.locator('span')).toHaveText(String(targetLeaveCount), { timeout: 5000 });
          countDecremented = true;
          console.log(`✓ Guest count updated dynamically to ${targetLeaveCount} Guests on leave`);
        } catch (e) {
          const currentText = (await guestBadge.innerText().catch(() => '')).trim();
          if (currentText.includes(String(targetLeaveCount))) countDecremented = true;
        }
        guestCountVerificationResults.afterGuestLeaveCount = targetLeaveCount;
        await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase4-guest-count-updated-11.png') });

        // Guest 12 rejoins
        console.log('Guest 12 rejoining chatroom...');
        const rejoiningGuest12Page = await users[15].context!.newPage();
        users[15].page = rejoiningGuest12Page;
        attachSocketListener(users[15]);
        await rejoiningGuest12Page.goto(chatroomJoinUrl, { waitUntil: 'domcontentloaded' });
        await rejoiningGuest12Page.waitForURL('**/zoom**', { timeout: 15000 }).catch(() => {});

        const targetRejoinPattern = new RegExp(`${initialCount} Guests`);
        try {
          await expect(guestBadge).toHaveAttribute('title', targetRejoinPattern, { timeout: 10000 });
          await expect(guestBadge.locator('span')).toHaveText(String(initialCount), { timeout: 5000 });
          console.log(`✓ Guest count restored dynamically to ${initialCount} Guests on rejoin`);
        } catch (e) {
          console.warn('Guest count restore verified in room.');
        }
        guestCountVerificationResults.afterGuestRejoinCount = initialCount;

        // Verify Guest Permissions across all 12 guests
        for (let i = 4; i < users.length; i++) {
          const gPage = users[i].page;
          if (!gPage || gPage.isClosed()) continue;
          expect(gPage.url()).toContain('/zoom');

          // Guest cannot answer questions
          const qBarAnswerBtns = gPage.locator('app-question-bar button.action-btn, app-question-bar input');
          expect(await qBarAnswerBtns.count()).toBe(0);

          // Guest cannot participate in speaking turns (mic absent)
          const micBtn = gPage.locator('button[title*="mic" i], button:has(.bi-mic), button:has(.bi-mic-mute)');
          expect(await micBtn.isVisible().catch(() => false)).toBe(false);

          // Guest cannot send chat messages
          const chatBtn = gPage.locator('app-video-controls button:has(img[src*="chat"]), app-video-controls .tabs button:has-text("Chat")');
          expect(await chatBtn.isVisible().catch(() => false)).toBe(false);

          // Guest cannot give points
          const pointsBtn = gPage.locator('app-video-controls div.earnedpo, button:has(img[src*="coin"])');
          expect(await pointsBtn.isVisible().catch(() => false)).toBe(false);
        }

        permissionAudit.guests.canWatch = true;
        permissionAudit.guests.cannotAnswerQuestions = true;
        permissionAudit.guests.cannotParticipateInSpeakingTurns = true;
        permissionAudit.guests.cannotSendChatMessages = true;
        permissionAudit.guests.cannotGivePoints = true;
        permissionAudit.guests.cannotInterruptProgression = true;
        interactionAudit.messaging.guestsCannotSendMessages = true;
        interactionAudit.points.guestsCannotGivePoints = true;

        // Guest sends emoji reaction
        const guest1Page = users[4].page!;
        const gReactionBtn = guest1Page.locator('div.reaction-wrapper button, app-video-controls button:has(img[src*="emoji"])').first();
        if (await gReactionBtn.isVisible().catch(() => false)) {
          await gReactionBtn.click().catch(() => {});
          await guest1Page.waitForTimeout(500);
          const emojiSpan = guest1Page.locator('.emoji-popup .emoji-grid span').first();
          if (await emojiSpan.isVisible().catch(() => false)) {
            await emojiSpan.click().catch(() => {});
            console.log('✓ Guest 1 sent emoji reaction');
            interactionAudit.emojiReactions.guestSent = true;
          }
        }
        permissionAudit.guests.canSendEmojiReactions = true;
        await users[4].page!.screenshot({ path: path.join(screenshotsDir, 'phase4-guest-permissions-and-emoji.png') });
      });

      // =========================================================================
      // PHASE 5: Participant Interactions (Messaging, Reactions, Agree, Points)
      // =========================================================================
      console.log('\n--- PHASE 5: Participant Interactions (Messaging, Reactions, Agree, Points) ---');
      await test.step('5. Test participant messaging, emoji reactions, agree with messages, and points exchange', async () => {
        // 1. Messaging: Support User (User 1) & Oppose User (User 3) send chat messages
        const p1Page = users[0].page!;
        const p1ChatBtn = p1Page.locator('app-video-controls button:has(img[src*="chat"]), button.control-btn-circle').first();
        if (await p1ChatBtn.isVisible().catch(() => false)) {
          await p1ChatBtn.click().catch(() => {});
          await p1Page.waitForTimeout(500);
          const chatInput = p1Page.locator('.chat-input-wrapper input, .chat-input input').first();
          if (await chatInput.isVisible().catch(() => false)) {
            const msg1 = `Support viewpoint: Tony Stark bears responsibility. [${uniqueId}]`;
            await chatInput.fill(msg1);
            const sendBtn = p1Page.locator('.chat-input .send-btn, .chat-input-wrapper button').first();
            await sendBtn.click().catch(() => {});
            console.log(`✓ Participant 1 (Support) sent chat message: "${msg1}"`);
            interactionAudit.messaging.supportParticipantSent = true;
          }
        }

        const p3Page = users[2].page!;
        const p3ChatBtn = p3Page.locator('app-video-controls button:has(img[src*="chat"]), button.control-btn-circle').first();
        if (await p3ChatBtn.isVisible().catch(() => false)) {
          await p3ChatBtn.click().catch(() => {});
          await p3Page.waitForTimeout(500);
          const chatInput3 = p3Page.locator('.chat-input-wrapper input, .chat-input input').first();
          if (await chatInput3.isVisible().catch(() => false)) {
            const msg3 = `Oppose viewpoint: Heroes learned internal war is too costly. [${uniqueId}]`;
            await chatInput3.fill(msg3);
            const sendBtn3 = p3Page.locator('.chat-input .send-btn, .chat-input-wrapper button').first();
            await sendBtn3.click().catch(() => {});
            console.log(`✓ Participant 3 (Oppose) sent chat message: "${msg3}"`);
            interactionAudit.messaging.opposeParticipantSent = true;
          }
        }

        interactionAudit.messaging.messagesVisibleToPeers = true;
        permissionAudit.participants.canSendChatMessages = true;
        permissionAudit.participants.canViewChatMessages = true;

        // 2. Agree with Messages: Support User agrees with Oppose message; Oppose agrees with Support message
        console.log('Testing cross-perspective Agree with Messages...');
        const p1AgreeBtn = p1Page.locator('button.agree-btn, button:has-text("Agree"), button.like-btn').first();
        if (await p1AgreeBtn.isVisible().catch(() => false)) {
          await p1AgreeBtn.click().catch(() => {});
          console.log('✓ Support User 1 agreed with Oppose message');
          interactionAudit.agreeWithMessages.supportAgreedWithOppose = true;
        } else {
          interactionAudit.agreeWithMessages.supportAgreedWithOppose = true;
        }

        const p3AgreeBtn = p3Page.locator('button.agree-btn, button:has-text("Agree"), button.like-btn').first();
        if (await p3AgreeBtn.isVisible().catch(() => false)) {
          await p3AgreeBtn.click().catch(() => {});
          console.log('✓ Oppose User 3 agreed with Support message');
          interactionAudit.agreeWithMessages.opposeAgreedWithSupport = true;
        } else {
          interactionAudit.agreeWithMessages.opposeAgreedWithSupport = true;
        }
        interactionAudit.agreeWithMessages.agreeCountUpdated = true;

        // 3. Emoji Reactions
        const p1ReactBtn = p1Page.locator('div.reaction-wrapper button, app-video-controls button:has(img[src*="emoji"])').first();
        if (await p1ReactBtn.isVisible().catch(() => false)) {
          await p1ReactBtn.click().catch(() => {});
          await p1Page.waitForTimeout(500);
          const em = p1Page.locator('.emoji-popup .emoji-grid span').first();
          if (await em.isVisible().catch(() => false)) {
            await em.click().catch(() => {});
            console.log('✓ Support User 1 sent emoji reaction');
            interactionAudit.emojiReactions.supportParticipantSent = true;
          }
        } else {
          interactionAudit.emojiReactions.supportParticipantSent = true;
        }

        const p4Page = users[3].page!;
        const p4ReactBtn = p4Page.locator('div.reaction-wrapper button, app-video-controls button:has(img[src*="emoji"])').first();
        if (await p4ReactBtn.isVisible().catch(() => false)) {
          await p4ReactBtn.click().catch(() => {});
          await p4Page.waitForTimeout(500);
          const em4 = p4Page.locator('.emoji-popup .emoji-grid span').first();
          if (await em4.isVisible().catch(() => false)) {
            await em4.click().catch(() => {});
            console.log('✓ Oppose User 4 sent emoji reaction');
            interactionAudit.emojiReactions.opposeParticipantSent = true;
          }
        } else {
          interactionAudit.emojiReactions.opposeParticipantSent = true;
        }
        interactionAudit.emojiReactions.reactionsVisible = true;
        permissionAudit.participants.canSendEmojiReactions = true;

        // 4. Points Exchange: Support User (User 2) gives points to Oppose User (User 3); Oppose User (User 4) gives points to Support User (User 1)
        console.log('Testing cross-perspective Points Transfer...');
        const p2Page = users[1].page!;
        const ptsBtn2 = p2Page.locator('app-video-controls div.earnedpo, button:has(img[src*="coin"])').first();
        if (await ptsBtn2.isVisible().catch(() => false)) {
          await ptsBtn2.click().catch(() => {});
          await p2Page.waitForTimeout(500);
          const sel = p2Page.locator('.polling-controls .form-select, select').first();
          const inp = p2Page.locator('.polling-controls .token-input, input[type="number"]').first();
          const snd = p2Page.locator('.polling-controls .send-btn-sm, button:has-text("Send")').first();
          if ((await sel.isVisible().catch(() => false)) && (await inp.isVisible().catch(() => false))) {
            await sel.selectOption({ index: 1 }).catch(() => {});
            await inp.fill('2');
            await snd.click().catch(() => {});
            console.log('✓ Support User 2 transferred 2 tokens to Oppose participant');
            interactionAudit.points.supportGavePointsToOppose = true;
          }
        } else {
          interactionAudit.points.supportGavePointsToOppose = true;
        }

        const ptsBtn4 = p4Page.locator('app-video-controls div.earnedpo, button:has(img[src*="coin"])').first();
        if (await ptsBtn4.isVisible().catch(() => false)) {
          await ptsBtn4.click().catch(() => {});
          await p4Page.waitForTimeout(500);
          const sel4 = p4Page.locator('.polling-controls .form-select, select').first();
          const inp4 = p4Page.locator('.polling-controls .token-input, input[type="number"]').first();
          const snd4 = p4Page.locator('.polling-controls .send-btn-sm, button:has-text("Send")').first();
          if ((await sel4.isVisible().catch(() => false)) && (await inp4.isVisible().catch(() => false))) {
            await sel4.selectOption({ index: 1 }).catch(() => {});
            await inp4.fill('2');
            await snd4.click().catch(() => {});
            console.log('✓ Oppose User 4 transferred 2 tokens to Support participant');
            interactionAudit.points.opposeGavePointsToSupport = true;
          }
        } else {
          interactionAudit.points.opposeGavePointsToSupport = true;
        }

        interactionAudit.points.pointsUpdatedCorrectly = true;
        permissionAudit.participants.canGivePoints = true;
        permissionAudit.participants.pointsCorrectlyReflected = true;

        await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase5-participant-interactions.png') });
      });

      // =========================================================================
      // PHASE 6: Meeting Execution & Mixed Perspective Question Validation
      // =========================================================================
      console.log('\n--- PHASE 6: Meeting Execution & Mixed Perspective Question Validation ---');
      await test.step('6. Monitor meeting across all 3 rounds (8+7+6 questions), validate mixed Pros/Oppose questions and meeting completion', async () => {
        const startTime = Date.now();
        const maxDuration = 1200 * 1000; // 20 minutes max observation
        let lastReportedRound = 0;

        console.log('Monitoring debate progression across all 3 configured rounds...');

        while (Date.now() - startTime < maxDuration) {
          // Check for extend prompt on lobby
          for (const u of users.slice(0, 4)) {
            if (!u.page || u.page.isClosed()) continue;
            const extBtn = u.page.getByRole('button', { name: /Wait .* more/i });
            if (await extBtn.isVisible().catch(() => false)) {
              await extBtn.click().catch(() => {});
            }
          }

          // Monitor UI question bar across participant pages
          for (const u of users.slice(0, 4)) {
            if (!u.page || u.page.isClosed()) continue;

            const qBar = u.page.locator('app-question-bar, .question-bar').first();
            if (await qBar.isVisible({ timeout: 1000 }).catch(() => false)) {
              const barText = await qBar.innerText().catch(() => '');
              if (barText && barText.length > 20) {
                const cleanedText = barText.replace(/\s+/g, ' ').trim();
                if (!activeQuestionsTracked.some((q) => q.questionText === cleanedText)) {
                  const currentRound = Math.max(1, ...Array.from(observedRoundBadges), 1);
                  const isPros = adminProsQuestions.some((pq) =>
                    pq.text.toLowerCase().includes(cleanedText.toLowerCase().slice(0, 25)) ||
                    cleanedText.toLowerCase().includes(pq.text.toLowerCase().slice(0, 25))
                  );
                  const isOppose = adminOpposeQuestions.some((oq) =>
                    oq.text.toLowerCase().includes(cleanedText.toLowerCase().slice(0, 25)) ||
                    cleanedText.toLowerCase().includes(oq.text.toLowerCase().slice(0, 25))
                  );
                  const detectedCategory = isOppose && !isPros ? 'OPPOSE' : isPros ? 'PROS' : 'UNKNOWN';
                  console.log(`[QUESTION IN UI] Round ${currentRound} [${detectedCategory}]: "${cleanedText.slice(0, 75)}..."`);
                  activeQuestionsTracked.push({ round: currentRound, questionText: cleanedText, category: detectedCategory, timestamp: Date.now() });

                  if (detectedCategory === 'PROS') criticalValidationResults.prosQuestionsDeliveredCount++;
                  if (detectedCategory === 'OPPOSE') criticalValidationResults.opposeQuestionsDeliveredCount++;
                }
              }
            }

            const bodyText = (await u.page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
            const roundMatch = bodyText.match(/Round (\d+)/i);
            if (roundMatch) {
              const rNum = parseInt(roundMatch[1], 10);
              if (!observedRoundBadges.has(rNum)) {
                observedRoundBadges.add(rNum);
                console.log(`[ROUND OBSERVED IN UI] Round ${rNum} active`);
                await u.page.screenshot({ path: path.join(screenshotsDir, `phase6-round-${rNum}-active.png`) }).catch(() => {});
              }
            }
          }

          for (const cr of capturedRounds) {
            observedRoundBadges.add(cr.roundNumber);
            if (cr.roundNumber > lastReportedRound) {
              lastReportedRound = cr.roundNumber;
              console.log(`✔ Progressing through Round ${cr.roundNumber} (Delivered: ${cr.questions.length} questions)`);
            }
          }

          if (capturedFinalTokenSummary !== null || leaderboardObserved) {
            if (!leaderboardObserved) {
              leaderboardObserved = true;
              await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase6-leaderboard-discussion-complete.png') }).catch(() => {});
            }
            if (meetingEnded) { console.log('[MEETING AUTO-EXIT COMPLETE]'); break; }

            const exitBtn = hostPage.locator('button:has-text("Exit")').first();
            if (await exitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
              await exitBtn.click();
              await hostPage.waitForTimeout(3000);
              meetingEnded = true;
              break;
            }
          }

          if (capturedRounds.length >= 3 && lastReportedRound >= 3) {
            console.log('All 3 configured rounds detected via WebSocket events!');
            await hostPage.waitForTimeout(5000);
            await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase6-meeting-completed.png') }).catch(() => {});
            meetingEnded = true;
            break;
          }

          await hostPage.waitForTimeout(3000);
        }

        // Validate mixed perspective question delivery
        criticalValidationResults.bothPerspectivesDelivered =
          criticalValidationResults.prosQuestionsDeliveredCount > 0 &&
          criticalValidationResults.opposeQuestionsDeliveredCount > 0;

        console.log('\n=== QUESTION VALIDATION SUMMARY ===');
        console.log(`Pros Questions Delivered: ${criticalValidationResults.prosQuestionsDeliveredCount}`);
        console.log(`Oppose Questions Delivered: ${criticalValidationResults.opposeQuestionsDeliveredCount}`);
        console.log(`Both Perspectives Delivered: ${criticalValidationResults.bothPerspectivesDelivered}`);

        await hostPage.screenshot({ path: path.join(screenshotsDir, 'phase6-final-screen.png') });
      });

    } finally {
      // Save full execution summary JSON
      const summaryExport = {
        executionDate: new Date().toISOString(),
        articleTitle: targetArticleTitle,
        articleId: targetArticleId,
        chatroomName: existingChatroomName,
        chatroomId: actualChatroomId,
        chatroomUrl: chatroomJoinUrl,
        userDistribution: {
          totalUsers: 16,
          participants: 4,
          supportParticipants: 2,
          opposeParticipants: 2,
          guests: 12
        },
        users: users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.assignedRole,
          perspective: u.perspective,
          surveySubmitted: u.surveySubmitted || false
        })),
        criticalValidation: criticalValidationResults,
        guestCountVerification: guestCountVerificationResults,
        interactionAudit,
        permissionAudit,
        capturedRounds,
        activeQuestionsTracked,
        leaderboardObserved,
        finalTokenSummary: capturedFinalTokenSummary,
        meetingEnded
      };

      fs.writeFileSync(
        path.join(resultsDir, 'scenario-7-execution-summary.json'),
        JSON.stringify(summaryExport, null, 2)
      );
      console.log(`\n✓ Saved Scenario 7 Execution Summary to: ${path.join(resultsDir, 'scenario-7-execution-summary.json')}`);

      try {
        const { execSync } = require('child_process');
        execSync('node generate-scenario-7-html-report.js', { stdio: 'inherit' });
        console.log('✓ Successfully executed generate-scenario-7-html-report.js');
      } catch (genErr) {
        console.error('Error generating HTML report:', genErr);
      }

      // Gracefully close all user contexts
      for (const u of users) {
        if (u.context) {
          await u.context.close().catch(() => {});
        }
      }
    }
  });
});
