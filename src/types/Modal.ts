import { ReactNode } from "react";

export type ModalType = string | null;

export type ModalProps = Record<string, any>;

export type OpenModalFunction = (type: string, props?: ModalProps) => void;

export type CloseModalFunction = () => void;


export type ModalContextType = {
  modalType: ModalType;
  modalProps: ModalProps;
  openModal: OpenModalFunction;
  closeModal: CloseModalFunction;
};


export type ModalProviderProps = {
  children: ReactNode;
};
