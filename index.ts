const img = new Image;
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const velocity = {r: 0, rotationVelocity: 0, maxVelocity: 100};
const friction = -0.001;

const imgDimensions = {width: 210, height: 220};
const touchInfo : {
  rateSamples: number;
  startX?: number;
  startY?: number;
  lastX?: number;
  lastY?: number;
} = {rateSamples: 0};

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
    if (Math.abs(velocity.r) < velocity.maxVelocity) {
      velocity.r += velocity.rotationVelocity;
    }

    if (velocity.rotationVelocity > friction && velocity.rotationVelocity > 0) {
      velocity.rotationVelocity += friction;
    }

    if (velocity.rotationVelocity < friction && velocity.rotationVelocity < 0) {
      velocity.rotationVelocity -= friction;
    }

    paint();
    tick();
  });
}

function onTouchStart(e: TouchEvent) {
  touchInfo.startX = e.touches[0].clientX;
  touchInfo.startY = e.touches[0].clientX;
}

function onTouchMove(e: TouchEvent) {
  touchInfo.lastX = e.touches[0].clientX;
  touchInfo.lastY = e.touches[0].clientY;
  touchInfo.rateSamples++;
}

function touchEnd() {
  if (touchInfo.lastX !== undefined && touchInfo.lastY !== undefined) {
    let touchSpeed = ((touchInfo.lastX! - touchInfo.startX!) / window.innerWidth) / touchInfo.rateSamples;

    velocity.rotationVelocity += touchSpeed;
  }

  touchInfo.lastX = undefined;
  touchInfo.lastY = undefined;
  touchInfo.rateSamples = 0;
}


(async () => {
  await boot();
  tick();

  document.body.addEventListener('touchstart', onTouchStart);
  document.body.addEventListener('touchmove', onTouchMove);
  document.body.addEventListener('touchend', touchEnd);
  document.body.addEventListener('touchcancel', touchEnd);
})();
