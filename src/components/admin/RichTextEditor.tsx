"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="mt-1 h-48 w-full rounded border border-ink/15 bg-white" />
  ),
});

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-1 rounded border border-ink/15 bg-white [&_.ql-container]:rounded-b [&_.ql-container]:font-body [&_.ql-container]:text-sm [&_.ql-toolbar]:rounded-t [&_.ql-toolbar]:border-ink/15 [&_.ql-container.ql-snow]:border-ink/15">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={MODULES}
      />
    </div>
  );
}
