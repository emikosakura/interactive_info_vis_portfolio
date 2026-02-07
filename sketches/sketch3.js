// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(800, 800);
  };
  p.draw = function () {
    p.background(240, 200, 200);
    p.translate(p.width / 2, p.height / 2);

    // clock face
    p.noFill();
    p.stroke(0);
    p.strokeWeight(4);
    p.ellipse(0, 0, 300, 300);

    for (let i = 0; i < 12; i++) {
      let angle = p.TWO_PI / 12 * i - p.HALF_PI; 
      let x1 = 120 * p.cos(angle);
      let y1 = 120 * p.sin(angle);
      let x2 = 140 * p.cos(angle);
      let y2 = 140 * p.sin(angle);
      p.line(x1, y1, x2, y2);
    }
  };
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
