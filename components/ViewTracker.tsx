"use client";

import { useEffect } from "react";
import { trackPageView } from "@/app/actions";

export default function ViewTracker() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/_next")) return;
    void trackPageView(path).catch(() => {});
  }, []);

  return null;
}
