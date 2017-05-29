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
    navigator.serviceWorker.register('/sw.js').then(function () {
        console.log('service worker is is all cool.');
    }).catch(function (e) {
        console.error('service worker is not so cool.', e);
        throw e;
    });
}
var maxVelocity = 0;
var img = new Image;
var ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();
var canvas = document.querySelector('canvas');
var velocity = { r: 0, rotationVelocity: 0, maxVelocity: 10 };
var statsElems = {
    turns: document.querySelector('#turns'),
    velocity: document.querySelector('#velocity'),
    maxVelocity: document.querySelector('#maxVelocity')
};
;
var imgDimensions = { width: 300, height: 300 };
var touchInfo = { samples: [] };
var dPR = window.devicePixelRatio;
var timeRemaining = 5000;
var lastTouchEnd;
var lastTouchVelocity;
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
function paint() {
    canvas.style.transform = "translateY(-50%) rotate(" + velocity.r + "rad)";
    if (!drewImage) {
        ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
        drewImage = true;
    }
}
function stats() {
    var vel = Math.abs(velocity.rotationVelocity * 100);
    maxVelocity = Math.max(vel, maxVelocity);
    var velocityText = vel.toLocaleString(undefined, { maximumFractionDigits: 1 });
    var turnsText = Math.abs(velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 0 });
    var maxVelText = maxVelocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
    statsElems.turns.textContent = "" + turnsText;
    statsElems.velocity.textContent = "" + velocityText;
    statsElems.maxVelocity.textContent = "" + maxVelText;
}
var easeOutQuad = function (t) { return t * (2 - t); };
function tick() {
    requestAnimationFrame(function () {
        velocity.r += velocity.rotationVelocity;
        if (lastTouchEnd) {
            var timeSinceLastTouch = Date.now() - lastTouchEnd;
            var timeLeftPct = timeSinceLastTouch / timeRemaining;
            if (timeLeftPct < 1) {
                var newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
                velocity.rotationVelocity = newVelocity;
                var soundMagnitude = Math.abs(newVelocity / velocity.maxVelocity * 200);
                spinSound(soundMagnitude);
                spinSound2(soundMagnitude);
            }
        }
        paint();
        stats();
        tick();
    });
}
function onTouchStart(e) {
    touchInfo.startX = e.touches[0].clientX;
    touchInfo.startY = e.touches[0].clientX;
    touchInfo.lastTimestamp = e.timeStamp;
}
function onTouchMove(e) {
    touchInfo.lastX = e.touches[0].clientX;
    touchInfo.lastY = e.touches[0].clientY;
    touchInfo.samples.push({
        xDistance: touchInfo.lastX - touchInfo.startX,
        duration: e.timeStamp - touchInfo.lastTimestamp
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
function updateVelocity(samples) {
    var multiplier = 25;
    var totalDistance = samples.reduce(function (total, curr) { return total += curr.xDistance; }, 0);
    var totalDuration = samples.reduce(function (total, curr) { return total += curr.duration; }, 0);
    var touchSpeed = totalDistance / totalDuration / multiplier;
    if (!Number.isFinite(touchSpeed))
        return;
    if (Math.abs(velocity.rotationVelocity) < velocity.maxVelocity) {
        velocity.rotationVelocity -= touchSpeed;
    }
    resetLastTouch();
}
function resetLastTouch() {
    lastTouchEnd = Date.now();
    lastTouchVelocity = velocity.rotationVelocity;
}
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
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, boot()];
            case 1:
                _a.sent();
                tick();
                document.addEventListener('touchstart', onTouchStart);
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', touchEnd);
                document.addEventListener('touchcancel', touchEnd);
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQW1SQTtBQW5SQSxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQztBQUN0QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxrQkFBa0IsS0FBSyxXQUFXLEdBQUcsa0JBQWtCLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUVqRyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztBQUNyRSxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUVoRSxJQUFNLFVBQVUsR0FBRztJQUNqQixLQUFLLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUU7SUFDeEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFFO0lBQzlDLFdBQVcsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMs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