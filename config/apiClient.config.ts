import { CONFIG } from '@/constants/common';
import i18n from '@/i18n/i18n'; // Update path to your i18n config
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

const LOCATION_STORAGE_KEY = 'cached_location';
const LOCATION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

type CachedLocation = {
  lat: number;
  lon: number;
  timestamp: number;
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

  setupLocationAndLanguageInterceptor(apiClientInstance);
  setupLocationAndLanguageInterceptor(apiClientInstanceInsecure);

  clients.secure = apiClientInstance;
  clients.insecure = apiClientInstanceInsecure;

  // Prefetch location in background on initialization
  prefetchLocation();

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
      return Promise.reject(errorHandler(error));
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await StorageService.clearAll();
        await sessionService.signOut();
      }
      return Promise.reject(errorHandler(error));
    }
  );
};

/**
 * Get cached location from storage
 */
const getCachedLocation = async (): Promise<CachedLocation | null> => {
  try {
    const cached = await StorageService.getData(LOCATION_STORAGE_KEY);
    if (!cached) return null;

    const location: CachedLocation = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still fresh
    if (now - location.timestamp < LOCATION_CACHE_DURATION) {
      return location;
    }

    return null;
  } catch (error) {
    console.warn('[Location] Error reading cached location:', error);
    return null;
  }
};

/**
 * Save location to storage
 */
const saveCachedLocation = async (location: CachedLocation): Promise<void> => {
  try {
    await StorageService.saveData(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch (error) {
    console.warn('[Location] Error saving location to cache:', error);
  }
};

/**
 * Prefetch location in background (non-blocking)
 */
const prefetchLocation = async (): Promise<void> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest, // Faster than Highest
    });

    const cachedLocation: CachedLocation = {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      timestamp: Date.now(),
    };

    await saveCachedLocation(cachedLocation);
    console.log('[Location] Prefetched and cached');
  } catch (error) {
    console.warn('[Location] Prefetch failed:', error);
  }
};

/**
 * Setup interceptor for location and language headers
 */
const setupLocationAndLanguageInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        // Add language header
        const currentLanguage = i18n.language || 'en';
        config.headers['Accept-Language'] = currentLanguage;

        // Get cached location
        let cachedLocation = await getCachedLocation();

        // If no cache or expired, try to get new location (with timeout)
        if (!cachedLocation) {
          try {
            const location = await Promise.race([
              Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced, // Faster than Highest
              }),
              new Promise<null>((_, reject) =>
                setTimeout(() => reject(new Error('timeout')), 5000) // Reduced to 5s
              ),
            ]) as Location.LocationObject;

            cachedLocation = {
              lat: location.coords.latitude,
              lon: location.coords.longitude,
              timestamp: Date.now(),
            };

            // Save to storage for next time (non-blocking)
            saveCachedLocation(cachedLocation);
          } catch (err) {
            console.warn('[Location] Could not retrieve fresh location:', err);
          }
        }

        // Add location to User-Agent if available
        if (cachedLocation) {
          const baseUA =
            (config.headers?.['User-Agent'] as string) ??
            `SchoolersMobile/${CONFIG.APP_VERSION}`;
          config.headers['User-Agent'] =
            `${baseUA};${cachedLocation.lat};${cachedLocation.lon}`;
        }
      } catch (err) {
        console.warn('[Interceptor] Error setting headers:', err);
      }
      return config;
    },
    (error) => Promise.reject(errorHandler(error))
  );
};

/**
 * Manually refresh location (call this when user pulls to refresh, etc.)
 */
export const refreshLocation = async (): Promise<void> => {
  await prefetchLocation();
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

const errorHandler = (error: any): any => {

  if (error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    if (status >= 500 && status <= 599) {
      error.message = i18n.t('common.systemUnavailable');
    } else if (serverMessage) {
      error.message = serverMessage;
    } else {
      error.message = i18n.t('common.systemUnavailable');
    }

    return error; // ✅ keep full error object with response
  }

  // No response = network / timeout / server down
  if (error.request) {
    error.message = i18n.t('common.systemUnavailable');
    return error;
  }

  // Unexpected error (client-side / config)
  error.message = i18n.t('common.networkError');
  return error;
};
