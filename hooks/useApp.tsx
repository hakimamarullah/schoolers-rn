import React, { createContext, useContext, useEffect, useRef } from "react";
import AppModal, { AppModalRef } from "@/components/AppModal";
import LoadingOverlay, { LoadingOverlayRef } from "@/components/LoadingOverlay";
import { initializeApiClient } from "@/config/apiClient.config";

type AppContextType = {
  modalRef: React.RefObject<AppModalRef | null>;
  overlayRef: React.RefObject<LoadingOverlayRef | null>;
  showModal: (title: string, message: string, onConfirm?: () => void, closable?: boolean) => void;
  hideModal: () => void;
  showOverlay: (message?: string) => void;
  hideOverlay: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const modalRef = useRef<AppModalRef>(null);
  const overlayRef = useRef<LoadingOverlayRef>(null);

  const showModal = (title: string, message: string, onConfirm?: () => void, closable?: boolean) => modalRef.current?.show(title, message, onConfirm, closable);
  const hideModal = () => modalRef.current?.hide();
  const showOverlay = (message? : string) => overlayRef.current?.show(message);
  const hideOverlay = () => overlayRef.current?.hide();

  useEffect(() => {
     const initClient = async () => {
      try {
        await initializeApiClient();

      } catch(error: any) {
        console.log(error.message);
      }
     }
     initClient();
  }, [])

  return (
    <AppContext.Provider
      value={{
        modalRef,
        overlayRef,
        showModal,
        hideModal,
        showOverlay,
        hideOverlay,
      }}
    >
      {children}

      {/* Mounted globally so they cover the whole app */}
      <LoadingOverlay ref={overlayRef} />
      <AppModal ref={modalRef} />
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
