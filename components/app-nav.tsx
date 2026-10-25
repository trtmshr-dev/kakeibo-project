"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "トップページ" },
  { href: "/register", label: "登録" },
  { href: "/reports", label: "月次レポート" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 shrink-0 border-r border-gray-200 bg-gray-100">
      <div className="border-b border-gray-200 px-5 py-5">
        <h1 className="text-xl font-bold text-gray-800">家計簿</h1>
      </div>

      <nav aria-label="メインメニュー" className="p-3">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`block w-full rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}