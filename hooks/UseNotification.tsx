import { useSession } from "@/hooks/useSession";
import informationService from "@/services/information.service";
import {
  handleInitialNotification,
  registerForPushNotificationsAsync,
  setupForegroundMessageHandler,
  setupNotificationOpenedListener,
  setupTokenRefreshListener
} from "@/services/notification.service";
import * as Notifications from "expo-notifications";
import { RelativePathString, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface NotificationContextType {
  devicePushToken?: string;
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [devicePushToken, setDevicePushToken] = useState<string>();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();
  const { session } = useSession();
  const rootNavigationState = useRootNavigationState();
  const segments = useSegments();

  const tokenRefreshUnsubscribe = useRef<(() => void) | null>(null);
  const foregroundMessageUnsubscribe = useRef<(() => void) | null>(null);
  const notificationOpenedUnsubscribe = useRef<(() => void) | null>(null);
  const notificationResponseSubscription = useRef<Notifications.Subscription | null>(null);
  const pendingNavigation = useRef<string | null>(null);

  // Check if router is ready
  const isRouterReady = rootNavigationState?.key != null;

  /** Fetch unread count from backend */
  const refreshUnreadCount = async () => {
    if (!session) return;
    try {
      const count = await informationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const navigateToTarget = (url: string) => {
    if (!url) return;

    if (isRouterReady) {
      try {
        router.push(url as RelativePathString);
        pendingNavigation.current = null;
      } catch (error) {
        console.error("Navigation error:", error);
      }
    } else {
      // Store for later when router is ready
      pendingNavigation.current = url;
    }
  };

  // Execute pending navigation when router becomes ready
  useEffect(() => {
    if (isRouterReady && pendingNavigation.current) {
      const url = pendingNavigation.current;
      pendingNavigation.current = null;
      
      // Small delay to ensure everything is settled
      setTimeout(() => {
        try {
          router.push(url as RelativePathString);
        } catch (error) {
          console.error("Pending navigation error:", error);
        }
      }, 100);
    }
  }, [isRouterReady, router]);

  // Initial load and app state changes
  useEffect(() => {
    if (!session) return;

    // Fetch on initial load
    refreshUnreadCount();

    // Refresh when app comes to foreground
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          refreshUnreadCount();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [session]);

  // Setup push notifications
  useEffect(() => {
    if (!session) return;

    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) setDevicePushToken(token);
      })
      .catch((err) => console.error("Push registration error:", err));

    // Handle initial notification
    const handleInitial = async () => {
      const remoteMessage = await handleInitialNotification();
      if (remoteMessage?.data?.target) {
        console.log("🚀 App launched via notification:", remoteMessage);
        navigateToTarget(remoteMessage.data.target);
        refreshUnreadCount();
      }
    };
    handleInitial();

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.target;
      if (typeof url === 'string') {
        navigateToTarget(url);
      }
    }

    // Check for last notification response
    const checkLastNotification = async () => {
      try {
        const response = Notifications.getLastNotificationResponse();
        if (response?.notification) {
          redirect(response.notification);
        }
      } catch (error) {
        console.error("Error checking last notification:", error);
      }
    };
    checkLastNotification();

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
      refreshUnreadCount();
    });
    
    notificationResponseSubscription.current = subscription;

    tokenRefreshUnsubscribe.current = setupTokenRefreshListener();
    foregroundMessageUnsubscribe.current = setupForegroundMessageHandler(async () => {
      await refreshUnreadCount();
    });
    notificationOpenedUnsubscribe.current = setupNotificationOpenedListener(
      async (remoteMessage) => {
        await refreshUnreadCount();
        if (remoteMessage?.data?.target) {
          navigateToTarget(remoteMessage.data.target);
        }
      }
    );

    return () => {
      notificationResponseSubscription.current?.remove();
      tokenRefreshUnsubscribe.current?.();
      foregroundMessageUnsubscribe.current?.();
      notificationOpenedUnsubscribe.current?.();
    };
  }, [session, isRouterReady]);

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
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}