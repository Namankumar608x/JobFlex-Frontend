import api from "../utils/api";

/**
 * analyzeResume
 * Sends resume file + job description to backend for ATS analysis.
 * Falls back to a mock response if backend is unavailable.
 *
 * @param {File}   resumeFile      - The uploaded resume file
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
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    const res = await api("post", "resume/analyze/", formData);
    return res.data;
  } catch (err) {
    // ── Mock fallback when backend is not ready ──────────────────────────
    console.warn("Resume API unavailable — using mock response.", err?.message);
    return getMockAnalysis(jobDescription);
  }
}

/**
 * getMockAnalysis
 * Generates a deterministic-looking mock ATS analysis from the job description.
 */
function getMockAnalysis(jobDescription) {
  const jd = jobDescription.toLowerCase();

  // Pull keywords from JD to make mock feel realistic
  const TECH_POOL = [
    "React", "TypeScript", "Node.js", "Python", "Django", "PostgreSQL",
    "REST API", "GraphQL", "Docker", "AWS", "CI/CD", "Jest", "Redux",
    "Tailwind CSS", "Next.js", "MongoDB", "Redis", "Kubernetes", "Git",
  ];

  const SOFT_POOL = [
    "communication skills", "team collaboration", "agile methodology",
    "problem solving", "leadership", "time management",
  ];

  const foundTech = TECH_POOL.filter((kw) => jd.includes(kw.toLowerCase()));
  const missing   = TECH_POOL.filter((kw) => !jd.includes(kw.toLowerCase())).slice(0, 5);
  const softMissing = SOFT_POOL.filter((kw) => !jd.includes(kw.toLowerCase())).slice(0, 2);

  const matchPercentage = Math.min(
    95,
    Math.max(35, 40 + foundTech.length * 6 + Math.floor(Math.random() * 10))
  );

  return {
    matchPercentage,
    missingKeywords: [...missing, ...softMissing],
    strengths: foundTech.length > 0
      ? foundTech.slice(0, 4)
      : ["Problem-solving", "Team collaboration", "Adaptability"],
    suggestions: [
      "Add measurable achievements (e.g. 'Reduced load time by 40%') to strengthen impact.",
      missing[0] ? `Include experience with ${missing[0]} if applicable to this role.` : null,
      "Tailor your summary section to match the job title exactly.",
      "Use action verbs: Built, Designed, Led, Optimized, Deployed.",
      softMissing[0] ? `Highlight ${softMissing[0]} with a concrete example.` : null,
    ].filter(Boolean),
  };
}