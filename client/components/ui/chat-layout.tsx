import React from "react";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
}

export function ChatLayout({ children, sidebar, className }: ChatLayoutProps) {
  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {/* Sidebar */}
      <div className="w-80 bg-secondary/50 border-r border-border">
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
