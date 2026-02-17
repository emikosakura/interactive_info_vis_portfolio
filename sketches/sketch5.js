registerSketch('sk5', function (p) {
  let table;

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let monthCounts = {};
  let monthTypeCounts = {};
  let maxMonthTotal = 0;
  let totalAllDrinks = 0;
  let hoveredMonth = null;

  p.preload = function () {
    table = p.loadTable("boba-tracker.csv", "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(800, 800);
  };

  p.draw = function () {
    p.background(255);
    p.textFont('monospace');
    p.angleMode(p.RADIANS);

    for (const m of months) {
      monthCounts[m] = 0;
      monthTypeCounts[m] = { Milk: 0, Fruit: 0 };
    }
  }

  p.windowResized = function () { p.resizeCanvas(800, 800); };
});