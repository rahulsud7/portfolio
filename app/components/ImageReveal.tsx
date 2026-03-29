"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ImageReveal() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current.querySelector(".color") as HTMLElement;

    gsap.to(el, {
      clipPath: "inset(0% 0% 0% 0%)",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });
  }, []);

  return (
    <div ref={ref} className="h-[120vh] flex items-center justify-center">
      <div className="relative w-[400px] h-[500px]">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c"
          className="absolute w-full h-full object-cover grayscale"
        />

        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c"
          className="color absolute w-full h-full object-cover"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        />
      </div>
    </div>
  );
}