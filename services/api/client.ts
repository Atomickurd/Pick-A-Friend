import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { firebaseAuth } from '../firebase/auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Firebase ID token to every request
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await firebaseAuth.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error shape
apiClient.interceptors.response.use(
  (r: AxiosResponse) => r,
  (err: AxiosError<{ error?: string }>) => {
    const message: string =
      (err.response?.data?.error) ?? err.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  },
);
