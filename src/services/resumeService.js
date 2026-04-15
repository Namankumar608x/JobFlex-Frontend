import api from "../utils/api";

/**
 * getResume
 * Checks if the user has a stored resume on the backend.
 * Returns resume metadata or null if none exists.
 */
export async function getResume() {
  try {
    const res = await api("get", "api/resume/");
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * scanResume
 * Scores the user's stored resume against a job description.
 * Used when the user already has a resume on file.
 */
export async function scanResume(jobDescription) {
  const res = await api("post", "api/resume/ats-scan/", {
    jd_text: jobDescription,
  });

  const data = res.data;
  return {
    matchPercentage: data.ats_score,
    missingKeywords: data.missing_keywords || [],
    strengths: data.strengths || [],
    suggestions: data.suggestions || [],
  };
}

/**
 * analyzeResume
 * Uploads a new resume file + job description for ATS analysis.
 * Used when the user does NOT have a stored resume yet.
 */
export async function analyzeResume(resumeFile, jobDescription) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd_text", jobDescription);

  const res = await api("post", "api/resume/analyze/", formData);

  const data = res.data;
  return {
    matchPercentage: data.ats_score,
    missingKeywords: data.missing_keywords || [],
    strengths: data.strengths || [],
    suggestions: data.suggestions || [],
  };
}
