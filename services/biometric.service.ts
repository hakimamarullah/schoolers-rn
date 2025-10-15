import { CONFIG } from '@/constants/common';
import { BiometricType } from '@/types/auth.type';
import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import { RSA } from 'react-native-rsa-native';
import storageService from './storage.service';
import i18n from '@/i18n/i18n';



class BiometricService {
  async isAvailable(): Promise<boolean> {
    return await LocalAuthentication.hasHardwareAsync();
  }

  async isEnrolled(): Promise<boolean> {
    return await LocalAuthentication.isEnrolledAsync();
  }

  async getSupportedTypes(): Promise<BiometricType[]> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const biometricTypes: BiometricType[] = [];

    types.forEach((type) => {
      if (type === LocalAuthentication.AuthenticationType.FINGERPRINT) {
        biometricTypes.push(BiometricType.FINGERPRINT);
      } else if (type === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) {
        biometricTypes.push(BiometricType.FACE);
      } else if (type === LocalAuthentication.AuthenticationType.IRIS) {
        biometricTypes.push(BiometricType.IRIS);
      }
    });

    return biometricTypes;
  }

  async authenticate(promptMessage?: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || i18n.t("biometric.promptSubtitle"),
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  /**
   * Generate RSA key pair using native library
   */
  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      console.log({RSA})
      const keys = await RSA.generateKeys(CONFIG.RSA_KEY_SIZE);
      return {
        publicKey: keys.public,
        privateKey: keys.private,
      };
    } catch (error) {
      console.error('Key generation error:', error);
      throw new Error('Failed to generate RSA key pair');
    }
  }

  /**
   * Sign data with RSA private key
   */
  async signData(data: string, privateKey: string): Promise<string> {
    try {
      const signature = await RSA.signWithAlgorithm(
        data,
        privateKey,
        'SHA256withRSA'
      );
      return signature;
    } catch (error) {
      console.error('Signing error:', error);
      throw new Error('Failed to sign data');
    }
  }

  /**
   * Verify signature with RSA public key (for testing)
   */
  async verifySignature(
    data: string,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    try {
      return await RSA.verifyWithAlgorithm(
        signature,
        data,
        publicKey,
        'SHA256withRSA'
      );
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }

  /**
   * Generate SHA-256 hash of public key
   */
  async hashPublicKey(publicKey: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      publicKey
    );
  }

  async getBiometricInfo(): Promise<{
    available: boolean;
    enrolled: boolean;
    types: BiometricType[];
    isEnabled: boolean;
  }> {
    const available = await this.isAvailable();
    const enrolled = available ? await this.isEnrolled() : false;
    const types = enrolled ? await this.getSupportedTypes() : [];
    const isEnabled = await storageService.getBiometricEnabledStatus();

    return { available, enrolled, types, isEnabled };
  }
}

export default new BiometricService();