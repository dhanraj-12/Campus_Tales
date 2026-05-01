import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import ForumSection from "../components/ForumSection";

// --- Tag component ---
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

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [experience, setExperience] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const currentUserId = React.useMemo(() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload._id;
    } catch {
      return null;
    }
  }, [token]);

  const fetchExperience = useCallback(async () => {
    try {
      const response = await api.get(`/experience/${id}`);
      setExperience(response.data);
    } catch (err) {
      console.error("Failed to fetch experience:", err);

      if (!err.response) {
        setError("Server not responding");
        return;
      }

      const { status } = err.response;

      if (status === 404) {
        setError("Experience not found");
        return;
      }

      if (status === 400) {
        const ownerPost = location?.state?.post;
        if (ownerPost && ownerPost.student?._id === currentUserId) {
          setExperience(ownerPost);
          return;
        }
        setError("This experience is not available");
        return;
      }

      navigate("/dashboard");
    }
  }, [id, token, navigate, currentUserId, location]);

  useEffect(() => {
    if (location?.state?.post) {
      setExperience(location.state.post);
      fetchExperience();
      return;
    }
    fetchExperience();
  }, [fetchExperience, location]);

  // Loading state
  if (!experience && !error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: "var(--text-tertiary)" }} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Loading experience…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
            style={{
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      {/* Company & Author */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          {experience.companyName}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Shared by <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{experience.student?.name || "N/A"}</span>
          {" · "}
          {new Date(experience.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
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

      {/* Experience content */}
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
          {experience.experienceText}
        </div>
      </div>

      {/* Q&A Section */}
      {experience.questions && experience.questions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)" }}>
            Interview Q&A
          </h2>
          <div className="space-y-4">
            {experience.questions.map((qa, index) => (
              <div
                key={index}
                className="p-5 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Q{index + 1}.</span> {qa.question}
                </h3>
                <div
                  className="p-4 rounded-md text-sm leading-relaxed whitespace-pre-line break-words"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {qa.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {experience.additionalNotes && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
            Additional Notes
          </h2>
          <div
            className="p-5 rounded-lg text-sm leading-relaxed whitespace-pre-line break-words"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            {experience.additionalNotes}
          </div>
        </div>
      )}

      {/* Forum/Discussion Section */}
      <ForumSection 
        experienceId={id} 
        experienceAuthorId={experience.student?._id || experience.student}
        currentUserId={currentUserId}
      />

      {/* Back button */}
      <div className="pt-6 mt-12" style={{ borderTop: "1px solid var(--border-default)" }}>
        <button
          onClick={() => navigate(-1)}
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
          ← Go Back
        </button>
      </div>
    </div>
  );
};

export default ExperienceDetails;
