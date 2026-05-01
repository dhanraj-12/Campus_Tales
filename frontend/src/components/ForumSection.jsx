import React, { useState, useEffect } from "react";
import api from "../api";

const ForumSection = ({ experienceId, experienceAuthorId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [experienceId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/experience/${experienceId}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/experience/${experienceId}/comments`, {
        text: newComment,
      });
      setComments([ { ...response.data, replies: [] }, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    try {
      const response = await api.post(
        `/experience/${experienceId}/comments/${commentId}/reply`,
        { text }
      );
      
      setComments(comments.map(c => {
        if (c._id === commentId) {
          const updatedReplies = [...(c.replies || []), response.data];
          // Re-sort: Author replies first, then by date
          updatedReplies.sort((a, b) => {
            if (a.isAuthorReply && !b.isAuthorReply) return -1;
            if (!a.isAuthorReply && b.isAuthorReply) return 1;
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      }));
      
      setReplyText({ ...replyText, [commentId]: "" });
      setShowReplyInput({ ...showReplyInput, [commentId]: false });
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const isAuthor = (userId) => userId === experienceAuthorId;

  return (
    <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-default)" }}>
      <h2 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        Discussion Forum
      </h2>

      {/* Post a Question */}
      {currentUserId && (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            className="w-full p-4 rounded-lg text-sm resize-none focus:outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              minHeight: "100px"
            }}
            placeholder="Ask a question or share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "var(--border-hover)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--text-primary)",
                color: "var(--bg-primary)",
                opacity: (loading || !newComment.trim()) ? 0.5 : 1
              }}
            >
              {loading ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: "var(--text-tertiary)" }}>
            No questions yet. Be the first to ask!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="group">
              <div 
                className="p-4 rounded-lg mb-2"
                style={{ 
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-default)"
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                    {comment.user?.name} {isAuthor(comment.user?._id) && 
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase bg-blue-500/10 text-blue-500">Author</span>
                    }
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {comment.text}
                </p>
                
                {/* Reply Button - Visible to all logged-in users */}
                {currentUserId && (
                  <button 
                    onClick={() => setShowReplyInput({ ...showReplyInput, [comment._id]: !showReplyInput[comment._id] })}
                    className="mt-3 text-xs font-medium transition-all"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {showReplyInput[comment._id] ? "Cancel" : (currentUserId === experienceAuthorId ? "Reply as Author" : "Reply")}
                  </button>
                )}
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 space-y-2 mt-2">
                  {comment.replies.map((reply) => (
                    <div 
                      key={reply._id}
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: "var(--bg-tertiary)",
                        border: "1px solid var(--border-default)",
                        borderLeft: reply.isAuthorReply ? "3px solid var(--text-primary)" : "1px solid var(--border-default)"
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[11px] font-bold" style={{ color: "var(--text-secondary)" }}>
                          {reply.user?.name} {reply.isAuthorReply && 
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] uppercase bg-green-500/10 text-green-500">Response</span>
                          }
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input Area */}
              {showReplyInput[comment._id] && (
                <div className="ml-8 mt-2">
                  <textarea
                    className="w-full p-3 rounded-lg text-sm resize-none focus:outline-none transition-all"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-primary)",
                      minHeight: "80px"
                    }}
                    placeholder="Write your reply..."
                    value={replyText[comment._id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                  />
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => handleSubmitReply(comment._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: "var(--text-primary)",
                        color: "var(--bg-primary)"
                      }}
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumSection;
