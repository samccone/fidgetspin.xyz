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
System.register("range", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function generateRange(args) {
        return function (x) {
            var outputRange = args.outputCeil - args.outputFloor;
            var inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
            return args.outputFloor + (inputPct * outputRange);
        };
    }
    exports_1("generateRange", generateRange);
    return {
        setters: [],
        execute: function () {
            ;
        }
    };
});
System.register("index", ["audio"], function (exports_2, context_2) {
    "use strict";
    _this = this;
    var __moduleName = context_2 && context_2.id;
    function boot() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (res) {
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
                    audio_1.spinSound(soundMagnitude);
                    audio_1.spinSound2(soundMagnitude);
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
    var _this, audio_1, maxVelocity, img, canvas, velocity, statsElems, imgDimensions, touchInfo, dPR, timeRemaining, lastTouchEnd, lastTouchVelocity, ctx, drewImage, easeOutQuad;
    return {
        setters: [
            function (audio_1_1) {
                audio_1 = audio_1_1;
            }
        ],
        execute: function () {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(function () {
                    console.log('service worker is is all cool.');
                }).catch(function (e) {
                    console.error('service worker is not so cool.', e);
                    throw e;
                });
            }
            maxVelocity = 0;
            img = new Image;
            canvas = document.querySelector('canvas');
            velocity = { r: 0, rotationVelocity: 0, maxVelocity: 10 };
            statsElems = {
                turns: document.querySelector('#turns'),
                velocity: document.querySelector('#velocity'),
                maxVelocity: document.querySelector('#maxVelocity')
            };
            ;
            imgDimensions = { width: 300, height: 300 };
            touchInfo = { samples: [] };
            dPR = window.devicePixelRatio;
            timeRemaining = 5000;
            canvas.height = imgDimensions.height * dPR;
            canvas.width = imgDimensions.width * dPR;
            canvas.style.width = imgDimensions.width + "px";
            canvas.style.height = imgDimensions.height + "px";
            ctx = canvas.getContext('2d');
            drewImage = false;
            exports_2("easeOutQuad", easeOutQuad = function (t) { return t * (2 - t); });
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, boot()];
                        case 1:
                            _a.sent();
                            tick();
                            document.addEventListener('touchstart', onTouchStart);
                            document.addEventListener('touchmove', onTouchMove);
                            document.addEventListener('touchend', touchEnd);
                            document.addEventListener('touchcancel', touchEnd);
                            return [2];
                    }
                });
            }); })();
        }
    };
});
System.register("audio", ["range", "index"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function spinSound(magnitude) {
        var time = ac.currentTime;
        var freqMagnitude = magnitude;
        magnitude = Math.min(1, magnitude / 10);
        var x = (index_1.easeOutQuad(magnitude) * 1.1) - (0.6 - (0.6 * index_1.easeOutQuad(magnitude)));
        if (time + x - index_1.easeOutQuad(magnitude) < endPlayTime) {
            return;
        }
        var osc = ac.createOscillator();
        var gain = ac.createGain();
        magnitude = Math.min(1, Math.max(0, magnitude));
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ac.destination);
        var freq = freqRange400_2000(freqMagnitude);
        var dur = 0.1 * (1 - magnitude / 2);
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.linearRampToValueAtTime(freq * 1.8, time += dur);
        endPlayTime = time + dur;
        gain.gain.setValueAtTime(0.1, ac.currentTime);
        gain.gain.linearRampToValueAtTime(0, endPlayTime);
        osc.start(ac.currentTime);
        osc.stop(endPlayTime);
    }
    exports_3("spinSound", spinSound);
    function spinSound2(magnitude) {
        var time = ac.currentTime;
        var freqMagnitude = magnitude;
        magnitude = Math.min(1, magnitude / 10);
        var x = (index_1.easeOutQuad(magnitude) * 1.1) - (0.3 - (0.3 * index_1.easeOutQuad(magnitude)));
        if (time + x - index_1.easeOutQuad(magnitude) < endPlayTime2) {
            return;
        }
        var osc = ac.createOscillator();
        var gain = ac.createGain();
        magnitude = Math.min(1, Math.max(0, magnitude));
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ac.destination);
        var freq = freqRange300_1500(freqMagnitude);
        var dur = 0.05 * (1 - magnitude / 2);
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.linearRampToValueAtTime(freq * 1.8, time += dur);
        endPlayTime2 = time + dur;
        gain.gain.setValueAtTime(0.15, ac.currentTime);
        gain.gain.linearRampToValueAtTime(0, endPlayTime2);
        osc.start(ac.currentTime);
        osc.stop(endPlayTime2);
    }
    exports_3("spinSound2", spinSound2);
    var range_1, index_1, ac, endPlayTime, endPlayTime2, freqRange400_2000, freqRange300_1500;
    return {
        setters: [
            function (range_1_1) {
                range_1 = range_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            ac = new (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : AudioContext)();
            endPlayTime = -1;
            endPlayTime2 = -1;
            freqRange400_2000 = range_1.generateRange({
                inputMin: 0,
                inputMax: 80,
                outputFloor: 400,
                outputCeil: 2000
            });
            freqRange300_1500 = range_1.generateRange({
                inputMin: 0,
                inputMax: 80,
                outputFloor: 300,
                outputCeil: 1500
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYW5nZS50cyIsImluZGV4LnRzIiwiYXVkaW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFPQSx1QkFBOEIsSUFBZTtRQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFTO1lBQ3pCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN2RCxJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUE7SUFDSCxDQUFDOzs7OztZQVJBLENBQUM7UUE4Q0YsQ0FBQzs7Ozs7OztJQ0FEOzs7Z0JBQ0UsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLEdBQUc7d0JBQ3JCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7NEJBQ1gsR0FBRyxFQUFFLENBQUM7d0JBQ1IsQ0FBQyxDQUFBO3dCQUVELEdBQUcsQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDO29CQUMxQixDQUFDLENBQUMsRUFBQzs7O0tBQ0o7SUFFRDtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLDZCQUEyQixRQUFRLENBQUMsQ0FBQyxTQUFNLENBQUM7UUFFckUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFD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