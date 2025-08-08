import { lazy } from "react";

const ModalCompo = lazy(() => import("./ModalComp"));
const DrawerCompo = lazy(() => import("./Drawer"));
const QuillEditor = lazy(() => import("./QuillEditor"));
import { QuillEditorRef } from "./QuillEditor";

export { ModalCompo, DrawerCompo, QuillEditor };
export type { QuillEditorRef };
