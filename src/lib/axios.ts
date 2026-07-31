import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ExtendedAxiosError<T = unknown> extends AxiosError<T> {
  friendlyMessage?: string;
  originalMessage?: string;
}

interface RequestConfigWithId extends InternalAxiosRequestConfig {
  requestId?: symbol;
}

const normalizeApiUrl = (url: string) => url.replace(/\/+$/, '');

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
const pendingControllers = new Map<symbol, AbortController>();

const cancelPendingRequests = () => {
  pendingControllers.forEach((controller) => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  });
  pendingControllers.clear();
};

const api = axios.create({
  baseURL: normalizeApiUrl(baseURL),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config: RequestConfigWithId) => {
  const controller = new AbortController();
  const requestId = Symbol();
  config.requestId = requestId;
  config.signal = controller.signal;
  pendingControllers.set(requestId, controller);
  return config;
});

const removePendingRequest = (config?: RequestConfigWithId) => {
  const requestId = config?.requestId;
  if (requestId) {
    pendingControllers.delete(requestId);
  }
};
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config as RequestConfigWithId);
    return response;
  },
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RequestConfigWithId & { _retry?: boolean };
    removePendingRequest(originalRequest);

    // Preserve original message, but expose a user-friendly message separately
    const extendedError = error as ExtendedAxiosError<{ message?: string }>;
    const originalMessage = extendedError.message;
    const friendlyMessage = extendedError.response?.data?.message;

    // Attach a non-destructive friendlyMessage property
    extendedError.friendlyMessage = friendlyMessage ||
      (extendedError.response?.status === 429 ? 'Too many requests. Please wait a moment and try again.' : undefined) ||
      (extendedError.code === 'ECONNABORTED' ? 'The request timed out. Please check your connection and try again.' : undefined) ||
      undefined;

    const requestUrl = originalRequest?.url || '';
    const isAuthRoute = requestUrl.includes('/auth/login') ||
                        requestUrl.includes('/auth/register') ||
                        requestUrl.includes('/auth/refresh');

    if (typeof window !== 'undefined' && extendedError.response?.status === 401 && !isAuthRoute) {
      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await api.post('/auth/refresh');
          processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);
          if (localStorage.getItem('wasLoggedIn') === 'true') {
            localStorage.setItem('showSessionExpiredToast', 'true');
            localStorage.removeItem('wasLoggedIn');
          }
          cancelPendingRequests();
          try { window.dispatchEvent(new CustomEvent('auth:unauthorized')); } catch {
            /* ignore */
          }
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    if (typeof window !== 'undefined' && extendedError.response?.status === 401 && isAuthRoute) {
      if (localStorage.getItem('wasLoggedIn') === 'true' && !requestUrl.includes('/auth/login')) {
        localStorage.setItem('showSessionExpiredToast', 'true');
        localStorage.removeItem('wasLoggedIn');
      }
    }

    // Keep original error intact for logging and debugging
    extendedError.originalMessage = originalMessage;

    return Promise.reject(extendedError);
  }
);

export default api;