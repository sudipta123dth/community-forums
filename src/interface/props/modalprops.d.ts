import { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  size?: "xs" | "sm" | "md" | "lg" | "full";
  footerContent?: ReactNode;
  closeOnEsc?: boolean;
}
