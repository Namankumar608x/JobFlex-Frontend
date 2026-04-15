const JOBFLEX_API = 'http://localhost:8000';

let detectedJobs = new Set();

chrome.runtime.onInstalled.addListener(() => {
  console.log('JobFlex extension installed');
  initStorage();
});

function initStorage() {
  chrome.storage.local.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.local.set({
        settings: {
          autoDetect: true,
          showNotifications: true,
          apiUrl: JOBFLEX_API,
        }
      });
    }
  });
}


async function getToken() {
  return new Promise(async (resolve) => {
    chrome.storage.local.get('user', async (result) => {
      const user = result.user;
      if (!user?.access) return resolve(null);

      try {
        const payload = JSON.parse(atob(user.access.split('.')[1]));
        const expiresAt = payload.exp * 1000; 
        const now = Date.now();

        console.log('Token expires at:', new Date(expiresAt).toISOString());
        console.log('Current time:', new Date(now).toISOString());
        console.log('Token expired?', now >= expiresAt);

        if (now < expiresAt) {
        
          return resolve(user.access);
        }

        
        console.log('Token expired, attempting refresh...');
        const apiUrl = await getApiUrl();
        const response = await fetch(`${apiUrl}/user/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: user.refresh }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Token refreshed successfully');

          const updatedUser = { ...user, access: data.access };
          chrome.storage.local.set({ user: updatedUser });
          return resolve(data.access);
        } else {
          console.log('Refresh token also expired, logging out');
          chrome.storage.local.remove('user');
          return resolve(null);
        }
      } catch (e) {
        console.error('Token check error:', e);
        return resolve(user.access);
      }
    });
  });
}

async function getApiUrl() {
  return new Promise(resolve => {
    chrome.storage.local.get('settings', (result) => {
      resolve(result.settings?.apiUrl || JOBFLEX_API);
    });
  });
}

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
  if (detectedJobs.has(jobData.link)) return;
  detectedJobs.add(jobData.link);

  chrome.action.setBadgeText({ text: '!', tabId: tab.id });
  chrome.action.setBadgeBackgroundColor({ color: '#6366f1', tabId: tab.id });

  if (settings.showNotifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '../icons/icon48.png',
      title: 'JobFlex: Job Detected!',
      message: `${jobData.jobrole || 'Job'} at ${jobData.company || 'Company'} — Click to save`,
      priority: 2,
    });
  }

  chrome.storage.session.set({ [`pending_${tab.id}`]: jobData });
}

// ─── Save Application ───
async function saveApplication(data) {
  const token = await getToken();
  const apiUrl = await getApiUrl();

  // Always save to local storage first
  const localResult = await saveToLocal(data);

  // If logged in, also save to backend
  if (token) {
    try {
      const payload = {
        jobrole: data.jobrole || data.jobTitle || '',
        company: data.company || '',
        link: data.link || data.url || '',
        status: data.status || 'Applied',
        platform: data.platform || '',
        location: data.location || '',
        notes: data.notes || '',
        id: data.id || null,
      };

      const response = await fetch(`${apiUrl}/api/applications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const backendData = await response.json();
        
        await updateLocalWithBackendId(localResult.application.id, backendData.application.APP_ID);
        return { success: true, application: { ...localResult.application, APP_ID: backendData.application.APP_ID } };
      }
    } catch (e) {
      console.warn('Backend save failed, kept locally:', e);
    }
  }

  return localResult;
}

async function saveToLocal(data) {
  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      const apps = result.applications || [];
      const newApp = {
        id: generateId(),
        jobrole: data.jobrole || data.jobTitle || '',
        company: data.company || '',
        link: data.link || data.url || '',
        status: data.status || 'Applied',
        platform: data.platform || '',
        location: data.location || '',
        notes: data.notes || '',
        jobNumber: data.id || null,
        createdAt: new Date().toISOString(),
        statusHistory: [{ status: data.status || 'Applied', date: new Date().toISOString() }],
      };
      apps.unshift(newApp);
      chrome.storage.local.set({ applications: apps }, () => {
        resolve({ success: true, application: newApp });
      });
    });
  });
}

async function updateLocalWithBackendId(localId, APP_ID) {
  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      const apps = result.applications || [];
      const idx = apps.findIndex(a => a.id === localId);
      if (idx !== -1) apps[idx].APP_ID = APP_ID;
      chrome.storage.local.set({ applications: apps }, resolve);
    });
  });
}


