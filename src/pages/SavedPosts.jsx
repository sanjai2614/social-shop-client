import { Bookmark, RefreshCw } from "lucide-react";
import useSavedPosts from "../hooks/useSavedPosts.js";
import PostCard from "../components/posts/PostCard.jsx";
import usePosts from "../hooks/usePosts.js";

const SavedPosts = () => {
  const { posts, isLoading, isError, error, refetch, isFetching } =
    useSavedPosts();

  const {
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
        <div className="mb-6 flex items-center gap-3">
          <Bookmark className="h-7 w-7 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Posts you have bookmarked.
            </p>
          </div>
        </div>

        {isLoading && (
          <p className="rounded-xl bg-white p-6 text-center text-gray-500">
            Loading saved posts...
          </p>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
            <p className="text-red-600">
              {error?.response?.data?.message || "Unable to load saved posts."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <Bookmark className="mx-auto h-10 w-10 text-gray-400" />
            <h2 className="mt-3 font-semibold text-gray-800">
              No saved posts yet
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Bookmark a post to find it here later.
            </p>
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="space-y-5">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                toggleLike={toggleLike}
                isLiking={isLiking && likeVariables?.postId === post._id}
                toggleSave={toggleSave}
                isSaving={isSaving && saveVariables?.postId === post._id}
              />
            ))}

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              {isFetching ? "Refreshing..." : "Refresh saved posts"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedPosts;
