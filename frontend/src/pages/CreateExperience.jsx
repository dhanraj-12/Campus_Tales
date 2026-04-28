import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CreateExperience = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    companyName: "", type: "", experienceText: "",
    year: "", branch: "", passoutYear: "", placementType: "",
  });

  const [predefinedQuestions, setPredefinedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [loading, setLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/experience/questions/list");
      setPredefinedQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setQuestionLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleQuestionToggle = (questionId) => {
    setSelectedQuestions((prev) => {
      const updated = { ...prev };
      if (updated.hasOwnProperty(questionId)) {
        delete updated[questionId];
      } else {
        updated[questionId] = "";
      }
      return updated;
    });
  };

  const handleQuestionAnswerChange = (questionId, answer) => {
    setSelectedQuestions((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { showNotification("error", "Please login first"); return; }

    setLoading(true);

    const passoutYear = parseInt(formData.passoutYear);
    if (passoutYear > currentYear + 4) {
      setLoading(false);
      showNotification("error", `Passout year cannot exceed ${currentYear + 4}`);
      return;
    }

    const unanswered = Object.entries(selectedQuestions).filter(
      ([, answer]) => !answer || answer.trim() === ""
    );
    if (unanswered.length > 0) {
      setLoading(false);
      const nums = unanswered.map(([qId]) => {
        const idx = predefinedQuestions.findIndex((q) => q.id === qId);
        return `Q${idx + 1}`;
      }).join(", ");
      showNotification("error", `Please answer: ${nums}`);
      return;
    }

    const questions = Object.entries(selectedQuestions).map(([qId, answer]) => {
      const question = predefinedQuestions.find((q) => q.id === qId);
      return { questionId: qId, question: question?.text, answer: answer.trim() };
    });

    try {
      await api.post("/experience", { ...formData, questions, additionalNotes: "" });
      showNotification("success", "Experience submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      showNotification("error", err.response?.data?.message || "Error submitting experience");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
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

      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          Share Your Experience
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          Help fellow students prepare for their interviews
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic fields */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--text-tertiary)" }}>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Company Name
              </label>
              <input id="companyName" name="companyName" placeholder="e.g., Google, Microsoft…"
                value={formData.companyName} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-colors" style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                required />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Experience Type
              </label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none" style={inputStyle} required>
                <option value="">Select Type</option>
                <option value="Internship">Internship</option>
                <option value="PPO">PPO</option>
                <option value="Internship+Placement">Internship+Placement</option>
              </select>
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Current Year
              </label>
              <select id="year" name="year" value={formData.year} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none" style={inputStyle} required>
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div>
              <label htmlFor="branch" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Branch
              </label>
              <select id="branch" name="branch" value={formData.branch} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none" style={inputStyle} required>
                <option value="">Select Branch</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
                <option value="Computer Science Engineering">Computer Science Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Robotics">Robotics</option>
                <option value="AI/ML">AI/ML</option>
              </select>
            </div>
            <div>
              <label htmlFor="passoutYear" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Passout Year
              </label>
              <input id="passoutYear" name="passoutYear" type="number" placeholder="e.g., 2026"
                min="1951" max={currentYear + 4}
                value={formData.passoutYear} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-colors" style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                required />
            </div>
            <div>
              <label htmlFor="placementType" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Placement Type
              </label>
              <select id="placementType" name="placementType" value={formData.placementType} onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm focus:outline-none" style={inputStyle} required>
                <option value="">Select Placement Type</option>
                <option value="On-Campus">On-Campus</option>
                <option value="Off-Campus">Off-Campus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>
            Interview Questions
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-tertiary)" }}>
            Select and answer questions to help future candidates
          </p>

          {questionLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg animate-pulse-soft" style={{ backgroundColor: "var(--bg-tertiary)" }} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {predefinedQuestions.map((question) => {
                const isSelected = selectedQuestions.hasOwnProperty(question.id);
                return (
                  <div
                    key={question.id}
                    className="rounded-lg p-4 transition-all"
                    style={{
                      border: `1px solid ${isSelected ? "var(--border-focus)" : "var(--border-default)"}`,
                      backgroundColor: isSelected ? "var(--accent-muted)" : "transparent",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={question.id}
                        checked={isSelected}
                        onChange={() => handleQuestionToggle(question.id)}
                        className="mt-0.5 w-4 h-4 cursor-pointer accent-[var(--accent)]"
                      />
                      <label
                        htmlFor={question.id}
                        className="cursor-pointer flex-grow text-sm font-medium"
                        style={{ color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}
                      >
                        {question.text}
                        {isSelected && (
                          <span className="ml-1.5 text-xs" style={{ color: "var(--status-error-text)" }}>*</span>
                        )}
                      </label>
                    </div>

                    {isSelected && (
                      <div className="mt-3 ml-7 animate-fade-in">
                        <textarea
                          placeholder="Your answer…"
                          value={selectedQuestions[question.id] || ""}
                          onChange={(e) => handleQuestionAnswerChange(question.id, e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                          style={inputStyle}
                          rows="3"
                          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Experience textarea */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
          }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-tertiary)" }}>
            Your Experience
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
            Describe interview rounds, questions, difficulty, and tips
          </p>
          <textarea
            id="experienceText"
            name="experienceText"
            placeholder="Describe your experience in detail…"
            value={formData.experienceText}
            onChange={handleChange}
            className="w-full px-3.5 py-3 text-sm focus:outline-none transition-colors resize-none"
            style={{ ...inputStyle, minHeight: "180px" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
            required
          />
          <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
            Include details on interview rounds, technical questions, preparation tips, and any other insights.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--text-on-accent)",
            borderRadius: "var(--radius-md)",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--accent)"; }}
          disabled={loading}
          id="submit-experience"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </span>
          ) : (
            "Submit Experience"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateExperience;