// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  p.setup = function () {
    p.createCanvas(800, 800);
  };
  p.draw = function () {
    p.background(220);
    p.fill(100, 150, 240);
    p.textSize(32);
    p.textAlign(p.CENTER, p.CENTER);
    let h = p.hour();
    let m = p.minute();
    let s = p.second();

    let timeStr = `${p.nf(h, 2)}:${p.nf(m, 2)}:${p.nf(s, 2)}`;

    p.text(timeStr, p.width / 2, p.height / 2);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
