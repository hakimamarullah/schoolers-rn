import { CONFIG } from '@/constants/common';
import configService from '@/services/config.service';
import sessionService from '@/services/session.service';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as Location from 'expo-location';
import StorageService from '../services/storage.service';

let apiClientInstance: AxiosInstance | null = null;
let apiClientInstanceInsecure: AxiosInstance | null = null;

const clients: Record<string, AxiosInstance | null> = {
  secure: apiClientInstance,
  insecure: apiClientInstanceInsecure,
};

/**
 * Initialize API client with host from storage
 */
export const initializeApiClient = async (): Promise<void> => {
  const host = await configService.getApiHost();

  if (isApiClientInitialized()) return;
  if (!host) throw new Error('API host not configured. Please setup host first.');

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


  setupLocationInterceptor(apiClientInstance);
  setupLocationInterceptor(apiClientInstanceInsecure);

  clients.secure = apiClientInstance;
  clients.insecure = apiClientInstanceInsecure;

  console.log('API Client initialized with base URL:', baseURL);
};

/**
 * Add Authorization header & handle errors
 */
const setupInterceptor = (instance: AxiosInstance, isSecure: boolean) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (isSecure) {
        const token = await StorageService.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('[Request Error]', error);
      return Promise.reject(error);
    }
  );

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
};

let cachedLocation: { lat: number; lon: number; timestamp: number } | null = null;
const LOCATION_CACHE_DURATION = 3 * 60 * 1000; // 5 minutes

const setupLocationInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const now = Date.now();
        
        // Use cached location if fresh enough
        if (cachedLocation && (now - cachedLocation.timestamp) < LOCATION_CACHE_DURATION) {
          const baseUA = (config.headers?.['User-Agent'] as string) ?? 
            `SchoolersMobile/${CONFIG.APP_VERSION}`;
          config.headers['User-Agent'] = `${baseUA};${cachedLocation.lat};${cachedLocation.lon}`;
          return config;
        }

        // Fetch new location with timeout
        const location = await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 30000))
        ]) as Location.LocationObject;

        cachedLocation = {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          timestamp: now
        };

        const baseUA = (config.headers?.['User-Agent'] as string) ?? 
          `SchoolersMobile/${CONFIG.APP_VERSION}`;
        config.headers['User-Agent'] = `${baseUA};${cachedLocation.lat};${cachedLocation.lon}`;
        
      } catch (err) {
        console.warn('[Location] Could not retrieve location', err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

/**
 * Getters
 */
export const getSecureApiClient = (): AxiosInstance => getClient('secure');
export const getApiClient = (): AxiosInstance => getClient('insecure');

const getClient = (name: keyof typeof clients): AxiosInstance => {
  const instance = clients[name];
  if (!instance) {
    throw new Error(`API client ${name} not initialized. Call initializeApiClient() first.`);
  }
  return instance;
};

export const isApiClientInitialized = (): boolean =>
  apiClientInstance !== null && apiClientInstanceInsecure !== null;

export const destroyApiClient = (): void => {
  apiClientInstance = null;
  apiClientInstanceInsecure = null;
};
