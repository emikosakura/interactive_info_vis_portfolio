registerSketch('sk5', function (p) {
  p.setup = function () {
    p.createCanvas(800, 800);
  };

  p.draw = function () {
    p.background(150);

  }

  p.windowResized = function () { p.resizeCanvas(800, 800); };
});

