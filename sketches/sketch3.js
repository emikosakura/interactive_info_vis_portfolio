// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  p.setup = function () {
    p.createCanvas(800, 800);
  };
  p.draw = function () {
    p.background(240, 200, 200);
    p.translate(p.width / 2, p.height / 2);

    // clock face
    p.noFill();
    p.stroke(0);
    p.strokeWeight(4);
    p.ellipse(0, 0, 300, 300);

    for (let i = 0; i < 12; i++) {
      let angle = p.TWO_PI / 12 * i - p.HALF_PI; 
      let x1 = 120 * p.cos(angle);
      let y1 = 120 * p.sin(angle);
      let x2 = 140 * p.cos(angle);
      let y2 = 140 * p.sin(angle);
      p.line(x1, y1, x2, y2);
    }

    // get current time
    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

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
  };
  p.windowResized = function () { p.resizeCanvas(800, 800); };
});
