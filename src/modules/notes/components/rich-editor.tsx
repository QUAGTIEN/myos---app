"use client";
/* eslint-disable @next/next/no-img-element -- IndexedDB images use local Blob URLs with their natural dimensions. */
import { Node, mergeAttributes, type JSONContent } from "@tiptap/core";
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  useEditorState,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Undo2,
  Redo2,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  imageIds,
  noteError,
  noteFingerprint,
  type Attachment,
  type RichNode,
} from "../model";
import { localNoteRepository } from "../repository";

const ImageContext = createContext<{ noteId: string; assets: Attachment[] }>({
  noteId: "",
  assets: [],
});
function LocalImageView({ node, editor, deleteNode }: NodeViewProps) {
  const { noteId, assets } = useContext(ImageContext);
  const attachmentId = String(node.attrs.attachmentId);
  const pending = assets.find((asset) => asset.id === attachmentId);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let disposed = false;
    let objectUrl = "";
    setError("");
    void (async () => {
      try {
        const asset =
          pending ??
          (await localNoteRepository.attachment(attachmentId, noteId));
        if (!asset) throw new Error("Ảnh không còn trong dữ liệu local.");
        if (disposed) return;
        objectUrl = URL.createObjectURL(asset.blob);
        setUrl(objectUrl);
      } catch (cause) {
        if (!disposed) setError(noteError(cause));
      }
    })();
    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [attachmentId, noteId, pending]);
  return (
    <NodeViewWrapper as="figure" className="note-image" contentEditable={false}>
      {/* Local object URLs represent private Blobs; next/image cannot read IndexedDB. */}
      {url && !error ? (
        <img
          src={url}
          alt={String(node.attrs.name || "Ảnh ghi chú")}
          onError={() => setError("Không hiển thị được ảnh.")}
        />
      ) : (
        <p>{error || "Đang tải ảnh…"}</p>
      )}
      <figcaption>{String(node.attrs.name || "Ảnh ghi chú")}</figcaption>
      {editor.isEditable && (
        <button
          type="button"
          className="icon-button"
          aria-label={"Gỡ ảnh " + node.attrs.name}
          title="Gỡ ảnh khỏi nội dung"
          onClick={deleteNode}
        >
          <Trash2 size={16} />
        </button>
      )}
    </NodeViewWrapper>
  );
}
const LocalImage = Node.create({
  name: "localImage",
  group: "block",
  atom: true,
  addAttributes: () => ({
    attachmentId: { default: "" },
    name: { default: "Ảnh ghi chú" },
  }),
  parseHTML: () => [{ tag: "figure[data-local-image]" }],
  renderHTML: ({ HTMLAttributes }) => [
    "figure",
    mergeAttributes(HTMLAttributes, { "data-local-image": "true" }),
  ],
  addNodeView: () => ReactNodeViewRenderer(LocalImageView),
});

