import { getApiClient, getSecureApiClient } from '@/config/apiClient.config';
import { handleError, handleResponse, inferFileMeta } from '@/scripts/utils';
import { ApiResponse } from '@/types/api.type';
import {
  AuthResponse,
  BiometricAuthCompleteRequest,
  BiometricAuthInitRequest,
  BiometricChallengeResponse,
  BiometricRegistrationRequest,
  BiometricRegistrationResponse,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse,
  ValidateSessionRequest,
  ValidateSessionResponse
} from '@/types/auth.type';
import BiometricService from './biometric.service';
import { default as DeviceService, default as deviceService } from './device.service';
import sessionService from './session.service';
import { default as StorageService, default as storageService } from './storage.service';
import i18n from '@/i18n/i18n';
import { AppError } from '@/types/error.type';


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
      
      await StorageService.saveSessionId(response.data?.data?.sessionId);

      return response.data;
    } catch (error: any) {
      return handleError(error);
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
      return handleError(error)
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
        throw new AppError(i18n.t("biometric.biometricIsNotSetupOnDevice"));
      }

      const publicKeyHash = await StorageService.getBiometricPublicKeyHash();
      if (!publicKeyHash) {
        throw new AppError(i18n.t("biometric.biometricCredentialNotRegistered"));
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
      return handleError(error);
    }
  }

  /**
   * Complete biometric login
   */
  async completeBiometricLogin(
    challengeToken: string
  ): Promise<AuthResponse> {
    try {
      const apiClient = getApiClient();
      // Get private key
      const privateKey = await StorageService.getBiometricPrivateKey();
      if (!privateKey) {
        throw new AppError(i18n.t("biometric.privateKeyNotFound"));
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

      await StorageService.saveSessionId(response.data?.data?.sessionId);

      return response.data?.data;
    } catch (error) {
      return handleError(error);
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
  async registerBiometric(): Promise<ApiResponse<BiometricRegistrationResponse>> {
    try {
      const apiClient = getSecureApiClient();
      const token = await StorageService.getAccessToken();
      if (!token) {
        throw new AppError(i18n.t("biometric.mustLoginToRegister"));
      }

      const biometricInfo = await BiometricService.getBiometricInfo();
      if (!biometricInfo.enrolled) {
        throw new AppError(i18n.t("biometric.biometricIsNotSetupOnDevice"));
      }

      // Authenticate first
      const authenticated = await BiometricService.authenticate(
        i18n.t("biometric.authenticateToEnable")
      );
      if (!authenticated) {
        throw new AppError('Biometric authentication was cancelled');
      }

      // Generate RSA key pair
      const { publicKey, privateKey } = await BiometricService.generateKeyPair();
    

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

      const response = await apiClient.post<ApiResponse<BiometricRegistrationResponse>>('/auth/biometric/register', request);

      // Save credentials locally
      if (handleResponse(response.data).ok) {
        const { publicKeyHash, credentialId } = response.data.data;
        await StorageService.saveBiometricCredentials(publicKey, privateKey, publicKeyHash, credentialId);
      }
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      const apiClient = getSecureApiClient();
      const sessionId = await StorageService.getSessionId();
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
   * Check if biometric is registered
   */
  async isBiometricRegistered(): Promise<boolean> {
    return await StorageService.isBiometricRegistered();
  }

  async validateSession(onError?: (value: string) => void): Promise<void> {
    try {

      const request: ValidateSessionRequest = {
        sessionId: await storageService.getSessionId(),
        deviceId: await deviceService.getDeviceIdAsync()
      }
      const api = getSecureApiClient();
      const response = await api.post<ApiResponse<ValidateSessionResponse>>("/sessions/validate", request);
      const { isValid } = response.data?.data ?? {};
      if (!isValid) {
        onError?.(response.data?.message);
        await sessionService.signOut();
      }
    } catch(error: any) {
      onError?.(error.response?.data?.message ?? i18n.t("common.systemUnavailable"));
      await sessionService.signOut();
    }
  }

}

export default new AuthService();