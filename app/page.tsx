"use client";

import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const WORKS = [
  { num: "01", title: "Grand Prix",     sub: "Automotive",  img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1600" },
  { num: "02", title: "Wild Narrative", sub: "Nature",      img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1600" },
  { num: "03", title: "Human Essence",  sub: "Portraiture", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1600" },
  { num: "04", title: "Urban Geometry", sub: "Architecture",img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600" },
  { num: "05", title: "High Fashion",   sub: "Editorial",   img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600" },
];

const MARQUEE = [
  "https://images.unsplash.com/photo-1604016625816-17b5e4c0222a?q=80&w=600",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600",
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=600",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
];

// ─── SHADERS (Optimized for 60FPS) ────────────────────────────────────────────
const VERT = `
varying vec2 vUv;
void main(){ vUv=uv; gl_Position=vec4(position,1.); }
`;

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec2  uMouse;
varying vec2  vUv;

vec2 hash2(vec2 p){
  p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
  return -1.0+2.0*fract(sin(p)*43758.5453);
}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  return mix(
    mix(dot(hash2(i),f), dot(hash2(i+vec2(1,0)),f-vec2(1,0)), u.x),
    mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)), dot(hash2(i+vec2(1,1)),f-vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  // Reduced to 3 iterations. Massive performance gain, visually identical.
  for(int i=0;i<3;i++){ v+=a*noise(p); p=p*2.3+vec2(.4,.7); a*=.5; }
  return v;
}
void main(){
  vec2 uv = vUv;
  float t = uTime*0.09;

  vec2 q = vec2(fbm(uv*1.6+t), fbm(uv*1.6+vec2(5.2,1.3)));
  vec2 r = vec2(fbm(uv*1.6+2.*q+vec2(1.7,9.2)+0.11*t),
                fbm(uv*1.6+2.*q+vec2(8.3,2.8)+0.09*t));
  float f = fbm(uv*2.2+r);

  vec3 c = mix(vec3(0.016,0.011,0.006), vec3(0.038,0.027,0.011), clamp(f*2.,0.,1.));
  c = mix(c, vec3(0.10,0.068,0.022), clamp(pow(f,2.5)*3.,0.,1.));
  c = mix(c, vec3(0.26,0.17,0.055), clamp(pow(f,4.0)*4.5,0.,1.));

  float md = length(uv - uMouse);
  c += vec3(0.52,0.36,0.11) * smoothstep(0.55,0.0,md) * 0.45;
  c += vec3(0.18,0.12,0.04) * smoothstep(1.5,0.0,length(uv-vec2(0.88,0.82))) * 0.28;

  vec2 vig = uv*2.0-1.0;
  c *= 1.0 - dot(vig*0.42, vig*0.42);
  c.r *= 1.0 + 0.06*(1.0-length(vig)*0.7);

  gl_FragColor = vec4(c, 1.0);
}
`;

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:ital,wght@0,200;0,300;0,400;1,300&family=Syne:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:   #060606;
    --fog:   #E9E6E0;
    --mid:   #5A5550;
    --gold:  #C4A35A;
    --cream: #EEEBE5;
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans:  'DM Sans', sans-serif;
    --ui:    'Syne', sans-serif;
  }
  body { background: var(--ink); color: var(--fog); font-family: var(--sans); font-weight: 300; overflow-x: hidden; cursor: none; }
  ::selection { background: var(--gold); color: var(--ink); }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; will-change: transform; }

  /* HARDWARE ACCELERATED CURSOR */
  .c-dot, .c-ring {
    position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none; mix-blend-mode: difference;
    border-radius: 50%; will-change: transform;
  }
  .c-dot { width: 8px; height: 8px; background: var(--fog); margin: -4px 0 0 -4px; }
  .c-ring { width: 40px; height: 40px; border: 1px solid rgba(233,230,224,0.35); margin: -20px 0 0 -20px; transition: width 0.3s ease, height 0.3s ease, margin 0.3s ease, background 0.3s ease; }
  .c-ring.big { width: 80px; height: 80px; margin: -40px 0 0 -40px; background: rgba(255,255,255,0.1); backdrop-filter: blur(2px); }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    padding: 2rem 2.5rem; display: flex; justify-content: space-between; align-items: flex-start; mix-blend-mode: difference;
  }
  .n-logo { font-family: var(--serif); font-size: 1.5rem; font-weight: 400; letter-spacing: .05em; display: flex; align-items: center; gap: 0.5rem; }
  .n-logo span { font-family: var(--ui); font-size: 0.5rem; letter-spacing: 0.3em; background: var(--fog); color: var(--ink); padding: 0.2rem 0.4rem; border-radius: 2px; }
  .n-links { display: flex; gap: 2.5rem; font-family: var(--ui); font-size: .58rem; letter-spacing: .42em; text-transform: uppercase; }
  .n-links a { opacity: .55; transition: opacity .3s, font-style .25s; }
  .n-links a:hover { opacity: 1; font-style: italic; }

  /* HERO */
  .hero { height: 100dvh; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
  .hero-title { font-family: var(--serif); font-size: clamp(5rem,20vw,17rem); font-weight: 300; line-height: .82; letter-spacing: -.04em; text-align: center; color: var(--fog); pointer-events: none; position: relative; z-index: 2; clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%); }
  .hero-title em { display: block; font-style: italic; opacity: .32; letter-spacing: -.06em; }
  .hero-tag { position: absolute; bottom: clamp(2rem,5vh,4rem); left: 2.5rem; display: flex; align-items: center; gap: 1rem; z-index: 2; }
  .hero-tag-line { width: 2rem; height: 1px; background: rgba(233,230,224,.25); }
  .hero-tag-txt { font-family: var(--ui); font-size: .53rem; letter-spacing: .45em; text-transform: uppercase; color: var(--mid); }

  /* MARQUEE */
  .marquee-wrap { overflow: hidden; position: relative; z-index: 2; border-top: 1px solid rgba(233,230,224,.05); border-bottom: 1px solid rgba(233,230,224,.05); }
  .marquee-track { display: flex; gap: .9rem; padding: .75rem 0; animation: mroll 24s linear infinite; width: max-content; }
  .mq-item { width: clamp(130px,16vw,200px); aspect-ratio: 3/2; overflow: hidden; flex-shrink: 0; }
  .mq-item img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(100%) brightness(.5); transition: filter .7s, transform .7s cubic-bezier(.25,.46,.45,.94); }
  .mq-item:hover img { filter: grayscale(0%) brightness(1); transform: scale(1.05); }
  @keyframes mroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* SECTION LABEL */
  .slabel { font-family: var(--ui); font-size: .53rem; letter-spacing: .52em; text-transform: uppercase; color: var(--mid); display: flex; align-items: center; gap: 1rem; margin-bottom: 4rem; overflow: hidden; }
  .slabel::before { content:''; width: 2.5rem; height: 1px; background: var(--gold); flex-shrink: 0; }
  
  /* PHILOSOPHY */
  .philosophy { background: var(--ink); position: relative; z-index: 2; padding: clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem); }
  .phi-quote { font-family: var(--serif); font-size: clamp(2rem,4.5vw,3.8rem); font-weight: 300; line-height: 1.1; letter-spacing: -.025em; color: var(--fog); max-width: 860px; margin-bottom: clamp(4rem,8vw,7rem); }
  .phi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; border-top: 1px solid rgba(233,230,224,.07); padding-top: clamp(3rem,6vw,5rem); }
  .phi-body { font-size: .85rem; line-height: 1.95; color: var(--mid); max-width: 440px; }
  .phi-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; padding-left: 3.5rem; border-left: 1px solid rgba(233,230,224,.07); }
  .stat-n { font-family: var(--serif); font-size: clamp(2.5rem,4.5vw,3.8rem); font-weight: 300; color: var(--gold); line-height: 1; font-variant-numeric: tabular-nums; }
  .stat-l { font-family: var(--ui); font-size: .52rem; letter-spacing: .42em; text-transform: uppercase; color: var(--mid); margin-top: .45rem; }

  /* HORIZONTAL SCROLL (GSAP PINNED - NO CRASHES) */
  .hs-outer { height: 100vh; overflow: hidden; background: #0A0906; z-index: 2; border-top: 1px solid rgba(233,230,224,.04); }
  .hs-track { display: flex; align-items: center; height: 100%; padding: 0 clamp(1.5rem,6vw,6rem); width: max-content; will-change: transform; }
  .hs-intro { flex-shrink: 0; width: clamp(220px,26vw,380px); padding-right: 4vw; }
  .hs-intro h3 { font-family: var(--serif); font-size: clamp(3rem,7vw,6rem); font-weight: 300; line-height: .88; letter-spacing: -.04em; }
  .hs-intro p { font-size: .75rem; color: var(--mid); margin-top: 2rem; line-height: 1.8; max-width: 220px; }
  
  .hs-card { flex-shrink: 0; width: clamp(240px,38vw,520px); height: clamp(320px,62vh,660px); position: relative; overflow: hidden; margin-right: clamp(.75rem,2.5vw,2.5rem); background: #0D0B08; border: 1px solid rgba(255,255,255,0.02); }
  .hs-card img { width: 100%; height: 110%; object-fit: cover; transform: scale(1.07); filter: brightness(0.4) grayscale(100%); transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1), filter 1.2s cubic-bezier(0.19, 1, 0.22, 1); pointer-events: none; }
  .hs-card:hover img { transform: scale(1); filter: brightness(0.9) grayscale(0%); }
  
  .hs-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(6,6,6,.96) 0%, transparent 100%); }
  .hs-num { font-family: var(--ui); font-size: .53rem; letter-spacing: .42em; color: var(--gold); margin-bottom: .4rem; }
  .hs-title { font-family: var(--serif); font-size: clamp(1.6rem,3vw,2.8rem); font-weight: 300; letter-spacing: -.025em; color: var(--fog); }

  /* EDITORIAL */
  .editorial { background: var(--ink); position: relative; z-index: 2; padding: clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem); overflow: hidden; }
  .ed-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; }
  .ed-img-wrap { aspect-ratio: 4/5; overflow: hidden; position: relative; }
  .ed-img-wrap img { width: 100%; height: 120%; object-fit: cover; top: -10%; position: absolute; filter: grayscale(100%); transition: filter 1s ease; }
  .ed-img-wrap:hover img { filter: grayscale(0%); }
  .ed-text { display: flex; flex-direction: column; gap: 2rem; }
  .ed-title { font-family: var(--serif); font-size: clamp(2.5rem,5vw,4.5rem); font-weight: 300; line-height: 1; letter-spacing: -.03em; }
  .ed-body { font-size: .85rem; line-height: 1.95; color: var(--mid); max-width: 380px; }

  /* CONTACT */
  .contact { background: var(--cream); color: var(--ink); padding: clamp(5rem,12vw,10rem) clamp(1.5rem,8vw,8rem) 4rem; min-height: 88dvh; position: relative; z-index: 2; display: flex; flex-direction: column; justify-content: space-between; }
  .ct-big { font-family: var(--serif); font-size: clamp(5rem,16vw,14rem); font-weight: 300; line-height: .82; letter-spacing: -.05em; color: var(--ink); }
  .ct-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 3rem; border-top: 1px solid rgba(6,6,6,.09); padding-top: 3rem; margin-top: clamp(3rem,6vw,5rem); }
  .ct-lbl { font-family: var(--ui); font-size: .52rem; letter-spacing: .42em; text-transform: uppercase; color: rgba(6,6,6,.38); margin-bottom: 1.1rem; }
  .ct-email { font-family: var(--serif); font-size: clamp(1rem,2.5vw,1.9rem); font-weight: 300; border-bottom: 1px solid rgba(6,6,6,.14); padding-bottom: .4rem; display: inline-block; color: var(--ink); transition: font-style 0.3s; }
  .ct-email:hover { font-style: italic; }
  .ct-copy { font-family: var(--ui); font-size: .52rem; letter-spacing: .32em; text-transform: uppercase; opacity: .32; color: var(--ink); border-top: 1px solid rgba(6,6,6,.07); padding-top: 2rem; margin-top: 3rem; }
  
  @media(max-width:768px){ 
    .n-links { display: none; }
    .phi-grid, .ed-grid, .ct-grid { grid-template-columns: 1fr; }
    .phi-stats { border-left: none; padding-left: 0; border-top: 1px solid rgba(233,230,224,.07); padding-top: 2.5rem; }
  }
`;

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function YKPortfolio() {
  const [loaded, setLoaded] = useState(false);
  const [prog, setProg]     = useState(0);

  const containerRef  = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const dotRef        = useRef<HTMLDivElement>(null);
  const ringRef       = useRef<HTMLDivElement>(null);
  const hOuterRef     = useRef<HTMLDivElement>(null);
  const hTrackRef     = useRef<HTMLDivElement>(null);

  // ── THREE.JS SHADER (OPTIMIZED) ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25)); // Caps resolution to prevent lag
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geo    = new THREE.PlaneGeometry(2, 2);
    const uni    = {
      uTime:  { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.3) },
    };
    
    const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: uni }));
    scene.add(mesh);

    const tM = new THREE.Vector2(0.5, 0.3);
    const sM = new THREE.Vector2(0.5, 0.3);
    
    const onMM = (e: MouseEvent) => {
      tM.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    const onRZ = () => renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener("mousemove", onMM, { passive: true });
    window.addEventListener("resize", onRZ, { passive: true });

    let id: number;
    const tick = (t: number) => {
      uni.uTime.value = t * 0.001;
      sM.x += (tM.x - sM.x) * 0.045;
      sM.y += (tM.y - sM.y) * 0.045;
      uni.uMouse.value.copy(sM);
      renderer.render(scene, camera);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("resize", onRZ);
      geo.dispose();
      mesh.material.dispose();
      renderer.dispose();
    };
  }, []);

  // ── GSAP MASTER TIMELINE (Loader + Scroll + Cursor) ────────────────────
  useGSAP(() => {
    // 1. FAST CURSOR (quickTo bypasses React overhead)
    const xDot = gsap.quickTo(dotRef.current, "left", { duration: 0.1, ease: "power3" });
    const yDot = gsap.quickTo(dotRef.current, "top", { duration: 0.1, ease: "power3" });
    const xRing = gsap.quickTo(ringRef.current, "left", { duration: 0.3, ease: "power3" });
    const yRing = gsap.quickTo(ringRef.current, "top", { duration: 0.3, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor, { passive: true });

    // Cursor Hover States
    const hoverElements = document.querySelectorAll("a, [data-cursor]");
    const grow = () => ringRef.current?.classList.add("big");
    const shrink = () => ringRef.current?.classList.remove("big");
    hoverElements.forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    // 2. YK PRELOADER SEQUENCE
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setProg(100);
        
        // Outro Timeline
        const tl = gsap.timeline({
          onComplete: () => {
            setLoaded(true);
            ScrollTrigger.refresh(); // Crucial: Re-calc scroll positions after loader leaves
          }
        });
        
        // The YK slide-up reveal
        tl.to(".ldr-inner", { y: -50, opacity: 0, duration: 0.6, ease: "power3.inOut", delay: 0.2 })
          .to(".ldr-bg", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
          .set(".ldr", { display: "none" });

        // Hero Content Reveal
        tl.from(".hero-split", { 
          y: 100, opacity: 0, duration: 1.5, ease: "power4.out", stagger: 0.1 
        }, "-=0.6")
        .from(".nav-reveal, .hero-tag", {
          y: 20, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.1
        }, "-=1.2");

      } else {
        setProg(Math.round(p));
      }
    }, 50);

    // 3. BULLETPROOF HORIZONTAL SCROLL (ScrollTrigger)
    const track = hTrackRef.current;
    const outer = hOuterRef.current;
    
    if (track && outer) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
      
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1.2, // Adds the buttery smooth catch-up lag
          invalidateOnRefresh: true,
        }
      });
    }

    // 4. EDITORIAL IMAGE PARALLAX
    gsap.to(".ed-img-wrap img", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".ed-img-wrap",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // 5. YK STYLE TYPOGRAPHY REVEALS
    gsap.utils.toArray(".gsap-rev").forEach((el: any) => {
      gsap.from(el, {
        y: 60, opacity: 0, duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      });
    });

    return () => {
      clearInterval(iv);
      window.removeEventListener("mousemove", moveCursor);
      hoverElements.forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, { scope: containerRef });

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true, syncTouch: true }}>
      <div ref={containerRef} style={{ background: "#060606", color: "#E9E6E0", minHeight: "100vh" }}>
        <style>{CSS}</style>

        {/* Grain overlay */}
        <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "190px" }} />

        {/* WebGL canvas — optimized */}
        <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", width: "100%", height: "100%" }} />

        {/* Custom cursor */}
        <div ref={dotRef}  className="c-dot hidden md:block" />
        <div ref={ringRef} className="c-ring hidden md:block" />

        {/* ── PRELOADER ─────────────────────────────────────────────── */}
        <div className="ldr">
          <div className="ldr-bg absolute inset-0 bg-[#060606] z-0" />
          <div className="ldr-inner relative z-10 text-center">
            <div className="ldr-num tabular-nums font-light">{String(prog).padStart(3, "0")}</div>
            <div className="ldr-lbl tracking-[0.6em]">Initializing Archive</div>
          </div>
        </div>

        {/* ── NAV ───────────────────────────────────────────────────── */}
        <nav className="nav-reveal">
          <div className="n-logo">
            YR <span>STUDIO</span>
          </div>
          <div className="n-links">
            <a href="#about"   data-cursor>Philosophy</a>
            <a href="#work"    data-cursor>Archive</a>
            <a href="#contact" data-cursor>Inquiries</a>
          </div>
        </nav>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-title overflow-hidden">
            <span className="hero-split block">YUVRAJ</span>
            <em className="hero-split">RANA</em>
          </div>
          <div className="hero-tag">
            <div className="hero-tag-line" />
            <span className="hero-tag-txt">Est. 2026 · Chandigarh · Global</span>
          </div>
        </section>

        {/* ── MARQUEE ───────────────────────────────────────────────── */}
        <div className="marquee-wrap gsap-rev">
          <div className="marquee-track">
            {[...MARQUEE, ...MARQUEE].map((src, i) => (
              <div className="mq-item" key={i}>
                <img src={src} alt="Archive Thumbnail" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* ── PHILOSOPHY ────────────────────────────────────────────── */}
        <section id="about" className="philosophy">
          <div className="slabel gsap-rev">01 — Philosophy</div>
          <p className="phi-quote gsap-rev">
            Photography is an act of <em>subtraction.</em><br />
            We remove the noise to reveal the narrative.
          </p>
          <div className="phi-grid">
            <div className="phi-body gsap-rev">
              <p>Based in India, Yuvraj Rana Studio specializes in high-contrast, atmospheric visual storytelling. From the visceral energy of a Grand Prix to the profound silence of a portrait, our work is defined by precision and emotion.</p>
              <p>We do not simply document moments — we architect them. Operating at the intersection of fine art and commercial production, we craft legacies for visionary brands and individuals who refuse to be ordinary.</p>
            </div>
            <div className="phi-stats gsap-rev">
              {[
                { count: "12+", label: "Years active"  },
                { count: "300+", label: "Projects"      },
                { count: "5",   label: "Disciplines"   },
                { count: "4",   label: "Continents"    },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="stat-n">{stat.count}</div>
                  <div className="stat-l">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HORIZONTAL SCROLL (GSAP PINNED - ZERO LAG) ────────────── */}
        <div id="work" ref={hOuterRef} className="hs-outer">
          <div ref={hTrackRef} className="hs-track">
            <div className="hs-intro">
              <div className="slabel" style={{ marginBottom: "2rem" }}>02 — Archive</div>
              <h3>Selected<br /><em>Works.</em></h3>
              <p>Scroll to navigate the archive.</p>
            </div>

            {WORKS.map((w, i) => (
              <div key={i} className="hs-card" data-cursor>
                <img src={w.img} alt={w.title} loading="lazy" />
                <div className="hs-info">
                  <div className="hs-num">{w.num} — {w.sub}</div>
                  <div className="hs-title">{w.title}</div>
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, width: "clamp(1.5rem,6vw,6rem)" }} />
          </div>
        </div>

        {/* ── EDITORIAL ─────────────────────────────────────────────── */}
        <section className="editorial">
          <div className="slabel gsap-rev">03 — The Aesthetic</div>
          <div className="ed-grid">
            <div className="ed-img-wrap gsap-rev" data-cursor>
              <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000" alt="Editorial" loading="lazy" />
            </div>
            <div className="ed-text">
              <h3 className="ed-title gsap-rev">Shadows<br /><em>&amp; Light</em></h3>
              <p className="ed-body gsap-rev">True mastery of the lens is not about illuminating the subject; it is about carefully curating the darkness that surrounds it. The intersection of structure and void creates a stark, uncompromising aesthetic.</p>
              <p className="ed-body gsap-rev">Every frame is a deliberate reduction — the irrelevant stripped away until only the essential remains. This philosophy extends from studio to final print.</p>
            </div>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────────────── */}
        <footer id="contact" className="contact">
          <div>
            <div className="slabel gsap-rev" style={{ color: "rgba(6,6,6,.38)" }}>04 — Inquiries</div>
            <div className="ct-big gsap-rev">
              LET'S<br /><em>CREATE.</em>
            </div>
          </div>

          <div className="ct-grid">
            <div className="gsap-rev">
              <div className="ct-lbl">Direct Communication</div>
              <a className="ct-email" href="mailto:yuvraj@rana.studio" data-cursor>
                yuvraj@rana.studio
              </a>
            </div>
            <div className="gsap-rev">
              <div className="ct-lbl">Studio Location</div>
              <address style={{ fontStyle: "normal", fontSize: ".78rem", lineHeight: 1.85, color: "rgba(6,6,6,.52)" }}>
                Yuvraj Rana Studio<br />
                Sector 9, Design District<br />
                Chandigarh, India
              </address>
            </div>
            <div className="gsap-rev">
              <div className="ct-lbl">Follow</div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                <a href="#" data-cursor style={{ fontSize: ".6rem", letterSpacing: ".32em", textTransform: "uppercase", opacity: .42 }}>Instagram</a>
                <a href="#" data-cursor style={{ fontSize: ".6rem", letterSpacing: ".32em", textTransform: "uppercase", opacity: .42 }}>Behance</a>
              </div>
            </div>
          </div>
          <div className="ct-copy">© 2026 YR STUDIO</div>
        </footer>
      </div>
    </ReactLenis>
  );
}