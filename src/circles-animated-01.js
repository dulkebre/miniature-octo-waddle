const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  const num = 20;
  const squares = [];
  const circles = [];

  const centerPoint = new Point(width * 0.5, height * 0.5);
  const w = width * 0.01;
  const h = height * 0.1;
  let x, y;
  const radius = width * 0.3;
    
  for (let i = 0; i < num; i++) {
    const slice = math.degToRad(360 / num);
    const angle = slice * i;

    x = centerPoint.x + radius * Math.sin(angle);
    y = centerPoint.y + radius * Math.cos(angle);

    const thisSquare = new Square(x, y, angle, w, h);
    squares.push(thisSquare);

    const thisCircle = new Circle(centerPoint, angle, radius, slice);
    circles.push(thisCircle);
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';

    squares.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce();
    });

    circles.forEach(agent => {
      agent.update();
      agent.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class BounceVelocity {
  constructor(speed, min, max) {
    this.speed = speed;
    this.min = min;
    this.max = max;
    this.acceleration = min;
  }
}

class Square {
  constructor(x, y, angle, w, h) {
    this.pos = new Point(x, y);
    this.angle = angle;
    this.w = w;
    this.h = h;
    this.scaleX = random.range(0.1, 2);
    this.scaleY = random.range(0.2, 0.5);
    this.rectX = -w * 0.5;
    this.rectY = random.range(0, -h * 0.5);
    this.valocity = new BounceVelocity(random.range(0.1, 0.9), 0.5, 100);
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.rotate(-1 * this.angle);
    context.scale(this.scaleX, this.scaleY);

    context.beginPath();
    context.rect(this.rectX, this.rectY, this.w, this.h);
    context.fill();
    context.restore();
  }

  update () {
    this.rectY += this.valocity.speed;
  }

  bounce() {
    this.valocity.acceleration += this.valocity.speed;
    if (this.valocity.acceleration > this.valocity.max || this.valocity.acceleration < this.valocity.min) {
      this.valocity.speed *= -1;
    }
  }
}

class AngleVelocity {
  constructor(value) {
    this.velocity = value;
  }
}

class Circle {

  constructor(centerPoint, angle, radius, slice) {
    this.center = centerPoint;
    this.angle = angle;
    this.lineWidth = random.range(0.5, 20);
    this.radius = radius * random.range(0.7, 1.3);
    this.startAngle = slice * random.range(1, -8);
    this.endAngle = slice * random.range(1, 5);
    const degree = math.degToRad(random.range(0.001,0.1));
    this.angular = new AngleVelocity(degree);
  }

  draw(context) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(-1 * this.angle);
    context.beginPath();

    context.lineWidth = this.lineWidth;

    context.arc(0, 0, this.radius, this.startAngle, this.endAngle);
    context.stroke();
    context.restore();
  }

  update() {
    this.startAngle += this.angular.velocity;
    this.endAngle += this.angular.velocity;
  }
}
