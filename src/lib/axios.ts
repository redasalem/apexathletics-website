import axios, { AxiosError } from 'axios';

interface ExtendedAxiosError<T = unknown> extends AxiosError<T> {
  friendlyMessage?: string;
  originalMessage?: string;
}

const normalizeApiUrl = (url: string) => url.replace(/\/+$/, '');

const api = axios.create({
  baseURL: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL || 'https://apexathletics-apis.vercel.app/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Increased default request timeout to reduce unexpected aborts on slower networks
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    // Preserve original message, but expose a user-friendly message separately
    const extendedError = error as ExtendedAxiosError<{ message?: string }>;
    const originalMessage = extendedError.message;
    const friendlyMessage = extendedError.response?.data?.message;

    // Attach a non-destructive friendlyMessage property
    extendedError.friendlyMessage = friendlyMessage ||
      (extendedError.response?.status === 429 ? 'Too many requests. Please wait a moment and try again.' : undefined) ||
      (extendedError.code === 'ECONNABORTED' ? 'The request timed out. Please check your connection and try again.' : undefined) ||
      undefined;

    // Broadcast unauthorized events to allow listeners (e.g., auth layer) to react
    if (typeof window !== 'undefined' && extendedError.response?.status === 401) {
      try { window.dispatchEvent(new CustomEvent('auth:unauthorized')); } catch {
        /* ignore */
      }
    }

    // Keep original error intact for logging and debugging
    extendedError.originalMessage = originalMessage;

    return Promise.reject(extendedError);
  }
);

export default api;