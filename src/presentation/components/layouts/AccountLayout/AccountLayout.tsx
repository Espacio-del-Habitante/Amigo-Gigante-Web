"use client";

import type { ReactNode } from "react";

import { AccountSidebar, type AccountSidebarProps } from "./AccountSidebar";

export interface AccountLayoutProps {
  children: ReactNode;
  profileName: string;
  activeRoute?: AccountSidebarProps["activeRoute"];
}

export function AccountLayout({ children, profileName, activeRoute }: AccountLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AccountSidebar profileName={profileName} activeRoute={activeRoute} />
      {children}
    </div>
  );
}
