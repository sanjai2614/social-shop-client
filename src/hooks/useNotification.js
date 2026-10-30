
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service.js";

const NOTIFICATION_QUERY_KEY = ["notifications"];

const useNotification = (params = {}) => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const notificationQuery = useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, params],
    queryFn: () => getNotifications(params),
  });

  // Mark one notification as read
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
      });
    },
  });

  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
      });
    },
  });

  const response = notificationQuery.data;

  return {
    notifications: response?.data?.notifications ?? [],
    unreadCount: response?.unreadCount ?? 0,
    pagination: response?.pagination ?? null,

    isLoading: notificationQuery.isLoading,
    isFetching: notificationQuery.isFetching,
    isError: notificationQuery.isError,
    error: notificationQuery.error,
    refetch: notificationQuery.refetch,

    markAsRead: markReadMutation.mutate,
    markAsReadAsync: markReadMutation.mutateAsync,
    isMarkingRead: markReadMutation.isPending,
    markReadError: markReadMutation.error,

    markAllAsRead: markAllReadMutation.mutate,
    markAllAsReadAsync: markAllReadMutation.mutateAsync,
    isMarkingAllRead: markAllReadMutation.isPending,
    markAllReadError: markAllReadMutation.error,
  };
};

export default useNotification;
