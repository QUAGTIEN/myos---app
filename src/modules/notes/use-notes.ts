"use client";
import { useEffect, useState } from "react";
import { subscribeLocalChange } from "@/lib/local/database";
import { localNoteRepository } from "./repository";
import { noteError, notesChangedEvent, type Note } from "./model";

export function useNotes(id?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let disposed = false;
    let generation = 0;
    const load = async () => {
      const current = ++generation;
      try {
        const data = id
          ? await localNoteRepository.get(id)
          : await localNoteRepository.list();
        if (disposed || current !== generation) return;
        if (Array.isArray(data)) setNotes(data);
        else setNote(data);
        setError("");
      } catch (cause) {
        if (!disposed && current === generation) setError(noteError(cause));
      } finally {
        if (!disposed && current === generation) setLoading(false);
      }
    };
    void load();
    const unsubscribe = subscribeLocalChange(notesChangedEvent, () => {
      void load();
    });
    return () => {
      disposed = true;
      unsubscribe();
    };
  }, [id, retry]);
  return {
    notes,
    note,
    loading,
    error,
    refresh: () => setRetry((value) => value + 1),
  };
}
