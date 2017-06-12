goog.module('index'); exports = {}; var module = {id: 'index.js'};/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./sw.js')
        .then(function () {
        console.log('service worker is all cool.');
    })
        .catch(function (e) {
        console.error('service worker is not so cool.', e);
        throw e;
    });
    if (navigator.serviceWorker.controller) {
        // Correctly prompt the user to reload during SW phase change.
        navigator.serviceWorker.controller.onstatechange = e => {
            if (((e.target)).state === 'redundant') {
                ((((document.querySelector('#reload-prompt'))))).classList.remove('hidden');
            }
        };
    }
}
// thx https://github.com/Modernizr/Modernizr/blob/master/feature-detects/pointerevents.js
const /** @type {?} */ USE_POINTER_EVENTS = 'onpointerdown' in document.createElement('div');
let /** @type {?} */ velocity = 0;
const /** @type {?} */ ac = new (typeof webkitAudioContext !== 'undefined'
    ? webkitAudioContext
    : AudioContext)();
const /** @type {?} */ masterVolume = ac.createGain();
masterVolume.connect(ac.destination);
const /** @type {?} */ appState = {
    pickerOpen: false,
    spinner: window.localStorage.getItem('fidget_spinner') ||
        './assets/spinners/base.png',
    muted: window.localStorage.getItem('fidget_muted') === 'true' ? true : false,
    spins: window.localStorage.getItem('fidget_spins')
        ? parseInt(/** @type {?} */ ((window.localStorage.getItem('fidget_spins'))), 10)
        : 0,
    maxVelocity: window.localStorage.getItem('fidget_max_velocity')
        ? parseInt(/** @type {?} */ ((window.localStorage.getItem('fidget_max_velocity'))), 10)
        : 0
};
const /** @type {?} */ spinners = [
    {
        path: './assets/spinners/base.png',
        name: 'The Classic',
        unlockedAt: 0
    },
    {
        path: './assets/spinners/triple.png',
        name: 'The Triple',
        unlockedAt: 500
    },
    {
        path: './assets/spinners/pokeball.png',
        name: "The 'Chu",
        unlockedAt: 2000
    },
    {
        path: './assets/spinners/cube.png',
        name: 'The Cubist',
        unlockedAt: 5000
    },
    {
        path: './assets/spinners/fractal.png',
        name: 'The Fractal',
        unlockedAt: 10000
    }
];
const /** @type {?} */ domElements = {
    turns: /** @type {?} */ ((document.getElementById('turns'))),
    velocity: /** @type {?} */ ((document.getElementById('velocity'))),
    maxVelocity: /** @type {?} */ ((document.getElementById('maxVelocity'))),
    spinner: /** @type {?} */ ((document.getElementById('spinner'))),
    traceSlow: /** @type {?} */ ((document.getElementById('trace-slow'))),
    traceFast: /** @type {?} */ ((document.getElementById('trace-fast'))),
    toggleAudio: /** @type {?} */ ((document.getElementById('toggle-audio'))),
    spinners: /** @type {?} */ (Array.from(/** @type {?} */ ((document.getElementsByClassName('spinner'))))),
    pickerToggle: /** @type {?} */ ((document.getElementById('picker'))),
    pickerPane: /** @type {?} */ ((document.getElementById('spinner-picker')))
};
let /** @type {?} */ fidgetAlpha = 0;
let /** @type {?} */ fidgetSpeed = 0;
/**
 * @param {?} fn
 * @return {?}
 */
function deferWork(fn) {
    if (((typeof requestIdleCallback)) !== 'undefined') {
        requestIdleCallback(fn, { timeout: 60 });
    }
    else if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(fn);
    }
    else {
        setTimeout(fn, 16.66);
    }
}
/**
 * @return {?}
 */
