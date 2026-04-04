import { siMlflow } from 'simple-icons';
import { useEffect, useRef } from 'react';

interface SkillNode {
  slug?: string;
  siIcon?: { svg: string; hex: string; title: string };
  label: string;
}

interface SimNode extends SkillNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const SKILLS: SkillNode[] = [
  { slug: 'py',         label: 'Python' },
  { slug: 'ts',         label: 'TypeScript' },
  { slug: 'js',         label: 'JavaScript' },
  { slug: 'react',      label: 'React' },
  { slug: 'bash',       label: 'Bash' },
  { slug: 'latex',     label: 'LaTeX' },
  { slug: 'astro',      label: 'Astro' },
  { slug: 'obsidian',   label: 'Obsidian' },
  { slug: 'flask',      label: 'Flask' },
  { slug: 'arch',       label: 'Arch Linux' },
  { slug: 'fastapi',    label: 'FastAPI' },
  { slug: 'spring',     label: 'Spring' },
  { slug: 'docker',     label: 'Docker' },
  { slug: 'kubernetes', label: 'Kubernetes' },
  { slug: 'postgres',   label: 'PostgreSQL' },
  { slug: 'mongodb',    label: 'MongoDB' },
  { slug: 'pytorch',    label: 'PyTorch' },
  { slug: 'sklearn',    label: 'scikit-learn' },
  { slug: 'git',        label: 'Git' },
  { slug: 'matlab',     label: 'Matlab' },
  { slug: 'lua',        label: 'Lua' },
  { siIcon: siMlflow,   label: 'MLflow' },
  { slug: 'linux',      label: 'Linux' },
  { slug: 'apple',      label: 'Apple' },
  { slug: 'vim',        label: 'Vim' },
  { slug: 'tailwind',   label: 'Tailwind CSS' },
  { slug: 'java',       label: 'Java' },
];

// Physics constants
const K_REPEL = 4000;
const K_SPRING = 0.012;
const K_GRAVITY = 0.008;
const DAMPING = 0.88;
const REST_LENGTH = 180;
const NEIGHBOURS = 5;
const MAX_REPEL_DIST = 200;
const WALL_MARGIN = 40;
const HOVER_RADIUS = 40;

