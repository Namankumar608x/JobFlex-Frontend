import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./authContext";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

const fetchBlogs = useCallback(async () => {
    if (blogs.length > 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/blogs/");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [blogs.length]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const addBlog = async (title, blogtext) => {
    try {
      await fetch("http://127.0.0.1:8000/api/blogs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, blogtext, U_ID: user?.id }),
      });
      await fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUpvote = async (blogId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/blogs/${blogId}/upvote/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ U_ID: user?.id }),
      });
      const data = await res.json();
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blogId ? { ...b, upvote_count: data.upvote_count } : b
        )
      );
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (blogId, commentText) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/blogs/${blogId}/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: commentText, U_ID: user?.id }),
      });
      await fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const getBlogById = (id) => blogs.find((b) => b.id === parseInt(id));

  return (
    <BlogContext.Provider
      value={{
        blogs,
        loading,
        fetchBlogs,
        addBlog,
        toggleUpvote,
        addComment,
        getBlogById,
        myBlogs: blogs.filter((b) => b.U_ID === user?.id),
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);