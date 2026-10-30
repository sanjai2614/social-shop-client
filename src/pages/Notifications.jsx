
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
  RefreshCw,
  UserRound,
} from "lucide-react";

import useNotification from "../hooks/useNotification.js";

const getNotificationIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "like":
      return <Heart size={20} className="text-pink-500" />;

    case "comment":
      return <MessageCircle size={20} className="text-blue-500" />;

    case "follow":
      return <UserPlus size={20} className="text-indigo-500" />;

    default:
      return <Bell size={20} className="text-gray-500" />;
  }
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    markAsReadAsync,
    markAllAsReadAsync,
    isMarkingRead,
    isMarkingAllRead,
  } = useNotification();

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead || isMarkingRead) return;

    try {
      await markAsReadAsync(notification._id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadAsync();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh notifications"
              className="rounded-full border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <CheckCheck size={17} />
                <span className="hidden sm:inline">
                  {isMarkingAllRead ? "Updating..." : "Mark all read"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="space-y-5 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-3"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="px-6 py-12 text-center">
              <Bell
                size={32}
                className="mx-auto mb-3 text-gray-400"
              />

              <p className="font-medium text-gray-800">
                Couldn't load notifications
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {error?.message || "Something went wrong."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                <Bell size={28} className="text-indigo-600" />
              </div>

              <h2 className="font-semibold text-gray-900">
                No notifications yet
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
                When someone likes or comments on your posts, you'll see
                their activity here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const sender =
                  notification.sender ?? notification.user;

                return (
                  <div
                    key={notification._id}
                    className={`flex gap-3 p-4 transition-colors sm:p-5 ${
                      notification.isRead
                        ? "bg-white hover:bg-gray-50"
                        : "bg-indigo-50/60 hover:bg-indigo-50"
                    }`}
                  >
                    {/* Avatar */}
                    {sender?.avatar ? (
                      <img
                        src={sender.avatar}
                        alt={sender.name || "User"}
                        className="h-11 w-11 shrink-0 rounded-full border border-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <UserRound
                          size={22}
                          className="text-gray-500"
                        />
                      </div>
                    )}

                    {/* Notification Content */}
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification)}
                      disabled={isMarkingRead || notification.isRead}
                      className="min-w-0 flex-1 text-left disabled:cursor-default"
                    >
                      <div className="flex items-start gap-2">
                        <span className="mt-1 shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-6 text-gray-800">
                            {sender?.name && (
                              <span className="font-semibold text-gray-900">
                                {sender.name}{" "}
                              </span>
                            )}

                            {notification.message ||
                              `interacted with your post.`}
                          </p>

                          {notification.post?.content && (
                            <p className="mt-1 truncate text-xs text-gray-500">
                              Post: {notification.post.content}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-gray-400">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <span
                            className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Notifications;
