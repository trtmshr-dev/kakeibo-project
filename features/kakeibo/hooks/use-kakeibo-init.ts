"use client";

import { useEffect } from "react";

import { ensureKakeiboInitialized } from "@/features/kakeibo/lib/repository";

export function useKakeiboInit() {
  useEffect(() => {
    void ensureKakeiboInitialized();
  }, []);
}
