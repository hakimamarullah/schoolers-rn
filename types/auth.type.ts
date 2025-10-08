export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  OFFICE_ADMIN = 'OFFICE_ADMIN',
}

export enum BiometricType {
  FINGERPRINT = 'FINGERPRINT',
  FACE = 'FACE',
  IRIS = 'IRIS',
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
}

export interface UserInfo {
  id: number;
  loginId: string;
  fullName: string;
  email: string;
  role: UserRole;
  schoolName?: string | undefined;
  classroomId?: number | undefined;
  className?: string | undefined;
  biometricEnabled: boolean;
  profilePictUri?: string;
  grade?: string | undefined;
  gender?: string | undefined;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  sessionId: string;
  user: UserInfo;
}

export interface LoginRequest {
  loginId: string;
  password: string;
  deviceId?: string;
  deviceName?: string;
}

export interface BiometricAuthInitRequest {
  loginId: string;
  deviceId: string;
  publicKeyHash: string;
}

export interface BiometricChallengeResponse {
  challengeToken: string;
  biometricCredentialId: number;
  expiresAt: string;
}

export interface BiometricAuthCompleteRequest {
  challengeToken: string;
  signedChallenge: string;
  deviceId: string;
}

export interface BiometricRegistrationRequest {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  biometricType: BiometricType;
  publicKey: string;
  algorithm: string;
  keySize: number;
}

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricAvailable: boolean;
  biometricRegistered: boolean;
}


export interface RegistrationRequest {
  studentNumber: string;
  fullName: string;
  email: string;
  classroomId: number;
  password: string;
  profilePicture: string;
  gender?: string;
}

export interface RegistrationResponse {
  userId: number;
  profileId: number;
  loginId: string;
  fullName: string;
  profilePictureUrl: string;
  email: string;
}

export interface LoginId {
  loginId: string;
  fullName: string;
}

export interface BiometricRegistrationResponse {
   credentialId: number;
   publicKeyHash: string;
}


export interface ValidateSessionRequest {
  sessionId: string | null;
  deviceId: string | null;
}

export interface ValidateSessionResponse {
  isValid: boolean;
}