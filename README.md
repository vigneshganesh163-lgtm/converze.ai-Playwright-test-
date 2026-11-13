# Converze.AI Public Portal — Automated Test Results & Reports

This repository contains the full automated test suite results and execution reports for the **Converze.AI Public Portal** (`https://newsapp.thedevdemo.in`).

## 📊 Published Test Workflows Summary

| Workflow / Scenario | Scope / Users | Key Objective & Critical Validation | Status | Report Link |
|---|---|---|---|---|
| **Admin Portal Workflow** | Admin Panel (`admin.thedevdemo.in`) | Login, Article & Category setup, AI Prompts (30 Pros + 30 Oppose + 10 Survey), Round Distribution & DB persistence | **PASSED** | [View Report](admin-test-report/all-in-one-report.html) |
| **Scenario 2** | 4 Users (4P) | Core Meeting flow, survey submission (Agree), token transfer, round progression | **PASSED** | [View Report](Scenario%202%20report/Scenario%202%20with%20survey%20agree%20%20-%204%20participants.html) |
| **Scenario 3** | 8 Users (4P + 4G) | Skip survey flow, auto role allotment (4P + 4G), dynamic guest badge updates | **PASSED** | [View Report](scenario-3-report/all-in-one-report.html) |
| **Scenario 4** | 8 Users (4P + 4G) | **Critical:** Strictly 0 Pros questions (100% Oppose questions delivered) | **PASSED** | [View Report](scenario-4-report/all-in-one-report.html) |
| **Scenario 5** | 12 Users (4P + 8G) | **Critical:** Strictly 0 Oppose questions (100% Pros questions delivered), 8 guest permission lockdown | **PASSED** | [View Report](scenario-5-report/all-in-one-report.html) |

*(Note: Scenario 6 is currently undergoing test refinement to verify active browser debate rounds before publishing.)*

---

## 🚀 How to Run Locally

You can run the web server locally using Node.js:

```bash
node server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 Deploy to Render

### Option 1: Render Static Site (Recommended — 100% Free)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Static Site**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name:** `converze-ai-test-reports`
   - **Branch:** `main`
   - **Build Command:** *(Leave empty)*
   - **Publish Directory:** `.`
5. Click **Create Static Site**.
6. Render will generate a live public URL (e.g., `https://converze-ai-test-reports.onrender.com`).

### Option 2: Render Web Service (Using Node.js server.js)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name:** `converze-ai-test-reports`
   - **Runtime:** `Node`
   - **Build Command:** *(Leave empty)*
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Click **Deploy Web Service**.
