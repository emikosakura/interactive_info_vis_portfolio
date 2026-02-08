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

  p.setup = function () {
    p.createCanvas(800, 800);

    buttons.push(makeBtn('Start', 0, 0, toggleRun));
    buttons.push(makeBtn('Reset', 0, 0, resetPhase));
    buttons.push(makeBtn('Skip', 0, 0, skipPhase));
  };
  p.draw = function () {
    p.background(255, 255, 255);

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
    
    // Coffee fill inside the cup
    p.fill(100, 50, 0); // Coffee color
    p.rect(cupX + 5, cupY + cupH - 40, cupW - 10, 35, 8); // Coffee fill

    // Handle on RIGHT side
    p.strokeWeight(2);
    p.noFill();
    p.arc(cupX + cupW, cupY + cupH / 2, 34, 34, -p.HALF_PI, p.HALF_PI);

    // Coffee drip animation
    let dripY = 0;
    let dripOn = true;

    if (dripOn) {
      // drip starts at bottom of nozzle
      let dripX1 = centerX - 5;
      let dripX2 = centerX + 5;
      let dripStartY = centerY + 100; 
      let dripEndY = cupY + 10; 

      // move drip downward
      dripY += 6;

      // wrap back to top when it reaches the cup
      if (dripStartY + dripY > dripEndY) dripY = 0;

      // draw droplets
      p.noStroke();
      p.fill(100, 50, 0);
      p.ellipse(dripX1, dripStartY + dripY, 6, 10);
      p.ellipse(dripX2, dripStartY + (dripY + 18) % 140, 6, 10);
    }
  };
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
