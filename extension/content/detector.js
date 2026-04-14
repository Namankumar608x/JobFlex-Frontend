// JobFlex Content Script - Job Application Page Detector
// Detection strategy:
//   1. Strict Blacklist (localhost, Google, etc.) -> NEVER fire
//   2. Explicit Bypass (URL contains job ID) -> FIRE
//   3. Strict Whitelist (Global boards, ATS, Regional boards) -> FIRE
//   4. Careers Subdomain check -> FIRE

(function () {
  'use strict';

  // ─── 1. STRICT BLACKLIST ───────────────────────────────────────────────────
  const BLACKLISTED_HOSTS = [
    'localhost', '127.0.0.1', '0.0.0.0',
    'google.', 'bing.com', 'yahoo.com', 'duckduckgo.com', 'baidu.com', // Search engines
    'github.com', 'gitlab.com', 'stackoverflow.com', 'bitbucket.org',  // Dev sites
    'wikipedia.org', 'reddit.com', 'youtube.com', 'quora.com',         // Generic content
    'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'tiktok.com'
  ];

  const SEARCH_URL_PATTERNS = [
    /[?&]q=/i, /[?&]query=/i, /[?&]search=/i, /\/search\?/i, /\/search\//i,
  ];

  // ─── 2. MASSIVE WHITELIST ──────────────────────────────────────────────────
  const WHITELISTED_DOMAINS = [
    // Global Job Boards
    'linkedin.com/jobs', 'indeed.com', 'glassdoor.com', 'monster.com',
    'ziprecruiter.com', 'dice.com', 'simplyhired.com', 'careerbuilder.com',
    'wellfound.com', 'angel.co/jobs', 'jooble.org', 'adzuna.com',
    
    // Remote & Tech Specific
    'weworkremotely.com', 'remote.co', 'remoteok.com', 'flexjobs.com',
    'otta.com', 'builtin.com', 'themuse.com', 'ycombinator.com/jobs',
    
    // India-Specific Job Boards
    'naukri.com', 'foundit.in', 'shine.com', 'instahyre.com', 
    'internshala.com', 'apna.co', 'hirist.com', 'iimjobs.com', 
    'cutshort.io', 'freshersworld.com', 'updazz.com', 'hasjob.co',

    // Applicant Tracking Systems (ATS) - where companies host their careers pages
    'greenhouse.io', 'lever.co', 'workday.com', 'myworkdayjobs.com',
    'smartrecruiters.com', 'ashbyhq.com', 'icims.com', 'jobvite.com',
    'taleo.net', 'successfactors.', 'bamboohr.com', 'workable.com',
    'recruitee.com', 'teamtailor.com', 'breezy.hr', 'freshteam.com',
    'pinpointhq.com', 'rippling.com/jobs', 'dover.com',

    // Major Tech Giants (Direct careers pages)
    'careers.microsoft.com', 'amazon.jobs', 'careers.google.com',
    'jobs.apple.com', 'metacareers.com', 'jobs.netflix.com', 'careers.ibm.com'
  ];

  // ─── 3. DATA EXTRACTORS FOR FAMOUS PLATFORMS ───────────────────────────────
  // Note: If a platform isn't here, the generic fallback at the bottom will still catch it.
  const KNOWN_PLATFORMS = {
    'linkedin.com': {
      name: 'LinkedIn',
      jobTitle: ['.job-details-jobs-unified-top-card__job-title', 'h1.t-24'],
      company: ['.job-details-jobs-unified-top-card__company-name', '.topcard__org-name-link'],
      location: ['.job-details-jobs-unified-top-card__bullet', '.topcard__flavor--bullet'],
    },
    'indeed.com': {
      name: 'Indeed',
      jobTitle: ['h1.jobsearch-JobInfoHeader-title', '[data-testid="jobsearch-JobInfoHeader-title"]'],
      company: ['.jobsearch-CompanyInfoContainer a', '[data-testid="inlineHeader-companyName"]'],
      location: ['.jobsearch-JobInfoHeader-subtitle .icl-u-xs-mt--xs', '[data-testid="inlineHeader-companyLocation"]'],
    },
    'glassdoor.com': {
      name: 'Glassdoor',
      jobTitle: ['[data-test="job-title"]', '.css-1j389vi'],
      company: ['[data-test="employer-name"]', '.css-16nw49e'],
      location: ['[data-test="location"]', '.css-56kyx5'],
    },
    'naukri.com': {
      name: 'Naukri',
      jobTitle: ['h1.jd-header-title', '.jd-header-title', 'h1'],
      company: ['.jd-header-comp-name a', '.comp-name'],
      location: ['.location', '[data-testid="job-location"]'],
    },
    'foundit.in': {
      name: 'Foundit',
      jobTitle: ['h1', '.job-tittle h1'],
      company: ['.comp-name', '.company-name'],
      location: ['.loc-link', '.location'],
    },
    'instahyre.com': {
      name: 'Instahyre',
      jobTitle: ['h1', '.job-title'],
      company: ['.company-name', '.org-name'],
      location: ['.location', '.job-location'],
    },
    'internshala.com': {
      name: 'Internshala',
      jobTitle: ['.profile', 'h1.heading_4_5'],
      company: ['.company-name', 'a.link_display_like_text'],
      location: ['.location_link', '.location'],
    },
    'wellfound.com': {
      name: 'Wellfound',
      jobTitle: ['h2.styles_title__18T3n', 'h1', '.styles_jobTitle__3d2dO'],
      company: ['h1.styles_name__2TfK5', '.styles_companyName__3G8Hk'],
      location: ['.styles_location__2G_bV'],
    },
    'greenhouse.io': {
      name: 'Greenhouse',
      jobTitle: ['h1.app-title', '.job-title'],
      company: ['.company-name', 'h2.company-name'],
      location: ['.location', '.job-location'],
    },
    'lever.co': {
      name: 'Lever',
      jobTitle: ['.posting-headline h2', '.role-title'],
      company: ['.main-header-logo img[alt]', '.company-name'],
      location: ['.posting-categories .location', '.location'],
    },
    'workday.com': {
      name: 'Workday',
      jobTitle: ['[data-automation-id="jobPostingHeader"]', 'h2.gwt-Label'],
      company: ['[data-automation-id="jobPostingCompanyName"]', '.WFIR'],
      location: ['[data-automation-id="locations"]', '.jobPostingLocation'],
    },
    'careers.microsoft.com': {
      name: 'Microsoft',
      jobTitle: ['.ms-DocumentCard-title', 'h1[class*="JobTitle"]', '[data-automation="job-title"]', '.atm-c-heading', 'h1'],
      company: [],  // Hardcoded in extraction logic
      location: ['[data-automation="job-location"]', '.ms-List-cell .location', '[class*="location"] span:last-child'],
      jobNumber: ['[data-automation="job-id"]', '.ms-List-cell [class*="jobId"]', 'span[class*="JobNumber"]'],
    },
    'amazon.jobs': {
      name: 'Amazon',
      jobTitle: ['h1.title', '.job-title', 'h1'],
      company: [], // Hardcoded in extraction logic
      location: ['.location', '.job-location'],
    },
  };

  // ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

  function getCurrentPlatform() {
    const hostname = window.location.hostname.replace('www.', '');
    for (const [domain, config] of Object.entries(KNOWN_PLATFORMS)) {
      if (hostname.includes(domain)) {
        return { domain, config }; 
      }
    }
    return null;
  }

  function extractTextFromSelectors(selectors) {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) {
          const text = (el.getAttribute('alt') || el.textContent || '').trim();
          if (text) return text;
        }
      } catch (e) {}
    }
    return null;
  }

  // ─── GATEKEEPER LOGIC ────────────────────────────────────────────────────────
  
  function isJobPage() {
    const host = window.location.hostname.toLowerCase();
    const url = window.location.href.toLowerCase();

    // 1. Check Blacklist FIRST
    if (BLACKLISTED_HOSTS.some(b => host.includes(b))) return false;

    // 2. Explicit Job ID bypass (Handles split-screen UI on sites like Microsoft/LinkedIn)
    const hasExplicitJobId = /[?&](jobId|job_id|reqId|job|currentJobId)=/i.test(url) || /\/job\//i.test(url);
    if (hasExplicitJobId) return true;

    // 3. Kill generic search URLs
    if (SEARCH_URL_PATTERNS.some(p => p.test(url))) return false;

    // 4. Check Whitelist
    if (WHITELISTED_DOMAINS.some(w => url.includes(w) || host.includes(w))) return true;

    // 5. Check for common subdomain structures (e.g., careers.company.com)
    const parts = host.split('.');
    if (parts.length >= 3 && (parts[0] === 'careers' || parts[0] === 'jobs')) return true;

    return false;
  }

  // ─── EXTRACTION LOGIC ────────────────────────────────────────────────────────

  function extractJobData() {
    const platform = getCurrentPlatform();
    let jobTitle = null;
    let company = null;
    let location = null;
    let jobNumber = null;

    if (platform) {
      const { config, domain } = platform;
      jobTitle = extractTextFromSelectors(config.jobTitle || []);
      company = extractTextFromSelectors(config.company || []);
      location = extractTextFromSelectors(config.location || []);

      if (config.jobNumber) {
        const rawJobNum = extractTextFromSelectors(config.jobNumber);
        if (rawJobNum) {
          const numMatch = rawJobNum.match(/\d+/);
          jobNumber = numMatch ? parseInt(numMatch[0]) : null;
        }
      }

      if (domain === 'careers.microsoft.com' && !company) company = 'Microsoft';
      if (domain === 'amazon.jobs' && !company) company = 'Amazon';

      if (location && location.includes(',')) {
        location = location.split(',').pop().trim();
      }
    }

    // Generic Fallbacks
    if (!jobTitle) {
      const h1 = document.querySelector('h1');
      if (h1) jobTitle = h1.textContent.trim();
    }

    if (!company) {
      const metaCompany = document.querySelector('meta[property="og:site_name"]');
      if (metaCompany) company = metaCompany.getAttribute('content');
    }

    if (!location) {
      const locationEl = document.querySelector('[class*="location"], [data-testid*="location"], [id*="location"]');
      if (locationEl) location = locationEl.textContent.trim();
    }

    const bodyText = document.body.innerText;
    const salaryMatch = bodyText.match(/\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|yr|annum|hour|hr|month))?/i);
    const salary = salaryMatch ? salaryMatch[0] : null;

    let jobType = null;
    const jobTypePatterns = ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'remote'];
    const lowerBody = bodyText.toLowerCase();
    for (const type of jobTypePatterns) {
      if (lowerBody.includes(type)) {
        jobType = type.charAt(0).toUpperCase() + type.slice(1);
        break;
      }
    }

    return {
      jobrole: cleanText(jobTitle), 
      company: cleanText(company),
      location: cleanText(location),
      salary,
      jobType,
      link: window.location.href,  
      id: jobNumber,               
      platform: platform ? platform.config.name : detectGenericPlatform(),
      appliedDate: new Date().toISOString().split('T')[0],
    };
  }

  function cleanText(text) {
    if (!text) return null;
    return text.replace(/\s+/g, ' ').trim().substring(0, 200);
  }

  function detectGenericPlatform() {
    const hostname = window.location.hostname.replace('www.', '');
    const parts = hostname.split('.');
    return parts.length > 1 ? parts[parts.length - 2] : hostname;
  }

  function hasApplicationForm() {
    const inputs = document.querySelectorAll('input, textarea, select');
    if (inputs.length < 3) return false;

    const applicationFormKeywords = [
      'cover letter', 'resume', 'curriculum vitae', 'cv',
      'work experience', 'years of experience',
      'linkedin profile', 'portfolio'
    ];

    const labels = Array.from(document.querySelectorAll('label, placeholder')).map(el =>
      (el.textContent || el.getAttribute('placeholder') || '').toLowerCase()
    );
    const bodyText = document.body.innerText.toLowerCase();

    return applicationFormKeywords.some(kw =>
      bodyText.includes(kw) || labels.some(l => l.includes(kw))
    );
  }

  // ─── MAIN EXECUTION ──────────────────────────────────────────────────────────

  function runDetection() {
    if (!isJobPage()) return;

    const jobData = extractJobData();
    const hasForm = hasApplicationForm();

    chrome.runtime.sendMessage({
      type: 'JOB_PAGE_DETECTED',
      data: {
        ...jobData,
        hasApplicationForm: hasForm,
        pageTitle: document.title,
        detectedAt: new Date().toISOString(),
      }
    }, (response) => {
      if (chrome.runtime.lastError) return; 
    });
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PAGE_DATA') {
      const jobData = extractJobData();
      const hasForm = hasApplicationForm();
      sendResponse({
        isJobPage: isJobPage(),
        data: { ...jobData, hasApplicationForm: hasForm },
      });
    }
    return true;
  });

  // Run on initial load
  if (document.readyState === 'complete') {
    runDetection();
  } else {
    window.addEventListener('load', runDetection);
  }

  // Watch for SPA (Single Page Application) navigation
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(runDetection, 1500); 
    }
  });
  observer.observe(document.body, { subtree: true, childList: true });
})();