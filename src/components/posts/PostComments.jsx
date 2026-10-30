
import { useState } from "react";
import { MessageCircle, Send, UserRound } from "lucide-react";
import usePostComments from "../../hooks/usePostComments.js";
import { formatDate } from "../../utils/dateHelper.js";

const PostComments = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    comments,
    isLoading,
    isError,
    error,
    addComment,
    isAddingComment,
  } = usePostComments(postId, isOpen);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setSubmitError("Comment cannot be empty.");
      return;
    }

    setSubmitError("");

    try {
      await addComment(trimmedContent);
      setContent("");
    } catch {
      setSubmitError("Unable to add comment. Please try again.");
    }
  };

  return (
    <section className="border-t border-gray-100">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-indigo-600"
      >
        <MessageCircle size={19} />
        {isOpen ? "Hide comments" : "View comments"}
      </button>

      {isOpen && (
        <div className="space-y-4 px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <label
              htmlFor={`comment-${postId}`}
              className="text-sm font-medium text-gray-700"
            >
              Add a comment
            </label>

            <div className="flex items-center gap-2">
              <input
                id={`comment-${postId}`}
                type="text"
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                  setSubmitError("");
                }}
                placeholder="Write a comment..."
                maxLength={1000}
                disabled={isAddingComment}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={isAddingComment || !content.trim()}
                aria-label="Submit comment"
                className="flex items-center justify-center rounded-lg bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={17} />
              </button>
            </div>

            {submitError && (
              <p role="alert" className="text-sm text-red-600">
                {submitError}
              </p>
            )}
          </form>

          {isLoading && (
            <p className="text-sm text-gray-500">
              Loading comments...
            </p>
          )}

          {isError && (
            <p role="alert" className="text-sm text-red-600">
              {error?.response?.data?.message ||
                "Unable to load comments."}
            </p>
          )}

          {!isLoading && !isError && comments.length === 0 && (
            <p className="py-2 text-sm text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}

          {!isError && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment) => (
                <article
                  key={comment._id}
                  className="flex items-start gap-3"
                >
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name || "User"}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <UserRound
                        size={18}
                        className="text-gray-500"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 rounded-xl bg-gray-50 px-3 py-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.author?.name || "User"}
                      </p>

                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PostComments;