function luminance(hex: string): number {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function iconFill(hex: string): string {
  return luminance(hex) > 0.35 ? '#1a1a2e' : '#ffffff';
}

function getNearestNeighbours(nodes: SimNode[], idx: number, n: number): number[] {
  const node = nodes[idx];
  const dists = nodes
    .map((other, j) => {
      if (j === idx) return { j, d: Infinity };
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      return { j, d: Math.sqrt(dx * dx + dy * dy) };
    })
    .sort((a, b) => a.d - b.d);
  return dists.slice(0, n).map((e) => e.j);
}

export default function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRefsRef = useRef<(HTMLElement | null)[]>([]);
  const nodesRef = useRef<SimNode[]>([]);
  const hoveredRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  // Stable edge list: computed once on scatter, never recomputed
  const edgesRef = useRef<[number, number][]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const iconSize = () => window.innerWidth <= 639 ? 48 : 64;

    function scatter(w: number, h: number) {
      const pad = 0.1;
      nodesRef.current = SKILLS.map((skill) => ({
        ...skill,
        x: pad * w + Math.random() * (1 - 2 * pad) * w,
        y: pad * h + Math.random() * (1 - 2 * pad) * h,
        vx: 0,
        vy: 0,
      }));
      // Compute edges once — fixed for the lifetime of this scatter
      const nodes = nodesRef.current;
      const pairs: [number, number][] = [];
      const seen = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        const neighbours = getNearestNeighbours(nodes, i, NEIGHBOURS);
        for (const j of neighbours) {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          pairs.push([i, j]);
        }
      }
      edgesRef.current = pairs;
    }

    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      canvas!.width = w;
      canvas!.height = h;
      scatter(w, h);
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function step() {
      const nodes = nodesRef.current;
      const w = canvas!.width;
      const h = canvas!.height;
      const cx = w / 2;
      const cy = h / 2;

      const fx = new Float64Array(nodes.length);
      const fy = new Float64Array(nodes.length);

      // 1. Repulsion (all pairs)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
          if (d > MAX_REPEL_DIST) continue;
          const f = K_REPEL / (d * d);
          const nx = dx / d;
          const ny = dy / d;
          fx[i] -= f * nx;
          fy[i] -= f * ny;
          fx[j] += f * nx;
          fy[j] += f * ny;
        }
      }

      // 2. Spring attraction to nearest neighbours
      for (let i = 0; i < nodes.length; i++) {
        const neighbours = getNearestNeighbours(nodes, i, NEIGHBOURS);
        for (const j of neighbours) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const f = K_SPRING * (d - REST_LENGTH);
          const nx = dx / d;
          const ny = dy / d;
          fx[i] += f * nx;
          fy[i] += f * ny;
        }
      }

      // 3. Center gravity
      for (let i = 0; i < nodes.length; i++) {
        fx[i] += K_GRAVITY * 0.4 * (cx - nodes[i].x);
        fy[i] += K_GRAVITY * 1.8 * (cy - nodes[i].y);
      }

      // 4. Soft boundary walls
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].x < WALL_MARGIN) fx[i] += (WALL_MARGIN - nodes[i].x) * 1.5;
        if (nodes[i].x > w - WALL_MARGIN) fx[i] -= (nodes[i].x - (w - WALL_MARGIN)) * 1.5;
        if (nodes[i].y < WALL_MARGIN) fy[i] += (WALL_MARGIN - nodes[i].y) * 1.5;
        if (nodes[i].y > h - WALL_MARGIN) fy[i] -= (nodes[i].y - (h - WALL_MARGIN)) * 1.5;
      }

      // Integrate + damp
      const half = 32; // half of max icon size (64px)
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].vx = (nodes[i].vx + fx[i]) * DAMPING;
        nodes[i].vy = (nodes[i].vy + fy[i]) * DAMPING;
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        // Hard clamp — nodes can never leave the visible area
        nodes[i].x = Math.max(half, Math.min(w - half, nodes[i].x));
        nodes[i].y = Math.max(half, Math.min(h - half, nodes[i].y));
      }
    }

    function draw() {
      const ctx = canvas!.getContext('2d');
      if (!ctx) return;
      const nodes = nodesRef.current;
      const w = canvas!.width;
      const h = canvas!.height;
      const hovered = hoveredRef.current;

      ctx.clearRect(0, 0, w, h);

      // Draw edges from stable cached topology
      for (const [i, j] of edgesRef.current) {
        const isHovered = i === hovered || j === hovered;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = isHovered ? 'rgba(124,58,237,0.90)' : 'rgba(124,58,237,0.55)';
        ctx.lineWidth = isHovered ? 2.2 : 1.6;
        ctx.stroke();
      }

      // Sync icon positions via transform
      const half = iconSize() / 2;
      iconRefsRef.current.forEach((el, i) => {
        if (!el) return;
        const scale = i === hovered ? 1.1 : 1.0;
        el.style.transform = `translate(${nodes[i].x - half}px, ${nodes[i].y - half}px) scale(${scale})`;
      });
    }

    function loop() {
      step();
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const nodes = nodesRef.current;
      let nearest = -1;
      let minDist = HOVER_RADIUS;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - mx;
        const dy = nodes[i].y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) { minDist = d; nearest = i; }
      }
      hoveredRef.current = nearest;
    }

    function onMouseLeave() {
      hoveredRef.current = -1;
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="skill-graph-wrap"
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @media (max-width: 639px) {
          .skill-graph-wrap { height: 560px !important; }
          .sg-icon { width: 48px !important; height: 48px !important; }
          .sg-icon img { width: 48px !important; height: 48px !important; }
          .sg-si-icon { width: 28px !important; height: 28px !important; }
          .sg-si-icon svg { width: 28px !important; height: 28px !important; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      {SKILLS.map((skill, i) => {
        const isSimple = !skill.slug && !!skill.siIcon;
        const bg = isSimple ? `#${skill.siIcon!.hex}` : undefined;
        const fill = isSimple ? iconFill(skill.siIcon!.hex) : undefined;
        return (
          <div
            key={skill.label}
            ref={(el) => { iconRefsRef.current[i] = el as HTMLElement | null; }}
            className="sg-icon"
            title={skill.label}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '64px',
              height: '64px',
              borderRadius: '22%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: bg,
              willChange: 'transform',
              transformOrigin: 'center center',
              transition: 'transform 0.1s ease',
              cursor: 'default',
              overflow: 'hidden',
            }}
          >
            {skill.slug ? (
              <img
                src={`https://skillicons.dev/icons?i=${skill.slug}`}
                alt={skill.label}
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                style={{ width: '64px', height: '64px', display: 'block', borderRadius: '22%' }}
              />
            ) : (
              <span
                className="sg-si-icon"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                }}
                dangerouslySetInnerHTML={{
                  __html: skill.siIcon!.svg.replace('<svg ', `<svg fill="${fill}" width="36" height="36" `),
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
