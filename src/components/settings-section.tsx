"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { useMobile } from "./use-mobile";

export function SettingsSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const mobile = useMobile();
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <Card asChild className={`settings-section ${className}`}>
      <section>
        <CardHeader>
          <h2>
            {mobile ? (
              <Button
                variant="ghost"
                className="settings-section-toggle"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen(!open)}
              >
                {title}
                <ChevronRight size={18} aria-hidden="true" />
              </Button>
            ) : (
              title
            )}
          </h2>
        </CardHeader>
        <CardContent id={id} hidden={mobile && !open}>
          {children}
        </CardContent>
      </section>
    </Card>
  );
}
