import { createContext, useContext, useState, FC } from "react";
import {
  ModalType,
  ModalProps,
  ModalContextType,
  ModalProviderProps,
} from "../../../types/Modal";
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const openModal = (type: string, props: ModalProps = {}) => {
    setModalType(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
