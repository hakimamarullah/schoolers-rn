import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

export const useBiometricAuth = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState<string[]>([]);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);

    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (enrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const typeNames = types.map((type) => {
          switch (type) {
            case LocalAuthentication.AuthenticationType.FINGERPRINT:
              return "Fingerprint";
            case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
              return "Face ID";
            case LocalAuthentication.AuthenticationType.IRIS:
              return "Iris";
            default:
              return "Biometric";
          }
        });
        setBiometricType(typeNames);
      }
    }
  };

  const authenticate = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        return {
          success: false,
          error: "No biometric data enrolled",
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to login",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: "Please login using password instead.",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Authentication error",
      };
    }
  };

  return {
    isBiometricSupported,
    biometricType,
    authenticate,
  };
};