function stats() {
    velocity =
        Math.abs(fidgetSpeed * 60 /* fps */ * 60 /* sec */ / 2 / Math.PI) | 0;
    const /** @type {?} */ newMaxVelocity = Math.max(velocity, appState.maxVelocity);
    if (appState.maxVelocity !== newMaxVelocity) {
        deferWork(() => window.localStorage.setItem('fidget_max_velocity', `${appState.maxVelocity}`));
        appState.maxVelocity = newMaxVelocity;
    }
    appState.spins += Math.abs(fidgetSpeed / 2 / Math.PI);
    deferWork(() => window.localStorage.setItem('fidget_spins', `${appState.spins}`));
    const /** @type {?} */ turnsText = appState.spins.toLocaleString(undefined, {
        maximumFractionDigits: 0
    });
    const /** @type {?} */ maxVelText = appState.maxVelocity.toLocaleString(undefined, {
        maximumFractionDigits: 1
    });
    domElements.turns.textContent = `${turnsText}`;
    domElements.velocity.textContent = `${velocity}`;
    domElements.maxVelocity.textContent = `${maxVelText}`;
}
const /** @type {?} */ spinnerPos = domElements.spinner.getBoundingClientRect();
const /** @type {?} */ centerX = spinnerPos.left + spinnerPos.width / 2;
const /** @type {?} */ centerY = spinnerPos.top + spinnerPos.height / 2;
const /** @type {?} */ centerRadius = spinnerPos.width / 10;
//
// Spin code
//
const /** @type {?} */ touchInfo = { alpha: 0, radius: 0, down: false };
let /** @type {?} */ touchSpeed = 0;
let /** @type {?} */ lastTouchAlpha = 0;
/**
 * @param {?} e
 * @return {?}
 */
function getXYFromTouchOrPointer(e) {
    let /** @type {?} */ x = 'touches' in e
        ? ((e)).touches[0].clientX
        : ((e)).clientX;
    let /** @type {?} */ y = 'touches' in e
        ? ((e)).touches[0].clientY
        : ((e)).clientY;
    return { x: x - centerX, y: y - centerY };
}
/**
 * @param {?} e
 * @return {?}
 */
function onTouchStart(e) {
    if (appState.pickerOpen) {
        return;
    }
    let { x, y } = getXYFromTouchOrPointer(e);
    onTouchMove(e);
    touchInfo.down = true;
    touchInfo.radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    lastTouchAlpha = touchInfo.alpha;
}
/**
 * @param {?} e
 * @return {?}
 */
function onTouchMove(e) {
    if (appState.pickerOpen) {
        return;
    }
    let { x, y } = getXYFromTouchOrPointer(e);
    touchInfo.alpha = Math.atan2(x, y);
    e.preventDefault();
}
/**
 * @return {?}
 */
function touchEnd() {
    if (appState.pickerOpen) {
        return;
    }
    touchInfo.down = false;
}
/**
 * @return {?}
 */
function tick() {
    requestAnimationFrame(() => {
        if (touchInfo.down) {
            if (touchInfo.radius > centerRadius) {
                touchSpeed = touchInfo.alpha - lastTouchAlpha;
                if (touchSpeed < -Math.PI)
                    touchSpeed += 2 * Math.PI;
                if (touchSpeed > Math.PI)
                    touchSpeed -= 2 * Math.PI;
                fidgetSpeed = touchSpeed;
                lastTouchAlpha = touchInfo.alpha;
            }
        }
        else if (touchSpeed) {
            fidgetSpeed = touchSpeed * touchInfo.radius / centerRadius;
            touchSpeed = 0;
        }
        fidgetAlpha -= fidgetSpeed;
        domElements.spinner.style.transform = `rotate(${fidgetAlpha}rad)`;
        domElements.traceSlow.style.opacity = Math.abs(fidgetSpeed) > 0.2
            ? '1'
            : '0.00001';
        domElements.traceFast.style.opacity = Math.abs(fidgetSpeed) > 0.4
            ? '1'
            : '0.00001';
        stats();
        // Slow down over time
        fidgetSpeed = fidgetSpeed * 0.99;
        fidgetSpeed =
            Math.sign(fidgetSpeed) * Math.max(0, Math.abs(fidgetSpeed) - 2e-4);
        const /** @type {?} */ soundMagnitude = Math.abs(velocity * Math.PI / 60);
        if (soundMagnitude && !touchInfo.down) {
            spinSound(soundMagnitude);
            spinSound2(soundMagnitude);
        }
        tick();
    });
}
//
// Audio code
//
let /** @type {?} */ endPlayTime = -1;
let /** @type {?} */ endPlayTime2 = -1;
/**
 * @record
 */
