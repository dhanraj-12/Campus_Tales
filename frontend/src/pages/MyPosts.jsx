import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const MyPosts = () => {
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      setLoading(true);
      const response = await api.get("/experience/me");
      setMyPosts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchMyPosts(); }, [fetchMyPosts]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "var(--status-success-bg)",
          border: "var(--status-success-border)",
          text: "var(--status-success-text)",
        };
      case "rejected":
        return {
          bg: "var(--status-error-bg)",
          border: "var(--status-error-border)",
          text: "var(--status-error-text)",
        };
      default:
        return {
          bg: "var(--status-warning-bg)",
          border: "var(--status-warning-border)",
          text: "var(--status-warning-text)",
        };
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            My Posts
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            View all your submitted experiences
          </p>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse-soft"
                  style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
                  <div className="p-6 space-y-3">
                    <div className="h-5 rounded-md w-3/4" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                    <div className="h-4 rounded-md w-1/2" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : myPosts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center text-center p-16 rounded-xl animate-fade-in"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
              }}
            >
              <svg className="w-12 h-12 mb-4" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 0H6.625A2.25 2.25 0 004.5 4.875v11.25a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 16.125v-1.5" />
              </svg>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                No posts yet
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
                Your posts will appear here once you share your interview experiences.
              </p>
              <button
                onClick={() => navigate("/create")}
                className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {myPosts.map((post) => {
                const statusStyle = getStatusStyle(post.status);
                return (
                  <div
                    key={post._id}
                    onClick={() => navigate(`/experience/${post._id}`, { state: { post } })}
                    className="group rounded-xl overflow-hidden cursor-pointer transition-all"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid var(--border-default)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-hover)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-default)";
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className="text-lg font-semibold truncate"
                          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                        >
                          {post.companyName || "N/A"}
                        </h3>
                        <span
                          className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {post.status || "pending"}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 pb-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                          {post.branch || "N/A"}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                          {post.type || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 py-3" style={{ borderTop: "1px solid var(--border-default)" }}>
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        }) : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;