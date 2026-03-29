"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const circle = ref.current.querySelector(".circle") as HTMLElement;

    gsap.to(circle, {
      clipPath: "circle(200% at 50% 50%)",
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section ref={ref} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        <video
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover"
          src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-silver-liquid-34440-large.mp4"
        />

        <div
          className="circle absolute inset-0 bg-[#F9F9F9]"
          style={{ clipPath: "circle(0% at 50% 50%)" }}
        />

        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-[8vw] tracking-[0.3em]">YUVRAJ RANA</h1>
        </div>
      </div>
    </section>
  );
}
