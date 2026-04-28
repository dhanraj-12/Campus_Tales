import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

// --- Tag ---
const InfoTag = ({ label, value }) => (
  <span
    className="inline-block text-xs font-medium px-3 py-1.5 rounded-full"
    style={{
      backgroundColor: "var(--bg-tertiary)",
      color: "var(--text-secondary)",
    }}
  >
    <strong>{label}:</strong> {value || "N/A"}
  </span>
);

// --- Status Badge ---
const StatusBadge = ({ status }) => {
  const styles = {
    approved: { bg: "var(--status-success-bg)", border: "var(--status-success-border)", text: "var(--status-success-text)" },
    rejected: { bg: "var(--status-error-bg)", border: "var(--status-error-border)", text: "var(--status-error-text)" },
    pending: { bg: "var(--status-warning-bg)", border: "var(--status-warning-border)", text: "var(--status-warning-text)" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span
      className="inline-block text-xs font-semibold uppercase px-3 py-1.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {status}
    </span>
  );
};

const AdminExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchExperience = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/experience/${id}`);
      setExperience(res.data);
    } catch (err) {
      console.error("Error fetching experience:", err);
      showNotification("error", "Failed to fetch experience details.");
      setTimeout(() => navigate("/admin-dashboard"), 2000);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleUpdate = async (action) => {
    const url = action === "approve"
      ? `/admin/experience/approve/${id}`
      : `/admin/experience/reject/${id}`;

    setIsUpdating(true);
    try {
      await api.put(url, {});
      showNotification("success", `Experience ${action}d successfully!`);
      setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err) {
      console.error(err);
      showNotification("error", `Failed to ${action} experience.`);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => { fetchExperience(); }, [fetchExperience]);

  // Loading
  if (loading || !experience) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <svg className="w-8 h-8 animate-spin" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      {/* Notification */}
      {notification && (
        <div
          className="fixed top-20 right-6 z-50 p-4 rounded-lg text-sm font-medium shadow-lg animate-fade-in max-w-sm"
          style={{
            backgroundColor: notification.type === "error" ? "var(--status-error-bg)" : "var(--status-success-bg)",
            border: `1px solid ${notification.type === "error" ? "var(--status-error-border)" : "var(--status-success-border)"}`,
            color: notification.type === "error" ? "var(--status-error-text)" : "var(--status-success-text)",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {experience.companyName}
          </h1>
          <StatusBadge status={experience.status} />
        </div>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Submitted by <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{experience.student?.name || "N/A"}</span>
          {" · "}{experience.student?.email || ""}
        </p>
      </div>

      {/* Info tags */}
      <div
        className="flex flex-wrap gap-2 py-5 mb-8"
        style={{ borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}
      >
        <InfoTag label="Branch" value={experience.branch} />
        <InfoTag label="Year" value={experience.year} />
        <InfoTag label="Passout" value={experience.passoutYear} />
        <InfoTag label="Type" value={experience.type} />
        <InfoTag label="Placement" value={experience.placementType} />
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
          Experience Details
        </h2>
        <div
          className="p-5 rounded-lg text-sm leading-relaxed whitespace-pre-line break-words"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
        >
          {experience.experienceText || "No description provided"}
        </div>
      </div>

      {/* Q&A */}
      {experience.questions && experience.questions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
            Interview Q&A
          </h2>
          <div className="space-y-4">
            {experience.questions.map((q, index) => (
              <div key={index} className="p-5 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Q{index + 1}.</span> {q.question}
                </h3>
                <div className="p-4 rounded-md text-sm leading-relaxed whitespace-pre-line break-words"
                  style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
                  {q.answer || "No answer provided"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {experience.additionalNotes && experience.additionalNotes.trim() !== "" && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Additional Notes
          </h2>
          <div className="p-5 rounded-lg text-sm leading-relaxed whitespace-pre-line break-words"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
            {experience.additionalNotes}
          </div>
        </div>
      )}

      {/* Skills */}
      {experience.skills && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Skills / Tools
          </h2>
          <div className="p-5 rounded-lg text-sm leading-relaxed whitespace-pre-line break-words"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
            {experience.skills}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-6" style={{ borderTop: "1px solid var(--border-default)" }}>
        {experience.status === "pending" && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={() => handleUpdate("approve")}
              disabled={isUpdating}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--status-success-text)",
                color: "#fff",
                borderRadius: "var(--radius-md)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              id="approve-button"
            >
              {isUpdating ? "Processing…" : "✓ Approve"}
            </button>
            <button
              onClick={() => handleUpdate("reject")}
              disabled={isUpdating}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--status-error-text)",
                color: "#fff",
                borderRadius: "var(--radius-md)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              id="reject-button"
            >
              {isUpdating ? "Processing…" : "✕ Reject"}
            </button>
          </div>
        )}

        <button
          onClick={() => navigate("/admin-dashboard")}
          disabled={isUpdating}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
          style={{
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-muted)";
            e.currentTarget.style.borderColor = "var(--border-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "var(--border-default)";
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminExperienceDetails;