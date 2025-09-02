(() => {
  // === Canvas setup ===
  const c = document.createElement("canvas");
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.body.appendChild(c);
  const ctx = c.getContext("2d");

  function resize() { 
    c.width = innerWidth; 
    c.height = innerHeight; 
  }
  window.addEventListener("resize", resize);
  resize();

  // === Input tracking ===
  const kd = {};
  window.addEventListener("keydown", e => kd[e.key] = true);
  window.addEventListener("keyup", e => kd[e.key] = false);

  let mx = 0, my = 0;
  c.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY;});
  c.addEventListener("touchmove", e => { mx = e.touches[0].clientX; my = e.touches[0].clientY;});
  c.addEventListener("touchstart", e => { mx = e.touches[0].clientX; my = e.touches[0].clientY;});

Object.defineProperty(window, 'x', {
  get() { return mx; },
  set(val) { mx = val; }
});

Object.defineProperty(window, 'y', {
  get() { return my; },
  set(val) { my = val; }
});


  // === Canvas width/height globals ===
Object.defineProperty(window, 'w', {
  get() { return c.width; },
  set(val) { c.width = val; }
});

Object.defineProperty(window, 'h', {
  get() { return c.height; },
  set(val) { c.height = val; }
});

  // === Short drawing helpers ===
  const cl = (x=0,y=0,w=c.width,h=c.height) => ctx.clearRect(x,y,w,h);
  const fr = (...args) => ctx.fillRect(...args);
  const f = (...args) => ctx.fill(...args);
  const st = (...args) => ctx.stroke(...args);
  const bp = (...args) => ctx.beginPath(...args);
  const fs = val => ctx.fillStyle = val;
  const ss = val => ctx.strokeStyle = val;
  const lw = val => ctx.lineWidth = val;
  const arc = (...args) => ctx.arc(...args);

  // === Short Math aliases ===
  const r = Math.random;
  const s = Math.sin;
  const cos = Math.cos;
  const t = Math.tan;
  const a2 = Math.atan2;
  const as = Math.asin;
  const ac = Math.acos;
  const sq = Math.sqrt;
  const ex = Math.exp;
  const l10 = Math.log10;
  const l = Math.log;
  const min = Math.min;
  const max = Math.max;
  const rd = Math.round;
  const fl = Math.floor;
  const tr = Math.trunc;
  const PI = Math.PI;
  const E = Math.E;

  // === Timing ===
  const raf = requestAnimationFrame;

  Object.defineProperty(window, 'now', {get() { return performance.now(); }});


function inR(p, q, r) { // Returns true if p and q are within radius r (inclusive)
  const dx = p.x - q.x;
  const adx = Math.abs(dx);
  if (adx > r) return false;           // cheap reject (Chebyshev)

  const dy = p.y - q.y;
  const ady = Math.abs(dy);
  if (ady > r) return false;           // cheap reject

  // Only now do the multiply
  return (dx*dx + dy*dy) <= r*r;       // no sqrt
}


function d(p, q) { // If you need the actual distance occasionally:
  const dx = p.x - q.x, dy = p.y - q.y;
  return Math.hypot(dx, dy);           // modern & fast, but avoid in hot loops
}

function dir(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return {x: 0, y: 0}; // avoid NaN when points are equal
  return {x: dx / len, y: dy / len};
}


  // === Expose globals ===
  Object.assign(window, {
    c, ctx, kd,
    cl, fr, f, st, bp, fs, ss, lw, arc,
    r, s, cos, t, a2, as, ac, sq, ex, l10, l, min, max, rd, fl, tr, PI, E,
    raf,inR,d,dir
  });

  console.log("boot.js loaded: ultrashort aliases ready!");

  // --- Load game.js dynamically ---
  const script = document.createElement("script");
  script.src = "game.js";
  document.body.appendChild(script);

})();
