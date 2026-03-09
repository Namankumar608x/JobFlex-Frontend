# JobFlex Chrome Extension

A powerful Chrome extension for automatically detecting and tracking job applications as you browse.

## Features

- 🔍 **Auto-detection** — Scans job pages on LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, Workday, Ashby, SmartRecruiters, and 20+ platforms
- 📋 **Smart extraction** — Pulls job title, company, location, salary, and job type automatically  
- ✏️ **Manual entry** — Add jobs that weren't auto-detected
- 📊 **Analytics dashboard** — Response rate, avg response time, status breakdowns, top companies
- 🔔 **Desktop notifications** — Get notified when a job page is detected
- 🔄 **Backend sync** — Optionally sync with your JobFlex Django API
- 📥 **Export** — Download all applications as JSON

## Installation (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `jobflex-extension/` folder
5. The JobFlex icon will appear in your toolbar

## Supported Platforms

Auto-detects jobs on:
- LinkedIn Jobs, Indeed, Glassdoor
- Greenhouse, Lever, Workday, Ashby HQ, SmartRecruiters
- Any page with job-related URL patterns (/jobs/, /careers/, /apply/, etc.)

## Backend Integration

To connect with your Django backend:
1. Open Settings in the extension
2. Enable **Sync with backend**  
3. Enter your API URL (e.g., `http://localhost:8000/api`)

### Expected API Endpoints
```
POST   /api/auth/login/           — User login
POST   /api/applications/         — Create application
POST   /api/applications/sync/    — Bulk sync
```

## File Structure

```
jobflex-extension/
├── manifest.json              # Extension config (Manifest V3)
├── background/
│   └── service_worker.js      # Background logic, storage, sync
├── content/
│   └── detector.js            # Page detection & data extraction
├── popup/
│   ├── popup.html             # Extension popup UI
│   ├── popup.css              # Dark premium UI styles
│   └── popup.js               # Popup logic & state management
└── icons/
    ├── icon16.png ... icon128.png
```

## Status Values

| Status | Meaning |
|--------|---------|
| Applied | Application submitted |
| Shortlisted | Moved to shortlist |
| Interview | Interview scheduled |
| Offer | Offer received |
| Hired | Accepted offer |
| Rejected | Application rejected |
