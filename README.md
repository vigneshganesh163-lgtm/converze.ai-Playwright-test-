# Converze.AI Public Portal — Automated Test Results & Reports

This repository contains the full automated test suite results and execution reports for the **Converze.AI Public Portal** (`https://newsapp.thedevdemo.in`).

## 📊 Scenarios Summary

| Scenario | Total Users | Survey Mode | Key Objective & Critical Validation | Status |
|---|---|---|---|---|
| **Scenario 2** | 4 Users (4P) | Agree | Core Meeting flow, survey submission, token transfer, round progression | **PASSED** |
| **Scenario 3** | 8 Users (4P + 4G) | Skip Survey | Skip survey flow, auto role allotment (4P + 4G), dynamic guest count | **PASSED** |
| **Scenario 4** | 8 Users (4P + 4G) | 100% Oppose | **Critical:** Strictly 0 Pros questions (only Oppose questions delivered) | **PASSED** |
| **Scenario 5** | 12 Users (4P + 8G) | 100% Support | **Critical:** Strictly 0 Oppose questions (only Pros questions delivered) | **PASSED** |
| **Scenario 6** | 12 Users (4P + 8G) | 2 Support + 2 Oppose | **Critical:** Balanced delivery of both Pros AND Oppose questions | **PASSED** |

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
