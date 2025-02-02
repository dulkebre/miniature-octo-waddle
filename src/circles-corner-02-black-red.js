const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [1080, 1080]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'red';

    const cx = width * 0.5;
    const cy = height * 0.5;

    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 40;
    const radius = width * 0.35;

    // Top left
    context.save();
    context.translate(0, 0);
    sketchQuarter(context, w, h, num, radius, math.degToRad(0));
    context.restore();
    // Bottom right
    context.save();
    context.translate(0, height);
    context.rotate(math.degToRad(-90));
    sketchQuarter(context, w, h, num, radius, math.degToRad(0));
    context.restore();
    // Bottom Right
    context.save();
    context.translate(width, height);
    context.rotate(math.degToRad(-180));
    sketchQuarter(context, w, h, num, radius, math.degToRad(0));
    context.restore();
    // Top Left
    context.save();
    context.translate(width, 0);
    context.rotate(math.degToRad(-270));
    sketchQuarter(context, w, h, num, radius, math.degToRad(0));
    context.restore();
  };
};

canvasSketch(sketch, settings);

const sketchQuarter = (context, w, h, num, radius, startAngle) => {
    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(90 / num);
      const angle = slice * i;

      x = radius * Math.sin(angle + startAngle);
      y = radius * Math.cos(angle + startAngle);

      context.save();
      context.rotate(angle);
      
      // Smaller red shapes go back
      context.lineWidth = random.range(0.4, 14);
      context.beginPath();
      context.strokeStyle = 'red';
      context.arc(0, 0, radius * random.range(0.6, 1.2),  slice * random.range(0.1, 0.5), slice * random.range(-0.1, -0.3),true);
      context.arc(0, 0, radius * random.range(0.6, 1.2),  slice * random.range(-0.1, -0.3), slice * random.range(0.1, 0.5), false);
      context.stroke();

      // Larger black shapes go fron
      context.lineWidth = random.range(0.5, 15);
      context.beginPath();
      context.arc(0, 0, radius * random.range(0.7, 1.3),  slice * random.range(0.1, 0.6), slice * random.range(-0.1, -0.4),true);
      context.arc(0, 0, radius * random.range(0.7, 1.3),  slice * random.range(-0.1, -0.4), slice * random.range(0.1, 0.6), false);
      context.strokeStyle = 'black';
      context.stroke();

      context.restore();
    }
}
