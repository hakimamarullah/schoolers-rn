import StorageService from './storage.service';
import BiometricService from './biometric.service';
import DeviceService from './device.service';
import {
  AuthResponse,
  LoginRequest,
  BiometricAuthInitRequest,
  BiometricAuthCompleteRequest,
  BiometricRegistrationRequest,
  BiometricChallengeResponse,
  UserInfo,
  RegistrationRequest,
  RegistrationResponse,
} from '@/types/auth.type';
import { getApiClient } from '@/config/apiClient.config';
import { ApiResponse } from '@/types/api.type';
import { handleResponse, inferFileMeta } from '@/scripts/utils';


class AuthService {
  /**
   * Password login
   */
  async login(loginId: string, password: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const apiClient = getApiClient();
      const deviceInfo = await DeviceService.getDeviceInfo();
      
      const request: LoginRequest = {
        loginId,
        password,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
      };

      
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', request);
      
      await this.saveAuthData(response.data?.data);

      return response.data;
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  async register(payload: RegistrationRequest): Promise<ApiResponse<RegistrationResponse>> {
    try {
       const apiClient = getApiClient();
    const formData = new FormData();

    // Append JSON data
    formData.append(
      "data",
      {
        string: JSON.stringify(payload),
        type: "application/json",
      } as any
    );
    // ✅ Append image if exists
    if (payload.profilePicture) {
    const { name, type } = inferFileMeta(payload.profilePicture);

    formData.append("file", {
      uri: payload.profilePicture,
      name,
      type,
    } as any);
  }

    // Send request
    const response = await apiClient.post<ApiResponse<RegistrationResponse>>(
      "/register/student",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
        },
      }
    );

    return response.data;
    } catch(error: any) {
      return this.handleError(error)
    }
    
  }

  /**
   * Initiate biometric login
   */
  async initiateBiometricLogin(loginId: string): Promise<BiometricChallengeResponse> {
    try {
      const apiClient = getApiClient();
      const biometricInfo = await BiometricService.getBiometricInfo();
      if (!biometricInfo.enrolled) {
        throw new Error('Biometric authentication is not set up on this device');
      }

      const publicKeyHash = await StorageService.getBiometricPublicKeyHash();
      if (!publicKeyHash) {
        throw new Error('Biometric credentials not found. Please register biometric first.');
      }

      const deviceInfo = await DeviceService.getDeviceInfo();

      const request: BiometricAuthInitRequest = {
        loginId,
        deviceId: deviceInfo.deviceId,
        publicKeyHash,
      };

      const response = await apiClient.post<ApiResponse<BiometricChallengeResponse>>(
        '/auth/biometric/init',
        request
      );

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Complete biometric login
   */
  async completeBiometricLogin(
    challengeToken: string,
    promptMessage?: string
  ): Promise<AuthResponse> {
    try {
      const apiClient = getApiClient();
      
      // Authenticate with biometric
      const authenticated = await BiometricService.authenticate(promptMessage);
      if (!authenticated) {
        throw new Error('Biometric authentication was cancelled or failed');
      }

      // Get private key
      const privateKey = await StorageService.getBiometricPrivateKey();
      if (!privateKey) {
        throw new Error('Private key not found. Please register biometric again.');
      }

      // Sign challenge
      const signedChallenge = await BiometricService.signData(challengeToken, privateKey);

      const deviceInfo = await DeviceService.getDeviceInfo();

      const request: BiometricAuthCompleteRequest = {
        challengeToken,
        signedChallenge,
        deviceId: deviceInfo.deviceId,
      };

      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/biometric/complete',
        request
      );

      await this.saveAuthData(response.data?.data);

      return response.data?.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Full biometric login flow
   */
  async loginWithBiometric(loginId: string): Promise<AuthResponse> {
    const challenge = await this.initiateBiometricLogin(loginId);
    const authResponse = await this.completeBiometricLogin(challenge.challengeToken);
    return authResponse;
  }

  /**
   * Register biometric credential
   */
  async registerBiometric(): Promise<ApiResponse<number>> {
    try {
      const apiClient = getApiClient();
      const token = await StorageService.getAccessToken();
      if (!token) {
        throw new Error('You must be logged in to register biometric');
      }

      const biometricInfo = await BiometricService.getBiometricInfo();
      if (!biometricInfo.enrolled) {
        throw new Error('Please set up biometric authentication in your device settings first');
      }

      // Authenticate first
      const authenticated = await BiometricService.authenticate(
        'Authenticate to enable biometric login'
      );
      if (!authenticated) {
        throw new Error('Biometric authentication was cancelled');
      }

      // Generate RSA key pair
      const { publicKey, privateKey } = await BiometricService.generateKeyPair();
      const publicKeyHash = await BiometricService.hashPublicKey(publicKey);

      const deviceInfo = await DeviceService.getDeviceInfo();

      const request: BiometricRegistrationRequest = {
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        biometricType: biometricInfo.types[0],
        publicKey,
        algorithm: 'RSA',
        keySize: 2048,
      };

      const response = await apiClient.post<ApiResponse<number>>('/auth/biometric/register', request);

      // Save credentials locally
      if (handleResponse(response.data).ok) {
        await StorageService.saveBiometricCredentials(publicKey, privateKey, publicKeyHash);
      }
      return response.data;
    } catch (error) {
      await StorageService.clearBiometricCredentials();
      return this.handleError(error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      const apiClient = getApiClient();
      const sessionId = await StorageService.getSessionId();
      console.log({sessionToLogout: sessionId})
      if (sessionId) {
        await apiClient.post(`/auth/logout`, null, {
          params: { sessionId },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await StorageService.clearAll();
    }
  }

  /**
   * Check authentication status
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await StorageService.getAccessToken();
    return token !== null;
  }

  async enableBiometric(): Promise<void> {
     await StorageService.setBiometricEnabled(String(true));
  }

   async disableBiometric(): Promise<void> {
     await StorageService.setBiometricEnabled(String(false));
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<UserInfo | null> {
    return await StorageService.getUserInfo();
  }

  /**
   * Check if biometric is registered
   */
  async isBiometricRegistered(): Promise<boolean> {
    return await StorageService.isBiometricRegistered();
  }

  /**
   * Save auth data
   */
  private async saveAuthData(data: AuthResponse): Promise<void> {
    await StorageService.saveAuthTokens(data.accessToken, data.sessionId);
    await StorageService.saveUserInfo(data.user);
  }

  /**
   * Handle errors
   */
  private handleError(error: any): any {
    if (error.response?.data) {
      return error.response?.data;
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Network error. Please check your connection.');
  }
}

export default new AuthService();