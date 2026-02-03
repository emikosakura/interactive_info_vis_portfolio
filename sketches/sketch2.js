// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {

  p.setup = function () {
    p.createCanvas(800, 800);
  };
  p.draw = function () {
    p.background(0);
    p.clock();
    p.drawCoffeeCup();
  }

  p.clock = function () {
    let hr = p.hour();
    let mn = p.minute();
    let sc = p.second();

    p.fill("pink");
    // p.textFont(clockFont);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(p.width / 10);
    let noon = hr >= 12 ? " PM" : " AM"
    if (mn < 10)
      mn = "0" + mn
    hr %= 12
    p.text(hr + ":" + mn + ":" + sc + noon, p.width / 2, p.height / 2);
  }

  p.drawCoffeeCup = function() {
    p.noFill();
    p.stroke(255);
    p.strokeWeight(4);

    // Draw the cup body (trapezoid shape for a tapered look)
    // Cup outline as 3 lines (no flat bottom)
    p.line(p.width / 2 - 60, p.height / 2 + 100, p.width / 2 + 60, p.height / 2 + 100); // top
    p.line(p.width / 2 - 60, p.height / 2 + 100, p.width / 2 - 50, p.height / 2 + 250); // left side
    p.line(p.width / 2 + 60, p.height / 2 + 100, p.width / 2 + 50, p.height / 2 + 250); // right side

    // Draw the cup handle (semi-oval shape)
    p.noFill();
    p.arc(p.width / 2 - 60, p.height / 2 + 175, 80, 100, p.HALF_PI, p.PI + p.HALF_PI);

    // Draw the cup base (ellipse for a rounded bottom)
    p.ellipse(p.width / 2, p.height / 2 + 248, 100, 20);

  }
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
