"use client";
import { firebaseEnabled } from "@/lib/firebase/client";
import { Download, FilePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import {
  projectErrorMessage,
  workspaceSchema,
  type Project,
  type ProjectWorkspace,
} from "../model";
import { projectService } from "../service";
import { readProjectAttachment } from "../repository";

const tabs = {
  goal: "Mục tiêu",
  documents: "Tài liệu",
  resources: "Tài nguyên",
  hardware: "Phần cứng",
  journal: "Nhật ký & kiểm thử",
  attachments: "Tệp đính kèm",
} as const;
type Tab = keyof typeof tabs;
const results = {
  log: "Nhật ký",
  passed: "Kiểm thử đạt",
  failed: "Kiểm thử chưa đạt",
} as const;
const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

export function ProjectWorkspacePanel({ project }: { project: Project }) {
  const [tab, setTab] = useState<Tab>("goal");
  const [snapshot, setSnapshot] = useState<Project | null>(null);
  const [draft, setDraft] = useState(project.workspace);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const lock = useRef(false);
  const workspace = snapshot ? draft : project.workspace;
  function change<K extends keyof ProjectWorkspace>(
    key: K,
    value: ProjectWorkspace[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }
  function remove<K extends "documents" | "resources" | "hardware" | "journal">(
    key: K,
    id: string,
  ) {
    if (window.confirm("Xóa mục này khỏi dự án khi lưu?"))
      setDraft((current) => ({
        ...current,
        [key]: current[key].filter((item) => item.id !== id),
      }));
  }
  function cancel() {
    if (
      !snapshot ||
      JSON.stringify(draft) === JSON.stringify(snapshot.workspace) ||
      window.confirm("Bỏ thay đổi chưa lưu?")
    ) {
      setSnapshot(null);
      setError("");
    }
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!snapshot || lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    setMessage("");
    try {
      await projectService.saveWorkspace(
        snapshot,
        workspaceSchema.parse(draft),
      );
      setSnapshot(null);
      setMessage("Đã lưu nội dung dự án.");
    } catch (cause) {
      setError(projectErrorMessage(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  async function fileAction(
    operation: () => Promise<unknown>,
    success: string,
  ) {
    if (lock.current) return;
    lock.current = true;
    setPending(true);
    setError("");
    setMessage("");
    try {
      await operation();
      setMessage(success);
    } catch (cause) {
      setError(projectErrorMessage(cause));
    } finally {
      lock.current = false;
      setPending(false);
    }
  }
  async function download(id: string, name: string) {
    await fileAction(async () => {
      const blob = await readProjectAttachment(project.id, id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "");
  }
  return (
    <section className="panel project-workspace-panel" aria-label="Hồ sơ dự án">
      <div className="project-section-heading">
        <h2>Hồ sơ dự án</h2>
        {!snapshot && tab !== "attachments" && (
          <button
            className="button secondary small"
            type="button"
            disabled={pending || !!project.archivedAt}
            onClick={() => {
              setSnapshot(project);
              setDraft(structuredClone(project.workspace));
              setError("");
              setMessage("");
            }}
          >
            <Pencil size={15} />
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>
      <div className="workspace-tabs" role="group" aria-label="Các phần hồ sơ">
        {Object.entries(tabs).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={tab === value}
            onClick={() => setTab(value as Tab)}
          >
            {label}
          </button>
        ))}
      </div>
      {error && (
        <p className="project-alert error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="project-alert success" role="status">
          {message}
        </p>
      )}
      {snapshot && project.version !== snapshot.version && (
        <p className="project-alert error">
          Dự án đã thay đổi. Nháp vẫn được giữ; sao chép nội dung cần giữ trước
          khi hủy và mở bản mới.
        </p>
      )}
      <form onSubmit={(event) => void save(event)} className="workspace-form">
        <fieldset disabled={pending}>
          {tab === "goal" &&
            (snapshot ? (
              <label>
                Mục tiêu và kết quả mong muốn
                <textarea
                  value={draft.goal}
                  maxLength={20000}
                  rows={7}
                  onChange={(event) => change("goal", event.target.value)}
                />
              </label>
            ) : (
              <p className="workspace-text">
                {workspace.goal || "Chưa có mục tiêu"}
              </p>
            ))}
          {tab === "documents" && (
            <>
              {workspace.documents.map((document) => (
                <article className="workspace-entry" key={document.id}>
                  {snapshot ? (
                    <>
                      <label>
                        Tên tài liệu
                        <input
                          required
                          maxLength={120}
                          value={document.title}
                          onChange={(event) =>
                            change(
                              "documents",
                              draft.documents.map((item) =>
                                item.id === document.id
                                  ? { ...item, title: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Nội dung tài liệu
                        <textarea
                          rows={6}
                          maxLength={40000}
                          value={document.content}
                          onChange={(event) =>
                            change(
                              "documents",
                              draft.documents.map((item) =>
                                item.id === document.id
                                  ? { ...item, content: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => remove("documents", document.id)}
                      >
                        Xóa tài liệu
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>{document.title}</h3>
                      <p className="workspace-text">
                        {document.content || "Chưa có nội dung"}
                      </p>
                    </>
                  )}
                </article>
              ))}
              {!workspace.documents.length && (
                <p className="workspace-empty">Chưa có tài liệu</p>
              )}
              {snapshot && (
                <button
                  className="button secondary small"
                  type="button"
                  disabled={draft.documents.length >= 50}
                  onClick={() =>
                    change("documents", [
                      ...draft.documents,
                      { id: crypto.randomUUID(), title: "", content: "" },
                    ])
                  }
                >
                  <Plus size={15} />
                  Thêm tài liệu
                </button>
              )}
            </>
          )}
          {tab === "resources" && (
            <>
              {workspace.resources.map((resource) => (
                <article className="workspace-entry" key={resource.id}>
                  {snapshot ? (
                    <>
                      <label>
                        Tên liên kết
                        <input
                          required
                          maxLength={120}
                          value={resource.title}
                          onChange={(event) =>
                            change(
                              "resources",
                              draft.resources.map((item) =>
                                item.id === resource.id
                                  ? { ...item, title: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Địa chỉ liên kết
                        <input
                          required
                          type="url"
                          maxLength={2000}
                          placeholder="https://github.com/…"
                          value={resource.url}
                          onChange={(event) =>
                            change(
                              "resources",
                              draft.resources.map((item) =>
                                item.id === resource.id
                                  ? { ...item, url: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => remove("resources", resource.id)}
                      >
                        Xóa liên kết
                      </button>
                    </>
                  ) : (
                    <a
                      className="workspace-resource"
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{resource.title}</strong>
                      <span>{resource.url}</span>
                    </a>
                  )}
                </article>
              ))}
              {!workspace.resources.length && (
                <p className="workspace-empty">Chưa có liên kết</p>
              )}
              {snapshot && (
                <button
                  className="button secondary small"
                  type="button"
                  disabled={draft.resources.length >= 100}
                  onClick={() =>
                    change("resources", [
                      ...draft.resources,
                      { id: crypto.randomUUID(), title: "", url: "" },
                    ])
                  }
                >
                  <Plus size={15} />
                  Thêm liên kết
                </button>
              )}
            </>
          )}
          {tab === "hardware" && (
            <>
              {snapshot && (
                <label className="workspace-checkbox">
                  <input
                    type="checkbox"
                    checked={draft.hardwareEnabled}
                    onChange={(event) =>
                      change("hardwareEnabled", event.target.checked)
                    }
                  />
                  Bật quản lý phần cứng
                </label>
              )}
              {!workspace.hardwareEnabled ? (
                <p className="workspace-empty">Phần cứng chưa bật</p>
              ) : (
                <>
                  {workspace.hardware.map((part) => (
                    <article className="workspace-entry" key={part.id}>
                      {snapshot ? (
                        <>
                          <label>
                            Tên linh kiện
                            <input
                              required
                              maxLength={120}
                              value={part.name}
                              onChange={(event) =>
                                change(
                                  "hardware",
                                  draft.hardware.map((item) =>
                                    item.id === part.id
                                      ? { ...item, name: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </label>
                          <label>
                            Thông số
                            <textarea
                              rows={2}
                              maxLength={2000}
                              value={part.specification}
                              onChange={(event) =>
                                change(
                                  "hardware",
                                  draft.hardware.map((item) =>
                                    item.id === part.id
                                      ? {
                                          ...item,
                                          specification: event.target.value,
                                        }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </label>
                          <div className="workspace-field-row">
                            <label>
                              Số lượng
                              <input
                                type="number"
                                required
                                min={1}
                                max={100000}
                                value={part.quantity}
                                onChange={(event) =>
                                  change(
                                    "hardware",
                                    draft.hardware.map((item) =>
                                      item.id === part.id
                                        ? {
                                            ...item,
                                            quantity: Number(
                                              event.target.value,
                                            ),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />
                            </label>
                            <label>
                              Đơn giá (VND)
                              <input
                                type="number"
                                required
                                min={0}
                                max={1e12}
                                step="any"
                                value={part.unitPrice}
                                onChange={(event) =>
                                  change(
                                    "hardware",
                                    draft.hardware.map((item) =>
                                      item.id === part.id
                                        ? {
                                            ...item,
                                            unitPrice: Number(
                                              event.target.value,
                                            ),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />
                            </label>
                          </div>
                          <button
                            type="button"
                            className="text-link"
                            onClick={() => remove("hardware", part.id)}
                          >
                            Xóa linh kiện
                          </button>
                        </>
                      ) : (
                        <>
                          <h3>{part.name}</h3>
                          <p className="workspace-text">{part.specification}</p>
                          <p>
                            {part.quantity} × {money(part.unitPrice)} ={" "}
                            <strong>
                              {money(part.quantity * part.unitPrice)}
                            </strong>
                          </p>
                        </>
                      )}
                    </article>
                  ))}
                  {!workspace.hardware.length && (
                    <p className="workspace-empty">Chưa có linh kiện</p>
                  )}
                  {snapshot && (
                    <button
                      className="button secondary small"
                      type="button"
                      disabled={draft.hardware.length >= 100}
                      onClick={() =>
                        change("hardware", [
                          ...draft.hardware,
                          {
                            id: crypto.randomUUID(),
                            name: "",
                            specification: "",
                            quantity: 1,
                            unitPrice: 0,
                          },
                        ])
                      }
                    >
                      <Plus size={15} />
                      Thêm linh kiện
                    </button>
                  )}
                  <p className="workspace-total">
                    Tổng chi phí phần cứng:{" "}
                    <strong>
                      {money(
                        workspace.hardware.reduce(
                          (sum, item) => sum + item.quantity * item.unitPrice,
                          0,
                        ),
                      )}
                    </strong>
                  </p>
                </>
              )}
            </>
          )}
          {tab === "journal" && (
            <>
              {workspace.journal.map((entry) => (
                <article className="workspace-entry" key={entry.id}>
                  {snapshot ? (
                    <>
                      <label>
                        Tên bản ghi
                        <input
                          required
                          maxLength={120}
                          value={entry.title}
                          onChange={(event) =>
                            change(
                              "journal",
                              draft.journal.map((item) =>
                                item.id === entry.id
                                  ? { ...item, title: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                      <label>
                        Loại bản ghi
                        <select
                          value={entry.result}
                          onChange={(event) =>
                            change(
                              "journal",
                              draft.journal.map((item) =>
                                item.id === entry.id
                                  ? {
                                      ...item,
                                      result: event.target
                                        .value as typeof entry.result,
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          {Object.entries(results).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Nội dung nhật ký
                        <textarea
                          rows={4}
                          maxLength={20000}
                          value={entry.content}
                          onChange={(event) =>
                            change(
                              "journal",
                              draft.journal.map((item) =>
                                item.id === entry.id
                                  ? { ...item, content: event.target.value }
                                  : item,
                              ),
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => remove("journal", entry.id)}
                      >
                        Xóa bản ghi
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>{entry.title}</h3>
                      <span
                        className={"workspace-result result-" + entry.result}
                      >
                        {results[entry.result]}
                      </span>
                      <time>
                        {new Intl.DateTimeFormat("vi-VN", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Asia/Ho_Chi_Minh",
                        }).format(new Date(entry.at))}
                      </time>
                      <p className="workspace-text">{entry.content}</p>
                    </>
                  )}
                </article>
              ))}
              {!workspace.journal.length && (
                <p className="workspace-empty">Chưa có bản ghi</p>
              )}
              {snapshot && (
                <button
                  className="button secondary small"
                  type="button"
                  disabled={draft.journal.length >= 200}
                  onClick={() =>
                    change("journal", [
                      {
                        id: crypto.randomUUID(),
                        title: "",
                        content: "",
                        result: "log",
                        at: new Date().toISOString(),
                      },
                      ...draft.journal,
                    ])
                  }
                >
                  <Plus size={15} />
                  Thêm bản ghi
                </button>
              )}
            </>
          )}
          {tab === "attachments" && (
            <>
              {workspace.attachments.map((file) => (
                <div className="workspace-file" key={file.id}>
                  <div>
                    <strong>{file.name}</strong>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={"Tải " + file.name}
                    onClick={() => void download(file.id, file.name)}
                  >
                    <Download size={17} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={"Xóa " + file.name}
                    disabled={!!project.archivedAt || !!snapshot}
                    onClick={() => {
                      if (window.confirm("Xóa tệp này khỏi dự án?"))
                        void fileAction(
                          () =>
                            projectService.removeAttachment(project, file.id),
                          "Đã xóa tệp.",
                        );
                    }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
              {!workspace.attachments.length && (
                <p className="workspace-empty">Chưa có tệp đính kèm</p>
              )}
              <label className="button secondary small workspace-upload">
                <FilePlus size={15} />
                Thêm tệp
                <input
                  aria-label="Thêm tệp dự án"
                  type="file"
                  disabled={
                    firebaseEnabled ||
                    !!project.archivedAt ||
                    !!snapshot ||
                    workspace.attachments.length >= 50
                  }
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file)
                      void fileAction(
                        () => projectService.attach(project, file),
                        "Đã lưu tệp dự án.",
                      );
                    event.target.value = "";
                  }}
                />
              </label>
              <p className="workspace-file-limit">
                {firebaseEnabled
                  ? "Tệp cloud sẽ triển khai sau"
                  : "Tối đa 20 MB/tệp · 50 tệp/dự án"}
              </p>
            </>
          )}
        </fieldset>
        {snapshot && (
          <div className="workspace-save">
            <button
              type="button"
              className="button secondary small"
              disabled={pending}
              onClick={cancel}
            >
              Hủy chỉnh sửa
            </button>
            <button
              type="submit"
              className="button primary small"
              disabled={pending}
            >
              {pending ? "Đang lưu…" : "Lưu hồ sơ"}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
