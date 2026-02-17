registerSketch('sk5', function (p) {
  let table;

  p.setup = function () {
    p.createCanvas(800, 800);
    table = p.loadTable('boba-tracker.csv', 'csv', 'header');
  };

  p.draw = function () {
    p.background(255);
    p.textFont('monospace');
  }

  p.windowResized = function () { p.resizeCanvas(800, 800); };
});