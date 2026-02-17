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

    for (const m of months) {
      monthCounts[m] = 0;
      monthTypeCounts[m] = { Milk: 0, Fruit: 0 };
    }

    // find column indices robustly (handles BOM/CR/spaces)
    const norm = (s) =>
      String(s ?? "")
        .replace(/\uFEFF/g, "")
        .replace(/\r/g, "")
        .replace(/\u00A0/g, " ")
        .trim()
        .toLowerCase();

    const cols = table.columns || [];
    const monthCol = cols.findIndex((c) => norm(c) === "month");
    const typeCol = cols.findIndex((c) => norm(c) === "type");
  }

  // count rows
  for (let r = 0; r < table.getRowCount(); r++) {
    const mRaw = table.getString(r, monthCol);
    const tRaw = typeCol === -1 ? "" : table.getString(r, typeCol);

    const mClean = String(mRaw ?? "")
      .replace(/\uFEFF/g, "")
      .replace(/\r/g, "")
      .trim();

    if (!mClean) continue;

    // normalize month value to match list
    const mFixed = mClean.charAt(0).toUpperCase() + mClean.slice(1).toLowerCase();
    if (!months.includes(mFixed)) continue;

    const type = String(tRaw ?? "").replace(/\r/g, "").trim();

    monthCounts[mFixed]++;

    if (type === "Milk") monthTypeCounts[mFixed].Milk++;
    else if (type === "Fruit") monthTypeCounts[mFixed].Fruit++;
  };

  maxMonthTotal = 0;
  totalAllDrinks = 0;
  for (let m of months) {
    maxMonthTotal = p.max(maxMonthTotal, monthCounts[m]);
    totalAllDrinks += monthCounts[m];
  }

  p.draw = function () {
    p.background(255);
    p.textFont('monospace');
    p.angleMode(p.RADIANS);
  }

  p.windowResized = function () { 
    p.resizeCanvas(800, 800); 
  };

  // helper functions below

  function isAngleBetween(a, a0, a1) {
    a = (a + p.TWO_PI) % p.TWO_PI;
    a0 = (a0 + p.TWO_PI) % p.TWO_PI;
    a1 = (a1 + p.TWO_PI) % p.TWO_PI;
    if (a0 <= a1) return a >= a0 && a <= a1;
    return a >= a0 || a <= a1;
  }
});