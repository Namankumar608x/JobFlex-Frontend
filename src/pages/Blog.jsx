import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/blogs/")
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
        .anim-3 { animation: fadeUp 0.4s ease 0.20s both; }
      `}</style>

      {/* Header */}
      <div className="anim-1 flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-900 tracking-tight">
            Interview Experiences
          </h1>
          <p className="text-zinc-400 text-sm mt-1 font-light">
            Real stories from real job seekers 📝
          </p>
        </div>
        <button
          onClick={() => navigate("/blog/new")}
          className="text-xs bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all font-medium"
        >
          + Write Blog
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-zinc-100 rounded w-2/3 mb-3" />
              <div className="h-3 bg-zinc-100 rounded w-full mb-2" />
              <div className="h-3 bg-zinc-100 rounded w-4/5" />
            </div>
          ))}
        </div>
      )}

      {/* Blog Cards */}
      {!loading && (
        <div className="anim-2 grid grid-cols-1 gap-4">
          {blogs.length === 0 && (
            <div className="text-center py-20 text-zinc-400">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm font-medium text-zinc-500">No blogs yet</p>
              <p className="text-xs mt-1">Be the first to share your experience!</p>
            </div>
          )}

          {blogs.map((blog, i) => (
            <div
              key={blog.id}
              onClick={() => navigate(`/blog/${blog.id}`)}
              className="anim-3 cursor-pointer bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title */}
                  <h2 className="font-display text-xl font-bold text-zinc-900 mb-2 tracking-tight">
                    {blog.title}
                  </h2>

                  {/* Blog text preview */}
                  <p className="text-zinc-500 text-sm font-light leading-relaxed line-clamp-2">
                    {blog.blogtext}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                      Interview Experience
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      User #{blog.U_ID}
                    </span>
                    <span className="text-blue-500 text-[11px] font-medium ml-auto">
                      Read more →
                    </span>
                  </div>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-lg ml-4 flex-shrink-0">
                  📄
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Sidebar>
  );
}