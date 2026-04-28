import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

// --- Stat Card ---
const StatCard = ({ title, value, accent }) => (
  <div
    className="p-5 rounded-xl transition-all"
    style={{
      backgroundColor: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
    }}
  >
    <div
      className="text-2xl font-bold mb-1"
      style={{ color: accent || "var(--text-primary)" }}
    >
      {value || 0}
    </div>
    <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
      {title}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState({
    studentName: "", companyName: "", type: "", year: "",
    branch: "", passoutYear: "", placementType: "", status: "", date: "",
  });

  const navigate = useNavigate();

  const branches = [
    "Civil Engineering", "Mechanical Engineering", "Electrical", "Electronics",
    "Computer Science Engineering", "Information Technology", "Robotics", "AI/ML",
  ];
  const currentYear = new Date().getFullYear();
  const passoutYears = Array.from({ length: 15 }, (_, i) => (currentYear - 10 + i).toString());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, analyticsRes] = await Promise.all([
        api.get("/admin/experience/all"),
        api.get("/admin/analytics"),
      ]);
      setExperiences(expRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFilterChange = (e) => setFilter({ ...filter, [e.target.name]: e.target.value });

  const filtered = experiences.filter((exp) =>
    (!filter.studentName || exp.student?.name?.toLowerCase().includes(filter.studentName.toLowerCase())) &&
    (!filter.companyName || exp.companyName?.toLowerCase().includes(filter.companyName.toLowerCase())) &&
    (!filter.type || exp.type === filter.type) &&
    (!filter.year || exp.year === filter.year) &&
    (!filter.branch || exp.branch === filter.branch) &&
    (!filter.passoutYear || exp.passoutYear === filter.passoutYear) &&
    (!filter.placementType || exp.placementType === filter.placementType) &&
    (!filter.status || exp.status === filter.status) &&
    (!filter.date || new Date(exp.createdAt).toLocaleDateString() === new Date(filter.date).toLocaleDateString())
  );

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

  const inputStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col p-6 overflow-hidden">

        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Admin Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            Manage all student experiences
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 flex-shrink-0 stagger">
          <StatCard title="Users" value={analytics.totalUsers} />
          <StatCard title="Total Posts" value={analytics.totalExperiences} />
          <StatCard title="Approved" value={analytics.totalApproved} accent="var(--status-success-text)" />
          <StatCard title="Pending" value={analytics.totalPending} accent="var(--status-warning-text)" />
          <StatCard title="Rejected" value={analytics.totalRejected} accent="var(--status-error-text)" />
        </div>

        {/* Filters */}
        <div
          className="p-4 rounded-xl mb-6 flex-shrink-0"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" name="studentName" placeholder="Search by student…"
              value={filter.studentName} onChange={handleFilterChange}
              className="w-full px-3.5 py-2 text-sm focus:outline-none transition-colors" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
            <input type="text" name="companyName" placeholder="Search by company…"
              value={filter.companyName} onChange={handleFilterChange}
              className="w-full px-3.5 py-2 text-sm focus:outline-none transition-colors" style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")} />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)", borderRadius: "var(--radius-md)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-default)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 12H7.5" />
              </svg>
              {showFilters ? "Hide" : "More"} Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 mt-4 animate-fade-in"
              style={{ borderTop: "1px solid var(--border-default)" }}>
              <select name="type" value={filter.type} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                <option value="">All Types</option>
                <option value="Internship">Internship</option>
                <option value="PPO">PPO</option>
                <option value="Internship+Placement">Internship+Placement</option>
              </select>
              <select name="year" value={filter.year} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                <option value="">All Years</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>
              <select name="branch" value={filter.branch} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                <option value="">All Branches</option>
                {branches.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <select name="passoutYear" value={filter.passoutYear} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                <option value="">All Passout Years</option>
                {passoutYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select name="placementType" value={filter.placementType} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                <option value="">All Placement</option>
                <option value="On-Campus">On-Campus</option>
                <option value="Off-Campus">Off-Campus</option>
              </select>
              <select name="status" value={filter.status} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <input type="date" name="date" value={filter.date} onChange={handleFilterChange}
                className="w-full px-3 py-2 text-sm focus:outline-none" style={inputStyle} />
            </div>
          )}
        </div>

        {/* Experience cards */}
        <div className="relative flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse-soft"
                  style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
                  <div className="p-6 space-y-3">
                    <div className="h-5 rounded-md w-3/4" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                    <div className="h-4 rounded-md w-1/2" style={{ backgroundColor: "var(--bg-tertiary)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 rounded-xl animate-fade-in"
              style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
              <svg className="w-12 h-12 mb-4" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 0H6.625A2.25 2.25 0 004.5 4.875v11.25a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 16.125v-1.5" />
              </svg>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>No posts found</h2>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {filtered.map((post) => {
                const statusStyle = getStatusStyle(post.status);
                return (
                  <div
                    key={post._id}
                    onClick={() => navigate(`/admin/experience/${post._id}`)}
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
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                            {post.companyName || "N/A"}
                          </h3>
                          <p className="text-sm mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                            by {post.student?.name || "N/A"}
                          </p>
                        </div>
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

export default AdminDashboard;