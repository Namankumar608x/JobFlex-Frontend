import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { fetchData } from "../utils/profileData.js";

const Heatmap = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchData("avadhesh_nagar", "avadhesh_n");
        console.log("FULL DATA:", res); // 🔥 debug
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  if (!data) return <div>Loading...</div>;

  // ✅ SAFE FALLBACKS (IMPORTANT)
  const lcStats = data?.leetcode?.stats || {};
  const cfStats = data?.codeforces?.stats || {};
  const combined = data?.heatmap || [];

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* 🔥 HEADER */}
      <h1 style={{ marginBottom: "20px" }}>
        Coding Activity Dashboard 🚀
      </h1>

       <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        
     
        <div style={cardStyle}>
          <h3>LeetCode</h3>
          <p>Total Solved: {lcStats.total ?? 0}</p>
        {/* {Array.isArray(lcStats.submissions) &&
  lcStats.submissions.map((e, index) => (
    <p key={index}>
      {e.difficulty}: {e.count}
    </p>
  ))
} */}
          {/* <p>Total Easy: {lcStats.submissions.difficulty==="Easy".count}</p> */}
           {/* <p>Total Medium: {lcStats.submissions ?? 0}</p>
            <p>Total Hard: {lcStats.submissions ?? 0}</p> */}
        </div> 


        <div style={cardStyle}>
          <h3>Codeforces</h3>
          <p>Total Solved: {cfStats.total ?? 0}</p>
          <p>Total Submissions: {cfStats.submissions ?? 0}</p>
        </div>

      </div>

   
      <div>
        <h2 style={{ marginBottom: "10px" }}>Activity Heatmap</h2>

        <CalendarHeatmap
          startDate={new Date("2025-01-01")}
          endDate={new Date()}

          // ✅ CRITICAL FIX → always array
          values={Array.isArray(combined) ? combined : []}

          classForValue={(value) => {
            if (!value || !value.total) return "color-empty";
            if (value.total >= 10) return "color-github-4";
            if (value.total >= 5) return "color-github-3";
            if (value.total >= 2) return "color-github-2";
            return "color-github-1";
          }}

          tooltipDataAttrs={(value) => {
  if (!value || !value.date) return {};

  return {
    "data-tip": `${value.date}
LC: ${value.lc || 0}
CF: ${value.cf || 0}
Total: ${value.total || 0}`
  };
}}
        />
      </div>
    </div>
  );
};

const cardStyle = {
  padding: "15px",
  borderRadius: "10px",
  background: "#f5f5f5",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  width: "200px"
};

export default Heatmap;