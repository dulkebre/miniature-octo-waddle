const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  

  return ({ context, width, height }) => {
    context.fillStyle = 'GhostWhite';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i <agents.length; i++) {
      const agent = agents[i];
      for (let j = i + 1; j <agents.length; j++) {
        const other = agents[j];
  
        const dist = agent.pos.getDistance(other.pos);

        if (dist > 175) continue;

        const gradient = context.createLinearGradient(agent.pos.x, agent.pos.y, other.pos.x, other.pos.y);

        gradient.addColorStop(0, agent.getColor());
        gradient.addColorStop(1, other.getColor());

        context.strokeStyle = gradient;

        context.lineWidth = math.mapRange(dist, 0, 175, 10, 1);
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.warp(width, height);
    });
  };
};


canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;

    return Math.sqrt(Math.pow(dx,2) + Math.pow(dy, 2));
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1,1), random.range(-1,1));
    this.radius = random.range(2,15);
  }

  warp(width, height) {
    if (this.pos.x < 0) {
      this.pos.x += width;
    }
    if (this.pos.x > width) {
      this.pos.x -= width;
    }
    if (this.pos.y < 0 ) {
      this.pos.y += height;
    }
    if (this.pos.y > height) {
      this.pos.y -= height;
    }
  }

  getColor() {
    const redFactor = Math.floor(math.mapRange(this.radius, 2, 15, 30, 170));
    const greenFactor = Math.floor(math.mapRange(this.radius, 2, 15, 150, 255));
    const blueFactor = Math.floor(math.mapRange(this.radius, 2, 15, 255, 150));

    return "rgb("+redFactor+","+greenFactor+","+blueFactor+")";
  }

  update () {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.strokeStyle = this.getColor();
    context.fillStyle = this.getColor();


    context.beginPath();
    context.arc(0,0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore()
  }
}
