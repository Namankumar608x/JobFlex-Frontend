import api from "../utils/api";

/**
 * analyzeResume
 * Sends resume file + job description to backend for ATS analysis.
 *
 * @param {File}   resumeFile      - The uploaded resume file (PDF)
 * @param {string} jobDescription  - The job description text
 * @returns {Promise<AnalysisResult>}
 *
 * AnalysisResult shape:
 * {
 *   matchPercentage: number,          // 0–100
 *   missingKeywords: string[],
 *   suggestions: string[],
 *   strengths: string[],
 * }
 */
export async function analyzeResume(resumeFile, jobDescription) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd_text", jobDescription);

  const res = await api("post", "api/resume/analyze/", formData);

  // Map BE response to FE shape
  const data = res.data;
  return {
    matchPercentage: data.ats_score,
    missingKeywords: data.missing_keywords || [],
    strengths: data.strengths || [],
    suggestions: data.suggestions || [],
  };
}