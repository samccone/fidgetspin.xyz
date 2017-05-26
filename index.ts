const img = new Image;
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const velocity = {r: 0, rotationVelocity: 0.1};
const imgDimensions = {width: 210, height: 220};

canvas.height = imgDimensions.height;
canvas.width = imgDimensions.width;

const ctx = canvas.getContext('2d')!;

async function boot() {
  return new Promise((res) => {
    img.onload = function() {
      res();
    }

    img.src = 'spinner.svg';
  });
}


function paint() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(imgDimensions.width / 2, imgDimensions.height / 2);
  ctx.rotate(velocity.r);
  ctx.translate(-120, -109);
  ctx.drawImage(img, 0, 0, imgDimensions.width, imgDimensions.height);
  ctx.restore();
}

function tick() {
  requestAnimationFrame(() => {
    velocity.r += velocity.rotationVelocity;
    paint();
    tick();
  });
}

(async () => {
  await boot();
  tick();
})();
