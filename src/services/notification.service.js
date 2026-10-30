import { get, patch } from "../api/apiHelper.js";

import {
  NOTIFICATIONS_URL,
  NOTIFICATION_READ_URL,
  NOTIFICATIONS_READ_ALL_URL,
} from "../api/urlHelper.js";

export const getNotifications = (params = {}) => get(NOTIFICATIONS_URL, { params });

export const markNotificationAsRead = (id) => patch(NOTIFICATION_READ_URL(id));

export const markAllNotificationsAsRead = () => patch(NOTIFICATIONS_READ_ALL_URL);
