# Converze.ai - Article Survey Automation Test

This test suite automates the end-to-end article reading and survey submission flow on [Converze.ai](https://newsapp.thedevdemo.in/home).

## Test Scenario Overview

1. **Authentication / Home Navigation**:
   - Opens `https://newsapp.thedevdemo.in/home`.
   - Automatically detects if authentication is required (or if redirected to `/login`).
   - Authenticates using dummy credentials via guest login or email/password form.
   - Confirms navigation to the Home page.
2. **Article Selection**:
   - Finds the article titled: `"Todd Blanche Defends DOJ Alaska Election Lawsuit as Murkowski Pushes Back"`.
   - Clicks on the article and navigates to the detailed view (`/home/individual-screen/<article-id>`).
3. **Article Reading & Scrolling**:
   - Confirms the article title on the detail page.
   - Smoothly scrolls through the content simulating reader activity.
4. **Survey Modal Wait**:
   - Waits for the 20–30 second reading timer that triggers the article survey popup.
5. **Survey Response**:
   - Locates all survey question cards (`.asd-question-card`).
   - Automatically answers all 10 questions by selecting an answer option (`Strongly Agree` / `Agree`).
6. **Submission & Verification**:
   - Clicks the **"Submit Survey"** button.
   - Asserts the survey modal is dismissed and records the submission.
   - Captures a completion screenshot, full trace, and recorded video.

---

## How to Run

### Run the Article Survey test:
```bash
npm run test:survey
```
or directly via Playwright:
```bash
npx playwright test tests/article-survey --project=chromium
```

### View the HTML Report & Recorded Videos:
```bash
npm run report
```
or:
```bash
npx playwright show-report
```

---

## Artifacts & Outputs

- **HTML Report**: `playwright-report/index.html` (interactive report with step-by-step breakdown and embedded video player).
- **Recorded Video**: `test-results/article-survey-*/video.webm`.
- **Trace Viewer**: `test-results/article-survey-*/trace.zip`.
- **Screenshots**: `test-results/survey-submitted-success.png`.
