"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const panels = gsap.utils.toArray(".panel");

    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        pin: true,
        scrub: 1,
        end: () => "+=" + ref.current!.offsetWidth,
      },
    });
  }, []);

  return (
    <section ref={ref} className="h-screen overflow-hidden">
      <div className="flex w-[300%] h-full">
        <div className="panel w-screen bg-black text-white flex items-center justify-center">Wildlife</div>
        <div className="panel w-screen bg-gray-800 text-white flex items-center justify-center">Events</div>
        <div className="panel w-screen bg-gray-600 text-white flex items-center justify-center">Portraits</div>
      </div>
    </section>
  );
}