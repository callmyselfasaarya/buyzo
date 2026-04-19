import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Tunable constants ─────────────────────────────────────────────────────────
const PARTICLE_COUNT   = 220;    // number of particles
const CANVAS_OPACITY   = 0.23;   // 23 % transparent as requested
const MOUSE_RADIUS     = 160;    // pixel radius of cursor influence
const REPEL_STRENGTH   = 420;    // how hard particles are pushed away
const RETURN_SPEED     = 0.055;  // spring stiffness back to origin (0–1)
const DAMPING          = 0.72;   // velocity damping per frame
const DRIFT_SPEED      = 0.00018;// idle drift amplitude
const PARTICLE_SIZE    = 2.8;    // base point size (px at z=0 depth)
const PARTICLE_COLOR   = 0xa78bfa; // lavender-purple to match brand

// ─── Per-particle state (not stored in React, lives inside the closure) ────────
interface Particle {
  ox: number; oy: number;        // origin (rest) position in world units
  x:  number; y:  number;
  vx: number; vy: number;
  phase: number;                 // drift phase offset
}

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);   // transparent clear
    renderer.domElement.style.position  = "fixed";
    renderer.domElement.style.inset     = "0";
    renderer.domElement.style.zIndex    = "1";
    renderer.domElement.style.opacity   = String(CANVAS_OPACITY);
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    // ── Scene & ortho camera ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    let W = window.innerWidth;
    let H = window.innerHeight;

    // Half-sizes in world units — 1 world unit = 1 px for orthographic camera
    const camera = new THREE.OrthographicCamera(
      -W / 2, W / 2, H / 2, -H / 2, 0.1, 100
    );
    camera.position.z = 10;
    renderer.setSize(W, H);

    // ── Mouse state (in world coords, centre = 0,0 ) ─────────────────────────
    // Start far off-screen so no force on load
    let mouseX = -99999;
    let mouseY = -99999;

    const toWorld = (clientX: number, clientY: number) => ({
      wx: clientX - W / 2,
      wy: -(clientY - H / 2),
    });

    const onMouseMove = (e: MouseEvent) => {
      const w = toWorld(e.clientX, e.clientY);
      mouseX = w.wx;
      mouseY = w.wy;
    };

    const onMouseLeave = () => {
      mouseX = -99999;
      mouseY = -99999;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    // ── Seed particles ────────────────────────────────────────────────────────
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ox = (Math.random() - 0.5) * W * 1.1;   // spread slightly beyond viewport
      const oy = (Math.random() - 0.5) * H * 1.1;
      particles.push({
        ox, oy,
        x: ox, y: oy,
        vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ── Three.js geometry / material ─────────────────────────────────────────
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const geometry  = new THREE.BufferGeometry();
    const posAttr   = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", posAttr);

    // Mix of purple and blue tints for variety
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      [0.655, 0.545, 0.980], // #a78bfa purple-300
      [0.486, 0.510, 0.969], // #7c82f7 indigo
      [0.231, 0.510, 0.965], // #3B82F6 blue-500
      [0.820, 0.702, 1.000], // lighter lavender
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col[0];
      colors[i * 3 + 1] = col[1];
      colors[i * 3 + 2] = col[2];
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: PARTICLE_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: 1,              // actual fade handled by canvas opacity
      sizeAttenuation: false,  // constant screen-space size (orthographic)
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Animation loop ───────────────────────────────────────────────────────
    let rafId: number;
    let time = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      time += 1;

      const pos = posAttr.array as Float32Array;
      const r2  = MOUSE_RADIUS * MOUSE_RADIUS;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // ── Mouse repulsion ──────────────────────────────────────────────
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < r2 && distSq > 0.01) {
          const dist   = Math.sqrt(distSq);
          // Quadratic falloff so it's stronger near the cursor
          const force  = REPEL_STRENGTH * (1 - dist / MOUSE_RADIUS) ** 2;
          p.vx += (dx / dist) * force * 0.016;  // × dt≈16ms normaliser
          p.vy += (dy / dist) * force * 0.016;
        }

        // ── Spring return to origin ──────────────────────────────────────
        const toOx = p.ox - p.x;
        const toOy = p.oy - p.y;
        p.vx += toOx * RETURN_SPEED;
        p.vy += toOy * RETURN_SPEED;

        // ── Idle drift ───────────────────────────────────────────────────
        p.vx += Math.sin(time * DRIFT_SPEED * 60 + p.phase)         * 0.12;
        p.vy += Math.cos(time * DRIFT_SPEED * 60 + p.phase * 1.3)   * 0.12;

        // ── Integrate ────────────────────────────────────────────────────
        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.x  += p.vx;
        p.y  += p.vy;

        // ── Write to buffer ──────────────────────────────────────────────
        pos[i * 3]     = p.x;
        pos[i * 3 + 1] = p.y;
        pos[i * 3 + 2] = 0;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
      camera.left   = -W / 2;
      camera.right  =  W / 2;
      camera.top    =  H / 2;
      camera.bottom = -H / 2;
      camera.updateProjectionMatrix();

      // Re-seed origins to new viewport
      for (const p of particles) {
        p.ox = (Math.random() - 0.5) * W * 1.1;
        p.oy = (Math.random() - 0.5) * H * 1.1;
      }
    };

    window.addEventListener("resize", onResize);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // The mount div itself is a zero-size layer — the renderer appends a canvas into it
  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}
    />
  );
}
