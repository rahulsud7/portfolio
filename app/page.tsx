"use client";

import React, { useRef, useState, useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  { title: "Grand Prix", subtitle: "Automotive", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000" },
  { title: "Wild Narrative", subtitle: "Nature", img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2000" },
  { title: "Human Essence", subtitle: "Portraiture", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000" },
  { title: "Urban Geometry", subtitle: "Architecture", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2000" },
  { title: "High Fashion", subtitle: "Editorial", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000" },
];

export default function Portfolio() {
  const container = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(true);

  // ELEGANT YK-STYLE LOADER
  useEffect(() => {
    const timer = setTimeout(() => {
      gsap.to(".loader-overlay", { 
        opacity: 0, 
        duration: 1.5, 
        ease: "power2.inOut",
        onComplete: () => {
            setIsLoading(false);
            gsap.set(".loader-overlay", { display: "none" });
        }
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (isLoading) return;

    // Refresh to guarantee accurate DOM measurements
    ScrollTrigger.refresh();

    // 1. GENTLE PARALLAX HERO
    gsap.to(heroImageRef.current, {
      yPercent: 15,
      scale: 1.05,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(".hero-text", {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "center top",
        scrub: true,
      }
    });

   // 2. FINAL HORIZONTAL SCROLL FIX (VERCEL + LOCAL SAFE)
const wrapper = horizontalRef.current;
const content = scrollContentRef.current;

if (wrapper && content) {
  const images = content.querySelectorAll("img");

  const initScroll = () => {
    const totalWidth = content.scrollWidth;
    const scrollDistance = totalWidth - window.innerWidth;

    gsap.to(content, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        scrub: 1,
        start: "top top",
        end: `+=${scrollDistance}`,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    ScrollTrigger.refresh();
  };

  // 🚨 Wait for images (THIS is what was breaking it)
  let loaded = 0;

  if (images.length === 0) {
    initScroll();
  } else {
    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) initScroll();
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === images.length) initScroll();
        };
      }
    });
  }
}

    // 3. EDITORIAL TEXT REVEALS
    gsap.utils.toArray(".reveal-text").forEach((el: any) => {
      gsap.from(el, {
        y: 40, 
        opacity: 0, 
        duration: 1.2, 
        ease: "power3.out",
        scrollTrigger: { 
            trigger: el, 
            start: "top 85%" 
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, { scope: container, dependencies: [isLoading] });

  return (
    <ReactLenis root options={{ lerp: 0.06, smoothWheel: true, syncTouch: true }}>
      
      {/* MINIMALIST LOADER */}
      <div className="loader-overlay fixed inset-0 z-[1000] bg-[#030303] text-[#E5E5E5] flex items-center justify-center pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.6em] font-medium animate-pulse">Loading Archive</p>
      </div>

      <main ref={container} className="bg-[#030303] text-[#E5E5E5] selection:bg-[#E5E5E5] selection:text-[#030303] overflow-x-hidden font-sans">
        
        {/* EDITORIAL NAVIGATION */}
        <nav className="fixed top-0 w-full p-8 md:p-12 flex justify-between items-start z-[100] mix-blend-difference">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold tracking-tight">YUVRAJ RANA</span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Studio Archive</span>
          </div>
          <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] font-medium mt-1">
            <a href="#about" className="hover:opacity-50 transition-opacity">Philosophy</a>
            <a href="#work" className="hover:opacity-50 transition-opacity">Selected Works</a>
            <a href="#contact" className="hover:opacity-50 transition-opacity">Inquiries</a>
          </div>
        </nav>

        {/* HERO SECTION - REFINED */}
        <section className="hero-section h-[100svh] relative flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div ref={heroImageRef} className="w-[110%] h-[110%] -left-[5%] -top-[5%] relative">
                <img 
                    src="https://images.unsplash.com/photo-1604016625816-17b5e4c0222a?q=80&w=2500" 
                    className="w-full h-full object-cover grayscale brightness-[0.2]"
                    alt="Hero Background"
                />
            </div>
            {/* Very subtle grain */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }} />
          </div>
          
          <div className="hero-text relative z-10 text-center pointer-events-none mt-20">
            <h1 className="text-[18vw] md:text-[14vw] font-black leading-[0.85] tracking-tighter uppercase mix-blend-overlay text-white opacity-90">
                YUVRAJ
            </h1>
            <h1 className="text-[18vw] md:text-[14vw] font-black leading-[0.85] tracking-tighter uppercase italic text-transparent stroke-text">
                RANA
            </h1>
          </div>

          <div className="absolute bottom-10 left-8 md:left-12 hero-text">
             <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">Est. 2026 // Global</p>
          </div>
        </section>

        {/* PHILOSOPHY - YK PRODUCE VIBE (High Whitespace) */}
        <section id="about" className="py-40 md:py-60 px-[8vw] md:px-[15vw] relative z-10">
            <div className="max-w-5xl">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-16 font-medium reveal-text">
                    [ 01 — The Approach ]
                </p>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal leading-[1.1] tracking-tight reveal-text text-[#E5E5E5]">
                    Photography is an act of <span className="italic font-light">subtraction</span>. We remove the noise to reveal the narrative.
                </h2>
                
                <div className="mt-32 grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-5 reveal-text">
                        <p className="text-xs uppercase tracking-widest text-white/40 leading-loose border-l border-white/10 pl-6">
                            Chandigarh<br />Mumbai<br />Worldwide
                        </p>
                    </div>
                    <div className="md:col-span-7 reveal-text text-sm md:text-base text-white/60 leading-relaxed font-light">
                        <p className="mb-8">
                            Based in India, Yuvraj Rana Studio specializes in high-contrast, atmospheric visual storytelling. 
                            From the visceral energy of a Grand Prix to the profound silence of a portrait, our work is defined by precision and emotion.
                        </p>
                        <p>
                            We do not just document moments; we architect them. Operating at the intersection of fine art and commercial production, we craft legacies for visionary brands and individuals.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* BULLETPROOF HORIZONTAL GALLERY */}
        {/* NOTE: w-max and shrink-0 are the keys to stopping the scroll from breaking */}
        <section ref={horizontalRef} id="work" className="h-screen flex items-center overflow-hidden bg-[#030303] border-y border-white/5">
          <div ref={scrollContentRef} className="flex h-[70vh] items-center px-[8vw] md:px-[15vw] w-max">
            
            {/* Intro Block */}
            <div className="w-[80vw] md:w-[35vw] shrink-0 flex flex-col justify-center pr-20">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-8 font-medium">
                    [ 02 — Archive ]
                </p>
                <h3 className="text-6xl md:text-8xl font-normal tracking-tighter leading-none italic">
                    Selected<br />Works.
                </h3>
            </div>
            
            {/* Cards */}
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="group relative w-[85vw] md:w-[40vw] h-full shrink-0 mr-8 md:mr-16 bg-[#0A0A0A] overflow-hidden cursor-pointer">
                <img 
                    src={cat.img} 
                    className="w-full h-full object-cover grayscale brightness-[0.5] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" 
                    alt={cat.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-1000" />
                
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="overflow-hidden">
                        <span className="text-[9px] text-white/40 mb-3 block tracking-[0.3em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                            {cat.subtitle} — 0{i + 1}
                        </span>
                        <h4 className="text-3xl md:text-4xl font-normal tracking-tighter uppercase text-white">
                            {cat.title}
                        </h4>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <ArrowUpRight size={28} strokeWidth={1} className="text-white" />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EDITORIAL REVEAL SECTION */}
        <section className="py-40 md:py-60 px-[8vw] md:px-[15vw]">
            <div className="grid md:grid-cols-2 gap-20 items-center">
                <div className="aspect-[3/4] overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2500" 
                        className="w-full h-full object-cover grayscale brightness-50 reveal-text"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-10 font-medium reveal-text">
                        [ 03 — The Aesthetic ]
                    </p>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tighter leading-[1] reveal-text italic">
                        Shadows <br />speak louder <br />than light.
                    </h2>
                    <p className="mt-12 text-sm text-white/50 leading-relaxed font-light reveal-text max-w-sm">
                        True mastery of the lens isn't about illuminating the subject; it's about carefully curating the darkness that surrounds it.
                    </p>
                </div>
            </div>
        </section>

        {/* HIGH-END CONTACT PAGE */}
        <footer id="contact" className="bg-[#E5E5E5] text-[#030303] pt-40 pb-12 px-[8vw] md:px-[12vw] flex flex-col justify-between min-h-screen">
          
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-black/40 mb-12 font-medium">
                [ 04 — Inquiries ]
            </p>
            <h2 className="text-[14vw] md:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase">
                LET'S
            </h2>
            <h2 className="text-[14vw] md:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase italic opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
                CREATE.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 border-t border-black/10 pt-16 mt-20">
            
            <div className="md:col-span-5 space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-bold">Direct Communication</p>
                <a href="mailto:yuvraj@rana.studio" className="text-2xl md:text-3xl lg:text-4xl font-normal tracking-tighter hover:italic transition-all duration-300 block break-words border-b border-black pb-2 inline-block">
                    yuvraj@rana.studio
                </a>
            </div>

            <div className="md:col-span-4 space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-bold">Studio Location</p>
                <div className="text-xs md:text-sm text-black/70 font-medium leading-relaxed">
                    Yuvraj Rana Studio<br />
                    Sector 9, Design District<br />
                    Chandigarh, India
                </div>
            </div>

            <div className="md:col-span-3 flex flex-col md:items-end justify-between space-y-12 md:space-y-0">
                <div className="flex flex-col gap-3 text-[10px] font-bold uppercase tracking-[0.2em] md:text-right">
                    <a href="#" className="hover:text-black/50 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-black/50 transition-colors">Behance</a>
                    <a href="#" className="hover:text-black/50 transition-colors">Twitter (X)</a>
                </div>
                <div className="text-[8px] uppercase tracking-[0.3em] text-black/40 font-bold md:text-right leading-loose">
                    © 2026 YR STUDIO<br />Design by Architecture
                </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Global Style for Outline Text */}
      <style jsx global>{`
        .stroke-text {
            -webkit-text-stroke: 1px rgba(255,255,255,0.4);
            color: transparent;
        }
      `}</style>
    </ReactLenis>
  );
}