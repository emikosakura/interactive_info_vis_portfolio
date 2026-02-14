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

    // hover detection
    hoveredMonth = null;
    const mx = p.mouseX - p.width / 2;
    const my = p.mouseY - p.height / 2;
    const rMouse = p.sqrt(mx * mx + my * my);

    let angMouse = p.atan2(my, mx);
    if (angMouse < 0) angMouse += p.TWO_PI;

    let rel = angMouse - startAngle;
    while (rel < 0) rel += p.TWO_PI;
    while (rel >= p.TWO_PI) rel -= p.TWO_PI;

    const idx = p.constrain(p.floor(rel / monthStep), 0, 11);
    const candidate = months[idx];

    const a0c = startAngle + idx * monthStep;
    const a1c = a0c + monthStep * gapFrac;

    const totalC = monthCounts[candidate];
    const outerRC = p.map(totalC, 0, maxMonthTotal || 1, outerRMin, outerRMax);

    const inAngle = isAngleBetween(angMouse, a0c, a1c);
    const inRadius = (rMouse >= innerR && rMouse <= outerRC);

    if (inAngle && inRadius && totalC > 0) hoveredMonth = candidate;

    // draw wedges
    for (let i = 0; i < 12; i++) {
      const m = months[i];
      const total = monthCounts[m];

      const a0 = startAngle + i * monthStep;
      const a1 = a0 + monthStep * gapFrac;

      const outerR = p.map(total, 0, maxMonthTotal || 1, outerRMin, outerRMax);

      const milk = monthTypeCounts[m].Milk;
      const fruit = monthTypeCounts[m].Fruit;

      const milkFrac = total > 0 ? milk / total : 0;
      const fruitFrac = total > 0 ? fruit / total : 0;

      let running = a0;

      // Milk segment
      if (milk > 0) {
        const seg = (a1 - a0) * milkFrac;
        drawRingSegment(innerR, outerR, running, running + seg, p.color(140, 110, 80));
        running += seg;
      }

      // Fruit segment
      if (fruit > 0) {
        const seg = (a1 - a0) * fruitFrac;
        drawRingSegment(innerR, outerR, running, running + seg, p.color(230, 160, 170));
        running += seg;
      }

      // Divider between milk and fruit
      if (milk > 0 && fruit > 0 && total > 0) {
        const boundaryA = a0 + (a1 - a0) * (milk / total);
        p.stroke(255);
        p.strokeWeight(3);
        p.line(
          p.cos(boundaryA) * innerR, p.sin(boundaryA) * innerR,
          p.cos(boundaryA) * outerR, p.sin(boundaryA) * outerR
        );
      }

      // Outer edge
      p.noFill();
      p.stroke(255);
      p.strokeWeight(2);
      p.arc(0, 0, outerR * 2, outerR * 2, a0, a1);

      // Month label around circle
      const mid = (a0 + a1) / 2;
      const labelR = outerRMax + 26;

      p.push();
      p.rotate(mid);
      p.translate(labelR, 0);
      p.rotate(p.HALF_PI);
      p.noStroke();
      p.fill(40);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(m.slice(0, 3) + ": " + total, 0, 0);
      p.pop();

      // Hover highlight
      if (hoveredMonth === m) {
        p.noFill();
        p.stroke(0, 70);
        p.strokeWeight(2);
        p.arc(0, 0, (outerR + 3) * 2, (outerR + 3) * 2, a0, a1);
      }
    }

    drawRadialLabels(innerR, outerRMax, maxMonthTotal);

    drawLegend();
    drawAnnotation();

    // helper methods below

    function isAngleBetween(a, a0, a1) {
      a = (a + p.TWO_PI) % p.TWO_PI;
      a0 = (a0 + p.TWO_PI) % p.TWO_PI;
      a1 = (a1 + p.TWO_PI) % p.TWO_PI;
      if (a0 <= a1) return a >= a0 && a <= a1;
      return a >= a0 || a <= a1;
    }
  
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
  
    function drawRadialLabels(innerR, outerRMax, maxValue) {
      p.push();
      const outerRMin = innerR + 20;
      const step = 20;
  
      p.textSize(10);
      p.textAlign(p.CENTER, p.CENTER);
  
      for (let v = step; v <= maxValue; v += step) {
        const r = p.map(v, 0, maxValue, outerRMin, outerRMax);
        const s = String(v);
  
        const labelX = 0;
        const labelY = -r;
  
        p.push();
        p.rectMode(p.CENTER);
        p.noStroke();
        p.fill(255, 230);
        p.rect(labelX, labelY, p.textWidth(s) + 12, 16, 7);
  
        p.fill(120);
        p.text(s, labelX, labelY);
        p.pop();
      }
      p.pop();
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

    function drawAnnotation() {
      p.push();
      p.resetMatrix();
  
      p.fill(70);
      p.textAlign(p.CENTER);
      p.textSize(10);
      p.text(
        "Radius encodes total drinks per month • Color shows Milk vs Fruit • Hover for details",
        p.width / 2,
        p.height - 18
      );
  
      p.pop();
    }

  }
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});

