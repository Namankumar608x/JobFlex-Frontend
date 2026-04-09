import api from "../utils/api";

// 🔹 LC transform
const transformLeetCodeData = (submissionCalendar) => {
  const result = [];

  for (let timestamp in submissionCalendar) {
    const date = new Date(parseInt(timestamp) * 1000)
      .toISOString()
      .split("T")[0];

    result.push({
      date,
      count: submissionCalendar[timestamp]
    });
  }

  return result;
};

// 🔹 CF transform (ONLY OK submissions 🔥)
const transformCFData = (submissions) => {
  const map = {};

  submissions.forEach((sub) => {
    if (sub.verdict !== "OK") return; // important

    const date = new Date(sub.creationTimeSeconds * 1000)
      .toISOString()
      .split("T")[0];

    if (!map[date]) map[date] = 0;
    map[date]++;
  });

  return Object.keys(map).map((date) => ({
    date,
    count: map[date],
  }));
};
const transformCFHeatmap = (cfMap) => {
   if (!cfMap) return [];
  return Object.entries(cfMap).map(([date, count]) => ({
    date,
    count
  }));
  
};
// 🔹 Merge LC + CF
const mergeHeatmaps = (lc, cf) => {
  const map = new Map();

  // 🔹 Add LC data
  lc.forEach(d => {
    map.set(d.date, {
      date: d.date,
      lc: d.count,
      cf: 0,
      total: d.count
    });
  });

  // 🔹 Add CF data
  cf.forEach(d => {
    if (map.has(d.date)) {
      const existing = map.get(d.date);
      existing.cf = d.count;
      existing.total = existing.lc + d.count;
    } else {
      map.set(d.date, {
        date: d.date,
        lc: 0,
        cf: d.count,
        total: d.count
      });
    }
  });

  return Array.from(map.values()).sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);
};
export const fetchData = async () => {
  let LCfound = true;
  let CFfound = true;

  let lcRes = null;
  let cfRes = null;

  // 🔹 Fetch LC
  try {
    lcRes = await api("get", "user/leetcode/");
  } catch (err) {
    LCfound = false;
  }

  // 🔹 Fetch CF
  try {
    cfRes = await api("get", "user/codeforces/");
  } catch (err) {
    CFfound = false;
  }

  // 🔹 If both missing
  if (!LCfound && !CFfound) {
    return { message: "Data not found" };
  }

  // 🔹 LC Data
  let leetcodeStats = {};
  let LCheatmap = [];

  if (LCfound) {
    leetcodeStats = {
      total: lcRes?.data?.totalSolved || 0,
      submissions: lcRes?.data?.submissions || [], // must match UI
    };

    LCheatmap = transformLeetCodeData(
      lcRes?.data?.submissionCalendar || {}
    );
  }

  // 🔹 CF Data
  let codeforcesStats = {};
  let CFheatmap = [];

  if (CFfound) {
    codeforcesStats = {
      total: cfRes?.data?.totalSolved || 0,
      submissions: cfRes?.data?.submissions || [],
      rating: cfRes?.data?.user?.rating || 0,
    };

    CFheatmap = transformCFHeatmap(
      cfRes?.data?.heatmap || {}
    );
  }

  // 🔹 Merge heatmaps safely
  const mergedHeatmap = mergeHeatmaps(LCheatmap, CFheatmap);

  // 🔹 Handle partial cases
  if (!LCfound) {
    return {
      message: "Leetcode profile not found",
      codeforces: { stats: codeforcesStats },
      heatmap: mergedHeatmap
    };
  }

  if (!CFfound) {
    return {
      message: "Codeforces profile not found",
      leetcode: { stats: leetcodeStats },
      heatmap: mergedHeatmap
    };
  }

  // ✅ Normal case
  return {
    leetcode: { stats: leetcodeStats },
    codeforces: { stats: codeforcesStats },
    heatmap: mergedHeatmap
  };
};