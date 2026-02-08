// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  p.setup = function () {
    p.createCanvas(800, 800);
  };
  p.draw = function () {
    p.background(255);
    p.drawCoffeeFill();
    p.drawCoffeeCup();
    p.drawCupLabels();
  }

  p.drawCoffeeCup = function() {
    p.noFill();
    p.stroke(0);
    p.strokeWeight(4);

    // Draw the cup body (trapezoid shape for a tapered look)
    // Cup outline as 3 lines (no flat bottom)
    p.line(p.width / 2 - 60, p.height / 2 + 100, p.width / 2 + 60, p.height / 2 + 100); // top
    p.line(p.width / 2 - 60, p.height / 2 + 100, p.width / 2 - 50, p.height / 2 + 250); // left side
    p.line(p.width / 2 + 60, p.height / 2 + 100, p.width / 2 + 50, p.height / 2 + 250); // right side

    // Draw the cup handle (semi-oval shape)
    p.noFill();
    p.arc(p.width / 2 - 60, p.height / 2 + 175, 80, 100, p.HALF_PI, p.PI + p.HALF_PI);

    // Draw the cup base (ellipse for a rounded bottom)
    p.ellipse(p.width / 2, p.height / 2 + 248, 100, 20);

  }

  p.drawCoffeeFill = function () {
    // time progress through a full day (0..1)
    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    // seconds since midnight
    let nowSec = hr * 3600 + mn * 60 + sc;

    // Workday boundaries
    let startSec = 9 * 3600;   // 9:00 AM
    let endSec   = 17 * 3600;  // 5:00 PM

    // Map time → progress
    let t;

    if (nowSec <= startSec) {
      t = 0;              // before work → full cup
    } else if (nowSec >= endSec) {
      t = 1;              // after work → empty cup
    } else {
      t = (nowSec - startSec) / (endSec - startSec);
    }
  
    // cup geometry (matches your lines)
    let topY = p.height / 2 + 100;
    let bottomY = p.height / 2 + 250;
  
    // fill level (top -> bottom)
    let fillY = p.lerp(topY, bottomY, t);
  
    // left/right walls are slanted: x changes with y
    // left: from (-60, topY) to (-50, bottomY)
    // right: from (+60, topY) to (+50, bottomY)
    let wallT = (fillY - topY) / (bottomY - topY); // 0 at top, 1 at bottom
    let leftX = p.lerp(p.width / 2 - 60, p.width / 2 - 50, wallT);
    let rightX = p.lerp(p.width / 2 + 60, p.width / 2 + 50, wallT);
  
    // draw coffee shape
    p.noStroke();
    p.fill(110, 72, 40, 220); // coffee brown w/ a little transparency
  
    p.beginShape();
    p.vertex(p.width / 2 - 50, bottomY); // bottom-left corner
    p.vertex(p.width / 2 + 50, bottomY); // bottom-right corner
    p.vertex(rightX, fillY);             // right at fill height
    p.vertex(leftX, fillY);              // left at fill height
    p.endShape(p.CLOSE);
  };
  
  p.drawCupLabels = function () {
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
  
    // Must match your cup geometry
    let topY = p.height / 2 + 100;
    let bottomY = p.height / 2 + 250;
    let midY = (topY + bottomY) / 2;
  
    let labelX = p.width / 2 + 80; 
  
    p.text("9:00 AM", labelX, topY);
    p.text("1:00 PM", labelX, midY);
    p.text("5:00 PM", labelX, bottomY);

  };

  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
