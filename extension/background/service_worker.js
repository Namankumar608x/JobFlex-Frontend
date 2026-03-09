// JobFlex Background Service Worker

const JOBFLEX_API = 'http://localhost:8000/api'; // Update to production URL

// State
let detectedJobs = new Set(); // Track already-detected URLs this session

chrome.runtime.onInstalled.addListener(() => {
  console.log('JobFlex extension installed');
  initStorage();
});

function initStorage() {
  chrome.storage.local.get(['applications', 'settings', 'user'], (result) => {
    if (!result.applications) {
      chrome.storage.local.set({ applications: [] });
    }
    if (!result.settings) {
      chrome.storage.local.set({
        settings: {
          autoDetect: true,
          showNotifications: true,
          apiUrl: JOBFLEX_API,
          syncWithBackend: false,
        }
      });
    }
  });
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'JOB_PAGE_DETECTED':
      handleJobDetection(message.data, sender.tab);
      sendResponse({ received: true });
      break;

    case 'SAVE_APPLICATION':
      saveApplication(message.data).then(result => sendResponse(result));
      return true;

    case 'GET_APPLICATIONS':
      getApplications(message.filters).then(apps => sendResponse(apps));
      return true;

    case 'UPDATE_APPLICATION':
      updateApplication(message.id, message.data).then(result => sendResponse(result));
      return true;

    case 'DELETE_APPLICATION':
      deleteApplication(message.id).then(result => sendResponse(result));
      return true;

    case 'GET_STATS':
      getStats().then(stats => sendResponse(stats));
      return true;

    case 'SYNC_WITH_BACKEND':
      syncWithBackend().then(result => sendResponse(result));
      return true;

    case 'GET_SETTINGS':
      chrome.storage.local.get('settings', (result) => sendResponse(result.settings));
      return true;

    case 'UPDATE_SETTINGS':
      chrome.storage.local.set({ settings: message.settings }, () => sendResponse({ success: true }));
      return true;

    case 'LOGIN':
      handleLogin(message.credentials).then(result => sendResponse(result));
      return true;

    case 'LOGOUT':
      handleLogout().then(result => sendResponse(result));
      return true;

    case 'GET_USER':
      chrome.storage.local.get('user', (result) => sendResponse(result.user || null));
      return true;
  }
});

async function handleJobDetection(jobData, tab) {
  const settings = await new Promise(resolve =>
    chrome.storage.local.get('settings', r => resolve(r.settings || {}))
  );

  if (!settings.autoDetect) return;

  // Avoid duplicate detections
  if (detectedJobs.has(jobData.url)) return;
  detectedJobs.add(jobData.url);

  // Check if already saved
  const apps = await getApplications();
  const alreadySaved = apps.some(a => a.url === jobData.url);
  if (alreadySaved) return;

  // Update badge
  chrome.action.setBadgeText({ text: '!', tabId: tab.id });
  chrome.action.setBadgeBackgroundColor({ color: '#6366f1', tabId: tab.id });

  // Show notification
  if (settings.showNotifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon48.png',
      title: 'JobFlex: Job Detected!',
      message: `${jobData.jobTitle || 'Job'} at ${jobData.company || 'Company'} — Click to save`,
      priority: 2,
    });
  }

  // Store pending detection
  chrome.storage.session.set({
    [`pending_${tab.id}`]: jobData
  });
}

async function saveApplication(data) {
  return new Promise((resolve) => {
    chrome.storage.local.get('applications', async (result) => {
      const apps = result.applications || [];
      const newApp = {
        id: generateId(),
        ...data,
        status: data.status || 'Applied',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: data.notes || '',
        emailLogs: [],
        statusHistory: [
          { status: data.status || 'Applied', date: new Date().toISOString() }
        ],
      };

      apps.unshift(newApp);
      chrome.storage.local.set({ applications: apps }, async () => {
        // Try to sync with backend
        const settings = await new Promise(r =>
          chrome.storage.local.get('settings', res => r(res.settings || {}))
        );

        if (settings.syncWithBackend) {
          try {
            await syncApplicationToBackend(newApp);
          } catch (e) {
            console.warn('Backend sync failed, saved locally:', e);
          }
        }

        resolve({ success: true, application: newApp });
      });
    });
  });
}

