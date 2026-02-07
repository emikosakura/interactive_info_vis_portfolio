// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(800, 800);
  };
  p.draw = function () {
    p.background(255, 255, 255); 
    p.translate(p.width / 2, p.height / 2);

    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();
    // determine light color based on time of day
    let lightColor;
    if (hr >= 6 && hr < 12) { // Morning (cool)
      lightColor = p.color(173, 216, 230, 100); // Light blue (matches legend)
    } else if (hr >= 12 && hr < 18) { // Midday (neutral)
      lightColor = p.color(255, 255, 224, 100); // Light yellow (matches legend)
    } else { // Evening (warm)
      lightColor = p.color(255, 165, 0, 100); // Orange (matches legend)
    }

    // draw luminescent light with a glowing effect
    for (let i = 0; i < 10; i++) {
      let alpha = 100 - i * 10; // Gradually reduce opacity
      let size = 400 + i * 20; // Gradually increase size
      p.noStroke();
      p.fill(lightColor.levels[0], lightColor.levels[1], lightColor.levels[2], alpha);
      p.ellipse(0, 0, size, size);
    }

    // clock face
    p.noFill();
    p.stroke(0);
    p.strokeWeight(4);
    p.ellipse(0, 0, 300, 300);

    for (let i = 0; i < 12; i++) {
      let angle = p.TWO_PI / 12 * (i + 1) - p.HALF_PI; 
      let x1 = 120 * p.cos(angle);
      let y1 = 120 * p.sin(angle);
      let x2 = 140 * p.cos(angle);
      let y2 = 140 * p.sin(angle);

      // restore stroke settings for tick marks
      p.stroke(0);
      p.line(x1, y1, x2, y2);

      // draw numbers
      let numX = 160 * p.cos(angle);
      let numY = 160 * p.sin(angle);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.noStroke(); 
      p.fill(0); 
      p.text(i + 1, numX, numY);
    }

    // restore stroke settings for clock hands
    p.stroke(0);

    // calculate angles for hands
    let secondAngle = p.map(sc, 0, 60, 0, p.TWO_PI) - p.HALF_PI;
    let minuteAngle = p.map(mn + sc / 60, 0, 60, 0, p.TWO_PI) - p.HALF_PI;
    let hourAngle = p.map((hr % 12) + mn / 60, 0, 12, 0, p.TWO_PI) - p.HALF_PI;

    // draw hour hand
    p.strokeWeight(6);
    p.line(0, 0, 70 * p.cos(hourAngle), 70 * p.sin(hourAngle));

    // draw minute hand
    p.strokeWeight(4);
    p.line(0, 0, 100 * p.cos(minuteAngle), 100 * p.sin(minuteAngle));

    // draw second hand
    p.strokeWeight(2);
    p.line(0, 0, 120 * p.cos(secondAngle), 120 * p.sin(secondAngle));

    // draw swatch legend
    const legendX = 250; // Shifted slightly to the right
    const legendY = -300;
    const swatchSize = 20;
    const spacing = 30;

    // Morning (cool)
    p.noStroke();
    p.fill(173, 216, 230); // Light blue
    p.ellipse(legendX, legendY, swatchSize, swatchSize);
    p.fill(0);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(12);
    p.text("Morning (cool)", legendX + spacing, legendY);

    // Midday (neutral)
    p.fill(255, 255, 224); // Light yellow
    p.ellipse(legendX, legendY + spacing, swatchSize, swatchSize);
    p.fill(0);
    p.text("Midday (neutral)", legendX + spacing, legendY + spacing);

    // Evening (warm)
    p.fill(255, 165, 0); // Orange
    p.ellipse(legendX, legendY + 2 * spacing, swatchSize, swatchSize);
    p.fill(0);
    p.text("Evening (warm)", legendX + spacing, legendY + 2 * spacing);
  };
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
