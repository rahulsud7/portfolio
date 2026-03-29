"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}