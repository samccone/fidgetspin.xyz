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
var velocity = { r: 0, rotationVelocity: 0, maxVelocity: 100 };
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
    var turnsText = Math.abs(velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 1 });
    var maxVelText = maxVelocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
    statsElems.turns.textContent = "" + parseInt(turnsText, 10);
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
                spinSound(Math.min(1, Math.abs(newVelocity / velocity.maxVelocity * 200)));
                spinSound2(Math.min(1, Math.abs(newVelocity / velocity.maxVelocity * 200)));
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
// assume magnitude is between 0 and 1
function spinSound(magnitude) {
    // automation start time
    var time = ac.currentTime;
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
    var freq = 400 + (400 * magnitude);
    // boop duration (longer for lower magnitude)
    var dur = 0.1 * (1 - magnitude / 2);
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.8, time += dur);
    endPlayTime = time + dur;
    // fade out the last boop
    gain.gain.setValueAtTime(0.2, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0, endPlayTime);
    // play it
    osc.start(ac.currentTime);
    osc.stop(endPlayTime);
}
function spinSound2(magnitude) {
    // automation start time
    var time = ac.currentTime;
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
    var freq = 300 + (300 * magnitude);
    // boop duration (longer for lower magnitude)
    var dur = 0.05 * (1 - magnitude / 2);
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.linearRampToValueAtTime(freq * 1.8, time += dur);
    endPlayTime2 = time + dur;
    // fade out the last boop
    gain.gain.setValueAtTime(0.3, ac.currentTime);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQXFQQTtBQXJQQSxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQztBQUN0QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxrQkFBa0IsS0FBSyxXQUFXLEdBQUcsa0JBQWtCLEdBQUcsWUFBWSxDQUFDLEVBQUUsQ0FBQztBQUVqRyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztBQUNyRSxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUVqRSxJQUFNLFVBQVUsR0FBRztJQUNqQixLQUFLLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUU7SUFDeEMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFFO0lBQzlDLFdBQVcsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBRTtDQUNyRCxDQUFDO0FBS0QsQ0FBQztBQUVGLElBQU0sYUFBYSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbEQsSUFBTSxTQUFTLEdBT1gsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFFcEIsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBQ3BDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQztBQUN6QixJQUFJLFlBQW9CLENBQUM7QUFDekIsSUFBSSxpQkFBeUIsQ0FBQztBQUU5QixNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzNDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sYUFBYSxDQUFDLEtBQUssT0FBSSxDQUFDO0FBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLGFBQWEsQ0FBQyxNQUFNLE9BQUksQ0FBQztBQUVsRCxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0FBQ3JDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUV0Qjs7O1lBQ0Usc0JBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxHQUFHO29CQUNyQixHQUFHLENBQUMsTUFBTSxHQUFHO3dCQUNYLEdBQUcsRUFBRSxDQUFDO29CQUNSLENBQUMsQ0FBQTtvQkFFRCxHQUFHLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQztnQkFDMUIsQ0FBQyxDQUFDLEVBQUM7OztDQUNKO0FBRUQ7SUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyw2QkFBMkIsUUFBUSxDQUFDLENBQUMsU0FBTSxDQUFDO0lBRXJFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNmLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsYUFBYSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNoRixTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7QUFDSCxDQUFDO0FBRUQ7SUFDRSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN0RCxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekMsSUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pGLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxFQUFFLHFCQUFxQixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekcsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBRXJGLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUcsQ0FBQztJQUM1RCxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFHLFlBQWMsQ0FBQztJQUNwRCxVQUFVLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxLQUFHLFVBQVksQ0FBQztBQUN2RCxDQUFDO0FBRUQsSUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFTLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxDQUFDO0FBRS9DO0lBQ0UscUJBQXFCLENBQUM7UUFDcEIsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFFeEMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxZQUFZLENBQUM7WUFDckQsSUFBTSxXQUFXLEdBQUcsa0JBQWtCLEdBQUcsYUFBYSxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFNLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUN2RixRQUFRLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO2dCQUN4QyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RSxDQUFDO1FBQ0gsQ0FBQztRQUVELEtBQUssRUFBRSxDQUFDO1FBQ1IsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELHNCQUFzQixDQUFhO0lBQ2pDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDeEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUN4QyxTQUFTLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDeEMsQ0FBQztBQUVELHFCQUFxQixDQUFhO0lBQ2hDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDdkMsU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUV2QyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNyQixTQUFTLEVBQUUsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTztRQUM5QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBYztLQUNqRCxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsU0FBUyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUNuQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDbkMsU0FBUyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDO0FBQ3hDLENBQUM7QUFFRDtJQUNFLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsU0FBUyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDekIsQ0FBQztBQUdELHdCQUF3QixPQUFpQjtJQUN2QyxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFFdEIsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxJQUFJLElBQUssT0FBQSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBdkIsQ0FBdUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsRixJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLElBQUksSUFBSyxPQUFBLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxFQUF0QixDQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLElBQU0sVUFBVSxHQUFHLGFBQWEsR0FBRyxhQUFhLEdBQUcsVUFBVSxDQUFDO0lBRTlELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQztJQUV6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQy9ELFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxVQUFVLENBQUM7SUFDMUMsQ0FBQztJQUVELGNBQWMsRUFBRSxDQUFDO0FBQ25CLENBQUM7QUFFRDtJQUNFLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUIsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDO0FBQ2hELENBQUM7QUFHRCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV0QixzQ0FBc0M7QUFDdEMsbUJBQW9CLFNBQWlCO0lBQ25DLHdCQUF3QjtJQUN4QixJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFL0UsRUFBRSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUM7SUFDWCxDQUFDO0lBRUQsSUFBTSxHQUFHLEdBQUksRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDbkMsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRTdCLGdCQUFnQjtJQUNoQixTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDLEVBQUUsU0FBUyxDQUFFLENBQUUsQ0FBQztJQUVwRCxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztJQUN0QixHQUFHLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBRSxDQUFDO0lBRS9CLGtCQUFrQjtJQUNsQixzQ0FBc0M7SUFDdEMsaURBQWlEO0lBQ2pELHFCQUFxQjtJQUVyQiw4Q0FBOEM7SUFDOUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBRSxDQUFDO0lBQ3JDLDZDQUE2QztJQUM3QyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBRSxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBRSxDQUFDO0lBRXRDLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFFLElBQUksRUFBRSxJQUFJLENBQUUsQ0FBQztJQUMzQyxHQUFHLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBRSxDQUFDO0lBQ2pFLFdBQVcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBRXpCLHlCQUF5QjtJQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBRSxDQUFDO0lBRXBELFVBQVU7SUFDVixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRCxvQkFBcUIsU0FBaUI7SUFDcEMsd0JBQXdCO0lBQ3hCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7SUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQztJQUNYLENBQUM7SUFFRCxJQUFNLEdBQUcsR0FBSSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUNuQyxJQUFNLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFN0IsZ0JBQWdCO0lBQ2hCLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUMsRUFBRSxTQUFTLENBQUUsQ0FBRSxDQUFDO0lBRXBELEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxPQUFPLENBQUUsSUFBSSxDQUFFLENBQUM7SUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBRSxFQUFFLENBQUMsV0FBVyxDQUFFLENBQUM7SUFFL0IsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQ25DLDZDQUE2QztJQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxHQUFHLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQy9ELFlBQVksR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQzFCLHlCQUF5QjtJQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBRW5ELFVBQVU7SUFDVixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFDRCxDQUFDOzs7b0JBQ0MscUJBQU0sSUFBSSxFQUFFLEVBQUE7O2dCQUFaLFNBQVksQ0FBQztnQkFDYixJQUFJLEVBQUUsQ0FBQztnQkFFUCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUN0RCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUNwRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDOzs7O0tBQ3BELENBQUMsRUFBRSxDQUFDIn0=