function rangeArgs() { }
/** @type {?} */
rangeArgs.prototype.inputMin;
/** @type {?} */
rangeArgs.prototype.inputMax;
/** @type {?} */
rangeArgs.prototype.outputFloor;
/** @type {?} */
rangeArgs.prototype.outputCeil;
/**
 * @param {?} args
 * @return {?}
 */
function generateRange(args) {
    return function (x) {
        const /** @type {?} */ outputRange = args.outputCeil - args.outputFloor;
        const /** @type {?} */ inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
        return args.outputFloor + inputPct * outputRange;
    };
}
const /** @type {?} */ freqRange400_2000 = generateRange({
    inputMin: 0,
    inputMax: 80,
    outputFloor: 400,
    outputCeil: 2000
});
const /** @type {?} */ freqRange300_1500 = generateRange({
    inputMin: 0,
    inputMax: 80,
    outputFloor: 300,
    outputCeil: 1500
});
const /** @type {?} */ easeOutQuad = (t) => t * (2 - t);
/**
 * @param {?} magnitude
 * @return {?}
 */
function spinSound(magnitude) {
    // automation start time
    let /** @type {?} */ time = ac.currentTime;
    const /** @type {?} */ freqMagnitude = magnitude;
    magnitude = Math.min(1, magnitude / 10);
    let /** @type {?} */ x = easeOutQuad(magnitude) * 1.1 - (0.6 - 0.6 * easeOutQuad(magnitude));
    if (time + x - easeOutQuad(magnitude) < endPlayTime) {
        return;
    }
    const /** @type {?} */ osc = ac.createOscillator();
    const /** @type {?} */ gain = ac.createGain();
    // enforce range
    magnitude = Math.min(1, Math.max(0, magnitude));
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(masterVolume);
    // max of 40 boops
    //const count = 6 + ( 1 * magnitude );
    // decay constant for frequency between each boop
    //const decay = 0.97;
    // starting frequency (min of 400, max of 900)
    let /** @type {?} */ freq = freqRange400_2000(freqMagnitude);
    // boop duration (longer for lower magnitude)
    let /** @type {?} */ dur = 0.1 * (1 - magnitude / 2);
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.8, (time += dur));
    endPlayTime = time + dur;
    // fade out the last boop
    gain.gain.setValueAtTime(0.1, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, endPlayTime);
    // play it
    osc.start(ac.currentTime);
    osc.stop(endPlayTime);
}
/**
 * @param {?} magnitude
 * @return {?}
 */
function spinSound2(magnitude) {
    // automation start time
    let /** @type {?} */ time = ac.currentTime;
    const /** @type {?} */ freqMagnitude = magnitude;
    magnitude = Math.min(1, magnitude / 10);
    let /** @type {?} */ x = easeOutQuad(magnitude) * 1.1 - (0.3 - 0.3 * easeOutQuad(magnitude));
    if (time + x - easeOutQuad(magnitude) < endPlayTime2) {
        return;
    }
    const /** @type {?} */ osc = ac.createOscillator();
    const /** @type {?} */ gain = ac.createGain();
    // enforce range
    magnitude = Math.min(1, Math.max(0, magnitude));
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(masterVolume);
    var /** @type {?} */ freq = freqRange300_1500(freqMagnitude);
    // boop duration (longer for lower magnitude)
    var /** @type {?} */ dur = 0.05 * (1 - magnitude / 2);
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.8, (time += dur));
    endPlayTime2 = time + dur;
    // fade out the last boop
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, endPlayTime2);
    // play it
    osc.start(ac.currentTime);
    osc.stop(endPlayTime2);
}
/**
 * @return {?}
 */
