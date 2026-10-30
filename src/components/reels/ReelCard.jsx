
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  ShoppingBag,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  Send,
  LoaderCircle,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  likeReel,
  unlikeReel,
  getReelComments,
  createReelComment,
  deleteReelComment
} from "../../services/reel.service";

const BRAND = "text-[var(--brand,#84cc16)]";

function Avatar({ user, size = "h-10 w-10" }) {
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 font-semibold text-white ring-1 ring-white/20`}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "User"}
          className="h-full w-full object-cover"
        />
      ) : (
        user?.name?.charAt(0)?.toUpperCase() || "U"
      )}
    </div>
  );
}

function CommentsSheet({ reelId, isOpen, onClose,currentUserId }) {
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const commentsQuery = useQuery({
    queryKey: ["reel-comments", reelId],
    queryFn: () => getReelComments(reelId),
    enabled: isOpen,
  });

  const response = commentsQuery.data;
  const comments = Array.isArray(response)
    ? response
    : response?.comments ?? response?.data?.comments ?? [];

  const commentMutation = useMutation({
    mutationFn: (content) => createReelComment(reelId, content),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({
        queryKey: ["reel-comments", reelId],
      });
      queryClient.invalidateQueries({ queryKey: ["reels"] });
    },
  });


  const deleteCommentMutation = useMutation({
  mutationFn: (commentId) =>
    deleteReelComment(reelId, commentId),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["reel-comments", reelId],
    });

    queryClient.invalidateQueries({
      queryKey: ["reels"],
    });
  },
});

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const submitComment = (event) => {
    event.preventDefault();
    const content = commentText.trim();

    if (!content || commentMutation.isPending) return;
    commentMutation.mutate(content);
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end bg-black/65 backdrop-blur-[2px] sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Reel comments"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[78dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#141414] text-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-semibold">Comments</h2>
            <p className="mt-0.5 text-xs text-white/45">
              Join the conversation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-40 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5">
          {commentsQuery.isPending && (
            <div className="flex justify-center py-10">
              <LoaderCircle className="animate-spin text-lime-400" />
            </div>
          )}

          {commentsQuery.isError && (
            <div className="py-8 text-center">
              <p className="text-sm text-white/60">
                Couldn't load comments.
              </p>
              <button
                type="button"
                onClick={() => commentsQuery.refetch()}
                className={`mt-3 text-sm font-semibold ${BRAND}`}
              >
                Try again
              </button>
            </div>
          )}

          {!commentsQuery.isPending &&
            !commentsQuery.isError &&
            comments.length === 0 && (
              <div className="py-10 text-center">
                <MessageCircle
                  size={32}
                  className="mx-auto mb-3 text-white/30"
                />
                <p className="font-medium">No comments yet</p>
                <p className="mt-1 text-sm text-white/45">
                  Be the first to share your thoughts.
                </p>
              </div>
            )}

          
{comments.map((comment) => {
  const commentUserId =
    comment.user?._id ?? comment.user;

  const isOwnComment =
    currentUserId &&
    String(commentUserId) === String(currentUserId);

  return (
    <article key={comment._id} className="flex gap-3">
      <Avatar user={comment.user} size="h-9 w-9" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {comment.user?.name || "User"}
        </p>

        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-white/75">
          {comment.content}
        </p>

        <p className="mt-1.5 text-[11px] text-white/35">
          {comment.createdAt
            ? new Date(comment.createdAt).toLocaleDateString()
            : ""}
        </p>
      </div>

      {isOwnComment && (
        <button
          type="button"
          disabled={deleteCommentMutation.isPending}
          onClick={() => {
            if (window.confirm("Delete this comment?")) {
              deleteCommentMutation.mutate(comment._id);
            }
          }}
          aria-label="Delete your comment"
          title="Delete comment"
          className="self-start rounded-full p-2 text-white/40 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
        >
          <Trash2 size={16} />
        </button>
      )}
    </article>
  );
})}

        </div>

        <form
          onSubmit={submitComment}
          className="border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-2 pl-4 focus-within:border-lime-400/50">
            <input
              ref={inputRef}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add a comment..."
              maxLength={1000}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || commentMutation.isPending}
              aria-label="Post comment"
              className={`rounded-xl p-2.5 transition disabled:opacity-30 ${BRAND} hover:bg-white/10`}
            >
              {commentMutation.isPending ? (
                <LoaderCircle size={19} className="animate-spin" />
              ) : (
                <Send size={19} />
              )}
            </button>
          </div>

          {commentMutation.isError && (
            <p className="mt-2 px-2 text-xs text-red-400">
              Comment couldn't be posted. Please try again.
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

export default function ReelCard({ reel, onViewProducts,currentUserId }) {
  const videoRef = useRef(null);
  const queryClient = useQueryClient();

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(Boolean(reel.isLiked));
  const [likesCount, setLikesCount] = useState(reel.likesCount ?? 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [commentsCount, setCommentsCount] = useState(
  reel.commentsCount ?? 0,
);

  const author = reel.author;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.7 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reel.videoUrl]);

  useEffect(() => {
  setIsLiked(Boolean(reel.isLiked));
  setLikesCount(reel.likesCount ?? 0);
  setCommentsCount(reel.commentsCount ?? 0);
}, [
  reel.isLiked,
  reel.likesCount,
  reel.commentsCount,
]);

  const likeMutation = useMutation({
  mutationFn: (shouldLike) =>
    shouldLike
      ? likeReel(reel._id)
      : unlikeReel(reel._id),

  onSuccess: (response, shouldLike) => {
    // Backend isLiked return pannina adha use pannuvom.
    // Illana namma requested action-a use pannuvom.
    const nextLiked =
      typeof response?.isLiked === "boolean"
        ? response.isLiked
        : shouldLike;

    setIsLiked(nextLiked);

    // Backend count return pannina authoritative count use pannuvom.
    // Illana optimistic count-a preserve pannuvom.
    if (typeof response?.likesCount === "number") {
      setLikesCount(response.likesCount);
    }

    queryClient.invalidateQueries({
      queryKey: ["reels"],
    });
  },

  onError: (error) => {
    console.error("Reel like failed:", error);
  },
});

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = () => {
  if (likeMutation.isPending) return;

  const previousLiked = isLiked;
  const previousCount = likesCount;
  const shouldLike = !previousLiked;

  // Instant UI update
  setIsLiked(shouldLike);
  setLikesCount(
    Math.max(
      0,
      previousCount + (shouldLike ? 1 : -1),
    ),
  );

  // Explicit true = Like, false = Unlike
  likeMutation.mutate(shouldLike, {
    onError: () => {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    },
  });
};

 
const handleShare = async () => {
  const reelUrl = `${window.location.origin}/reels?reel=${reel._id}`;

  if (typeof navigator.share !== "function") {
    window.prompt("Copy this reel link:", reelUrl);
    return;
  }

  try {
    await navigator.share({
      title: "Check out this reel",
      text: reel.caption || "Watch this reel!",
      url: reelUrl,
    });
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Share failed:", error);
    }
  }
};


  return (
    <section className="relative h-dvh w-full snap-start snap-always overflow-hidden bg-black text-white">
      {!videoError && (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="absolute inset-0 h-full w-full cursor-pointer object-contain"
          playsInline
          loop
          muted={isMuted}
          preload="metadata"
          onClick={togglePlayback}
          onError={() => setVideoError(true)}
        />
      )}

      {videoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950">
          <Play size={36} className="text-white/30" />
          <p className="text-sm text-white/60">Video couldn't be loaded.</p>
          <button
            type="button"
            onClick={() => {
              setVideoError(false);
              if (videoRef.current) videoRef.current.load();
            }}
            className={`text-sm font-semibold ${BRAND}`}
          >
            Try again
          </button>
        </div>
      )}

      {/* Contrast gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-36 bg-linear-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[48%] bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))]">
        <div>
          <p className="text-lg font-bold tracking-tight">Reels</p>
          <div className="mt-1 h-0.5 w-7 rounded-full bg-(--brand,#84cc16)" />
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
          className="rounded-full border border-white/15 bg-black/35 p-3 shadow-lg backdrop-blur-md transition hover:bg-black/60 active:scale-95"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Play / pause overlay */}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause reel" : "Play reel"}
        className={`absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white shadow-lg backdrop-blur-sm transition ${
          isPlaying ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {isPlaying ? <Pause size={25} /> : <Play size={27} fill="white" />}
      </button>

      {/* Creator and caption */}
      <div className="absolute bottom-0 left-0 z-10 w-[calc(100%-5.25rem)] p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:w-[calc(100%-6rem)] sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <Avatar user={author} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold drop-shadow">
              {author?.name || "User"}
            </p>
            <p className="mt-0.5 text-xs text-white/65">Original video</p>
          </div>
          <MoreHorizontal size={21} className="text-white/80" />
        </div>

        {reel.caption && (
          <p className="mb-4 line-clamp-3 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-white/90 drop-shadow">
            {reel.caption}
          </p>
        )}

        {reel.taggedProducts?.length > 0 && (
          <button
            type="button"
            onClick={() => onViewProducts?.(reel.taggedProducts)}
            className="inline-flex max-w-full items-center gap-2.5 rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-left shadow-lg backdrop-blur-lg transition hover:bg-black/60 active:scale-[0.98]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(--brand,#84cc16)/20 text-(--brand,#a3e635)">
              <ShoppingBag size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-white/60">Shop this reel</span>
              <span className="block truncate text-sm font-semibold">
                View products ({reel.taggedProducts.length})
              </span>
            </span>
          </button>
        )}
      </div>

      {/* Right-side actions */}
      <div className="absolute bottom-[max(7.5rem,18dvh)] right-3 z-20 flex flex-col items-center gap-5 sm:right-5 sm:gap-6">
        <button
          type="button"
          onClick={handleLike}
          disabled={likeMutation.isPending}
          aria-label={isLiked ? "Unlike reel" : "Like reel"}
          className="group flex flex-col items-center gap-1.5 transition active:scale-90 disabled:opacity-70"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition group-hover:bg-black/45">
            <Heart
              size={29}
              strokeWidth={2.2}
              fill={isLiked ? "currentColor" : "none"}
              className={`transition duration-200 ${
                isLiked
                  ? "scale-110 text-red-500"
                  : "text-white group-hover:text-red-300"
              }`}
            />
          </span>
          <span className="text-xs font-semibold drop-shadow">
            {likesCount}
          </span>
        </button>

        <button
  type="button"
  onClick={() => setIsCommentsOpen(true)}
  aria-label="Open comments"
  className="group flex flex-col items-center gap-1.5 transition active:scale-90"
>
  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition group-hover:bg-black/45">
    <MessageCircle
      size={28}
      strokeWidth={2.1}
      className="transition group-hover:text-(--brand,#a3e635)"
    />
  </span>

  <span className="text-xs font-semibold drop-shadow">
    {commentsCount}
  </span>
</button>

        <button
  type="button"
  onClick={handleShare}
  disabled={isSharing}
  aria-label="Share reel"
  className="group flex flex-col items-center gap-1.5 transition active:scale-90 disabled:opacity-50"
>
  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm">
    <Share2 size={27} strokeWidth={2.1} />
  </span>

  <span className="text-xs font-semibold drop-shadow">
    {isSharing ? "Sharing..." : "Share"}
  </span>
</button>
      </div>

      <CommentsSheet
        reelId={reel._id}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        currentUserId={currentUserId}
      />
    </section>
  );
}
