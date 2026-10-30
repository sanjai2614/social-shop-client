import api from "./axios";

// GET request
export const get = async (url, config = {}) => {
  const { data } = await api.get(url, config);
  return data;
};

// POST request
export const post = async (url, payload = {}, config = {}) => {
  const { data } = await api.post(url, payload, config);
  return data;
};

// PUT request
export const put = async (url, payload = {}, config = {}) => {
  const { data } = await api.put(url, payload, config);
  return data;
};

// PATCH request
export const patch = async (url, payload = {}, config = {}) => {
  const { data } = await api.patch(url, payload, config);
  return data;
};

// DELETE request
export const del = async (url, payload = {}, config = {}) => {
  const { data } = await api.delete(url, {
    ...config,
    data: payload,
  });
  return data;
};

 // Multipart form-data POST request
export const postForm = async (url, formData, config = {}) => {
  const { data } = await api.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
    },
  });

  return data;
};


// Multipart form-data PATCH request
export const patchForm = async (url, formData, config = {}) => {
  const { data } = await api.patch(url, formData, {
    ...config,
    headers: {
      ...config.headers,
    },
  });
  return data;
};
