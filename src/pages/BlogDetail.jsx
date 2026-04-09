import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/blogs/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .anim-1 { animation: fadeUp 0.4s ease 0.05s both; }
        .anim-2 { animation: fadeUp 0.4s ease 0.12s both; }
      `}</style>

      {/* Back button */}
      <div className="anim-1 mb-6">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
        >
          ← Back to Blogs
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 animate-pulse">
          <div className="h-6 bg-zinc-100 rounded w-2/3 mb-4" />
          <div className="h-4 bg-zinc-100 rounded w-full mb-2" />
          <div className="h-4 bg-zinc-100 rounded w-5/6 mb-2" />
          <div className="h-4 bg-zinc-100 rounded w-4/5" />
        </div>
      )}

      {/* Blog Content */}
      {!loading && blog && (
        <div className="anim-2 bg-white border border-zinc-200 rounded-2xl p-8">

          {/* Tag */}
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 mb-4 inline-block">
            Interview Experience
          </span>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold text-zinc-900 tracking-tight mt-3 mb-2">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-100">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
            <span className="text-sm text-zinc-400 font-light">
              User #{blog.U_ID}
            </span>
          </div>

          {/* Blog text */}
          <p className="text-zinc-700 leading-relaxed text-base font-light whitespace-pre-line">
            {blog.blogtext}
          </p>
        </div>
      )}

      {/* Not found */}
      {!loading && !blog && (
        <div className="text-center py-20 text-zinc-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm font-medium text-zinc-500">Blog not found</p>
        </div>
      )}
    </Sidebar>
  );
}