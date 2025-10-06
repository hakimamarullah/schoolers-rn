import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import StorageService from '../services/storage.service';
import { CONFIG } from '@/constants/common';
import configService from '@/services/config.service';
import sessionService from '@/services/session.service';

// API client instance (initially null)
let apiClientInstance: AxiosInstance | null = null;

/**
 * Initialize API client with host from storage
 * MUST be called after host is configured
 */
export const initializeApiClient = async (): Promise<void> => {
  const host = await configService.getApiHost();
  
  if (isApiClientInitialized()) {
    return;
  }

  if (!host) {
    throw new Error('API host not configured. Please setup host first.');
  }

  const baseURL = `${host}/api`;

  apiClientInstance = axios.create({
    baseURL,
    timeout: CONFIG.API_TIMEOUT,
  });
  

  // Request interceptor - Add auth token
  apiClientInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(
      config.headers,
      config.method?.toUpperCase(),
      config.baseURL,
      config.url,
      config.data || ''
    );

    const token = await StorageService.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

  // Response interceptor - Handle 401
  apiClientInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      console.log({response_code: error.response?.status})
      if (error.response?.status === 401) {
        await StorageService.clearAll();
        await sessionService.signOut();
      }
      return Promise.reject(error);
    }
  );

  console.log('API Client initialized with base URL:', baseURL);
};

/**
 * Get API client instance
 * Throws error if not initialized
 */
export const getApiClient = (): AxiosInstance => {
  if (!apiClientInstance) {
    throw new Error('API client not initialized. Call initializeApiClient() first.');
  }
  return apiClientInstance;
};

/**
 * Check if API client is initialized
 */
export const isApiClientInitialized = (): boolean => {
  return apiClientInstance !== null;
};

/**
 * Destroy API client (when host changes)
 */
export const destroyApiClient = (): void => {
  apiClientInstance = null;
};

// Export default for backward compatibility
export default {
  get client() {
    return getApiClient();
  },
  initialize: initializeApiClient,
  isInitialized: isApiClientInitialized,
  destroy: destroyApiClient,
};
