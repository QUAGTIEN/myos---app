"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  noteError,
  noteInput,
  noteFingerprint,
  type Note,
  type NoteInput,
  type Attachment,
} from "./model";
import { noteService, prepareImages } from "./service";

export function useNoteDraft(note: Note) {
  const [draft, setDraft] = useState(() => noteInput(note));
  const [base, setBase] = useState(note);
  const [status, setStatus] = useState("Đã lưu");
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const draftRef = useRef(draft);
  const baseRef = useRef(note);
  const assetsRef = useRef<Attachment[]>([]);
  const paused = useRef(false);
  const inFlight = useRef<Promise<Note> | null>(null);
  const mounted = useRef(true);
  const change = useCallback((input: NoteInput) => {
    if (noteFingerprint(input) === noteFingerprint(draftRef.current)) return;
    draftRef.current = input;
    setDraft(input);
    if (!paused.current) setStatus("Chưa lưu");
  }, []);
  const save = useCallback(async (): Promise<Note> => {
    if (inFlight.current) {
      await inFlight.current;
      return save();
    }
    if (
      noteFingerprint(draftRef.current) ===
      noteFingerprint(noteInput(baseRef.current))
    )
      return baseRef.current;
    const snapshot = draftRef.current;
    const submittedAssets = [...assetsRef.current];
    if (mounted.current) {
      setStatus("Đang lưu…");
      setBusy(true);
      setError("");
    }
    const previous = baseRef.current;
    const operation = Promise.resolve().then(() =>
      noteService.save(previous, snapshot, submittedAssets),
    );
    inFlight.current = operation;
    try {
      const saved = await operation;
      baseRef.current = saved;
      paused.current = false;
      assetsRef.current = assetsRef.current.filter(
        (asset) =>
          !submittedAssets.some((submitted) => submitted.id === asset.id),
      );
      if (mounted.current) {
        setBase(saved);
        setAssets(assetsRef.current);
        const unchanged =
          noteFingerprint(snapshot) === noteFingerprint(draftRef.current);
        if (unchanged) {
          draftRef.current = noteInput(saved);
          setDraft(draftRef.current);
        }
        setStatus(unchanged ? "Đã lưu" : "Chưa lưu");
      }
      return saved;
    } catch (cause) {
      paused.current = true;
      if (mounted.current) {
        setError(noteError(cause));
        setStatus("Lưu lỗi");
      }
      throw cause;
    } finally {
      inFlight.current = null;
      if (mounted.current) setBusy(false);
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (note.version <= baseRef.current.version) return;
    if (inFlight.current) return;
    if (
      noteFingerprint(draftRef.current) !==
      noteFingerprint(noteInput(baseRef.current))
    ) {
      paused.current = true;
      setError(
        "Ghi chú đã thay đổi ở tab khác. Bản nháp vẫn được giữ; sao chép nội dung hoặc tải bản mới.",
      );
      setStatus("Lưu lỗi");
    } else {
      baseRef.current = note;
      setBase(note);
      const next = noteInput(note);
      draftRef.current = next;
      setDraft(next);
    }
  }, [note]);
  useEffect(() => {
    if (base.trashedAt || paused.current) return;
    const timer = window.setTimeout(() => {
      void save().catch(() => {});
    }, 800);
    return () => window.clearTimeout(timer);
  }, [draft, base, save]);
  useEffect(() => {
    const isDirty = () =>
      !!inFlight.current ||
      noteFingerprint(draftRef.current) !==
        noteFingerprint(noteInput(baseRef.current));
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty()) event.preventDefault();
    };
    const beforeNavigation = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!link || !isDirty() || link.getAttribute("href")?.startsWith("#"))
        return;
      if (
        !window.confirm(
          "Ghi chú chưa lưu xong. Rời trang sẽ bỏ bản nháp chưa lưu. Tiếp tục?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", beforeNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", beforeNavigation, true);
    };
  }, []);
  async function upload(files: File[]) {
    const prepared = await prepareImages(files, baseRef.current.id);
    assetsRef.current = [...assetsRef.current, ...prepared];
    setAssets(assetsRef.current);
    return prepared;
  }
  function accept(saved: Note) {
    baseRef.current = saved;
    setBase(saved);
    const input = noteInput(saved);
    draftRef.current = input;
    setDraft(input);
    paused.current = false;
    setError("");
    setStatus("Đã lưu");
  }
  function reload(latest: Note) {
    if (
      !window.confirm(
        "Tải bản mới và bỏ bản nháp hiện tại? Hãy sao chép nội dung cần giữ trước.",
      )
    )
      return;
    assetsRef.current = [];
    setAssets([]);
    accept(latest);
  }
  return {
    draft,
    base,
    status,
    error,
    busy,
    assets,
    change,
    save,
    upload,
    accept,
    reload,
  };
}
