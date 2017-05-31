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
var slowDownDuration = 5000;
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
            var timeLeftPct = timeSinceLastTouch / slowDownDuration;
            if (timeSinceLastTouch < slowDownDuration) {
                var newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
                velocity.rotationVelocity = newVelocity;
                var soundMagnitude = Math.abs(newVelocity / velocity.maxVelocity * 200);
                spinSound(soundMagnitude);
                spinSound2(soundMagnitude);
            }
            else {
                velocity.rotationVelocity = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQXFSQTtBQXJSQSxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQztBQUN0QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxrQkFBa0IsS0FBSyxXQUFXLEdBQUcsa0JBQWtCLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUVqRyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztBQUNyRSxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsQ0FBQztBQUVoRSxJQUFNLFVBQVUsR0FBRztJQUNqQixLQUFLLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUU7SUFDeEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFFO0lBQzlDLFdBQVcsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMs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