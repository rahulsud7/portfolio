"use client";

import React, { useRef } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, X, Mail, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { title: "Events", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000" },
  { title: "Wildlife", img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2000" },
  { title: "Portrait", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2000" },
  { title: "Street", img: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2000" },
  { title: "Landscape", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" },
  { title: "Architecture", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000" },
  { title: "Fashion", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" },
  { title: "Macro", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2000" },
];

export default function Portfolio() {
  const container = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. MAGNETIC CURSOR
      const moveCursor = (e: MouseEvent) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.8,
          ease: "power3.out",
        });
      };
      window.addEventListener("mousemove", moveCursor);

      // 2. THE CINEMATIC HERO (Lando Norris + YK Inspo)
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
        },
      });

      heroTl
        .to(".hero-title-main", { 
            scale: 15, 
            opacity: 0, 
            duration: 2, 
            ease: "power2.inOut" 
        })
        .to(".hero-video-container", { 
            clipPath: "inset(0% 0% 0% 0%)", 
            duration: 2 
        }, 0)
        .from(".hero-subtext", { 
            y: 50, 
            opacity: 0, 
            duration: 1 
        }, 1);

      // 3. HORIZONTAL GALLERY
      const sections = gsap.utils.toArray(".category-card");
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1.2),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${horizontalRef.current?.offsetWidth}`,
        },
      });

      // 4. PARALLAX & REVEALS
      gsap.utils.toArray(".reveal-up").forEach((el: any) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          }
        });
      });

      return () => window.removeEventListener("mousemove", moveCursor);
    },
    { scope: container }
  );

  return (
    <ReactLenis root options={{ lerp: 0.06 }}>
      <main ref={container} className="bg-[#050505] text-[#F9F9F9] overflow-hidden">
        
        {/* CUSTOM CURSOR */}
        <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[999] mix-blend-difference hidden md:block" />

        {/* NAVIGATION */}
        <nav className="fixed top-0 w-full p-8 md:p-12 flex justify-between items-center z-[100] mix-blend-difference">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-white flex items-center justify-center font-black text-sm tracking-tighter">
                YR
            </div>
            <span className="text-xs uppercase tracking-[0.4em] font-bold hidden md:block">Yuvraj Rana</span>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-medium">
            <a href="#work" className="hover:opacity-40 transition">Work</a>
            <a href="#about" className="hover:opacity-40 transition">About</a>
            <a href="#contact" className="hover:opacity-40 transition">Contact</a>
          </div>
        </nav>

        {/* HERO SECTION - RE-ENGINEERED */}
        <section className="hero-section h-screen relative flex items-center justify-center">
          {/* Background Video Layer */}
          <div className="hero-video-container absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: "inset(15% 15% 15% 15%)" }}>
            <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover scale-110 grayscale brightness-50"
                src="https://assets.mixkit.co/videos/preview/mixkit-glacier-river-in-a-mountain-valley-41716-large.mp4" 
            />
          </div>

          {/* Typography Layer */}
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="hero-title-main text-[22vw] font-black leading-none tracking-tighter text-center">
              YUVRAJ
            </h1>
            <div className="hero-subtext mt-10 flex items-center gap-6 opacity-80">
                <span className="h-[1px] w-20 bg-white" />
                <p className="text-sm uppercase tracking-[0.6em]">Visual Storyteller</p>
                <span className="h-[1px] w-20 bg-white" />
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <p className="text-[10px] uppercase tracking-widest">Scroll to explore</p>
            <div className="w-[1px] h-12 bg-white" />
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section id="about" className="py-60 px-[10vw]">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-8">
                <h2 className="reveal-up text-5xl md:text-8xl font-light leading-[0.95] tracking-tighter italic">
                    I find the <span className="font-bold not-italic">unseen</span> in the obvious.
                </h2>
            </div>
            <div className="md:col-span-4 flex items-end">
                <p className="reveal-up text-gray-400 leading-relaxed text-sm md:text-base border-l border-white/10 pl-8">
                    My lens doesn't just record light; it captures the weight of silence. 
                    From the roar of high-speed events to the quiet dignity of a portrait, 
                    my work is an exploration of contrast and character.
                </p>
            </div>
          </div>
        </section>

        {/* CATEGORIES GRID (HORIZONTAL) */}
        <section ref={horizontalRef} id="work" className="h-screen flex items-center bg-[#080808]">
          <div className="flex h-[75vh] items-center px-[10vw] gap-8">
            <div className="min-w-[45vw] md:min-w-[30vw] flex flex-col justify-center pr-20">
                <h3 className="text-8xl font-black tracking-tighter mb-4">WORKS</h3>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">8 Specialized Domains</p>
            </div>
            
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="category-card group relative min-w-[70vw] md:min-w-[40vw] h-full bg-zinc-900 overflow-hidden">
                <img 
                  src={cat.img} 
                  alt={cat.title}
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-12 left-12">
                    <span className="text-xs font-mono opacity-40 mb-2 block">CAT/0{i + 1}</span>
                    <h4 className="text-5xl font-bold tracking-tighter uppercase">{cat.title}</h4>
                    <div className="mt-6 flex items-center gap-2 overflow-hidden w-0 group-hover:w-32 transition-all duration-500 opacity-0 group-hover:opacity-100">
                        <span className="text-[10px] uppercase tracking-widest whitespace-nowrap">View Gallery</span>
                        <ChevronRight size={14} />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVEAL IMAGE */}
        <section className="py-40 px-[5vw]">
            <div className="w-full h-[140vh] relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2500" 
                    className="w-full h-full object-cover grayscale brightness-50"
                    style={{ transform: 'scale(1.1)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-[15vw] font-black mix-blend-overlay opacity-20">STILLNESS</h2>
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="min-h-screen bg-white text-black p-8 md:p-20 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start pt-20">
            <div>
                <p className="text-xs uppercase tracking-[0.5em] mb-10 text-gray-400">Collaborate</p>
                <h2 className="text-[14vw] font-black leading-[0.75] tracking-tighter">
                    READY TO<br />BEGIN?
                </h2>
            </div>
            <div className="mt-20 md:mt-0 text-right">
                <p className="text-3xl font-light mb-2">yuvraj@rana.studio</p>
                <p className="text-xs uppercase tracking-widest opacity-40">Chandigarh / Mumbai / Global</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-t border-black/10 pt-10">
            <div className="flex gap-12 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="hover:line-through">Instagram</a>
              <a href="#" className="hover:line-through">Behance</a>
              <a href="#" className="hover:line-through">Twitter</a>
            </div>
            <div className="text-[10px] opacity-40 uppercase tracking-[0.3em]">
              © 2026 Yuvraj Rana — Built for the Visionary
            </div>
          </div>
        </footer>
      </main>
    </ReactLenis>
  );
}