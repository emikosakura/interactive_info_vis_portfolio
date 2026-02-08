// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  function isMouseOverCup(cx, topY, bottomY, halfW) {
    return (p.mouseX >= cx - halfW &&
            p.mouseX <= cx + halfW &&
            p.mouseY >= topY &&
            p.mouseY <= bottomY);
  }

  p.setup = function () {
    p.createCanvas(500, 500);
  
  };
  p.draw = function () {
    p.background(255);
    const g = p.drawCoffeeFill();
    p.drawCoffeeCup();
    p.drawCupLabels();

    if (g && isMouseOverCup(g.cx, g.topY, g.bottomY, g.halfW)) {

      // format current time
      let hr = p.hour();
      let mn = p.minute();
    
      let ampm = hr >= 12 ? "PM" : "AM";
      let hr12 = hr % 12;
      if (hr12 === 0) hr12 = 12;
    
      let timeStr = `${hr12}:${p.nf(mn,2)} ${ampm}`;
    
      // draw tooltip
      p.textSize(13);
      let pad = 8;
      let w = p.textWidth(timeStr) + pad*2;
      let h = 24;
    
      let tx = p.mouseX + 12;
      let ty = p.mouseY - 12;
    
      p.noStroke();
      p.fill(255);
      p.rect(tx, ty, w, h, 6);
    
      p.fill(0);
      p.textAlign(p.LEFT, p.CENTER);
      p.text(timeStr, tx + pad, ty + h/2);
    }
  }

  p.drawCoffeeCup = function() {
    p.noFill();
    p.stroke(0);
    p.strokeWeight(4);
  
    let cx = p.width / 2;
    let cy = p.height * 0.40; 
    let topY = cy;
    let bottomY = cy + 150;
  
    p.line(cx - 55, topY, cx + 55, topY);      // top
    p.line(cx - 55, topY, cx - 55, bottomY);   // left wall (vertical)
    p.line(cx + 55, topY, cx + 55, bottomY);   // right wall (vertical)
  
    p.ellipse(cx, bottomY, 110, 22);
  
    p.arc(
      cx - 55,
      (topY + bottomY) / 2,
      70,
      110,
      p.HALF_PI,
      p.PI + p.HALF_PI
    );
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
    let cx = p.width / 2;
    let cy = p.height * 0.40; 
    let topY = cy;
    let bottomY = cy + 150;

    // fill level (top -> bottom)
    let fillY = p.lerp(topY, bottomY, t);
    let halfW = 55;
    let leftX = cx - 55;
    let rightX = cx + 55;

    p.noStroke();
    p.fill(110, 72, 40, 220);

    p.beginShape();
    p.vertex(leftX, bottomY);   // bottom-left
    p.vertex(rightX, bottomY);  // bottom-right
    p.vertex(rightX, fillY);    // right side up
    p.vertex(leftX, fillY);     // left side up
    p.endShape(p.CLOSE);

    p.stroke(255,120);
    p.line(leftX+3, fillY+2, rightX-3, fillY+2);
    return { cx, topY, bottomY, halfW };

  };
  
  p.drawCupLabels = function () {
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
  
    // Must match your cup geometry
    let cy = p.height * 0.40;
    let topY = cy;
    let bottomY = cy + 150;
    let midY = (topY + bottomY) / 2;
  
    let labelX = p.width / 2 + 80; 
  
    p.text("9:00 AM", labelX, topY);
    p.text("1:00 PM", labelX, midY);
    p.text("5:00 PM", labelX, bottomY);
  };

  p.windowResized = function () { p.resizeCanvas(500, 500); };
});