export function RichEditor({
  noteId,
  content,
  onChange,
  onUpload,
  assets = [],
  readOnly = false,
}: {
  noteId: string;
  content: RichNode;
  onChange?: (content: RichNode) => void;
  onUpload?: (files: File[]) => Promise<Attachment[]>;
  assets?: Attachment[];
  readOnly?: boolean;
}) {
  const [imageError, setImageError] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<(files: File[]) => void>(() => {});
  const fileInput = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false, heading: { levels: [2, 3] } }),
      TaskList,
      TaskItem.configure({
        nested: true,
        a11y: {
          checkboxLabel: (node) =>
            "Hoàn thành " + (node.textContent || "mục checklist"),
        },
      }),
      LocalImage,
    ],
    content: content as JSONContent,
    immediatelyRender: false,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "note-prose",
        role: "textbox",
        "aria-label": "Nội dung ghi chú",
        "aria-multiline": "true",
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.length || readOnly) return false;
        event.preventDefault();
        uploadRef.current(files);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.length || readOnly) return false;
        event.preventDefault();
        uploadRef.current(files);
        return true;
      },
    },
    onUpdate: ({ editor: current }) =>
      onChange?.(current.getJSON() as RichNode),
  });
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current
        ? {
            bold: current.isActive("bold"),
            italic: current.isActive("italic"),
            underline: current.isActive("underline"),
            heading: current.isActive("heading"),
            bullet: current.isActive("bulletList"),
            ordered: current.isActive("orderedList"),
            task: current.isActive("taskList"),
            quote: current.isActive("blockquote"),
            undo: current.can().undo(),
            redo: current.can().redo(),
          }
        : null,
  });
  useEffect(() => {
    editor?.setEditable(!readOnly, false);
  }, [editor, readOnly]);
  useEffect(() => {
    if (
      editor &&
      noteFingerprint(editor.getJSON()) !== noteFingerprint(content)
    )
      editor.commands.setContent(content as JSONContent, {
        emitUpdate: false,
        errorOnInvalidContent: true,
      });
  }, [editor, content]);
  async function addImages(files: File[]) {
    if (!editor || !onUpload || uploading || readOnly) return;
    setUploading(true);
    setImageError("");
    try {
      if (imageIds(editor.getJSON() as RichNode).length + files.length > 20)
        throw new Error("Một ghi chú hỗ trợ tối đa 20 ảnh.");
      const prepared = await onUpload(files);
      if (!editor.isDestroyed)
        editor
          .chain()
          .focus()
          .insertContent(
            prepared.map((asset) => ({
              type: "localImage",
              attrs: { attachmentId: asset.id, name: asset.name },
            })),
          )
          .run();
      if (fileInput.current) fileInput.current.value = "";
    } catch (cause) {
      setImageError(noteError(cause));
    } finally {
      setUploading(false);
    }
  }
  uploadRef.current = (files) => {
    void addImages(files);
  };
  if (!editor)
    return <p className="note-editor-loading">Đang mở trình soạn thảo…</p>;
  const buttons = [
    {
      label: "Chữ đậm",
      icon: Bold,
      selected: active?.bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Chữ nghiêng",
      icon: Italic,
      selected: active?.italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Gạch chân",
      icon: Underline,
      selected: active?.underline,
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Tiêu đề đoạn",
      icon: Heading2,
      selected: active?.heading,
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Danh sách",
      icon: List,
      selected: active?.bullet,
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Danh sách đánh số",
      icon: ListOrdered,
      selected: active?.ordered,
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Checklist",
      icon: ListTodo,
      selected: active?.task,
      run: () => editor.chain().focus().toggleTaskList().run(),
    },
    {
      label: "Trích dẫn",
      icon: Quote,
      selected: active?.quote,
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];
  return (
    <ImageContext.Provider value={{ noteId, assets }}>
      {!readOnly && (
        <div
          className="note-editor-toolbar"
          role="group"
          aria-label="Định dạng ghi chú"
        >
          {buttons.map(({ label, icon: Icon, selected, run }) => (
            <button
              key={label}
              type="button"
              className={selected ? "selected" : ""}
              aria-label={label}
              aria-pressed={!!selected}
              title={label}
              onPointerDown={(event) => event.preventDefault()}
              onClick={run}
            >
              <Icon size={18} />
            </button>
          ))}
          <span className="note-toolbar-divider" />
          <button
            type="button"
            aria-label="Hoàn tác"
            title="Hoàn tác"
            disabled={!active?.undo}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 size={18} />
          </button>
          <button
            type="button"
            aria-label="Làm lại"
            title="Làm lại"
            disabled={!active?.redo}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 size={18} />
          </button>
          <button
            type="button"
            aria-label="Thêm ảnh"
            title="PNG, JPEG, WebP, GIF · tối đa 5 MB/ảnh"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
          >
            <ImagePlus size={18} />
          </button>
          <input
            ref={fileInput}
            className="sr-only"
            type="file"
            aria-label="Chọn ảnh ghi chú"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            onChange={(event) => {
              void addImages(Array.from(event.target.files ?? []));
            }}
          />
        </div>
      )}
      {uploading && (
        <p className="note-inline-message" role="status">
          Đang đọc ảnh…
        </p>
      )}
      {imageError && (
        <p className="note-error" role="alert">
          {imageError}
        </p>
      )}
      <EditorContent editor={editor} />
    </ImageContext.Provider>
  );
}
