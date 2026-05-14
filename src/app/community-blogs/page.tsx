"use client";

import React, { useEffect, useState } from "react";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await fetch("/api/blogs");
  return res.json();
};

const addBlog = async (blog: Omit<Blog, "id" | "createdAt">) => {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  return res.json();
};

const CommunityBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const newBlog = await addBlog(form);
    setBlogs([newBlog, ...blogs]);
    setForm({ title: "", content: "", author: "" });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-gray-800">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-green-800 animate-fade-in">Community Blogs</h1>
          {/* Potentially add navigation or user profile here */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-green-700 mb-5 text-center animate-fade-in-up">Share Your Farming Insights</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-8 animate-slide-in border border-green-200"
          >
            <div className="mb-5">
              <label htmlFor="title" className="block text-gray-700 text-sm font-semibold mb-2">Blog Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Sustainable Farming Practices"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out text-lg"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="content" className="block text-gray-700 text-sm font-semibold mb-2">Your Blog Content</label>
              <textarea
                id="content"
                name="content"
                placeholder="Write your insightful blog post here..."
                value={form.content}
                onChange={handleChange}
                required
                rows={7}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out text-lg resize-y"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="author" className="block text-gray-700 text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="author"
                name="author"
                placeholder="e.g., Kisan Singh"
                value={form.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200 ease-in-out text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting Your Blog..." : "Post Your Blog"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-700 mb-6 text-center animate-fade-in-up">Recent Community Blogs</h2>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-green-600 text-lg animate-pulse p-8 bg-white rounded-xl shadow-md">Loading inspiring blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center text-gray-500 text-lg animate-fade-in p-8 bg-white rounded-xl shadow-md">No blogs yet. Be the first to share your knowledge!</div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-xl shadow-md p-7 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl animate-fade-in-up border border-green-100"
                  style={{ animationDelay: `${0.05 * blog.id}s` }}
                >
                  <h3 className="text-2xl font-bold text-green-700 mb-3 leading-tight">{blog.title}</h3>
                  <p className="text-gray-700 mb-5 whitespace-pre-line text-base leading-relaxed">{blog.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <span className="font-medium">By <span className="text-green-600">{blog.author}</span></span>
                    <span className="text-xs">{new Date(blog.createdAt).toLocaleDateString()} at {new Date(blog.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CommunityBlogsPage; 