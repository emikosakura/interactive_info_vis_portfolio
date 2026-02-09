// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {

  // Config
  const WORK_MIN = 25;
  const SHORT_MIN = 5;
  const LONG_MIN = 15;
  const LONG_EVERY = 4;

  // State
  let phase = 'work';
  let running = false;
  let startMs = 0;
  let elapsedMs = 0;
  let completedWorks = 0;
  let totalWorks = 0;
  const buttons = [];

  let dripY = 0;

  p.setup = function () {
    p.createCanvas(800, 800);

    buttons.push(makeBtn('Start', 0, 0, toggleRun));
    buttons.push(makeBtn('Reset', 0, 0, resetPhase));
    buttons.push(makeBtn('Skip', 0, 0, skipPhase));
  };
  p.draw = function () {
    p.background(255, 255, 255);

    // calculate progress
    const durMs = minutesToMs(currentPhaseMinutes());
    const tMs = p.constrain(getElapsedMs(), 0, durMs);
    const remainMs = p.max(0, durMs - tMs);
    const progress = (durMs === 0) ? 0 : p.constrain(tMs / durMs, 0, 1);

    if (running && remainMs <= 0) onPhaseComplete();

    // Center the espresso machine
    let centerX = p.width / 2;
    let centerY = p.height / 2;

    // Draw the main body of the espresso machine
    p.fill(100);
    p.stroke(0);
    p.strokeWeight(2);
    p.rect(centerX - 100, centerY - 150, 200, 300, 10); // Main body

    // Draw the top section
    p.fill(80);
    p.rect(centerX - 120, centerY - 180, 240, 30, 10); // Top section

    // Draw the coffee spout
    p.fill(60);
    p.rect(centerX - 20, centerY + 50, 40, 20, 5); // Spout base
    p.rect(centerX - 10, centerY + 70, 20, 30, 5); // Spout nozzle

    // Draw the control panel
    p.fill(120);
    p.rect(centerX - 80, centerY - 130, 160, 60, 5); // Panel background

    // Draw buttons on the control panel
    p.fill(255, 0, 0);
    p.ellipse(centerX - 50, centerY - 100, 20, 20); // Button 1 (Red)
    p.fill(0, 255, 0);
    p.ellipse(centerX, centerY - 100, 20, 20); // Button 2 (Green)
    p.fill(255, 255, 0);
    p.ellipse(centerX + 50, centerY - 100, 20, 20); // Button 3 (Yellow)
    
    /// Draw the coffee cup under the spout
    let cupW = 90;
    let cupH = 70;
    let cupX = centerX - cupW / 2;
    let cupY = centerY + 130;

    p.fill(255);
    p.stroke(0);
    p.strokeWeight(2);

    // Cup body
    p.rect(cupX, cupY, cupW, cupH, 12);

    // Handle on RIGHT side
    p.strokeWeight(2);
    p.noFill();
    p.arc(cupX + cupW, cupY + cupH / 2, 34, 34, -p.HALF_PI, p.HALF_PI);

    // Coffee fill based on timer progress
    let fillProg = (phase === 'work') ? progress : 1; 
    // ^ stays full during breaks
    // change 1 → 0 if you want empty cup during breaks

    let margin = 8;
    let innerHeight = cupH - margin * 2;
    let fillHeight = innerHeight * fillProg;

    p.noStroke();
    p.fill(100, 50, 0);

    p.rect(
      cupX + margin,
      cupY + cupH - margin - fillHeight,
      cupW - margin * 2,
      fillHeight,
      6
    );

    // Coffee drip animation

    if (phase === 'work' && running) {
      let dripX1 = centerX - 5;
      let dripX2 = centerX + 5;
      let dripStartY = centerY + 100;
      let dripEndY = cupY + 10;

      dripY += 6;
      if (dripStartY + dripY > dripEndY) dripY = 0;

      p.noStroke();
      p.fill(100, 50, 0);
      p.ellipse(dripX1, dripStartY + dripY, 6, 10);
      p.ellipse(dripX2, dripStartY + (dripY + 18) % 140, 6, 10);
    }

    // same structure as example 8
    layoutButtons(centerX, centerY + 260);
    drawButtons();

    // Hint
    p.fill('#3E2723');
    p.noStroke();
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text('Space: Start/Pause   •   R: Reset   •   N: Skip', centerX, p.height - 50);

  };

  function toggleRun() {
    if (running) {
      // Pausing: capture elapsed time BEFORE flipping running off
      elapsedMs = (p.millis() - startMs) + elapsedMs;
      running = false;
      labelButton('Start', 'Start');
    } else {
      // Starting/resuming
      running = true;
      startMs = p.millis();
      labelButton('Start', 'Pause');
    }
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
    } else phase = 'work';
  
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
  
  function makeBtn(label, x, y, onClick) {
    return { label, x, y, w: 90, h: 34, onClick, hover: false };
  }
  
  function labelButton(oldText, newText) {
    const b = buttons.find(btn => btn.label === oldText || (oldText === 'Start' && (btn.label === 'Start' || btn.label === 'Pause')));
    if (b) b.label = newText;
  }
  
  function layoutButtons(cx, baselineY) {
    const gap = 12;
    const totalW = buttons.length * 90 + (buttons.length - 1) * gap;
    let x = cx - totalW / 2;
    for (let b of buttons) {
      b.x = x;
      b.y = baselineY;
      x += 90 + gap;
    }
  }
  
  function drawButtons() {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    for (let b of buttons) {
      b.hover = p.mouseX >= b.x && p.mouseX <= b.x + b.w &&
                p.mouseY >= b.y && p.mouseY <= b.y + b.h;
  
    p.stroke('#8B6B4A'); // warm brown outline
    p.strokeWeight(1);

    // button fill
    p.fill(b.hover ? '#D7B899' : '#E8D3BD'); 
    p.rect(b.x, b.y, b.w, b.h, 20);

    // text color
    p.noStroke();
    p.fill('#3E2723'); // espresso dark
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
