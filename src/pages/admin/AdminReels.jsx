
import { useEffect, useState } from "react";
import { Search, RefreshCw, Clapperboard, Play } from "lucide-react";
import { useAdminReels } from "../../hooks/useAdminModeration.js";

const LIMIT = 10;

const AdminReels = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");
  const [previewReel, setPreviewReel] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    reels,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    updateReelStatus,
    isUpdatingReel,
  } = useAdminReels({
    page,
    limit: LIMIT,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
  });

  const handleStatusChange = async (reel) => {
    const nextStatus = !reel.isActive;
    const action = nextStatus ? "restore" : "deactivate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this reel?`,
      )
    ) {
      return;
    }

    setActionError("");

    try {
      await updateReelStatus({
        reelId: reel._id,
        isActive: nextStatus,
      });
    } catch (err) {
      setActionError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update reel.",
      );
    }
  };

  const startItem = total ? (page - 1) * LIMIT + 1 : 0;
  const endItem = Math.min(page * LIMIT, total);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reel Moderation
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review reels and manage their visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search reel caption or author..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-400"
        >
          <option value="active">Active reels</option>
          <option value="inactive">Inactive reels</option>
          <option value="all">All reels</option>
        </select>
      </div>

      {actionError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-white p-6">
          <p className="font-medium text-red-700">
            Failed to load reels
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message || "Something went wrong."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Reels</h2>
            <span className="text-sm text-gray-500">
              {total} total
            </span>
          </div>

          {isLoading ? (
            <p className="p-10 text-center text-sm text-gray-500">
              Loading reels...
            </p>
          ) : reels.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              <Clapperboard
                size={32}
                className="mx-auto mb-3 text-gray-300"
              />
              No reels found.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {reels.map((reel) => (
                <article key={reel._id} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setPreviewReel(reel)}
                      className="group relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-950 sm:w-32"
                      aria-label="Preview reel"
                    >
                      {reel.videoUrl ? (
                        <video
                          src={reel.videoUrl}
                          preload="metadata"
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Clapperboard
                            size={32}
                            className="text-white/50"
                          />
                        </div>
                      )}

                      <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white opacity-0 transition group-hover:opacity-100">
                        <Play size={28} fill="currentColor" />
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            reel.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {reel.isActive ? "Active" : "Inactive"}
                        </span>

                        <span className="text-xs text-gray-400">
                          {reel.createdAt
                            ? new Date(reel.createdAt).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm text-gray-800">
                        {reel.caption || "No caption"}
                      </p>

                      <p className="mt-3 text-xs text-gray-500">
                        By {reel.author?.name || "Unknown author"}
                      </p>

                      {reel.taggedProducts?.length > 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Tagged products: {reel.taggedProducts.length}
                        </p>
                      )}
                    </div>

                    <div className="sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(reel)}
                        disabled={isUpdatingReel}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
                          reel.isActive
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {isUpdatingReel
                          ? "Updating..."
                          : reel.isActive
                            ? "Deactivate"
                            : "Restore"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing {startItem}–{endItem} of {total}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => current - 1)}
                  disabled={page <= 1 || isFetching}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  {page} / {Math.max(totalPages, 1)}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={
                    page >= totalPages ||
                    isFetching ||
                    totalPages === 0
                  }
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {previewReel && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewReel(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Reel preview"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900">
                Reel preview
              </h2>
              <button
                type="button"
                onClick={() => setPreviewReel(null)}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <video
              key={previewReel._id}
              src={previewReel.videoUrl}
              controls
              autoPlay
              playsInline
              className="max-h-[70dvh] w-full rounded-xl bg-black"
            />

            <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm text-gray-700">
              {previewReel.caption || "No caption"}
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminReels;
