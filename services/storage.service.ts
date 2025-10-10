import { LoginId, UserInfo } from '@/types/auth.type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';


const KEYS = {
  ACCESS_TOKEN: 'token',
  SESSION_ID: 'auth_session_id',
  USER_INFO: 'auth_user_info',
  BIOMETRIC_PUBLIC_KEY: 'biometric_public_key',
  BIOMETRIC_PRIVATE_KEY: 'biometric_private_key',
  BIOMETRIC_PUBLIC_KEY_HASH: 'biometric_public_key_hash',
  BIOMETRIC_REGISTERED: 'biometric_registered',
};

export const STORAGE_KEYS = {
  HOST: 'api_host',
  LANGUAGE: 'user_language',
  CLASSROOM: 'user_classroom',
  SCHOOL_NAME: 'school_name',
  LOGIN_ID: 'loginId',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  BIOMETRIC_CREDENTIAL_ID: 'biometric_id'
};

class StorageService {

  // Secure storage for sensitive data
  private async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting secure item ${key}:`, error);
      throw error;
    }
  }

  private async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting secure item ${key}:`, error);
      return null;
    }
  }

  private async deleteSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error deleting secure item ${key}:`, error);
    }
  }

  // Regular storage
  private async setRegular(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  private async getRegular(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async getData(key: string) : Promise<string | null> {
    return await this.getRegular(key);
  }

  async saveData(key: string, value: any) : Promise<void> {
    await this.setRegular(key, value);
  }
  private async deleteRegular(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting item ${key}:`, error);
    }
  }

  async getLoginId(): Promise<LoginId | null> {
    const storedId = await this.getSecure(STORAGE_KEYS.LOGIN_ID);
    return storedId && JSON.parse(storedId);
  }

  async getApiHost(): Promise<string | null> {
    return await this.getRegular(STORAGE_KEYS.HOST);
  }

  async setApiHost(host: string): Promise<void> {
    await this.setRegular(STORAGE_KEYS.HOST, host);
  }

   async clearApiHost(): Promise<void> {
    await this.deleteRegular(STORAGE_KEYS.HOST);
  }

  async getLanguage(): Promise<string | null> {
    return await this.getRegular(STORAGE_KEYS.LANGUAGE);
  }

  async setLanguage(lang: string) : Promise<void> {
    await this.setRegular(STORAGE_KEYS.LANGUAGE, lang);
  }

  // Auth tokens
  async saveSessionId(sessionId: string): Promise<void> {
    await this.setSecure(KEYS.SESSION_ID, sessionId);
  }

  async getAccessToken(): Promise<string | null> {
    return await this.getSecure(KEYS.ACCESS_TOKEN);
  }

  async getSessionId(): Promise<string | null> {
    return await this.getSecure(KEYS.SESSION_ID);
  }

  async clearAuthTokens(): Promise<void> {
    await this.deleteSecure(KEYS.ACCESS_TOKEN);
    await this.deleteSecure(KEYS.SESSION_ID);
  }

  // User info
  async saveUserInfo(user: UserInfo): Promise<void> {
    await this.setRegular(KEYS.USER_INFO, JSON.stringify(user));
  }

  async clearUserInfo(): Promise<void> {
    await this.deleteRegular(KEYS.USER_INFO);
  }

  // Biometric credentials
  async saveBiometricCredentials(
    publicKey: string,
    privateKey: string,
    publicKeyHash: string,
    credentialId: number,
  ): Promise<void> {
    await this.setSecure(KEYS.BIOMETRIC_PUBLIC_KEY, publicKey);
    await this.setSecure(KEYS.BIOMETRIC_PRIVATE_KEY, privateKey);
    await this.setSecure(KEYS.BIOMETRIC_PUBLIC_KEY_HASH, publicKeyHash);
    await this.setRegular(KEYS.BIOMETRIC_REGISTERED, 'true');
    await this.setSecure(STORAGE_KEYS.BIOMETRIC_CREDENTIAL_ID, JSON.stringify(credentialId));
  
  }

  async getBiometricPublicKey(): Promise<string | null> {
    return await this.getSecure(KEYS.BIOMETRIC_PUBLIC_KEY);
    
  }
  async getBiometricPrivateKey(): Promise<string | null> {
    return await this.getSecure(KEYS.BIOMETRIC_PRIVATE_KEY);
  }

  async getBiometricPublicKeyHash(): Promise<string | null> {
    return await this.getSecure(KEYS.BIOMETRIC_PUBLIC_KEY_HASH);
  }

  async isBiometricRegistered(): Promise<boolean> {
    const registered = await this.getRegular(KEYS.BIOMETRIC_REGISTERED);
    return registered === 'true';
  }

  async setBiometricEnabled(status: string): Promise<void> {
    await this.setRegular(STORAGE_KEYS.BIOMETRIC_ENABLED, status);
  }

  async getBiometricEnabledStatus(): Promise<boolean> {
    const enabled = await this.getRegular(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return enabled === "true";
  }

  async clearBiometricCredentials(): Promise<void> {
    await this.deleteSecure(KEYS.BIOMETRIC_PUBLIC_KEY);
    await this.deleteSecure(KEYS.BIOMETRIC_PRIVATE_KEY);
    await this.deleteSecure(KEYS.BIOMETRIC_PUBLIC_KEY_HASH);
    await this.deleteRegular(KEYS.BIOMETRIC_REGISTERED);
    await this.deleteSecure(STORAGE_KEYS.BIOMETRIC_CREDENTIAL_ID);
    console.log("BIOMETRIC CLEARED")
  }

  // Clear all
  async clearAll(): Promise<void> {
    await Promise.all([
      this.clearAuthTokens(),
      this.clearUserInfo(),
    ]);
  }
}

export default new StorageService();