// src/components/LossLandscape.tsx
import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

function lossNonConvex(nx: number, ny: number): number {
  return (
    0.25 * (nx * nx + ny * ny)
    - 1.05 * Math.exp(-((nx - 0.40) ** 2 + (ny + 0.35) ** 2) * 5.5)
    - 0.80 * Math.exp(-((nx + 0.50) ** 2 + (ny - 0.30) ** 2) * 6.0)
    - 0.55 * Math.exp(-((nx + 0.10) ** 2 + (ny + 0.65) ** 2) * 7.0)
    + 0.20 * Math.sin(nx * 5.0) * Math.cos(ny * 4.0)
    + 0.40
  );
}

function buildPath(
  startX: number, startY: number,
  steps: number, lr0: number, mom: number
): [number, number][] {
  const path: [number, number][] = [];
  let x = startX, y = startY, vx = 0, vy = 0;
  const eps = 0.007;
  for (let s = 0; s < steps; s++) {
    path.push([x, y]);
    const gx = (lossNonConvex(x + eps, y) - lossNonConvex(x - eps, y)) / (2 * eps);
    const gy = (lossNonConvex(x, y + eps) - lossNonConvex(x, y - eps)) / (2 * eps);
    const lr = lr0 / (1 + s * 0.012);
    vx = mom * vx - lr * gx;
    vy = mom * vy - lr * gy;
    x = Math.max(-0.98, Math.min(0.98, x + vx));
    y = Math.max(-0.98, Math.min(0.98, y + vy));
  }
  return path;
}

function samplePath(path: [number, number][], t01: number): [number, number, number] {
  const last = path.length - 1;
  const ft = t01 * last;
  const i = Math.min(Math.floor(ft), last - 1);
  const f = ft - i;
  const [ax, ay] = path[i];
  const [bx, by] = path[i + 1];
  const x = ax + (bx - ax) * f;
  const y = ay + (by - ay) * f;
  return [x, y, lossNonConvex(x, y)];
}

function isoProject(
  v: [number, number, number],
  cx: number, cy: number, sx: number, sy: number
) {
  return {
    x: cx + (v[0] - v[1]) * sx,
    y: cy + (v[0] + v[1]) * sy - v[2] * sy * 2.4,
  };
}

// Pre-computed at module load — not re-run per frame
const BALLS: { path: [number, number][]; color: [number, number, number]; offset: number }[] = [
  { path: buildPath(-0.82, -0.80, 500, 0.062, 0.78), color: [0,   212, 255], offset: 0 },
  { path: buildPath( 0.85, -0.75, 500, 0.055, 0.82), color: [245, 158,  11], offset: 0 },
  { path: buildPath(-0.78,  0.80, 500, 0.070, 0.75), color: [74,  222, 128], offset: 0 },
  { path: buildPath( 0.78,  0.72, 500, 0.048, 0.85), color: [251, 113, 133], offset: 0 },
  { path: buildPath(-0.10, -0.90, 500, 0.065, 0.80), color: [250, 204,  21], offset: 0 },
];

const TRAIL = 120;

export default function LossLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!canvas || !ctx) return;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);
      t += 0.0004;
      if (t >= 1) t = 0;

      const N = 24;
      const cx = cw * 0.5;
      const cy = ch * 0.76;
      const sx = cw * 0.23;
      const sy = ch * 0.10;

      // Build grid with subtle breathing
      const grid: [number, number, number][][] = [];
      for (let i = 0; i <= N; i++) {
        const row: [number, number, number][] = [];
        for (let j = 0; j <= N; j++) {
          const nx = (i / N) * 2 - 1;
          const ny = (j / N) * 2 - 1;
          let z = lossNonConvex(nx, ny);
          z += Math.sin(nx * 3 - t * 0.5) * 0.010 + Math.sin(ny * 3 - t * 0.4) * 0.010;
          row.push([nx, ny, z]);
        }
        grid.push(row);
      }

      let zMin = Infinity, zMax = -Infinity;
      grid.forEach(row => row.forEach(([,, z]) => {
        zMin = Math.min(zMin, z);
        zMax = Math.max(zMax, z);
      }));

      // Draw surface wireframe — colour interpolates violet→magenta by height
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const p0 = isoProject(grid[i][j],     cx, cy, sx, sy);
          const p1 = isoProject(grid[i + 1][j], cx, cy, sx, sy);
          const p2 = isoProject(grid[i][j + 1], cx, cy, sx, sy);
          const z = grid[i][j][2];
          const zt = Math.max(0, Math.min(1, (z - zMin) / (zMax - zMin)));
          const r = Math.round(70  + (232 - 70)  * zt);
          const g = Math.round(25  + (121 - 25)  * zt);
          const b = Math.round(195 + (249 - 195) * zt);
          const alpha = (0.12 + zt * 0.45).toFixed(2);
          const col = `rgba(${r},${g},${b},${alpha})`;
          ctx.strokeStyle = col;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
      }

      // Draw balls + trails
      BALLS.forEach(({ path, color: [cr, cg, cb] }) => {
        const headT = t;
        const tailT = Math.max(0, headT - 0.18);

        // Trail — interpolated samples from tail to head
        for (let s = 0; s < TRAIL; s++) {
          const t0 = tailT + (headT - tailT) * (s / TRAIL);
          const t1 = tailT + (headT - tailT) * (Math.min(s + 1, TRAIL) / TRAIL);
          const pa = isoProject(samplePath(path, t0), cx, cy, sx, sy);
          const pb = isoProject(samplePath(path, t1), cx, cy, sx, sy);
          const age = s / TRAIL;
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(age * 0.88).toFixed(2)})`;
          ctx.lineWidth = 0.5 + age * 1.8;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }

        // Glow halo + white core
        const head = samplePath(path, headT);
        const pt = isoProject([head[0], head[1], head[2] + 0.055], cx, cy, sx, sy);
        const halo = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 11);
        halo.addColorStop(0,   `rgba(${cr},${cg},${cb},1)`);
        halo.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.3)`);
        halo.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 11, 0, TAU);
        ctx.fillStyle = halo; ctx.fill();

        ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, TAU);
        ctx.fillStyle = '#ffffff'; ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
