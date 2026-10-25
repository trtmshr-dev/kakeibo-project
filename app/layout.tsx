import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { AppNav } from "@/components/app-nav";

export const metadata: Metadata = {
  title: "家計簿アプリ",
  description: "家計簿管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen bg-white text-gray-900 antialiased">
        <AppNav />

        <main className="min-w-0 flex-1 bg-white p-4 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}