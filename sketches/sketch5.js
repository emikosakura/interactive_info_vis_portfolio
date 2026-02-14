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
    p.translate(p.width/2, p.height/2);

    const innerR = 90;
    const outerRMin = innerR + 20;
    const outerRMax = 230;
    const monthStep = p.TWO_PI / 12;
    const startAngle = -p.HALF_PI;
    const gapFrac = 0.92;

    // chart title
    p.push();
    p.resetMatrix();
    p.fill(20);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text("My Boba Consumption: 2021–2025", 16, 14);
    p.pop();

    // background layers
    drawSeasonBands(innerR, outerRMax);
    drawRadialRings(innerR, outerRMax, maxMonthTotal);

    drawLegend();

    // helper methods below
  
    function drawRingSegment(rInner, rOuter, a0, a1, c) {
      p.noStroke();
      p.fill(c);
      p.beginShape();
      for (let a = a0; a <= a1; a += 0.01) {
        p.vertex(p.cos(a) * rOuter, p.sin(a) * rOuter);
      }
      for (let a = a1; a >= a0; a -= 0.01) {
        p.vertex(p.cos(a) * rInner, p.sin(a) * rInner);
      }
      p.endShape(p.CLOSE);
    }

    function drawSeasonBands(innerR, outerRMax) {
      const startAngle = -p.HALF_PI;
      const step = p.TWO_PI / 12;
  
      const bandInner = innerR + 6;
      const bandOuter = outerRMax + 10;
  
      const seasons = [
        { start: 11, end: 1,  col: p.color(210, 225, 245) }, // Winter: Dec-Feb
        { start: 2,  end: 4,  col: p.color(215, 240, 220) }, // Spring: Mar-May
        { start: 5,  end: 7,  col: p.color(255, 240, 200) }, // Summer: Jun-Aug
        { start: 8,  end: 10, col: p.color(240, 220, 200) }  // Fall: Sep-Nov
      ];
  
      p.noStroke();
  
      function drawRange(startIdx, endIdx, baseCol) {
        const fillCol = p.color(p.red(baseCol), p.green(baseCol), p.blue(baseCol), 70);
        if (startIdx <= endIdx) {
          const a0 = startAngle + startIdx * step;
          const a1 = startAngle + (endIdx + 1) * step;
          drawRingSegment(bandInner, bandOuter, a0, a1, fillCol);
        } else {
          // wrap-around
          let a0 = startAngle + startIdx * step;
          let a1 = startAngle + 12 * step;
          drawRingSegment(bandInner, bandOuter, a0, a1, fillCol);
          a0 = startAngle;
          a1 = startAngle + (endIdx + 1) * step;
          drawRingSegment(bandInner, bandOuter, a0, a1, fillCol);
        }
      }
  
      for (const s of seasons) drawRange(s.start, s.end, s.col);
    }

    function drawRadialRings(innerR, outerRMax, maxValue) {
      p.push();
      const outerRMin = innerR + 20;
      const step = 20;
  
      p.noFill();
      p.stroke(210);
      p.strokeWeight(1);
  
      for (let v = step; v <= maxValue; v += step) {
        const r = p.map(v, 0, maxValue, outerRMin, outerRMax);
        p.circle(0, 0, r * 2);
      }
      p.pop();
    }

    function drawLegend() {
      p.push();
      p.resetMatrix();
  
      const x = 16, y = p.height - 78;
  
      p.noStroke();
      p.fill(20);
      p.textSize(12);
      p.textAlign(p.LEFT, p.TOP);
      p.text("Legend", x, y);
  
      p.fill(140, 110, 80);
      p.rect(x, y + 22, 14, 14, 3);
      p.fill(20);
      p.text("Milk", x + 20, y + 22);
  
      p.fill(230, 160, 170);
      p.rect(x, y + 42, 14, 14, 3);
      p.fill(20);
      p.text("Fruit", x + 20, y + 42);
  
      p.pop();
    }

  }
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});

