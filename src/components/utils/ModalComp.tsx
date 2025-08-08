import { ModalProps } from "@/interface/props/modalprops";
import { Modal } from "rsuite";

export default function ModalComp(props: ModalProps) {
    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            size={props.size ?? "sm"}
            backdrop="static"
            keyboard={props.closeOnEsc}
        >
            <Modal.Header>
                <Modal.Title className="dark:text-slate-50 text-slate-950">{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="dark:text-slate-200 text-slate-900">{props.children}</Modal.Body>
            {!!props.footerContent && (
                <Modal.Footer>{props.footerContent}</Modal.Footer>
            )}
        </Modal>
    );
}