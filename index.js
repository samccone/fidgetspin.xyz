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
define("range", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ;
    function generateRange(args) {
        return function (x) {
            var outputRange = args.outputCeil - args.outputFloor;
            var inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
            return args.outputFloor + (inputPct * outputRange);
        };
    }
    exports.generateRange = generateRange;
    function testRange() {
        var range0to10 = generateRange({
            inputMin: 0,
            inputMax: 10,
            outputFloor: 0,
            outputCeil: 10
        });
        console.assert(range0to10(5) === 5);
        console.assert(range0to10(0) === 0);
        console.assert(range0to10(10) === 10);
        var range5to15 = generateRange({
            inputMin: 0,
            inputMax: 1,
            outputFloor: 5,
            outputCeil: 15
        });
        console.assert(range5to15(.5) === 10);
        console.assert(range5to15(0) === 5);
        console.assert(range5to15(1) === 15);
        var range5to15_taking10to20 = generateRange({
            inputMin: 10,
            inputMax: 20,
            outputFloor: 5,
            outputCeil: 15
        });
        console.assert(range5to15_taking10to20(15) === 10);
        console.assert(range5to15_taking10to20(10) === 5);
        console.assert(range5to15_taking10to20(20) === 15);
        console.log('pass!');
    }
});
define("index", ["require", "exports", "range"], function (require, exports, range_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
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
    var freqRange400_2000 = range_1.generateRange({
        inputMin: 0,
        inputMax: 80,
        outputFloor: 400,
        outputCeil: 2000
    });
    var freqRange300_1500 = range_1.generateRange({
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYW5nZS50cyIsImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBS0MsQ0FBQztJQUVGLHVCQUE4QixJQUFlO1FBQzVDLE1BQU0sQ0FBQyxVQUFVLENBQVM7WUFDekIsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ3ZELElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQTtJQUNILENBQUM7SUFORCxzQ0FNQztJQUVEO1FBQ0MsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO1lBQ2hDLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsQ0FBQztZQUNkLFVBQVUsRUFBRSxFQUFFO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFdEMsSUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDO1lBQ2hDLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxFQUFFLENBQUM7WUFDWCxXQUFXLEVBQUUsQ0FBQztZQUNkLFVBQVUs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