import { get } from "../api/apiHelper.js";
import { DASHBOARD_STATS_URL } from "../api/urlHelper.js";

export const getDashboardStats = async () => get(DASHBOARD_STATS_URL);
