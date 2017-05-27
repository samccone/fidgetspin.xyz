if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('service worker is is all cool.');
  }).catch(function(e) {
    console.error('service worker is not so cool.', e);
    throw e;
  });
}

const img = new Image;
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const velocity = { r: 0, rotationVelocity: 0, maxVelocity: 100 };

const statsElems = {
  turns: document.querySelector('#turns')!,
  velocity: document.querySelector('#velocity')!
};

interface Sample {
  xDistance: number;
  duration: number;
};

const imgDimensions = { width: 300, height: 300 };
const touchInfo: {
  startX?: number;
  startY?: number;
  lastX?: number;
  lastY?: number;
  samples: Sample[];
  lastTimestamp?: number;
} = { samples: [] };

const dPR = window.devicePixelRatio;
let timeRemaining = 5000;
let lastTouchEnd: number;
let lastTouchVelocity: number;

canvas.height = imgDimensions.height * dPR;
canvas.width = imgDimensions.width * dPR;
canvas.style.width = `${imgDimensions.width}px`;
canvas.style.height = `${imgDimensions.height}px`;

const ctx = canvas.getContext('2d')!;
const fontHeight = 20 * dPR;
ctx.font = `${fontHeight}px 'Roboto'`;

let drewImage = false;

async function boot() {
  return new Promise((res) => {
    img.onload = function () {
      res();
    }

    img.src = 'spinner.svg';
  });
}

function paint() {
  canvas.style.transform = `rotate(${velocity.r}rad)`;

  if (!drewImage) {
    ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
    drewImage = true;
  }
}

function stats() {
  const velocityText = Math.abs(velocity.rotationVelocity * 100).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const turnsText = (velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 1 });
  statsElems.turns.textContent = `turns: ${turnsText}`;
  statsElems.velocity.textContent = `velocity: ${velocityText}`;
}

const easeOutQuad = (t: number) => t * (2 - t);

function tick() {
  requestAnimationFrame(() => {
    velocity.r += velocity.rotationVelocity;

    if (lastTouchEnd) {
      const timeSinceLastTouch = Date.now() - lastTouchEnd;
      const timeLeftPct = timeSinceLastTouch / timeRemaining;
      if (timeLeftPct < 1) {
        const newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
        velocity.rotationVelocity = newVelocity;
      }
    }

    paint();
    stats();
    tick();
  });
}

function onTouchStart(e: TouchEvent) {
  touchInfo.startX = e.touches[0].clientX;
  touchInfo.startY = e.touches[0].clientX;
  touchInfo.lastTimestamp = e.timeStamp;
}

function onTouchMove(e: TouchEvent) {
  touchInfo.lastX = e.touches[0].clientX;
  touchInfo.lastY = e.touches[0].clientY;

  touchInfo.samples.push({
    xDistance: touchInfo.lastX - touchInfo.startX!,
    duration: e.timeStamp - touchInfo.lastTimestamp!
  });

  if (touchInfo.samples.length >= 3) {
    updateVelocity(touchInfo.samples);
    touchInfo.samples = [];
  }

  touchInfo.startX = touchInfo.lastX;
  touchInfo.startY = touchInfo.lastY;
  touchInfo.lastTimestamp = e.timeStamp;
}

function touchEnd() {
  updateVelocity(touchInfo.samples);
  touchInfo.samples = [];
}


function updateVelocity(samples: Sample[]) {
  const multiplier = 25;

  const totalDistance = samples.reduce((total, curr) => total += curr.xDistance, 0);
  const totalDuration = samples.reduce((total, curr) => total += curr.duration, 0);
  const touchSpeed = totalDistance / totalDuration / multiplier;

  if (!Number.isFinite(touchSpeed)) return;

  if (Math.abs(velocity.rotationVelocity) < velocity.maxVelocity) {
    velocity.rotationVelocity -= touchSpeed;
  }

  resetLastTouch();
}

function resetLastTouch() {
  lastTouchEnd = Date.now();
  lastTouchVelocity = velocity.rotationVelocity;
}


(async () => {
  await boot();
  tick();

  document.body.addEventListener('touchstart', onTouchStart);
  document.body.addEventListener('touchmove', onTouchMove);
  document.body.addEventListener('touchend', touchEnd);
  document.body.addEventListener('touchcancel', touchEnd);
})();
