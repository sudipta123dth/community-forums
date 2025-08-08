// "use client";

// import type Quill from "quill";
// import "quill/dist/quill.snow.css";
// import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// export type QuillEditorRef = {
//   setContents: (html: string) => void;
// };

// type QuillEditorProps = {
//   initialContent: string;
//   onChange: (html: string) => void;
//   disabled?: boolean
// };

// const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
//   // ({ initialContent, onChange, disabled }, ref) => {
//   //   const editorRef = useRef<HTMLDivElement>(null);
//   //   const quillInstanceRef = useRef<Quill>(null);

//   //   useImperativeHandle(ref, () => ({
//   //     setContents: (html: string) => {
//   //       if (quillInstanceRef.current) {
//   //         quillInstanceRef.current.root.innerHTML = html;
//   //       }
//   //     },
//   //   }));

//   //   useEffect(() => {
//   //     const loadQuill = async () => {
//   //       const Quill = (await import("quill")).default;

//   //       if (editorRef.current && !quillInstanceRef.current) {
//   //         quillInstanceRef.current = new Quill(editorRef.current, {
//   //           theme: "snow",
//   //           modules: {
//   //             toolbar: [
//   //               [{ header: [1, 2, 3, 4, 5, false] }],
//   //               ["bold", "italic", "underline"],
//   //               [{ list: "ordered" }, { list: "bullet" }],
//   //             ],
//   //           },
//   //         });

//   //         if (initialContent) {
//   //           quillInstanceRef.current.root.innerHTML = initialContent;
//   //         }

//   //         quillInstanceRef.current.on("text-change", () => {
//   //           const html = quillInstanceRef.current?.root.innerHTML;
//   //           onChange?.(html ?? '');
//   //         });
//   //       }
//   //     };

//   //     if (typeof window !== "undefined") {
//   //       loadQuill();
//   //     }
//   //   }, [initialContent, onChange]);

//   //   useEffect(() => {
//   //     if (quillInstanceRef.current) {
//   //       quillInstanceRef.current.enable(!!!disabled);
//   //     }
//   //   }, [disabled]);

//     return (
//       <div className="rounded-xl my-2 h-[300px]">
//         <div ref={editorRef} style={{ height: "250px" }} />
//       </div>
//     );
//   }
// );

// QuillEditor.displayName = "QuillEditor";

// export default QuillEditor;

import React from 'react'

const QuillEditor = (x : any) => {
  return (
    <div>QuillEditor</div>
  )
}

export default QuillEditor