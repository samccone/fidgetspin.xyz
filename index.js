var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
    navigator.serviceWorker.register('/sw.js').then(function () {
        console.log('service worker is is all cool.');
    }).catch(function (e) {
        console.error('service worker is not so cool.', e);
        throw e;
    });
}
var velocity = 0;
var maxVelocity = 0.01;
var img = new Image;
var ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();
var canvas = document.querySelector('canvas');
// thx https://github.com/Modernizr/Modernizr/blob/master/feature-detects/pointerevents.js
var hasPointerEvts = 'onpointerdown' in document.createElement('div');
var statsElems = {
    turns: document.querySelector('#turns'),
    velocity: document.querySelector('#velocity'),
    maxVelocity: document.querySelector('#maxVelocity')
};
var imgDimensions = { width: 300, height: 300 };
var dPR = window.devicePixelRatio;
canvas.height = imgDimensions.height * dPR;
canvas.width = imgDimensions.width * dPR;
canvas.style.width = imgDimensions.width + "px";
canvas.style.height = imgDimensions.height + "px";
var ctx = canvas.getContext('2d');
var drewImage = false;
function boot() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res) {
                    img.onload = function () {
                        res();
                    };
                    img.src = 'spinner.svg';
                })];
        });
    });
}
var fidgetAlpha = 0;
var fidgetSpeed = 0;
var turnCount = 0;
function paint() {
    canvas.style.transform = "translateX(-50%) translateY(-50%) rotate(" + fidgetAlpha + "rad)";
    if (!drewImage) {
        ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
        drewImage = true;
    }
}
function stats() {
    velocity = Math.abs(fidgetSpeed * 60);
    maxVelocity = Math.max(velocity, maxVelocity);
    var velocityText = velocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
    turnCount += Math.abs(fidgetSpeed / 2 / Math.PI);
    var turnsText = turnCount.toLocaleString(undefined, { maximumFractionDigits: 0 });
    var maxVelText = maxVelocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
    statsElems.turns.textContent = "" + turnsText;
    statsElems.velocity.textContent = "" + velocityText;
    statsElems.maxVelocity.textContent = "" + maxVelText;
}
var canvasPos = canvas.getBoundingClientRect();
var centerX = canvasPos.left + canvasPos.width / 2;
var centerY = canvasPos.top + canvasPos.height / 2;
//
// Spin code
//
function getPrimaryTouch(e) {
    if (hasPointerEvts && !e.isPrimary)
        return false;
    if (!hasPointerEvts)
        e = e.touches[0];
    return true;
}
var touchInfo = { alpha: 0, down: false };
var touchSpeed = 0;
var lastTouchAlpha = 0;
function onTouchStart(e) {
    if (!getPrimaryTouch(e))
        return;
    touchInfo.alpha = Math.atan2(e.clientX - centerX, e.clientY - centerY);
    lastTouchAlpha = touchInfo.alpha;
    touchInfo.down = true;
    e.preventDefault();
}
function onTouchMove(e) {
    if (!getPrimaryTouch(e))
        return;
    touchInfo.alpha = Math.atan2(e.clientX - centerX, e.clientY - centerY);
    e.preventDefault();
}
function touchEnd() {
    touchInfo.down = false;
}
var friction = 0.1;
function tick() {
    requestAnimationFrame(function () {
        if (touchInfo.down) {
            touchSpeed = touchInfo.alpha - lastTouchAlpha;
            if (touchSpeed < -Math.PI)
                touchSpeed += 2 * Math.PI;
            if (touchSpeed > Math.PI)
                touchSpeed -= 2 * Math.PI;
            // Apply friction
            var boost = 1 + 10 * Math.min(1, Math.abs(fidgetSpeed));
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
        var soundMagnitude = Math.abs(velocity / 2);
        if (soundMagnitude) {
            spinSound(soundMagnitude);
            spinSound2(soundMagnitude);
        }
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
    var documentaddEventListener;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, boot()];
            case 1:
                _a.sent();
                tick();
                documentaddEventListener = document.addEventListener.bind(document);
                documentaddEventListener(hasPointerEvts ? 'pointerdown' : 'touchstart', onTouchStart, { passive: false });
                documentaddEventListener(hasPointerEvts ? 'pointermove' : 'touchmove', onTouchMove, { passive: false });
                documentaddEventListener(hasPointerEvts ? 'pointerup' : 'touchend', touchEnd);
                documentaddEventListener(hasPointerEvts ? 'pointercancel' : 'touchcancel', touchEnd);
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQWtTQTtBQWxTQSxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNqQixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFFdkIsSUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUM7QUFDdEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sa0JBQWtCLEtBQUssV0FBVyxHQUFHLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxFQUFFLENBQUM7QUFFakcsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQXNCLENBQUM7QUFFckUsMEZBQTBGO0FBQzFGLElBQU0sY0FBYyxHQUFHLGVBQWUsSUFBSSxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXhFLElBQU0sVUFBVSxHQUFHO0lBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBRTtJQUN4QyxRQUFRLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUU7SUFDOUMsV0FBVyxFQUFFLFFBQVEsQ0FB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