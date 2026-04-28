import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      setLoading(true);

      const [profileRes, postsRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/experience/me"),
      ]);

      setUser(profileRes.data);
      const allPosts = Array.isArray(postsRes.data) ? postsRes.data : [];
      setMyPosts(allPosts);
      setAnalytics({
        total: allPosts.length,
        approved: allPosts.filter((p) => p.status === "approved").length,
        pending: allPosts.filter((p) => p.status === "pending").length,
        rejected: allPosts.filter((p) => p.status === "rejected").length,
      });
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return { bg: "var(--status-success-bg)", border: "var(--status-success-border)", text: "var(--status-success-text)" };
      case "rejected":
        return { bg: "var(--status-error-bg)", border: "var(--status-error-border)", text: "var(--status-error-text)" };
      default:
        return { bg: "var(--status-warning-bg)", border: "var(--status-warning-border)", text: "var(--status-warning-text)" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="w-8 h-8 animate-spin" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Could not load profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      {/* Profile Card */}
      <div
        className="p-8 rounded-xl text-center mb-8"
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--text-on-accent)",
          }}
        >
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {user.name}
        </h1>
        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          {user.email}
        </p>
        <span
          className="inline-block text-xs font-semibold uppercase px-3 py-1 rounded-full"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          {user.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: analytics.total, color: null },
          { label: "Approved", value: analytics.approved, color: "var(--status-success-text)" },
          { label: "Pending", value: analytics.pending, color: "var(--status-warning-text)" },
          { label: "Rejected", value: analytics.rejected, color: "var(--status-error-text)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl text-center"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: stat.color || "var(--text-primary)" }}
            >
              {stat.value}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
          My Posts
        </h2>

        {myPosts.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center text-center p-12 rounded-xl"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              No posts yet. Share your first experience from the Dashboard.
            </p>
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
                      <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>
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
  );
};

export default Profile;