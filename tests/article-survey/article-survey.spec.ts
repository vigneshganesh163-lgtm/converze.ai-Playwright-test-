import { test, expect } from '@playwright/test';

/**
 * Test Suite: NewsApp Converze.ai - Article Survey Flow
 * 
 * Scenario:
 * 1. Navigate to https://newsapp.thedevdemo.in/home
 * 2. In case of login requirement / redirection, authenticate using dummy credentials
 * 3. Verify Home page displays article list
 * 4. Click target article: "Todd Blanche Defends DOJ Alaska Election Lawsuit as Murkowski Pushes Back"
 * 5. Verify Article Detail page opens
 * 6. Scroll through article content to view details
 * 7. Wait for 20-30 seconds for the survey questions modal to appear
 * 8. Answer all questions in the survey
 * 9. Submit / save the survey
 * 10. Verify successful survey submission and modal dismissal
 */

test.describe('Article Survey Flow', () => {
  // Allow sufficient time for the 20-30s survey timer and user interactions
  test.setTimeout(120 * 1000);

  test('should open article, scroll details, wait for survey, answer all questions and submit', async ({ page }) => {
    const targetArticleTitle = 'Todd Blanche Defends DOJ Alaska Election Lawsuit as Murkowski Pushes Back';
    const dummyUserName = 'Playwright QA Tester';

    // -------------------------------------------------------------------------
    // STEP 1: Navigate to Home Page & Handle Login with Dummy Credentials
    // -------------------------------------------------------------------------
    await test.step('Navigate to Home page and handle login if redirected', async () => {
      console.log('Navigating to https://newsapp.thedevdemo.in/home...');
      await page.goto('/home', { waitUntil: 'domcontentloaded' });

      const targetArticleLocator = page.getByText(targetArticleTitle, { exact: false }).first();
      const loginIndicator = page.locator('text=Sign in to discover');

      // Race between article being rendered on /home and redirection to login/auth
      await Promise.race([
        targetArticleLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {}),
        page.waitForURL(/\/login|\/guest/, { timeout: 5000 }).catch(() => {}),
        loginIndicator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
      ]);

      const currentUrl = page.url();
      const isLoginVisible = await loginIndicator.isVisible().catch(() => false);
      const isArticleVisible = await targetArticleLocator.isVisible().catch(() => false);

      console.log(`Current URL: ${currentUrl}, Login Visible: ${isLoginVisible}, Article Visible: ${isArticleVisible}`);

      if (!isArticleVisible || currentUrl.includes('/login') || currentUrl.includes('/guest') || isLoginVisible) {
        console.log('Login required. Authenticating using dummy credentials...');

        // If email & password fields are present on the login page, support them
        const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
        const passwordInput = page.locator('input[type="password"]').first();

        if (await emailInput.isVisible().catch(() => false) && await passwordInput.isVisible().catch(() => false)) {
          console.log('Filling dummy email & password...');
          await emailInput.fill('dummy.tester@example.com');
          await passwordInput.fill('DummyPassword123!');
          const submitBtn = page.getByRole('button', { name: /login|sign in/i }).first();
          await submitBtn.click();
        } else {
          // Navigate to guest login to authenticate with dummy credentials
          console.log('Navigating to /guest for dummy credential login...');
          await page.goto('/guest', { waitUntil: 'domcontentloaded' });
          const nameInput = page.locator('input').first();
          await nameInput.waitFor({ state: 'visible', timeout: 10000 });
          await nameInput.fill(dummyUserName);

          const continueBtn = page.getByRole('button', { name: /continue/i }).first();
          await continueBtn.click();
        }

        // Wait for redirect to /home after authentication
        await page.waitForURL('**/home', { timeout: 15000 });
        console.log('Successfully logged in with dummy credentials and redirected to /home');
      }

      await expect(page).toHaveURL(/\/home/);
      console.log('Active URL:', page.url());
    });

    // -------------------------------------------------------------------------
    // STEP 2: Find and Click the Target Article
    // -------------------------------------------------------------------------
    await test.step(`Find and click article: "${targetArticleTitle}"`, async () => {
      console.log(`Locating article: "${targetArticleTitle}"...`);

      const articleLocator = page.getByText(targetArticleTitle, { exact: false }).first();
      await articleLocator.waitFor({ state: 'visible', timeout: 20000 });
      await expect(articleLocator).toBeVisible();

      console.log('Article found. Clicking to open detail page...');
      await articleLocator.click();

      // Wait for article detail page URL
      await page.waitForURL(/\/home\/individual-screen\//, { timeout: 15000 });
      console.log('Navigated to Article Detail page:', page.url());
    });

    // -------------------------------------------------------------------------
    // STEP 3: Verify Detail Page and Scroll to See Details
    // -------------------------------------------------------------------------
    await test.step('Verify article detail page and scroll through content', async () => {
      // Verify article title is visible on detail page
      const detailTitle = page.getByText(targetArticleTitle, { exact: false }).first();
      await expect(detailTitle).toBeVisible();
      console.log('Article title verified on detail page');

      // Scroll smoothly down the article to read content
      console.log('Scrolling down to read article details...');
      for (let i = 1; i <= 5; i++) {
        await page.evaluate((step) => window.scrollBy({ top: 400 * step, behavior: 'smooth' }), i);
        await page.waitForTimeout(1000);
      }
      console.log('Finished scrolling article details.');
    });

    // -------------------------------------------------------------------------
    // STEP 4: Wait 20-30 Seconds for Survey Question to be Displayed
    // -------------------------------------------------------------------------
    await test.step('Wait for 20-30 seconds for survey questions to appear', async () => {
      console.log('Waiting for survey modal to trigger (20-30 second reading timer)...');

      const submitSurveyBtn = page.getByRole('button', { name: /Submit Survey/i });
      
      // The survey API and modal are triggered after ~20 seconds of reading
      await submitSurveyBtn.waitFor({ state: 'visible', timeout: 45000 });
      await expect(submitSurveyBtn).toBeVisible();
      console.log('Survey question modal is now displayed!');
    });

    // -------------------------------------------------------------------------
    // STEP 5: Answer All Survey Questions
    // -------------------------------------------------------------------------
    await test.step('Answer all survey questions', async () => {
      const questionCards = page.locator('.asd-question-card');
      const totalQuestions = await questionCards.count();
      console.log(`Detected ${totalQuestions} survey questions.`);
      expect(totalQuestions).toBeGreaterThan(0);

      for (let i = 0; i < totalQuestions; i++) {
        const questionCard = questionCards.nth(i);
        const questionText = await questionCard.locator('h2, .asd-question-heading').innerText().catch(() => `Question ${i + 1}`);
        console.log(`[Q${i + 1}]: ${questionText.trim().replace(/\n+/g, ' ')}`);

        // Select an answer option (e.g., "Agree" or "Strongly Agree")
        const optionButton = questionCard.getByRole('button', { name: /Agree|Strongly Agree|Neutral|Disagree/i }).first();
        await optionButton.scrollIntoViewIfNeeded();
        await optionButton.click();
        await page.waitForTimeout(250);
        console.log(`  -> Selected option for Question ${i + 1}`);
      }

      console.log('All survey questions answered successfully.');
    });

    // -------------------------------------------------------------------------
    // STEP 6: Save / Submit Survey and Verify Submission
    // -------------------------------------------------------------------------
    await test.step('Submit the survey and verify completion', async () => {
      const submitSurveyBtn = page.getByRole('button', { name: /Submit Survey/i });
      await submitSurveyBtn.scrollIntoViewIfNeeded();
      await expect(submitSurveyBtn).toBeVisible();

      console.log('Clicking "Submit Survey" button...');
      await submitSurveyBtn.click();

      // Verify that survey modal is closed / submitted
      await expect(submitSurveyBtn).toBeHidden({ timeout: 15000 });
      console.log('Survey successfully submitted and modal dismissed!');

      // Capture a screenshot verifying post-survey state
      await page.screenshot({ path: 'test-results/survey-submitted-success.png', fullPage: false });
      console.log('Saved screenshot of completed survey state.');
    });
  });
});
