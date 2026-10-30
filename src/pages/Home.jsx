import { RefreshCw } from "lucide-react";
import usePosts from "../hooks/usePosts.js";
import PostCard from "../components/posts/PostCard.jsx";

const Home = () => {
  const {
    posts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    toggleLike,
    isLiking,
    likeVariables,
    toggleSave,
  isSaving,
  saveVariables,
  } = usePosts({ page: 1, limit: 10 });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover what the community is sharing.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4" aria-live="polite">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="h-4 w-32 rounded bg-gray-200" />
                </div>

                <div className="h-56 rounded-lg bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
            <p className="font-medium text-red-600">
              {error?.response?.data?.message ||
                error?.message ||
                "Unable to load posts."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              {isFetching ? "Retrying..." : "Try again"}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h2 className="font-semibold text-gray-800">No posts yet</h2>
            <p className="mt-2 text-sm text-gray-500">
              New community posts will appear here.
            </p>
          </div>
        )}

        {/* Posts feed */}
        {!isLoading && !isError && posts.length > 0 && (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard
  key={post._id || post.id}
  post={post}
  toggleLike={toggleLike}
  isLiking={
    isLiking &&
    likeVariables?.postId === (post._id || post.id)
  }
  toggleSave={toggleSave}
  isSaving={
    isSaving &&
    saveVariables?.postId === (post._id || post.id)
  }
/>
            ))}

            {/* Refresh feed */}
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              {isFetching ? "Refreshing..." : "Refresh feed"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
