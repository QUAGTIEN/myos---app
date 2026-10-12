"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMobile } from "./use-mobile";

export function MobileHeaderAction({ children }: { children: ReactNode }) {
  const mobile = useMobile();
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setTarget(document.getElementById("mobile-header-actions"));
  }, []);
  return mobile && target ? createPortal(children, target) : null;
}
