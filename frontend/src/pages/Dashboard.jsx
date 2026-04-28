import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

// --- Skeleton Loader ---
const CardSkeleton = () => (
  <div
    className="rounded-xl overflow-hidden animate-pulse-soft"
    style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}
  >
    <div className="p-6 space-y-3">
      <div className="h-5 rounded-md w-3/4" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      <div className="h-4 rounded-md w-1/2" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      <div className="flex gap-2 mt-4">
        <div className="h-6 w-20 rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-6 w-16 rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    studentName: "", companyName: "", type: "", year: "",
    branch: "", passoutYear: "", placementType: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchExperiences = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      setLoading(true);
      const response = await api.get("/experience");
      const data = response.data;

      const filtered = data.filter((exp) => (
        (filters.studentName === "" || exp.student?.name.toLowerCase().includes(filters.studentName.toLowerCase())) &&
        (filters.companyName === "" || exp.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) &&
        (filters.type === "" || exp.type === filters.type) &&
        (filters.year === "" || exp.year === filters.year) &&
        (filters.branch === "" || exp.branch === filters.branch) &&
        (filters.passoutYear === "" || exp.passoutYear === filters.passoutYear) &&
        (filters.placementType === "" || exp.placementType === filters.placementType)
      ));
      setExperiences(filtered);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, navigate]);

  useEffect(() => { fetchExperiences(); }, [fetchExperiences]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const currentYear = new Date().getFullYear();
  const passoutYears = Array.from({ length: 15 }, (_, i) => (currentYear - 10 + i).toString());

  const branches = [
    "Civil Engineering", "Mechanical Engineering", "Electrical",
    "Electronics", "Computer Science Engineering",
    "Information Technology", "Robotics", "AI/ML",
  ];

  const inputStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
  };

  const selectStyle = { ...inputStyle };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col p-6 overflow-hidden">

        {/* Header area */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                Experiences
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
                Browse interview experiences shared by students
              </p>
            </div>
            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-on-accent)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
              id="create-post-button"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Post
            </button>
          </div>

          {/* Filters */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="studentName"
                placeholder="Search by student…"
                value={filters.studentName}
                onChange={handleFilterChange}
                className="w-full px-3.5 py-2 text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              />
              <input
                type="text"
                name="companyName"
                placeholder="Search by company…"
                value={filters.companyName}
                onChange={handleFilterChange}
                className="w-full px-3.5 py-2 text-sm focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-secondary)",
                  borderRadius: "var(--radius-md)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border-default)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0M3.75 12H7.5" />
                </svg>
                {showFilters ? "Hide" : "More"} Filters
              </button>
            </div>

            {/* Collapsible filters */}
            {showFilters && (
              <div
                className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 mt-4 animate-fade-in"
                style={{ borderTop: "1px solid var(--border-default)" }}
              >
                <select name="type" value={filters.type} onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm focus:outline-none" style={selectStyle}>
                  <option value="">All Types</option>
                  <option value="Internship">Internship</option>
                  <option value="PPO">PPO</option>
                  <option value="Internship+Placement">Internship+Placement</option>
                </select>
                <select name="year" value={filters.year} onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm focus:outline-none" style={selectStyle}>
                  <option value="">All Years</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
                <select name="branch" value={filters.branch} onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm focus:outline-none" style={selectStyle}>
                  <option value="">All Branches</option>
                  {branches.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select name="passoutYear" value={filters.passoutYear} onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm focus:outline-none" style={selectStyle}>
                  <option value="">All Passout Years</option>
                  {passoutYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select name="placementType" value={filters.placementType} onChange={handleFilterChange}
                  className="w-full px-3 py-2 text-sm focus:outline-none" style={selectStyle}>
                  <option value="">All Placement</option>
                  <option value="On-Campus">On-Campus</option>
                  <option value="Off-Campus">Off-Campus</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Experience cards */}
        <div className="relative flex-1 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : experiences.length === 0 ? (
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
                No experiences found
              </h2>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Try adjusting your filters or be the first to create a post.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {experiences.map((exp) => (
                <div
                  key={exp._id}
                  onClick={() => navigate(`/experience/${exp._id}`)}
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
                  {/* Card Header */}
                  <div className="p-5 pb-3">
                    <h3
                      className="text-lg font-semibold truncate mb-1"
                      style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                    >
                      {exp.companyName || "N/A"}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      by {exp.student?.name || "N/A"}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="px-5 pb-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                      >
                        {exp.branch || "N/A"}
                      </span>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                      >
                        {exp.type || "N/A"}
                      </span>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                      >
                        {exp.placementType || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="px-5 py-3"
                    style={{ borderTop: "1px solid var(--border-default)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        }) : "N/A"}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {exp.year || ""} • Passout {exp.passoutYear || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
