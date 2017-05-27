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
var img = new Image;
var canvas = document.querySelector('canvas');
var velocity = { r: 0, rotationVelocity: 0, maxVelocity: 100 };
var statsElems = {
    turns: document.querySelector('#turns'),
    velocity: document.querySelector('#velocity')
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
var fontHeight = 20 * dPR;
ctx.font = fontHeight + "px 'Roboto'";
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
    var velocityText = Math.abs(velocity.rotationVelocity * 100).toLocaleString(undefined, { maximumFractionDigits: 1 });
    var turnsText = (velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 1 });
    statsElems.turns.textContent = "turns: " + turnsText;
    statsElems.velocity.textContent = "velocity: " + velocityText;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlCQThKQTtBQTlKQSxFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNqQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUM7UUFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQztJQUNWLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELElBQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDO0FBQ3RCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0FBQ3JFLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBRWpFLElBQU0sVUFBVSxHQUFHO0lBQ2pCLEtBQUssRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBRTtJQUN4QyxRQUFRLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUU7Q0FDL0MsQ0FBQztBQUtELENBQUM7QUFFRixJQUFNLGFBQWEsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2xELElBQU0sU0FBUyxHQU9YLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBRXBCLElBQU0sR0FBRyxHQUFH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