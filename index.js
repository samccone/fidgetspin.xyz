var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function () {
        console.log('service worker is is all cool.');
    }).catch(function (e) {
        console.error('service worker is not so cool.', e);
        throw e;
    });
}
// thx https://github.com/Modernizr/Modernizr/blob/master/feature-detects/pointerevents.js
var USE_POINTER_EVENTS = !('ontouchstart' in window['__proto__']);
var velocity = 0;
var maxVelocity = 0.01;
var ac;
var domElements = {
    turns: document.getElementById('turns'),
    velocity: document.getElementById('velocity'),
    maxVelocity: document.getElementById('maxVelocity'),
    spinner: document.getElementById('spinner'),
    traceSlow: document.getElementById('trace-slow'),
    traceFast: document.getElementById('trace-fast')
};
var fidgetAlpha = 0;
var fidgetSpeed = 0;
var turnCount = 0;
function stats() {
    velocity = Math.abs(fidgetSpeed * 60 /* fps */ * 60 /* sec */) | 0;
    maxVelocity = Math.max(velocity, maxVelocity);
    turnCount += Math.abs(fidgetSpeed / 2 / Math.PI);
    var turnsText = turnCount.toLocaleString(undefined, { maximumFractionDigits: 0 });
    var maxVelText = maxVelocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
    domElements.turns.textContent = "" + turnsText;
    domElements.velocity.textContent = "" + velocity;
    domElements.maxVelocity.textContent = "" + maxVelText;
}
var spinnerPos = domElements.spinner.getBoundingClientRect();
var centerX = spinnerPos.left + spinnerPos.width / 2;
var centerY = spinnerPos.top + spinnerPos.height / 2;
var centerRadius = spinnerPos.width / 10;
//
// Spin code
//
var touchInfo = { alpha: 0, radius: 0, down: false };
var touchSpeed = 0;
var lastTouchAlpha = 0;
function getXYFromTouchOrPointer(e) {
    var x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    var y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: x - centerX, y: y - centerY };
}
function onTouchStart(e) {
    var _a = getXYFromTouchOrPointer(e), x = _a.x, y = _a.y;
    onTouchMove(e);
    touchInfo.down = true;
    touchInfo.radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    lastTouchAlpha = touchInfo.alpha;
}
function onTouchMove(e) {
    var _a = getXYFromTouchOrPointer(e), x = _a.x, y = _a.y;
    touchInfo.alpha = Math.atan2(x, y);
    e.preventDefault();
}
function touchEnd() {
    touchInfo.down = false;
    // http://www.holovaty.com/writing/ios9-web-audio/
    if (ac === undefined) {
        ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();
        var osc = ac.createOscillator();
        osc.connect(ac.destination);
        osc.start(ac.currentTime);
        osc.stop(ac.currentTime + 0.00000001);
    }
}
function tick() {
    requestAnimationFrame(function () {
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
        domElements.spinner.style.transform =
            "translateX(-50%) translateY(-50%) rotate(" + fidgetAlpha + "rad)";
        domElements.traceSlow.style.display = Math.abs(fidgetSpeed) > 0.1 ? 'block' : 'none';
        domElements.traceFast.style.display = Math.abs(fidgetSpeed) > 0.2 ? 'block' : 'none';
        stats();
        // Slow down over time
        fidgetSpeed = fidgetSpeed * 0.99;
        fidgetSpeed = Math.sign(fidgetSpeed) * Math.max(0, (Math.abs(fidgetSpeed) - 2e-4));
        var soundMagnitude = Math.abs(velocity / 2 / 60);
        if (ac && soundMagnitude) {
            spinSound(soundMagnitude);
            spinSound2(soundMagnitude);
        }
        tick();
    });
}
//
// Audio code
//
var endPlayTime = -1;
var endPlayTime2 = -1;
;
function generateRange(args) {
    return function (x) {
        var outputRange = args.outputCeil - args.outputFloor;
        var inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
        return args.outputFloor + (inputPct * outputRange);
    };
}
var freqRange400_2000 = generateRange({
    inputMin: 0,
    inputMax: 80,
    outputFloor: 400,
    outputCeil: 2000
});
var freqRange300_1500 = generateRange({
    inputMin: 0,
    inputMax: 80,
    outputFloor: 300,
    outputCeil: 1500
});
var easeOutQuad = function (t) { return t * (2 - t); };
// assume magnitude is between 0 and 1, though it can be a tad higher
function spinSound(magnitude) {
    // automation start time
    var time = ac.currentTime;
    var freqMagnitude = magnitude;
    magnitude = Math.min(1, magnitude / 10);
    var x = (easeOutQuad(magnitude) * 1.1) - (0.6 - (0.6 * easeOutQuad(magnitude)));
    if (time + x - easeOutQuad(magnitude) < endPlayTime) {
        return;
    }
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    // enforce range
    magnitude = Math.min(1, Math.max(0, magnitude));
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(ac.destination);
    // max of 40 boops
    //const count = 6 + ( 1 * magnitude );
    // decay constant for frequency between each boop
    //const decay = 0.97;
    // starting frequency (min of 400, max of 900)
    var freq = freqRange400_2000(freqMagnitude);
    // boop duration (longer for lower magnitude)
    var dur = 0.1 * (1 - magnitude / 2);
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.8, time += dur);
    endPlayTime = time + dur;
    // fade out the last boop
    gain.gain.setValueAtTime(0.1, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, endPlayTime);
    // play it
    osc.start(ac.currentTime);
    osc.stop(endPlayTime);
}
function spinSound2(magnitude) {
    // automation start time
    var time = ac.currentTime;
    var freqMagnitude = magnitude;
    magnitude = Math.min(1, magnitude / 10);
    var x = (easeOutQuad(magnitude) * 1.1) - (0.3 - (0.3 * easeOutQuad(magnitude)));
    if (time + x - easeOutQuad(magnitude) < endPlayTime2) {
        return;
    }
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    // enforce range
    magnitude = Math.min(1, Math.max(0, magnitude));
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ac.destination);
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
(function () { return __awaiter(_this, void 0, void 0, function () {
    var listenFor;
    return __generator(this, function (_a) {
        tick();
        listenFor = document.addEventListener;
        listenFor(USE_POINTER_EVENTS ? 'pointerdown' : 'touchstart', onTouchStart, { passive: false });
        listenFor(USE_POINTER_EVENTS ? 'pointermove' : 'touchmove', onTouchMove, { passive: false });
        listenFor(USE_POINTER_EVENTS ? 'pointerup' : 'touchend', touchEnd);
        listenFor(USE_POINTER_EVENTS ? 'pointercancel' : 'touchcancel', touchEnd);
        return [2 /*return*/];
    });
}); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQW1SQTtBQW5SQSxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELDBGQUEwRjtBQUMxRixJQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxjQUFjLElBQUssTUFBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFFN0UsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztBQUV2QixJQUFJLEVBQWlCLENBQUM7QUFFdEIsSUFBTSxXQUFXLEdBQUc7SUFDbEIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFFO0lBQ3hDLFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBRTtJQUM5QyxXQUFXLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUU7SUFDcEQsT0FBTyxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFFO0lBQzVDLFNBQVMsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBRTtJQUNqRCxTQUFTLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZ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