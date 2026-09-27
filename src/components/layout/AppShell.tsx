"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardFooter } from "./DashboardFooter";
import { MobileNavigation } from "./MobileNavigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const isDashboardPage =
    pathname === "/customer" ||
    pathname.startsWith("/customer/") ||
    pathname === "/provider" ||
    pathname.startsWith("/provider/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAuthPage) {
    return <main className="flex-1 min-h-screen flex flex-col">{children}</main>;
  }

  if (isDashboardPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 w-full overflow-x-clip">
        <DashboardNavbar />
        <main className="flex-1 pb-28 md:pb-0 flex flex-col w-full min-w-0">{children}</main>
        <DashboardFooter />
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-clip">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-0 w-full min-w-0">{children}</main>
      <Footer />
      <MobileNavigation />
    </div>
  );
}

