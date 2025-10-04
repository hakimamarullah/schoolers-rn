import { useStorageState } from '@/store/storageState';
import { use, createContext, type PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const AuthContext = createContext<{
  signIn: (data: any) => void;
  signOut: () => void;
  setHost: (host: string) => void;
  session?: string | null;
  token?: string | null;
  isLoading: boolean;
  isHostSet: boolean;
}>({
  signIn: async () => {},
  signOut: async () => {},
  setHost: async () => {},
  session: null,
  isLoading: true,
  token: null,
  isHostSet: false,
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

  const isLoading = loadingSession || loadingToken || loadingHost;

  const handleLogin = useCallback(async (data: any) => {
    setSession(JSON.stringify({ fullName: "Steve Roger", email: "steve@gmail.com" }));
    setToken("tetsaigdia");
  }, [setSession, setToken]);

  const handleSignOut = useCallback(async () => {
    setSession(null);
    setToken(null);
  }, [setSession, setToken]);

  const handleSetHost = useCallback(async (host: string) => {
    setSession(null);
    setToken(null);
    setHost(host);
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
        session,
        token,
        isLoading,
        isHostSet,
      }}
    >
      {children}
    </AuthContext>
  );
}
