import { CONFIG } from '@/constants/common';
import configService from '@/services/config.service';
import sessionService from '@/services/session.service';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import StorageService from '../services/storage.service';

// API client instance (initially null)
let apiClientInstance: AxiosInstance | null = null;
let apiClientInstanceInsecure: AxiosInstance | null = null;
const clients: Record<string, AxiosInstance | null> = {
  secure: apiClientInstance,
  insecure: apiClientInstanceInsecure
}

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

  apiClientInstanceInsecure = axios.create({
    baseURL,
    timeout: CONFIG.API_TIMEOUT,
  });
  
  setupInterceptor(apiClientInstance, true);
  setupInterceptor(apiClientInstanceInsecure, false);

  clients["secure"] = apiClientInstance;
  clients["insecure"] = apiClientInstanceInsecure;

  
  console.log('API Client initialized with base URL:', baseURL);
};

const setupInterceptor = (instance: AxiosInstance, isSecure: boolean) => {

  // Request interceptor - Add auth token
  if (isSecure) {
    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
        console.log(
          isSecure,
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
  }

  // Response interceptor - Handle 401
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await StorageService.clearAll();
        await sessionService.signOut();
      }
      return Promise.reject(error);
    }
  );

}

/**
 * Get API client instance
 * Throws error if not initialized
 */



export const getSecureApiClient = (): AxiosInstance => getClient("secure");

export const getApiClient = (): AxiosInstance => getClient("insecure");

const getClient = (name: keyof typeof clients): AxiosInstance => {
  const instance = clients[name];
  if (!instance) {
    throw new Error(`API client ${name} not initialized. Call initializeApiClient() first.`);
  }
  return instance;
};



/**
 * Check if API client is initialized
 */
export const isApiClientInitialized = (): boolean => {
  return apiClientInstance !== null && apiClientInstanceInsecure !== null;
};

/**
 * Destroy API client (when host changes)
 */
export const destroyApiClient = (): void => {
  apiClientInstance = null;
  apiClientInstanceInsecure = null;
};

