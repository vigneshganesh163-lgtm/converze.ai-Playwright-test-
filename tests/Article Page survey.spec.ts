
import { test, expect } from '@playwright/test';

test('Converze - Login, Open Article and Submit Survey', async ({ page }) => {

  // STEP 1: Open login page
  await page.goto('/');

  // STEP 2: Enter login credentials
  await page.getByLabel(/email/i).fill('vignesh.ganesh163@gmail.com');

  await page.getByLabel(/password/i).fill('Vipvicky@123!');

  // STEP 3: Login
  await page.getByRole('button', {
    name: /login|sign in/i
  }).click();

  await expect(page).not.toHaveURL(/\/login/);

  console.log('Login successful');

  // STEP 4: Navigate to News Articles
  await page.getByRole('link', {
    name: /news|articles/i
  }).click();

  // STEP 5: Select an article
  await page.getByText('Todd Blanche Defends DOJ Alaska Election Lawsuit as Murkowski Pushes Back', {
    exact: true
  }).click();

  console.log('Article selected');

  // STEP 6: Verify article detail page
  await expect(
    page.getByText('Todd Blanche Defends DOJ Alaska Election Lawsuit as Murkowski Pushes Back', {
      exact: true
    })
  ).toBeVisible();

  // STEP 7: Wait for 20 seconds
  console.log('Waiting for survey question...');

  await page.waitForTimeout(20000);

  // STEP 8: Verify survey question
  const surveyQuestion = page.locator(
    'REPLACE_WITH_SURVEY_QUESTION_SELECTOR'
  );

  await expect(surveyQuestion).toBeVisible();

  console.log('Survey question displayed');

  // STEP 9: Select survey answer
  const surveyOptions = page.getByRole('radio');

  await expect(surveyOptions.first()).toBeVisible();

  await surveyOptions.first().check();

  console.log('Survey answer selected');

  // STEP 10: Submit survey
  await page.getByRole('button', {
    name: /submit|continue|next/i
  }).click();

  // STEP 11: Verify survey submission
  await expect(
    page.getByText(
      /submitted successfully|response recorded|thank you/i
    )
  ).toBeVisible();

  console.log('Survey submitted successfully');

});
