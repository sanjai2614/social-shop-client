import { patchForm } from "../api/apiHelper.js";
import { UPLOAD_AVATAR_URL } from "../api/urlHelper.js";

export const uploadAvatar = async (formData, onUploadProgress) => {
  const response = await patchForm(UPLOAD_AVATAR_URL, formData, {
    onUploadProgress: (event) => {
      if (!event.total) return;

      const percentage = Math.round(
        (event.loaded * 100) / event.total,
      );

      onUploadProgress?.(percentage);
    },
  });

  return response?.data;
};