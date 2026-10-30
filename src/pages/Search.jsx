import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  LoaderCircle,
  Users,
  FileText,
  UserRound,
} from "lucide-react";

import useDebounce from "../hooks/useDebounce.js";
import usePosts from "../hooks/usePosts.js";
import PostCard from "../components/posts/PostCard.jsx";
import { searchUsers } from "../services/user.service.js";

const Search = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("posts");

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 300);
  const query = debouncedSearch.trim();

  // Posts search — existing hook and actions
  const {
    posts,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
    refetch: refetchPosts,
    toggleLike,
    isLiking,
    likeVariables,
    toggleSave,
    isSaving,
    saveVariables,
  } = usePosts({
    page: 1,
    limit: 10,
    ...(query ? { search: query } : {}),
  });

  // People search — existing backend search API
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["user-search", query],
    queryFn: () => searchUsers(query),
    enabled: Boolean(query) && activeTab === "people",
    staleTime: 30_000,
  });

  const users = usersResponse?.users ?? usersResponse?.data?.users ?? [];

  const clearSearch = () => setSearch("");

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 pb-24 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Search</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover people and posts from the community.
          </p>
        </header>

        {/* Search input */}
        <div className="relative mb-5">
          <SearchIcon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              activeTab === "posts"
                ? "Search posts or authors..."
                : "Search people by name..."
            }
            aria-label="Search"
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-11 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-xl border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "posts"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText size={17} />
            Posts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("people")}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === "people"
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users size={17} />
            People
          </button>
        </div>

        {/* Empty search state */}
        {!query ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
            <SearchIcon size={32} className="mx-auto text-gray-300" />
            <h2 className="mt-3 font-semibold text-gray-800">
              Start searching
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "posts"
                ? "Enter a keyword to find posts and authors."
                : "Enter a name to discover people."}
            </p>
          </div>
        ) : activeTab === "posts" ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800">Post results</h2>

              {!isPostsLoading && !isPostsError && (
                <span className="text-sm text-gray-500">
                  {posts.length} posts
                </span>
              )}
            </div>

            {isPostsLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
                <LoaderCircle size={20} className="animate-spin" />
                Searching posts...
              </div>
            ) : isPostsError ? (
              <div className="rounded-xl border border-red-100 bg-white p-6 text-center">
                <p className="text-sm text-red-600">
                  {postsError?.message || "Unable to search posts."}
                </p>
                <button
                  type="button"
                  onClick={() => refetchPosts()}
                  className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Try again
                </button>
              </div>
            ) : posts.length === 0 ? (
              <EmptyResults message="No posts found. Try another keyword." />
            ) : (
              <div className="space-y-5">
                {posts.map((post) => {
                  const postId = post._id ?? post.id;

                  return (
                    <PostCard
                      key={postId}
                      post={post}
                      toggleLike={toggleLike}
                      isLiking={
                        isLiking &&
                        String(likeVariables?.postId) === String(postId)
                      }
                      toggleSave={toggleSave}
                      isSaving={
                        isSaving &&
                        String(saveVariables?.postId) === String(postId)
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800">People results</h2>
            </div>

            {isUsersLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
                <LoaderCircle size={20} className="animate-spin" />
                Searching people...
              </div>
            ) : isUsersError ? (
              <div className="rounded-xl border border-red-100 bg-white p-6 text-center">
                <p className="text-sm text-red-600">
                  {usersError?.message || "Unable to search people."}
                </p>
                <button
                  type="button"
                  onClick={() => refetchUsers()}
                  className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Try again
                </button>
              </div>
            ) : users.length === 0 ? (
              <EmptyResults message="No people found. Try another name." />
            ) : (
              <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white">
                {users.map((person) => {
                  const userId = person.id ?? person._id;

                  return (
                    <button
                      key={userId}
                      type="button"
                      onClick={() => navigate(`/profile/${userId}`)}
                      className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-gray-50 sm:p-5"
                    >
                      {person.avatar ? (
                        <img
                          src={person.avatar}
                          alt={person.name || "User"}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                          <UserRound size={23} className="text-indigo-500" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {person.name}
                        </p>

                        {person.bio && (
                          <p className="mt-0.5 truncate text-sm text-gray-500">
                            {person.bio}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          {person.followersCount ?? 0} followers
                          {" · "}
                          {person.followingCount ?? 0} following
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

const EmptyResults = ({ message }) => (
  <div className="rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
    <SearchIcon size={32} className="mx-auto text-gray-300" />
    <p className="mt-3 text-sm text-gray-500">{message}</p>
  </div>
);

export default Search;
