if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function() {
    console.log('service worker is is all cool.');
  }).catch(function(e) {
    console.error('service worker is not so cool.', e);
    throw e;
  });
}

let velocity = 0;
let maxVelocity = 0.01;

const img = new Image;
const ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

const statsElems = {
  turns: document.querySelector('#turns')!,
  velocity: document.querySelector('#velocity')!,
  maxVelocity: document.querySelector('#maxVelocity')!
};

const imgDimensions = { width: 300, height: 300 };
const dPR = window.devicePixelRatio;

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

let fidgetAlpha = 0;
let fidgetSpeed = 0;
let turnCount = 0;

function paint() {
  canvas.style.transform = `translateX(-50%) translateY(-50%) rotate(${fidgetAlpha}rad)`;
  if (!drewImage) {
    ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
    drewImage = true;
  }
}

function stats() {
  velocity = Math.abs(fidgetSpeed * 60);
  maxVelocity = Math.max(velocity, maxVelocity);
  const velocityText = velocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
  turnCount += Math.abs(fidgetSpeed / 2 / Math.PI);
  const turnsText = turnCount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const maxVelText = maxVelocity.toLocaleString(undefined, {maximumFractionDigits: 1});

  statsElems.turns.textContent = `${turnsText}`;
  statsElems.velocity.textContent = `${velocityText}`;
  statsElems.maxVelocity.textContent = `${maxVelText}`;
}

const canvasPos = canvas.getBoundingClientRect()
const centerX = canvasPos.left + canvasPos.width / 2;
const centerY = canvasPos.top + canvasPos.height / 2;

//
// Spin code
//

const touchInfo: {
  alpha: number;
  down: boolean;
} = { alpha: 0, down: false };

let touchSpeed = 0;
let lastTouchAlpha = 0;

function onTouchStart(e: TouchEvent) {
  touchInfo.alpha = Math.atan2(e.touches[0].clientX - centerX, e.touches[0].clientY - centerY);
  lastTouchAlpha = touchInfo.alpha;
  touchInfo.down = true;
  e.preventDefault();
}

function onTouchMove(e: TouchEvent) {
  touchInfo.alpha = Math.atan2(e.touches[0].clientX - centerX, e.touches[0].clientY - centerY);
  e.preventDefault();
}

function touchEnd() {
  touchInfo.down = false;
}

const friction = 0.1;

function tick() {
  requestAnimationFrame(() => {
    if (touchInfo.down) {
       touchSpeed = touchInfo.alpha - lastTouchAlpha;
       if (touchSpeed < - Math.PI)
         touchSpeed += 2 * Math.PI;
       if (touchSpeed > Math.PI)
         touchSpeed -= 2 * Math.PI;
       // Apply friction
       const boost = 1 + 10 * Math.min(1, Math.abs(fidgetSpeed));
       fidgetSpeed = (1 - friction) * fidgetSpeed + friction * boost * touchSpeed;
       lastTouchAlpha = touchInfo.alpha;
    }
    fidgetAlpha -= fidgetSpeed;
    paint();
    stats();
    tick();

    // Slow down over time
    fidgetSpeed = fidgetSpeed * 0.99;
    fidgetSpeed = Math.sign(fidgetSpeed) * Math.max(0, (Math.abs(fidgetSpeed) - 2e-4));

    const soundMagnitude = Math.abs(velocity / 2);
    if (soundMagnitude) {
      spinSound(soundMagnitude);
      spinSound2(soundMagnitude);
    }
  });
}


//
// Audio code
//

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

const easeOutQuad = (t: number) => t * (2 - t);

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
