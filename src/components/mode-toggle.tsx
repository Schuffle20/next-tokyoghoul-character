'use client';

import { useState } from "react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted] = useState(() => typeof window !== "undefined");

  // Avoid hydration mismatches by not rendering until mounted on the client
  if (!mounted) {
    return null;
  }

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      {isDark ? "Light mode" : "Dark mode"}
    </button>
  );
}

