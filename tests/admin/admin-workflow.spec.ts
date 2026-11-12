import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Converze.AI Admin Portal End-to-End Workflow', () => {

  test('Complete Admin Workflow: Login, Question Generation, and Article Configuration', async ({ page }) => {
    test.setTimeout(180000);

    const screenshotsDir = path.join(__dirname, '../../admin-test-results/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // ==========================================
    // STEP 1: Admin Login
    // ==========================================
    console.log('\n--- STEP 1: Admin Login ---');
    await test.step('Navigate to Admin Portal and Log in', async () => {
      await page.goto('https://newsadmin.thedevdemo.in/login', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 15000 });

      // Enter credentials
      await page.fill('input[type="email"]', 'admin@newsapp.com');
      await page.fill('input[type="password"]', '123456');

      // Click Sign In
      await page.click('button:has-text("Sign in")');

      // Verify login success - URL navigates to /dashboard
      await page.waitForURL('**/dashboard', { timeout: 25000 });
      expect(page.url()).toContain('/dashboard');
      console.log('✓ Successfully logged in, navigated to /dashboard');

      // Verify navigation menu items are displayed
      const expectedNavItems = [
        'Dashboard',
        'Articles',
        'Book Club',
        'Participants',
        'Admin Users',
        'Articles Configuration'
      ];

      for (const item of expectedNavItems) {
        const navLink = page.locator(`.sidebar-nav-link:has-text("${item}"), a:has-text("${item}")`).first();
        await expect(navLink).toBeVisible({ timeout: 10000 });
        console.log(`✓ Sidebar navigation menu displays: "${item}"`);
      }

      await page.screenshot({ path: path.join(screenshotsDir, 'step1-admin-dashboard.png') });
    });

    // ==========================================
    // STEP 2: Article Question Generation
    // ==========================================
    let articleTitle = '';
    console.log('\n--- STEP 2: Article Question Generation ---');
    await test.step('Navigate to Articles and Generate Pros/Oppose Questions', async () => {
      // Navigate to Articles section
      await page.click('.sidebar-nav-link:has-text("Articles"), a[href="/article"]');
      await page.waitForURL('**/article', { timeout: 20000 });
      await page.waitForSelector('.article-card-item', { timeout: 20000 });
      console.log('✓ Navigated to Articles section');

      // Select any one available article
      const firstArticle = page.locator('.article-card-item').first();
      await expect(firstArticle).toBeVisible();
      articleTitle = (await firstArticle.innerText()).split('\n')[0].trim();
      console.log(`✓ Selected article: "${articleTitle}"`);

      // Open article detail page
      await firstArticle.click();
      await page.waitForTimeout(3000);
      expect(page.url()).toMatch(/\/article\/[a-zA-Z0-9_-]+/);
      console.log(`✓ Opened article detail page: ${page.url()}`);

      // Navigate to Questions tab
      const questionsTab = page.locator('button.tab-btn:has-text("Questions")');
      await expect(questionsTab).toBeVisible({ timeout: 10000 });
      await questionsTab.click();
      await page.waitForTimeout(2000);
      console.log('✓ Navigated to Questions tab');

      // If already in questions list mode, click Manage Prompt to open prompt editor
      const managePromptBtn = page.locator('button:has-text("Manage Prompt")');
      if (await managePromptBtn.isVisible({ timeout: 2000 })) {
        console.log('Questions already exist. Clicking "Manage Prompt" to re-generate with new prompt...');
        await managePromptBtn.click();
        await page.waitForTimeout(1500);
      }

      // Enter suitable prompts for Pros and Oppose (max 30 questions each)
      const prosPromptText = 'Write exactly 30 discussion questions for people who support the central thesis of this article. Provide thought-provoking, deep-dive debate questions numbered 1 to 30.';
      const opposePromptText = 'Write exactly 30 discussion questions for people who oppose the central thesis of this article. Provide thought-provoking, deep-dive debate questions numbered 1 to 30.';

      const textareas = page.locator('.prompt-card textarea');
      await expect(textareas.first()).toBeVisible({ timeout: 10000 });
      await textareas.nth(0).fill(prosPromptText);
      await textareas.nth(1).fill(opposePromptText);
      console.log('✓ Entered Pros and Oppose generation prompts');

      await page.screenshot({ path: path.join(screenshotsDir, 'step2-prompts-entered.png') });

      // Click Generate button
      const generateBtn = page.locator('button.btn-filled-primary:has-text("Generate")');
      await expect(generateBtn).toBeEnabled();
      console.log('Clicking Generate button and awaiting question generation...');
      await generateBtn.click();

      // Wait for generation API response and toast notification
      const toastSuccess = page.locator('.toast, [role="alert"], .swal2-title, .toast-success');
      await expect(toastSuccess.first()).toBeVisible({ timeout: 45000 });
      const toastMsg = await toastSuccess.first().innerText();
      console.log(`✓ Received generation confirmation: "${toastMsg}"`);

      await page.waitForTimeout(3000);

      // Verify that the generated questions are displayed correctly
      // 1. Check Pros perspective questions
      const prosPill = page.locator('button:has-text("Pros ("), .questions-pill-tabs button:has-text("Pros")').first();
      await expect(prosPill).toBeVisible({ timeout: 15000 });
      await prosPill.click();
      await page.waitForTimeout(1000);

      const prosQuestions = page.locator('.question-row-item, .question-text-content');
      const prosCount = await prosQuestions.count();
      expect(prosCount).toBeGreaterThan(0);
      const firstProsQuestion = await prosQuestions.first().innerText();
      console.log(`✓ Pros questions displayed: ${prosCount} items. Sample: "${firstProsQuestion.substring(0, 70)}..."`);

      // 2. Check Oppose perspective questions
      const opposePill = page.locator('button:has-text("Oppose ("), .questions-pill-tabs button:has-text("Oppose")').first();
      await expect(opposePill).toBeVisible({ timeout: 10000 });
      await opposePill.click();
      await page.waitForTimeout(1000);

      const opposeQuestions = page.locator('.question-row-item, .question-text-content');
      const opposeCount = await opposeQuestions.count();
      expect(opposeCount).toBeGreaterThan(0);
      const firstOpposeQuestion = await opposeQuestions.first().innerText();
      console.log(`✓ Oppose questions displayed: ${opposeCount} items. Sample: "${firstOpposeQuestion.substring(0, 70)}..."`);

      await page.screenshot({ path: path.join(screenshotsDir, 'step2-questions-generated-saved.png') });
      console.log('✓ Verified questions are saved and displayed correctly for both perspectives');
    });

    // ==========================================
    // STEP 3: Article Configuration
    // ==========================================
    console.log('\n--- STEP 3: Article Configuration ---');
    await test.step('Navigate to Article Configuration, Update Rounds & Questions, and Confirm Persistence', async () => {
      // Navigate to Article Configuration from admin navigation menu
      const articleConfigLink = page.locator('.sidebar-nav-link:has-text("Articles Configuration"), a[href="/settings/articles"]').first();
      await articleConfigLink.click();
      await page.waitForURL('**/settings/articles', { timeout: 20000 });
      console.log('✓ Navigated to Articles Configuration');

      // Click "Rounds & Questions" tab
      const roundsTab = page.locator('button.tab-button:has-text("Rounds & Questions")');
      await expect(roundsTab).toBeVisible({ timeout: 10000 });
      await roundsTab.click();
      await page.waitForTimeout(2000);
      console.log('✓ Switched to Rounds & Questions tab');

      // Check existing configuration
      let roundRows = await page.locator('.round-row').all();
      const initialRoundsCount = roundRows.length;
      console.log(`✓ Existing configuration has ${initialRoundsCount} rounds`);

      const initialCounts: number[] = [];
      for (let i = 0; i < initialRoundsCount; i++) {
        const valText = await roundRows[i].locator('.counter-value').innerText();
        const val = parseInt(valText, 10);
        initialCounts.push(val);
        console.log(`  Existing Round ${i + 1}: ${val} questions`);
      }

      // For each existing round: Increase configured question count by 2
      const targetCounts: number[] = [];
      for (let i = 0; i < initialRoundsCount; i++) {
        const plusBtn = roundRows[i].locator('button.counter-btn:has(i.bi-plus)');
        await plusBtn.click();
        await page.waitForTimeout(250);
        await plusBtn.click();
        await page.waitForTimeout(250);

        const updatedValText = await roundRows[i].locator('.counter-value').innerText();
        const updatedVal = parseInt(updatedValText, 10);
        targetCounts.push(updatedVal);
        expect(updatedVal).toBe(initialCounts[i] + 2);
        console.log(`✓ Round ${i + 1} increased by 2: ${initialCounts[i]} -> ${updatedVal}`);
      }

      // Add one additional round
      console.log('Adding one additional round...');
      const addRoundBtn = page.locator('button.add-round-btn');
      await expect(addRoundBtn).toBeVisible();
      await addRoundBtn.click();
      await page.waitForTimeout(1000);

      // Verify that the new round appears
      roundRows = await page.locator('.round-row').all();
      expect(roundRows.length).toBe(initialRoundsCount + 1);
      const newRoundIndex = roundRows.length - 1;
      const newRoundRow = roundRows[newRoundIndex];
      const newRoundLabel = await newRoundRow.locator('.round-label').innerText();
      console.log(`✓ Added new round: "${newRoundLabel}"`);

      // Configure new round with 2 questions
      let newRoundVal = parseInt(await newRoundRow.locator('.counter-value').innerText(), 10) || 0;
      while (newRoundVal < 2) {
        await newRoundRow.locator('button.counter-btn:has(i.bi-plus)').click();
        await page.waitForTimeout(250);
        newRoundVal = parseInt(await newRoundRow.locator('.counter-value').innerText(), 10);
      }
      while (newRoundVal > 2) {
        await newRoundRow.locator('button.counter-btn:has(i.bi-dash)').click();
        await page.waitForTimeout(250);
        newRoundVal = parseInt(await newRoundRow.locator('.counter-value').innerText(), 10);
      }
      expect(newRoundVal).toBe(2);
      targetCounts.push(2);
      console.log(`✓ New round configured with ${newRoundVal} questions`);

      await page.screenshot({ path: path.join(screenshotsDir, 'step3-rounds-updated-before-save.png') });

      // Save updated article configuration
      const saveBtn = page.locator('button.btn-rounds-save:has-text("Save Changes")');
      await expect(saveBtn).toBeEnabled();
      console.log('Clicking "Save Changes"...');
      await saveBtn.click();

      // Verify configuration is saved successfully
      const saveToast = page.locator('.toast, [role="alert"], .toast-success');
      await expect(saveToast.first()).toBeVisible({ timeout: 15000 });
      const saveToastText = await saveToast.first().innerText();
      console.log(`✓ Saved configuration toast message: "${saveToastText}"`);

      await page.screenshot({ path: path.join(screenshotsDir, 'step3-rounds-saved-success.png') });

      // Reopen the configuration and confirm that all changes are retained
      console.log('Reopening configuration to verify persistence...');
      await page.goto('https://newsadmin.thedevdemo.in/settings/articles', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);

      const reopenRoundsTab = page.locator('button.tab-button:has-text("Rounds & Questions")');
      await expect(reopenRoundsTab).toBeVisible({ timeout: 10000 });
      await reopenRoundsTab.click();
      await page.waitForTimeout(2500);

      // Verify retained rounds count
      const persistedRows = await page.locator('.round-row').all();
      expect(persistedRows.length).toBe(targetCounts.length);
      console.log(`✓ Retained total rounds count: ${persistedRows.length}`);

      // Verify retained question count for each round
      for (let i = 0; i < persistedRows.length; i++) {
        const roundLbl = await persistedRows[i].locator('.round-label').innerText();
        const persistedCount = parseInt(await persistedRows[i].locator('.counter-value').innerText(), 10);
        expect(persistedCount).toBe(targetCounts[i]);
        console.log(`✓ Retained ${roundLbl}: ${persistedCount} questions (expected: ${targetCounts[i]})`);
      }

      await page.screenshot({ path: path.join(screenshotsDir, 'step3-persisted-configuration-verified.png') });
      console.log('✓ All changes verified and retained successfully!');
    });

  });

});
