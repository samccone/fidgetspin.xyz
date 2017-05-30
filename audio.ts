import { generateRange } from './range';

export const easeOutQuad = (t: number) => t * (2 - t);

const ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();
let endPlayTime = -1;
let endPlayTime2 = -1;

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
export function spinSound( magnitude: number ) {
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

export function spinSound2( magnitude: number ) {
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
