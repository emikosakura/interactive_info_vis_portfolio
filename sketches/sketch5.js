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

  p.preload = function() {
    table = p.loadTable('boba-tracker.csv', 'csv', 'header');
  }

  p.setup = function () {
    p.createCanvas(800, 800);
    p.textFont('monospace');
    p.angleMode(p.RADIANS);

    for (let m of months) {
      monthCounts[m] = 0;
      monthTypeCounts[m] = { Milk: 0, Fruit: 0 };
    }

    for (let r = 0; r < table.getRowCount(); r++) {
      let mRaw, typeRaw;

      try {
        mRaw = table.getString(r, "Month");
        typeRaw = table.getString(r, "Type");
      } catch (e) {
        continue;
      }

      if (!mRaw) continue;

      const m = String(mRaw).trim();
      if (!months.includes(m)) continue;

      const type = typeRaw ? String(typeRaw).trim() : "";

      monthCounts[m]++;

      if (type === "Milk") monthTypeCounts[m].Milk++;
      else if (type === "Fruit") monthTypeCounts[m].Fruit++;
    }

    maxMonthTotal = 0;
    totalAllDrinks = 0;
    for (let m of months) {
      maxMonthTotal = p.max(maxMonthTotal, monthCounts[m]);
      totalAllDrinks += monthCounts[m];
    }
  };

  p.draw = function () {
    p.background(255);

  }

  p.windowResized = function () { p.resizeCanvas(800, 800); };
});

