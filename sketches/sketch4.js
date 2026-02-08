// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  p.setup = function () {
    p.createCanvas(800, 800);
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
    
    // Handle on RIGHT side
    p.strokeWeight(2);
    p.noFill();
    p.arc(cupX + cupW, cupY + cupH / 2, 34, 34, -p.HALF_PI, p.HALF_PI);
  };
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
