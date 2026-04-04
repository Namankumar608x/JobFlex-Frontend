// JobFlex Content Script - Job Application Page Detector
// Detects job application pages and extracts relevant data

(function () {
  'use strict';

  const JOB_PATTERNS = {
    // URL patterns
    urlPatterns: [
      /\/jobs?\//i,
      /\/careers?\//i,
      /\/apply/i,
      /\/application/i,
      /\/job-application/i,
      /\/hiring/i,
      /\/openings?\//i,
      /\/positions?\//i,
      /\/opportunities?\//i,
      /\/vacancies?\//i,
      /workday\.com/i,
      /greenhouse\.io/i,
      /lever\.co/i,
      /ashbyhq\.com/i,
      /smartrecruiters\.com/i,
      /icims\.com/i,
      /jobvite\.com/i,
      /brassring\.com/i,
      /taleo\.net/i,
      /successfactors\./i,
      /myworkdayjobs\.com/i,
      /linkedin\.com\/jobs/i,
      /indeed\.com\/viewjob/i,
      /glassdoor\.com\/job/i,
      /monster\.com\/job/i,
      /ziprecruiter\.com\/c\//i,
      /dice\.com\/jobs/i,
      /angel\.co\/jobs/i,
      /wellfound\.com\/jobs/i,
    ],
    // Keyword patterns in page content
    applyKeywords: [
      'apply now', 'apply for this job', 'apply for this position',
      'submit application', 'submit your application',
      'apply to this job', 'apply to this role',
      'start application', 'begin application',
      'apply online', 'apply here',
    ],
    applicationFormKeywords: [
      'cover letter', 'resume', 'curriculum vitae', 'cv',
      'work experience', 'years of experience',
      'linkedin profile', 'portfolio',
      'why do you want to work', 'tell us about yourself',
    ],
    jobKeywords: [
      'job title', 'position', 'role', 'responsibilities',
      'requirements', 'qualifications', 'salary', 'compensation',
      'location', 'remote', 'hybrid', 'full-time', 'part-time',
      'experience required', 'about the role', 'about the job',
    ],
  };

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
    'myworkdayjobs.com': {
      name: 'Workday',
      jobTitle: ['[data-automation-id="jobPostingHeader"]', 'h2'],
      company: ['[data-automation-id="jobPostingCompanyName"]'],
      location: ['[data-automation-id="locations"]'],
    },
    'smartrecruiters.com': {
      name: 'SmartRecruiters',
      jobTitle: ['.job-title h1', 'h1'],
      company: ['.company-name', '.employer-name'],
      location: ['.job-location', '.location'],
    },
    'ashbyhq.com': {
      name: 'Ashby',
      jobTitle: ['h1', '.ashby-job-posting-heading'],
      company: ['.ashby-logo img[alt]', '.company-name'],
      location: ['.ashby-job-posting-brief-items', '.location'],
    },
    'careers.microsoft.com': {
  name: 'Microsoft',
  jobTitle: [
    '.ms-DocumentCard-title',
    'h1[class*="JobTitle"]',
    '[data-automation="job-title"]',
    '.atm-c-heading',
    'h1',
  ],
  company: [],  // always Microsoft, handled below
  location: [
    '[data-automation="job-location"]',
    '.ms-List-cell .location',
    '[class*="location"] span:last-child',
  ],
  jobNumber: [
    '[data-automation="job-id"]',
    '.ms-List-cell [class*="jobId"]',
    'span[class*="JobNumber"]',
  ],
},
  };

  function getCurrentPlatform() {
    const hostname = window.location.hostname.replace('www.', '');
    for (const [domain, config] of Object.entries(KNOWN_PLATFORMS)) {
      if (hostname.includes(domain)) {
        return { domain, config };  // added domain here
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

      // Extract job number if selectors exist (Microsoft etc.)
      if (config.jobNumber) {
        const rawJobNum = extractTextFromSelectors(config.jobNumber);
        if (rawJobNum) {
          const numMatch = rawJobNum.match(/\d+/);
          jobNumber = numMatch ? parseInt(numMatch[0]) : null;
        }
      }

      // Microsoft company name hardcoded since it's never on the page
      if (domain === 'careers.microsoft.com' && !company) {
        company = 'Microsoft';
      }

      // Fix location — take only last part after last comma
      // "India, Karnataka, Bangalore" → "Bangalore"
      if (location && location.includes(',')) {
        location = location.split(',').pop().trim();
      }
    }

    // Fallback: generic extraction
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
      jobrole: cleanText(jobTitle),       // renamed from jobTitle
      company: cleanText(company),
      location: cleanText(location),
      salary,
      jobType,
      link: window.location.href,          // renamed from url
      id: jobNumber,                        // company's job number
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

  function isJobPage() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const bodyText = document.body ? document.body.innerText.toLowerCase().substring(0, 5000) : '';

    // Check URL patterns
    const urlMatch = JOB_PATTERNS.urlPatterns.some(p => p.test(url));
    if (urlMatch) return true;

    // Check for known platforms
    const platformMatch = getCurrentPlatform();
    if (platformMatch) return true;

    // Check for apply keywords in page
    const applyMatch = JOB_PATTERNS.applyKeywords.some(kw => bodyText.includes(kw));
    if (applyMatch) return true;

    // Check title
    const titleMatch = ['job', 'career', 'apply', 'position', 'role', 'hiring'].some(kw => title.includes(kw));
    if (titleMatch) {
      // Also need some job content
      const contentMatch = JOB_PATTERNS.jobKeywords.some(kw => bodyText.includes(kw));
      return contentMatch;
    }

    return false;
  }

  function hasApplicationForm() {
    const inputs = document.querySelectorAll('input, textarea, select');
    if (inputs.length < 3) return false;

    const labels = Array.from(document.querySelectorAll('label, placeholder')).map(el =>
      (el.textContent || el.getAttribute('placeholder') || '').toLowerCase()
    );
    const bodyText = document.body.innerText.toLowerCase();

    return JOB_PATTERNS.applicationFormKeywords.some(kw =>
      bodyText.includes(kw) || labels.some(l => l.includes(kw))
    );
  }

  // Main detection logic
  function runDetection() {
    if (!isJobPage()) return;

    const jobData = extractJobData();
    const hasForm = hasApplicationForm();

    // Notify background script
    chrome.runtime.sendMessage({
      type: 'JOB_PAGE_DETECTED',
      data: {
        ...jobData,
        hasApplicationForm: hasForm,
        pageTitle: document.title,
        detectedAt: new Date().toISOString(),
      }
    }, (response) => {
      if (chrome.runtime.lastError) return; // Extension context invalidated
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

  // Run detection after page loads
  if (document.readyState === 'complete') {
    runDetection();
  } else {
    window.addEventListener('load', runDetection);
  }

  // Watch for SPA navigation
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(runDetection, 1500); // Wait for SPA content to render
    }
  });
  observer.observe(document.body, { subtree: true, childList: true });
})();
