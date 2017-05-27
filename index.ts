if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('service worker is is all cool.');
  }).catch(function(e) {
    console.error('service worker is not so cool.', e);
    throw e;
  });
}

declare const webkitAudioContext: AudioContext;


// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func: Function, wait: number, options: any) {
  var context: any, args:any, result: any;
  var timeout:any = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

const img = new Image;
const ac = new (typeof AudioContext !== 'undefined' ? AudioContext : webkitAudioContext)();

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
  canvas.style.transform = `translateY(-50%) rotate(${velocity.r}rad)`;

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
const throttled = throttle(spinSound, 44, {});

function tick() {
  requestAnimationFrame(() => {
    velocity.r += velocity.rotationVelocity;

    if (lastTouchEnd) {
      const timeSinceLastTouch = Date.now() - lastTouchEnd;
      const timeLeftPct = timeSinceLastTouch / timeRemaining;
      if (timeLeftPct < 1) {
        //spinSound(1- timeLeftPct);
        const newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
        velocity.rotationVelocity = newVelocity;
        throttled(Math.abs(newVelocity / velocity.maxVelocity * 200));
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


// assume magnitude is between 0 and 1
function spinSound( magnitude: number ) {
  const osc  = ac.createOscillator();
  const gain = ac.createGain();

  // enforce range
  magnitude = Math.min( 1, Math.max( 0, magnitude ) );

  osc.type = 'square';
  osc.connect( gain );
  gain.connect( ac.destination );

  // max of 40 boops
  //const count = 6 + ( 1 * magnitude );
  // decay constant for frequency between each boop
  //const decay = 0.97;

  // automation start time
  let time = ac.currentTime;
  // starting frequency (min of 400, max of 900)
  let freq = 400 + ( 400 * magnitude );
  // boop duration (longer for lower magnitude)
  let dur = 0.1 * ( 1 - magnitude / 2 );

  osc.frequency.setValueAtTime( freq, time );
  osc.frequency.linearRampToValueAtTime( freq * 1.8, time += dur );

  // fade out the last boop
  gain.gain.setValueAtTime( 1, time );
  gain.gain.linearRampToValueAtTime( 0, time += dur );

  // play it
  osc.start( ac.currentTime );
  console.log(ac.currentTime, time)
  osc.stop( time  );
}


(async () => {
  await boot();
  tick();

  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', touchEnd);
  document.addEventListener('touchcancel', touchEnd);
})();