async function getApplications(filters = {}) {
  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      let apps = result.applications || [];

      if (filters.status) {
        apps = apps.filter(a => a.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        apps = apps.filter(a =>
          (a.jobTitle || '').toLowerCase().includes(q) ||
          (a.company || '').toLowerCase().includes(q)
        );
      }

      resolve(apps);
    });
  });
}

async function updateApplication(id, data) {
  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      const apps = result.applications || [];
      const idx = apps.findIndex(a => a.id === id);
      if (idx === -1) return resolve({ success: false, error: 'Not found' });

      const oldStatus = apps[idx].status;
      apps[idx] = { ...apps[idx], ...data, updatedAt: new Date().toISOString() };

      // Track status changes
      if (data.status && data.status !== oldStatus) {
        apps[idx].statusHistory = apps[idx].statusHistory || [];
        apps[idx].statusHistory.push({
          status: data.status,
          date: new Date().toISOString()
        });
      }

      chrome.storage.local.set({ applications: apps }, () => {
        resolve({ success: true, application: apps[idx] });
      });
    });
  });
}

async function deleteApplication(id) {
  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      const apps = (result.applications || []).filter(a => a.id !== id);
      chrome.storage.local.set({ applications: apps }, () => {
        resolve({ success: true });
      });
    });
  });
}

async function getStats() {
  const apps = await getApplications();
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const stats = {
    total: apps.length,
    byStatus: {},
    recentCount: 0,
    responseRate: 0,
    avgResponseDays: null,
    topCompanies: [],
  };

  const statusCounts = {};
  let responded = 0;
  let responseDays = [];
  const companyCounts = {};

  for (const app of apps) {
    // Status counts
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;

    // Recent
    if (new Date(app.createdAt) > thirtyDaysAgo) stats.recentCount++;

    // Response tracking
    if (['Shortlisted', 'Rejected', 'Hired', 'Interview'].includes(app.status)) {
      responded++;
      if (app.statusHistory && app.statusHistory.length > 1) {
        const applied = new Date(app.statusHistory[0].date);
        const response = new Date(app.statusHistory[1].date);
        const days = Math.round((response - applied) / (1000 * 60 * 60 * 24));
        if (days >= 0) responseDays.push(days);
      }
    }

    // Company counts
    if (app.company) {
      companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
    }
  }

  stats.byStatus = statusCounts;
  if (apps.length > 0) {
    stats.responseRate = Math.round((responded / apps.length) * 100);
  }
  if (responseDays.length > 0) {
    stats.avgResponseDays = Math.round(responseDays.reduce((a, b) => a + b, 0) / responseDays.length);
  }
  stats.topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return stats;
}

async function syncWithBackend() {
  const settings = await new Promise(r =>
    chrome.storage.local.get('settings', res => r(res.settings || {}))
  );
  const apps = await getApplications();

  try {
    const response = await fetch(`${settings.apiUrl || JOBFLEX_API}/applications/sync/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applications: apps }),
    });
    const data = await response.json();
    return { success: true, synced: data.synced };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function syncApplicationToBackend(app) {
  const settings = await new Promise(r =>
    chrome.storage.local.get('settings', res => r(res.settings || {}))
  );
  const user = await new Promise(r =>
    chrome.storage.local.get('user', res => r(res.user || null))
  );

  const response = await fetch(`${settings.apiUrl || JOBFLEX_API}/applications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(user?.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
    },
    body: JSON.stringify(app),
  });

  if (!response.ok) throw new Error('Backend sync failed');
  return await response.json();
}

async function handleLogin(credentials) {
  try {
    const settings = await new Promise(r =>
      chrome.storage.local.get('settings', res => r(res.settings || {}))
    );
    const response = await fetch(`${settings.apiUrl || JOBFLEX_API}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (response.ok) {
      await new Promise(r => chrome.storage.local.set({ user: data }, r));
      return { success: true, user: data };
    }
    return { success: false, error: data.detail || 'Login failed' };
  } catch (e) {
    return { success: false, error: 'Cannot connect to server' };
  }
}

async function handleLogout() {
  await new Promise(r => chrome.storage.local.remove('user', r));
  return { success: true };
}

function generateId() {
  return `jf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle notification clicks
chrome.notifications.onClicked.addListener(() => {
  chrome.action.openPopup();
});

// Clear badge when popup opens
chrome.action.onClicked.addListener((tab) => {
  chrome.action.setBadgeText({ text: '', tabId: tab.id });
});
