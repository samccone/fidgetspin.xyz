var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function () {
        console.log('service worker is is all cool.');
    }).catch(function (e) {
        console.error('service worker is not so cool.', e);
        throw e;
    });
}
const img = new Image;
const canvas = document.querySelector('canvas');
const velocity = { r: 0, rotationVelocity: 0, maxVelocity: 100 };
const statsElems = {
    turns: document.querySelector('#turns'),
    velocity: document.querySelector('#velocity')
};
;
const imgDimensions = { width: 300, height: 300 };
const touchInfo = { samples: [] };
const dPR = window.devicePixelRatio;
let timeRemaining = 5000;
let lastTouchEnd;
let lastTouchVelocity;
canvas.height = imgDimensions.height * dPR;
canvas.width = imgDimensions.width * dPR;
canvas.style.width = `${imgDimensions.width}px`;
canvas.style.height = `${imgDimensions.height}px`;
const ctx = canvas.getContext('2d');
const fontHeight = 20 * dPR;
ctx.font = `${fontHeight}px 'Roboto'`;
let drewImage = false;
function boot() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => {
            img.onload = function () {
                res();
            };
            img.src = 'spinner.svg';
        });
    });
}
function paint() {
    canvas.style.transform = `rotate(${velocity.r}rad)`;
    if (!drewImage) {
        ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
        drewImage = true;
    }
}
function stats() {
    const velocityText = Math.abs(velocity.rotationVelocity * 100).toLocaleString(undefined, { maximumFractionDigits: 1 });
    const turnsText = (velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 1 });
    statsElems.turns.textContent = `turns: ${turnsText}`;
    statsElems.velocity.textContent = `velocity: ${velocityText}`;
}
const easeOutQuad = (t) => t * (2 - t);
function tick() {
    requestAnimationFrame(() => {
        velocity.r += velocity.rotationVelocity;
        if (lastTouchEnd) {
            const timeSinceLastTouch = Date.now() - lastTouchEnd;
            const timeLeftPct = timeSinceLastTouch / timeRemaining;
            if (timeLeftPct < 1) {
                const newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
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
    const multiplier = 25;
    const totalDistance = samples.reduce((total, curr) => total += curr.xDistance, 0);
    const totalDuration = samples.reduce((total, curr) => total += curr.duration, 0);
    const touchSpeed = totalDistance / totalDuration / multiplier;
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
(() => __awaiter(this, void 0, void 0, function* () {
    yield boot();
    tick();
    document.body.addEventListener('touchstart', onTouchStart);
    document.body.addEventListener('touchmove', onTouchMove);
    document.body.addEventListener('touchend', touchEnd);
    document.body.addEventListener('touchcancel', touchEnd);
}))();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLEVBQUUsQ0FBQyxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLFNBQVMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsQ0FBQztRQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxDQUFDO0lBQ1YsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUM7QUFDdEIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQXNCLENBQUM7QUFDckUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFFakUsTUFBTSxVQUFVLEdBQUc7SUFDakIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFFO0lBQ3hDLFFBQVEsRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBRTtDQUMvQyxDQUFDO0FBS0QsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbEQsTUFBTSxTQUFTLEdBT1gsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFFcEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBQ3BDLElBQUksYUFBYSxH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