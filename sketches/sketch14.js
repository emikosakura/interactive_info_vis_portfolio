// Espresso Pomodoro (based on Example 8 logic)
registerSketch('sk14', function (p) {

  // Config (use real minutes; you can temporarily change to small numbers for demo)

  const WORK_MIN = 0.4;
  const SHORT_MIN = 0.1;
  const LONG_MIN = 0.2;
  const LONG_EVERY = 0.5;

  // State
  let phase = 'work'; // 'work' | 'short' | 'long'
  let running = false;
  let startMs = 0;
  let elapsedMs = 0;
  let completedWorks = 0;
  let totalWorks = 0;

  const buttons = [];

  p.setup = function () {
    p.createCanvas(800, 800);
    p.textFont('Georgia');

    buttons.push(makeBtn('Start', 0, 0, toggleRun));
    buttons.push(makeBtn('Reset', 0, 0, resetPhase));
    buttons.push(makeBtn('Skip', 0, 0, skipPhase));
  };

  p.draw = function () {
    p.background(255);

    const cx = p.width / 2;
    const cy = p.height / 2;

    const durMs = minutesToMs(currentPhaseMinutes());
    const tMs = p.constrain(getElapsedMs(), 0, durMs);
    const remainMs = p.max(0, durMs - tMs);
    const progress = durMs === 0 ? 0 : tMs / durMs;

    if (running && remainMs <= 0) onPhaseComplete();

    // ===== Title + timer text =====
    p.noStroke();
    p.fill(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text(phaseTitle(), cx, cy - 300);

    const { mm, ss } = msToMMSS(remainMs);
    p.textSize(40);
    p.text(`${mm}:${ss}`, cx, cy - 255);

    p.textSize(14);
    p.fill(90);
    p.text(`Pomodoros completed: ${totalWorks}   •   Cycle: ${completedWorks % LONG_EVERY}/${LONG_EVERY}`, cx, cy - 220);

    // ===== Draw espresso machine =====
    drawEspressoMachine(cx, cy - 40, phase);

    // ===== Draw cup behavior =====
    // Work: cup stays under spout and fills
    // Break: cup slides out full and "resets"
    const working = (phase === 'work');

    // Slide out only during breaks
    let slide = 0;
    if (!working) slide = p.lerp(0, 220, progress);

    // Cup position (under spout)
    const cupW = 150;
    const cupH = 110;
    const cupX = cx - cupW / 2 + slide;
    const cupY = cy + 135;

    // Cup
    drawCup(cupX, cupY, cupW, cupH);

    // Coffee fill
    // During work: fill based on progress
    // During break: stay full
    const fillProg = working ? progress : 1;
    drawCoffeeFill(cupX, cupY, cupW, cupH, fillProg);

    // Optional drip during work for clarity
    if (working && running) drawDrip(cx, cy + 78);

    // ===== Completed cups row (each completed work session adds one) =====
    drawCompletedCups(90, p.height - 140, totalWorks);

    // ===== Buttons =====
    layoutButtons(cx, cy + 300);
    drawButtons();

    // Hint
    p.fill(120);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text('Space: Start/Pause   •   R: Reset   •   N: Skip', cx, p.height - 28);
  };

  // -----------------------
  // Pomodoro Logic (same structure)
  // -----------------------
  function toggleRun() {
    running = !running;
    labelButton('Start', running ? 'Pause' : 'Start');
    if (running) startMs = p.millis();
    else elapsedMs = getElapsedMs();
  }

  function resetPhase() {
    running = false;
    labelButton('Start', 'Start');
    startMs = p.millis();
    elapsedMs = 0;
  }

  function skipPhase() {
    running = false;
    labelButton('Start', 'Start');
    onPhaseComplete(true);
  }

  function onPhaseComplete(skipped = false) {
    if (phase === 'work' && !skipped) {
      completedWorks++;
      totalWorks++;
    }

    if (phase === 'work') {
      if (completedWorks > 0 && completedWorks % LONG_EVERY === 0) phase = 'long';
      else phase = 'short';
    } else {
      phase = 'work';
    }

    elapsedMs = 0;
    startMs = p.millis();
    running = true;
    labelButton('Start', 'Pause');
  }

  function currentPhaseMinutes() {
    if (phase === 'work') return WORK_MIN;
    if (phase === 'short') return SHORT_MIN;
    return LONG_MIN;
  }

  function phaseTitle() {
    if (phase === 'work') return 'Work (Brewing)';
    if (phase === 'short') return 'Short Break (Serving)';
    return 'Long Break (Serving)';
  }

  function getElapsedMs() {
    return running ? (p.millis() - startMs) + elapsedMs : elapsedMs;
  }

  function minutesToMs(mins) {
    return mins * 60 * 1000;
  }

  function msToMMSS(ms) {
    const total = p.max(0, p.round(ms / 1000));
    const m = p.floor(total / 60);
    const s = total % 60;
    return { mm: p.nf(m, 2), ss: p.nf(s, 2) };
  }

  function phaseColor(ph) {
    if (ph === 'work') return p.color(80, 170, 120);   // green-ish
    if (ph === 'short') return p.color(240, 180, 80);  // amber
    return p.color(180, 160, 220);                     // lavender
  }

  // -----------------------
  // Drawing helpers
  // -----------------------
  function drawEspressoMachine(cx, cy, ph) {
    p.push();
    p.translate(cx, cy);

    // Body
    p.fill(90);
    p.stroke(0);
    p.strokeWeight(3);
    p.rect(-170, -240, 340, 420, 18);

    // Top cap
    p.fill(70);
    p.rect(-200, -280, 400, 60, 18);

    // Control panel
    p.fill(110);
    p.rect(-140, -200, 280, 90, 10);

    // Buttons (keep your traffic-light feel, plus a phase light)
    p.fill(255, 0, 0);
    p.ellipse(-70, -155, 28, 28);
    p.fill(0, 255, 0);
    p.ellipse(0, -155, 28, 28);
    p.fill(255, 255, 0);
    p.ellipse(70, -155, 28, 28);

    // Phase indicator light
    p.noStroke();
    p.fill(phaseColor(ph));
    p.ellipse(135, -225, 18, 18);

    // Spout / group head
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(80);
    p.rect(-40, 10, 80, 30, 8);
    p.rect(-18, 38, 36, 55, 8);

    // A little portafilter cue (simple)
    p.fill(60);
    p.rect(-55, -5, 110, 18, 8);

    p.pop();
  }

  function drawCup(x, y, w, h) {
    p.push();
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.rect(x, y, w, h, 16);

    // inner rim
    p.noFill();
    p.strokeWeight(1.5);
    p.rect(x + 8, y + 8, w - 16, h - 16, 12);

    // handle on right
    p.strokeWeight(4);
    p.noFill();
    p.arc(x + w + 18, y + h / 2, 50, 50, -p.HALF_PI, p.HALF_PI);
    p.pop();
  }

  function drawCoffeeFill(x, y, w, h, prog) {
    // inner bounds
    const m = 14;
    const innerH = h - m * 2;
    const fillH = innerH * prog;

    p.noStroke();
    p.fill(100, 50, 0);
    p.rect(x + m, y + h - m - fillH, w - m * 2, fillH, 10);
  }

  function drawDrip(x, y) {
    p.stroke(100, 50, 0);
    p.strokeWeight(4);
    const dy = (p.frameCount % 18);
    p.point(x - 8, y + dy);
    p.point(x + 8, y + dy);
  }

  function drawCompletedCups(x, y, count) {
    p.push();
    const cupW = 38;
    const cupH = 50;
    const gap = 12;

    p.textAlign(p.LEFT, p.BOTTOM);
    p.noStroke();
    p.fill(80);
    p.textSize(12);
    p.text('Finished cups (completed work sessions):', x, y - 14);

    for (let i = 0; i < count; i++) {
      let cx = x + i * (cupW + gap);
      p.stroke(0);
      p.strokeWeight(2);
      p.fill(255);
      p.rect(cx, y, cupW, cupH, 10);

      p.noStroke();
      p.fill(100, 50, 0);
      p.rect(cx + 6, y + 8, cupW - 12, cupH - 16, 6);

      // stop drawing if off screen
      if (cx + cupW > p.width - 20) break;
    }
    p.pop();
  }

  // -----------------------
  // Buttons (same pattern)
  // -----------------------
  function makeBtn(label, x, y, onClick) {
    return { label, x, y, w: 100, h: 38, onClick, hover: false };
  }

  function labelButton(oldText, newText) {
    const b = buttons.find(btn =>
      btn.label === oldText ||
      (oldText === 'Start' && (btn.label === 'Start' || btn.label === 'Pause'))
    );
    if (b) b.label = newText;
  }

  function layoutButtons(cx, baselineY) {
    const gap = 14;
    const totalW = buttons.length * 100 + (buttons.length - 1) * gap;
    let x = cx - totalW / 2;
    for (let b of buttons) {
      b.x = x;
      b.y = baselineY;
      x += 100 + gap;
    }
  }

  function drawButtons() {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    for (let b of buttons) {
      b.hover = p.mouseX >= b.x && p.mouseX <= b.x + b.w &&
                p.mouseY >= b.y && p.mouseY <= b.y + b.h;

      p.stroke(0, 60);
      p.strokeWeight(1);
      p.fill(b.hover ? 235 : 250);
      p.rect(b.x, b.y, b.w, b.h, 18);

      if (b.label === 'Start' || b.label === 'Pause') p.fill(phaseColor(phase));
      else p.fill(80);

      p.noStroke();
      p.text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    }
  }

  p.mousePressed = function () {
    for (let b of buttons) {
      if (p.mouseX >= b.x && p.mouseX <= b.x + b.w &&
          p.mouseY >= b.y && p.mouseY <= b.y + b.h) {
        b.onClick();
        return;
      }
    }
  };

  p.keyPressed = function () {
    if (p.key === ' ') toggleRun();
    if (p.key === 'r' || p.key === 'R') resetPhase();
    if (p.key === 'n' || p.key === 'N') skipPhase();
  };

  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
