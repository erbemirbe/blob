(() => {
  // === Blob setup ===
  const b = {
    x: w / 2,
    y: h / 2,
    r: 120,
    faceOffset: { x: 0, y: 0 }, // offset for face features
    faceSpeed: 0.17,            // speed of face movement
    eyes: [
      { ex: -70, ey: 25, er: 40, epr: 35, speed: 0.75, px: 0, py: 0, blink: 0, blinkSpeed: 0.05, nextBlink: 0, restingEyelidState:.85 },//eye states: .1 = sus, .5 tired?
      { ex:  70, ey: 25, er: 40, epr: 35, speed: 0.75, px: 0, py: 0, blink: 0, blinkSpeed: 0.05, nextBlink: 0, restingEyelidState:.85 },
      // { ex:  0, ey: -25, er: 40, epr: 33, speed: 0.75, px: 0, py: 0, blink: 0, blinkSpeed: 0.05, nextBlink: 0, restingEyelidState:.9 },
      { ex:  0, ey: 60, er: 10, epr: 10, speed: 0.0, px: 0, py: 0, blink: 0, blinkSpeed: 0.01, nextBlink: 0, restingEyelidState:.3 }, //mouth
    ],
    blinkMode: "sync", // "sync" or "async"
    winkChance: 0.1,  // 10% chance to wink instead of full blink
    blinkChance: 0.005,
    bodySpeed:.1
  };

  function updateBlink(eyes) {
    if(b.blinkMode === "sync"){
      if (r() < b.blinkChance) {
        for( e of b.eyes){
          if(e.blink !== 0) continue
          if (r() < b.winkChance) {console.log("wink");continue};
          e.blink = 0.001; 
          // e.isWink = doWink;
          e.nextBlink = now + 2000 + r() * 4000;
        }
      }

    }
    // Determine next blink timing


    for(e of b.eyes){
      // Animate blink open/close
      if (e.blink > 0) {
        e.blink += e.blinkSpeed;
        if (e.blink >= 2) e.blink = 0;
      }
    }
  }


  function drawBlob() {
    // === Update face offset toward mouse ===
    const dx = x - b.x;
    const dy = y - b.y;
    const dist = Math.hypot(dx, dy);
    const maxOffset = b.r * 0.14; // how far face features can move toward mouse
    let targetX = dx, targetY = dy;
    if (dist > maxOffset) {
      const scale = maxOffset / dist;
      targetX = dx * scale;
      targetY = dy * scale;
    }

    // Smooth interpolation
    b.faceOffset.x += (targetX - b.faceOffset.x) * b.faceSpeed;
    b.faceOffset.y += (targetY - b.faceOffset.y) * b.faceSpeed;

    b.x += (targetX - b.faceOffset.x) * b.bodySpeed;
    b.y += (targetY - b.faceOffset.y) * b.bodySpeed;

    // === Draw body ===
    bp();
    fs("#88c");
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.r * 1.1, b.r, 0, 0, PI * 2);
    f();

    // === Draw eyes with face offset ===
    b.eyes.forEach(e => drawEye(
      b.x + e.ex + b.faceOffset.x,
      b.y + e.ey + b.faceOffset.y,
      e
    ));
  }

  function drawEye(ex, ey, e) {
    updateBlink(b.eyes);

    const blinkPhase = e.blink > 1 ? 2 - e.blink : e.blink;
    const ry = e.er * (1 - blinkPhase) * (e.restingEyelidState-.3+.3*cos(.0001*now)); // vertical radius

    // Eye white
    // bp();
    // ctx.save()
    // ctx.ellipse(b.x, b.y, b.r * 1.12, b.r*1.02, 0, 0, PI * 2);
    // ctx.clip()
    bp()
    if (ry <=3){ // fully closed
      fs("black");
      ctx.ellipse(ex, ey, e.er, max(0,ry), 0, 0, PI*2);
      f();
      return; 
    }
    fs("white");
    ctx.ellipse(ex, ey, e.er, max(0,ry), 0, 0, PI*2);
    f();

    // ctx.restore()

    // Calculate pupil target
    const dx = x - ex;
    const dy = y - ey;
    const dist = Math.hypot(dx, dy);
    const maxOffset = e.er - e.epr -1;
    let tx, ty;
    if (dist <= maxOffset) {
      tx = dx;
      ty = dy;
    } else {
      const scale = maxOffset / dist;
      tx = dx * scale;
      ty = dy * scale;
    }

    // Smooth pupil
    e.px += (tx - e.px) * e.speed;
    e.py += (ty - e.py) * e.speed;

    // --- Clip pupils to eye white ellipse ---
    bp();
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(ex, ey, e.er, ry, 0, 0, PI*2);
    ctx.clip();

    // Draw pupil
    bp();
    fs("black");
    arc(ex + e.px, ey + e.py, e.epr, 0, PI*2);
    f();

    ctx.restore();
}




  // === Animation loop ===
  function loop() {
    raf(loop);
    cl();
    fs('DarkSlateBlue')
    fr(0,0,w,h)
    drawBlob();
  }

  loop();
})();
