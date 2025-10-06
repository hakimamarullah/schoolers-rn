import { setSignOutCallback } from '@/config/apiClient.config';
import authService from '@/services/auth.service';
import storageService from '@/services/storage.service';
import { useStorageState } from '@/store/storageState';
import { LoginId, UserInfo } from '@/types/auth.type';
import { createContext, type PropsWithChildren, use, useCallback, useEffect, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const AuthContext = createContext<{
  signIn: (data: any) => void;
  signOut: () => void;
  setHost: (host: string) => void;
  setLoginId: (loginId: LoginId) => void;
  session?: UserInfo | null;
  token?: string | null;
  isLoading: boolean;
  isHostSet: boolean;
  loginId?: LoginId | null;
}>({
  signIn: async () => {},
  signOut: async () => {},
  setHost: async () => {},
  setLoginId: async () => {},
  session: null,
  isLoading: true,
  token: null,
  isHostSet: false,
  loginId: null
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[loadingSession, session], setSession] = useStorageState("session");
  const [[loadingToken, token], setToken] = useStorageState("token");
  const [[loadingHost, host], setHost] = useStorageState("host");
  const [[loadingLoginId, loginId], setLoginId] = useStorageState("loginId");

  const isLoading = loadingSession || loadingToken || loadingHost || loadingLoginId;
  const parsedLoginId = loginId && JSON.parse(loginId);

  

  const handleSignOut = useCallback(async () => {
    console.log({fuck: "calllllled"})
    setSession(null);
    setToken(null);
    try {
      await authService.logout();
    } catch(error: any) {
      console.log(`Error logout ${error.message}`);
    }
  }, [setSession, setToken]);

  const handleLogin = useCallback(async ({ session, token }: any) => {
    const apiHost = await storageService.getApiHost();
    session.profilePictUri = `${apiHost}${session.profilePictUri}`
    setSession(JSON.stringify(session));
    setToken(token);
    setHost(apiHost);
    setSignOutCallback(handleSignOut)
  }, [setSession, setToken]);

  const handleSetHost = useCallback(async (host: string) => {
    setSession(null);
    setToken(null);
    setHost(host);
    await storageService.setApiHost(host);
  }, [setSession, setToken, setHost]);

  // Determine if host is properly set
  const isHostSet = useMemo(() => {
    if (isLoading) return false;
    if (!host || typeof host !== 'string' || host.trim() === '') return false;

    try {
      const url = new URL(host);
      return !!url.protocol && !!url.host;
    } catch {
      return false;
    }
  }, [host, isLoading]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (nextState == "active") {
          
        }
        if (nextState === "inactive") {
          handleSignOut();
        }
      }
    );
    return () => subscription.remove();
  }, [handleSignOut]);

  return (
    <AuthContext
      value={{
        signIn: async (data: any) => handleLogin(data),
        signOut: handleSignOut,
        setHost: handleSetHost,
        setLoginId: async (loginId: LoginId) => setLoginId(JSON.stringify(loginId)),
        session: session && JSON.parse(session),
        token,
        isLoading,
        isHostSet,
        loginId: parsedLoginId
      }}
    >
      {children}
    </AuthContext>
  );
}
