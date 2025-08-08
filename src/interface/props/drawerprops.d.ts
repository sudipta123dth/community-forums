import {CSSProperties, ReactNode} from "react";
import { TypeAttributes } from "rsuite/esm/internals/types";
import { ModalSize } from "rsuite/esm/Modal";

export default interface DrawerProps {
  open: boolean;
  onClose: () => void;
  backdrop?: boolean;
  closeOnEsc?: boolean;
  placement?: TypeAttributes.Placement4;
  size?: ModalSize;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
}
