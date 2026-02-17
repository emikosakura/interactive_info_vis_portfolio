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
    p.textFont('monospace');
    p.angleMode(p.RADIANS);

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
  }

  p.draw = function () {
    p.background(255);
    p.translate(p.width / 2, p.height / 2);

    // layout constants
    const innerR = 90;
    const outerRMin = innerR + 20;
    const outerRMax = 230;
    const monthStep = p.TWO_PI / 12;
    const startAngle = -p.HALF_PI;
    const gapFrac = 0.92;

    // title
    p.push();
    p.resetMatrix();
    p.fill(20);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("My Boba Consumption: 2021–2025", 16, 14);
    p.pop();

    drawSeasonBands(innerR, outerRMax);
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

  function drawSeasonBands(innerR, outerRMax) {
    const startAngle = -p.HALF_PI;
    const step = p.TWO_PI / 12;

    const bandInner = innerR + 6;
    const bandOuter = outerRMax + 10;

    const seasons = [
      { start: 11, end: 1,  col: p.color(210, 225, 245) },
      { start: 2,  end: 4,  col: p.color(215, 240, 220) },
      { start: 5,  end: 7,  col: p.color(255, 240, 200) },
      { start: 8,  end: 10, col: p.color(240, 220, 200) }
    ];

    p.noStroke();

    function drawRange(startIdx, endIdx, baseCol) {
      const fillCol = p.color(p.red(baseCol), p.green(baseCol), p.blue(baseCol), 70);
      if (startIdx <= endIdx) {
        const a0 = startAngle + startIdx * step;
        const a1 = startAngle + (endIdx + 1) * step;
        drawRingSegment(bandInner, bandOuter, a0, a1, fillCol);
      } else {
        drawRingSegment(bandInner, bandOuter, startAngle + startIdx * step, startAngle + 12 * step, fillCol);
        drawRingSegment(bandInner, bandOuter, startAngle, startAngle + (endIdx + 1) * step, fillCol);
      }
    }

    for (const s of seasons) drawRange(s.start, s.end, s.col);
  }
});