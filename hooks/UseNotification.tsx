import { useSession } from "@/hooks/useSession";
import informationService from "@/services/information.service";
import {
  handleInitialNotification,
  registerForPushNotificationsAsync,
  setupForegroundMessageHandler,
  setupTokenRefreshListener,
} from "@/services/notification.service";
import * as Notifications from "expo-notifications";
import {
  RelativePathString,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

interface NotificationContextType {
  devicePushToken?: string;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [devicePushToken, setDevicePushToken] = useState<string>();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const { session } = useSession();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  // refs
  const isMounted = useRef(true);
  const isNavigating = useRef(false);
  const pendingNavigation = useRef<string | null>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // NEW: Store notification target when user is not logged in
  const pendingNotificationTarget = useRef<string | null>(null);

  // notification listener refs
  const tokenRefreshUnsubscribe = useRef<(() => void) | null>(null);
  const foregroundMessageUnsubscribe = useRef<(() => void) | null>(null);
  const notificationResponseSubscription =
    useRef<Notifications.Subscription | null>(null);

  // derived
  const isRouterReady = !!rootNavigationState?.key;

  /** Safely fetch unread count */
  const refreshUnreadCount = useCallback(async () => {
    if (!session || !isMounted.current) return;
    try {
      const count = await informationService.getUnreadCount();
      if (isMounted.current) setUnreadCount(count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [session]);

  /** Safe navigation guard */
  const navigateToTarget = useCallback(
    (url: string) => {
      if (!url || !isMounted.current) return;
      
      // NEW: If not logged in, store the target for later
      if (!session) {
        console.log("📌 User not logged in. Storing notification target:", url);
        pendingNotificationTarget.current = url;
        return;
      }
      
      if (!isRouterReady || isNavigating.current) return;

      // prevent repeated navigation to same target
      if (pendingNavigation.current === url) return;
      pendingNavigation.current = url;

      try {
        isNavigating.current = true;
        console.log("🔗 Navigating to:", url);
        router.push(url as RelativePathString);
      } catch (err) {
        console.error("Navigation error:", err);
      } finally {
        if (navigationTimer.current) clearTimeout(navigationTimer.current);
        navigationTimer.current = setTimeout(() => {
          isNavigating.current = false;
          pendingNavigation.current = null;
        }, 800);
      }
    },
    [isRouterReady, router, session]
  );

  /** NEW: Navigate to pending notification target after login */
  useEffect(() => {
    if (session && isRouterReady && pendingNotificationTarget.current) {
      const target = pendingNotificationTarget.current;
      pendingNotificationTarget.current = null;
      
      console.log("🎯 User logged in. Navigating to pending notification:", target);
      
      // Small delay to ensure navigation stack is ready
      setTimeout(() => {
        navigateToTarget(target);
        refreshUnreadCount();
      }, 500);
    }
  }, [session, isRouterReady, navigateToTarget, refreshUnreadCount]);

  /** Refresh unread count when app becomes active */
  useEffect(() => {
    if (!session) return;
    refreshUnreadCount();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active" && isMounted.current)
          refreshUnreadCount();
      }
    );

    return () => subscription.remove();
  }, [session, refreshUnreadCount]);

  /** Setup push notification logic - MODIFIED to work without session */
  useEffect(() => {
    if (!isRouterReady) return;
    let isSubscribed = true;

    // Register push token (works without session)
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token && isSubscribed && isMounted.current)
          setDevicePushToken(token);
      })
      .catch((err) => console.error("Push registration error:", err));

    /** Handle initial notification - works without session */
    const handleInitial = async () => {
      try {
        const remoteMessage = await handleInitialNotification();
        if (remoteMessage?.data?.target && isSubscribed && isMounted.current) {
          navigateToTarget(remoteMessage.data.target);
          if (session) refreshUnreadCount();
          console.log("📬 Initial notification handled");
        }
      } catch (err) {
        console.error("Error handling initial notification:", err);
      }
    };
    handleInitial();

    /** Handle last tapped notification - works without session */
    const response = Notifications.getLastNotificationResponse();
    if (response) {
      const url = response?.notification?.request?.content?.data?.target;
      if (typeof url === "string" && isSubscribed && isMounted.current) {
        Notifications.clearLastNotificationResponse();
        navigateToTarget(url);
      }
    }

    /** Foreground listener - only refresh count if logged in */
    foregroundMessageUnsubscribe.current = setupForegroundMessageHandler(
      async () => {
        if (isSubscribed && isMounted.current && session) {
          await refreshUnreadCount();
        }
      }
    );

    /** When notification is tapped - works without session */
    notificationResponseSubscription.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data?.target;
        if (typeof url === "string" && isSubscribed && isMounted.current) {
          navigateToTarget(url);
          if (session) refreshUnreadCount();
          console.log("🔔 Notification tapped");
        }
      });

    /** Token refresh */
    tokenRefreshUnsubscribe.current = setupTokenRefreshListener();

    return () => {
      isSubscribed = false;
      notificationResponseSubscription.current?.remove();
      tokenRefreshUnsubscribe.current?.();
      foregroundMessageUnsubscribe.current?.();
    };
  }, [isRouterReady, navigateToTarget, refreshUnreadCount, session]);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        devicePushToken,
        unreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  return ctx;
}