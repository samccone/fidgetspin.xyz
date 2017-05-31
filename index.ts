if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('service worker is is all cool.');
  }).catch(function(e) {
    console.error('service worker is not so cool.', e);
    throw e;
  });
}

let maxVelocity = 0;
const img = new Image;
const ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const velocity = { r: 0, rotationVelocity: 0, maxVelocity: 10 };

const statsElems = {
  turns: document.querySelector('#turns')!,
  velocity: document.querySelector('#velocity')!,
  maxVelocity: document.querySelector('#maxVelocity')!
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
let slowDownDuration = 5000;
let lastTouchEnd: number;
let lastTouchVelocity: number;

canvas.height = imgDimensions.height * dPR;
canvas.width = imgDimensions.width * dPR;
canvas.style.width = `${imgDimensions.width}px`;
canvas.style.height = `${imgDimensions.height}px`;

const ctx = canvas.getContext('2d')!;
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
  const vel = Math.abs(velocity.rotationVelocity * 100);
  maxVelocity = Math.max(vel, maxVelocity);
  const velocityText = vel.toLocaleString(undefined, { maximumFractionDigits: 1 });
  const turnsText = Math.abs(velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 0 });
  const maxVelText = maxVelocity.toLocaleString(undefined, {maximumFractionDigits: 1});

  statsElems.turns.textContent = `${turnsText}`;
  statsElems.velocity.textContent = `${velocityText}`;
  statsElems.maxVelocity.textContent = `${maxVelText}`;
}

const easeOutQuad = (t: number) => t * (2 - t);

function tick() {
  requestAnimationFrame(() => {
    velocity.r += velocity.rotationVelocity;

    if (lastTouchEnd) {
      const timeSinceLastTouch = Date.now() - lastTouchEnd;
      const timeLeftPct = timeSinceLastTouch / slowDownDuration;
      if (timeSinceLastTouch < slowDownDuration) {
        const newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
        velocity.rotationVelocity = newVelocity;
        const soundMagnitude = Math.abs(newVelocity / velocity.maxVelocity * 200);
        spinSound(soundMagnitude);
        spinSound2(soundMagnitude);
      } else {
        velocity.rotationVelocity = 0;
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
  e.preventDefault();
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
  e.preventDefault();
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


let endPlayTime = -1;
let endPlayTime2 = -1;

interface rangeArgs {
  inputMin: number;
  inputMax: number;
  outputFloor: number;
  outputCeil: number;
};
function generateRange(args: rangeArgs) {
	return function (x: number):number {
		const outputRange = args.outputCeil - args.outputFloor;
		const inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
		return args.outputFloor + (inputPct * outputRange);
  }
}
const freqRange400_2000 = generateRange({
  inputMin: 0,
  inputMax: 80,
  outputFloor: 400,
  outputCeil: 2000
});
const freqRange300_1500 = generateRange({
  inputMin: 0,
  inputMax: 80,
  outputFloor: 300,
  outputCeil: 1500
});

// assume magnitude is between 0 and 1, though it can be a tad higher
function spinSound( magnitude: number ) {
  // automation start time
  let time = ac.currentTime;
  const freqMagnitude = magnitude;
  magnitude = Math.min(1, magnitude / 10);
  let x = (easeOutQuad(magnitude) * 1.1) -(0.6 - (0.6 * easeOutQuad(magnitude)));

  if (time + x - easeOutQuad(magnitude) < endPlayTime) {
      return;
  }

  const osc  = ac.createOscillator();
  const gain = ac.createGain();

  // enforce range
  magnitude = Math.min( 1, Math.max( 0, magnitude ) );

  osc.type = 'triangle';
  osc.connect( gain );
  gain.connect( ac.destination );

  // max of 40 boops
  //const count = 6 + ( 1 * magnitude );
  // decay constant for frequency between each boop
  //const decay = 0.97;

  // starting frequency (min of 400, max of 900)
  let freq = freqRange400_2000(freqMagnitude);
  // boop duration (longer for lower magnitude)
  let dur = 0.1 * ( 1 - magnitude / 2 );
  osc.frequency.setValueAtTime( freq, time );
  osc.frequency.linearRampToValueAtTime( freq * 1.8, time += dur );
  endPlayTime = time + dur;

  // fade out the last boop
  gain.gain.setValueAtTime(0.1,   ac.currentTime);
  gain.gain.linearRampToValueAtTime( 0, endPlayTime );

  // play it
  osc.start(ac.currentTime);
  osc.stop(endPlayTime);
}

function spinSound2( magnitude: number ) {
  // automation start time
  let time = ac.currentTime;
  const freqMagnitude = magnitude;
  magnitude = Math.min(1, magnitude / 10);
  let x = (easeOutQuad(magnitude) * 1.1) - (0.3 - (0.3 * easeOutQuad(magnitude)));

  if (time + x - easeOutQuad(magnitude) < endPlayTime2) {
      return;
  }

  const osc  = ac.createOscillator();
  const gain = ac.createGain();

  // enforce range
  magnitude = Math.min( 1, Math.max( 0, magnitude ) );

  osc.type = 'sine';
  osc.connect( gain );
  gain.connect( ac.destination );

  var freq = freqRange300_1500(freqMagnitude);
  // boop duration (longer for lower magnitude)
  var dur = 0.05 * (1 - magnitude / 2);
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.linearRampToValueAtTime(freq * 1.8, time += dur);
  endPlayTime2 = time + dur;
  // fade out the last boop
  gain.gain.setValueAtTime(0.15, ac.currentTime);
  gain.gain.linearRampToValueAtTime(0, endPlayTime2);

  // play it
  osc.start(ac.currentTime);
  osc.stop(endPlayTime2);
}


interface WhatWGEventListenerArgs {
  capture?: boolean;
}

interface WhatWGAddEventListenerArgs extends WhatWGEventListenerArgs {
  passive?: boolean;
  once?: boolean;
}

type WhatWGAddEventListener = (
  type: string,
  listener: (event: Event) => void,
  options?: WhatWGAddEventListenerArgs
) => void;


(async () => {
  await boot();
  tick();

  (document.addEventListener as WhatWGAddEventListener)('touchstart', onTouchStart, {passive: false});
  (document.addEventListener as WhatWGAddEventListener)('touchmove', onTouchMove, {passive: false});
  (document.addEventListener as WhatWGAddEventListener)('touchend', touchEnd);
  (document.addEventListener as WhatWGAddEventListener)('touchcancel', touchEnd);
})();
