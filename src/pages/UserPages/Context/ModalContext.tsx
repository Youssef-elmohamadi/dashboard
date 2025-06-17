// ModalContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";

type ModalContextType = {
  modalType: string | null;
  modalProps: Record<string, any>;
  openModal: (type: string, props?: Record<string, any>) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);
type ModalProviderProps = {
  children: ReactNode;
};


export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modalType, setModalType] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, any>>({});

  const openModal = (type: string, props: Record<string, any> = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modalType, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// 5. hook آمن باستخدام useContext
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
