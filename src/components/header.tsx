"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter text-red-600">
          ANTEIKU <span className="text-slate-900 dark:text-white">DB</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* We put our toggle here */}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}