function unlockAudio() {
    /**
     * @return {?}
     */
    function unlock() {
        // Create an empty buffer.
        const /** @type {?} */ source = ac.createBufferSource();
        source.buffer = ac.createBuffer(1, 1, 22050);
        source.connect(ac.destination);
        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
            ((source)).noteOn(0);
        }
        else {
            source.start(0);
        }
        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function () {
            source.disconnect(0);
            // Remove the touch start listener.
            document.removeEventListener('touchend', unlock, true);
        };
    }
    document.addEventListener('touchend', unlock, true);
}
/**
 * @param {?} muted
 * @return {?}
 */
function setMutedSideEffects(muted) {
    domElements.toggleAudio.classList.toggle('muted', muted);
    masterVolume.gain.setValueAtTime(appState.muted ? 0 : 1, ac.currentTime);
    window.localStorage.setItem('fidget_muted', `${appState.muted}`);
}
/**
 * @return {?}
 */
function togglePicker() {
    if (appState.pickerOpen !== true) {
        appState.pickerOpen = !appState.pickerOpen;
        history.pushState(appState, '', '#picker');
        showPicker();
    }
    else {
        history.back();
    }
}
/**
 * @param {?} e
 * @return {?}
 */
function toggleAudio(e) {
    appState.muted = !appState.muted;
    setMutedSideEffects(appState.muted);
    // if something is spinning, we do not want to stop it if you touch the menu.
    e.stopPropagation();
}
/**
 * @param {?} src
 * @return {?}
 */
function changeSpinner(src) {
    appState.spinner = src;
    deferWork(() => window.localStorage.setItem('fidget_spinner', src));
    for (let /** @type {?} */ s of domElements.spinners) {
        s.src = src;
    }
}
/**
 * @param {?} e
 * @return {?}
 */
function pickSpinner(e) {
    const /** @type {?} */ target = (e.target);
    if (target.tagName === 'IMG' && !target.classList.contains('locked')) {
        changeSpinner(((e.target)).src);
        togglePicker();
    }
}
/**
 * @return {?}
 */
function showPicker() {
    domElements.pickerPane.innerHTML = '';
    let /** @type {?} */ toAppend = '';
    for (let /** @type {?} */ spinner of spinners) {
        toAppend += `<li><p class="title">${spinner.name}</p>`;
        if (spinner.unlockedAt >= appState.spins) {
            toAppend += `<img width="300" height="300" class="locked" src="${spinner.path}"><p class="locked-info">Unlocks at ${spinner.unlockedAt} spins</p>`;
        }
        else {
            toAppend += `<img width="300" height="300" src="${spinner.path}">`;
        }
        toAppend += '</li>';
    }
    domElements.pickerPane.innerHTML = toAppend;
    domElements.pickerPane.classList.remove('hidden');
    domElements.pickerPane.scrollTop = 0;
}
(async () => {
    setMutedSideEffects(appState.muted);
    unlockAudio();
    tick();
    const /** @type {?} */ listenFor = (document.addEventListener);
    domElements.pickerToggle.addEventListener(USE_POINTER_EVENTS ? 'pointerdown' : 'touchstart', togglePicker);
    domElements.pickerPane.addEventListener('click', pickSpinner);
    domElements.toggleAudio.addEventListener(USE_POINTER_EVENTS ? 'pointerdown' : 'touchstart', toggleAudio);
    listenFor(USE_POINTER_EVENTS ? 'pointerdown' : 'touchstart', onTouchStart, {
        passive: false
    });
    listenFor(USE_POINTER_EVENTS ? 'pointermove' : 'touchmove', onTouchMove, {
        passive: false
    });
    listenFor(USE_POINTER_EVENTS ? 'pointerup' : 'touchend', touchEnd);
    listenFor(USE_POINTER_EVENTS ? 'pointercancel' : 'touchcancel', touchEnd);
    // Assume clean entry always.
    history.replaceState(null, '', '/');
    changeSpinner(appState.spinner);
    window.onpopstate = (e) => {
        // Assume if state is not set here picker is going to need to close.
        if (e.state === null) {
            appState.pickerOpen = false;
            domElements.pickerPane.classList.add('hidden');
            // Assume if state is set here picker is going to need to open.
        }
        else if (e.state !== null) {
            appState.pickerOpen = true;
            showPicker();
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,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