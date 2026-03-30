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

  return Array.from(map.values());
};

export const fetchData = async (LCusername = "", CFusername = "") => {
  try {
  
    const lcRes = await api("get",`user/leetcode/${LCusername}`);

    const leetcodeStats = {
      total: lcRes.data.totalSolved,
      submissions: lcRes.data.totalSubmissions,
    };

    const LCheatmap = transformLeetCodeData(
      lcRes.data.submissionCalendar
    );

  
    const cfRes = await api("get", `user/codeforces/${CFusername}`);

    const CFheatmap = transformCFData(cfRes.data.submissions);

    const codeforcesStats = {
      total: cfRes.data.totalSolved,
      submissions: cfRes.data.submissions.length,
    };

    const mergedHeatmap = mergeHeatmaps(LCheatmap, CFheatmap);
    // console.log(leetcodeStats);
    // console.log(codeforcesStats);
    // console.log(mergedHeatmap);
    return {
      leetcode: {
        stats: leetcodeStats,
      },
      codeforces: {
        stats: codeforcesStats,
      },
      heatmap: mergedHeatmap
    };

  } catch (error) {
    console.error(error);
    return null;
  }


};