async function getApplications(filters = {}) {
  const token = await getToken();
  const apiUrl = await getApiUrl();

  if (token) {
    try {
      const response = await fetch(`${apiUrl}/api/applications/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        let apps = data.applications || [];

        if (filters.status) apps = apps.filter(a => a.status === filters.status);
        if (filters.search) {
          const q = filters.search.toLowerCase();
          apps = apps.filter(a =>
            (a.jobrole || '').toLowerCase().includes(q) ||
            (a.company || '').toLowerCase().includes(q)
          );
        }
        return apps;
      }
    } catch (e) {
      console.warn('Backend fetch failed, using local:', e);
    }
  }

  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      let apps = result.applications || [];
      if (filters.status) apps = apps.filter(a => a.status === filters.status);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        apps = apps.filter(a =>
          (a.jobrole || '').toLowerCase().includes(q) ||
          (a.company || '').toLowerCase().includes(q)
        );
      }
      resolve(apps);
    });
  });
}

async function updateApplication(id, data) {
  const token = await getToken();
  const apiUrl = await getApiUrl();

 
  if (token && data.APP_ID) {
    try {
      await fetch(`${apiUrl}/api/applications/${data.APP_ID}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Backend update failed:', e);
    }
  }

  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      const apps = result.applications || [];
      const idx = apps.findIndex(a => a.id === id);
      if (idx === -1) return resolve({ success: false });

      const oldStatus = apps[idx].status;
      apps[idx] = { ...apps[idx], ...data, updatedAt: new Date().toISOString() };

      if (data.status && data.status !== oldStatus) {
        apps[idx].statusHistory = apps[idx].statusHistory || [];
        apps[idx].statusHistory.push({ status: data.status, date: new Date().toISOString() });
      }

      chrome.storage.local.set({ applications: apps }, () => {
        resolve({ success: true, application: apps[idx] });
      });
    });
  });
}
async function deleteApplication(id) {
  const token = await getToken();
  const apiUrl = await getApiUrl();
  const apps = await new Promise(r =>
    chrome.storage.local.get('applications', res => r(res.applications || []))
  );
  const app = apps.find(a => a.id === id);

  if (token && app?.APP_ID) {
    try {
      await fetch(`${apiUrl}/api/applications/${app.APP_ID}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (e) {
      console.warn('Backend delete failed:', e);
    }
  }

  return new Promise((resolve) => {
    chrome.storage.local.get('applications', (result) => {
      const filtered = (result.applications || []).filter(a => a.id !== id);
      chrome.storage.local.set({ applications: filtered }, () => resolve({ success: true }));
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

  let responded = 0;
  let responseDays = [];
  const companyCounts = {};
  const statusCounts = {};

  for (const app of apps) {
    const dateField = app.createdAt || app.changed_at;
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    if (new Date(dateField) > thirtyDaysAgo) stats.recentCount++;
    if (['Shortlisted', 'Rejected', 'Hired', 'Interview', 'Offer'].includes(app.status)) {
      responded++;
      if (app.statusHistory && app.statusHistory.length > 1) {
        const applied = new Date(app.statusHistory[0].date);
        const response = new Date(app.statusHistory[1].date);
        const days = Math.round((response - applied) / (1000 * 60 * 60 * 24));
        if (days >= 0) responseDays.push(days);
      }
    }
    if (app.company) companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
  }

  stats.byStatus = statusCounts;
  if (apps.length > 0) stats.responseRate = Math.round((responded / apps.length) * 100);
  if (responseDays.length > 0) stats.avgResponseDays = Math.round(responseDays.reduce((a, b) => a + b, 0) / responseDays.length);
  stats.topCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

  return stats;
}

async function handleLogin(credentials) {
  const apiUrl = await getApiUrl();
  try {
    const response = await fetch(`${apiUrl}/user/extension-login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      await new Promise(r => chrome.storage.local.set({ user: data }, r));
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'Login failed' };
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

chrome.notifications.onClicked.addListener(() => {
  chrome.action.openPopup();
});

chrome.action.onClicked.addListener((tab) => {
  chrome.action.setBadgeText({ text: '', tabId: tab.id });
});