var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const img = new Image;
const canvas = document.querySelector('canvas');
const velocity = { r: 0, rotationVelocity: 0, maxVelocity: 100 };
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
const fontHeight = 20;
ctx.font = `${fontHeight * dPR}px 'Roboto'`;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(dPR * imgDimensions.width / 2, dPR * imgDimensions.height / 2);
    ctx.rotate(velocity.r);
    ctx.translate(-150 * dPR, -150 * dPR);
    ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
    ctx.restore();
    const velocityText = Math.abs(velocity.rotationVelocity * 100).toLocaleString(undefined, { maximumFractionDigits: 2 });
    const turnsText = (velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 1 });
    ctx.fillText(`turns: ${turnsText}`, 0, fontHeight);
    ctx.fillText(`velocity: ${velocityText}`, 0, canvas.height * dPR - fontHeight);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDO0FBQ3RCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0FBQ3JFLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBS2hFLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2xELE1BQU0sU0FBUyxHQU9YLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBRXBCLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUNwQyxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDekIsSUFBSSxZQUFvQixDQUFDO0FBQ3pCLElBQUksaUJBQXlCLENBQUM7QUFFOUIsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUMzQyxNQUFNLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsYUFBYSxDQUFDLEtBQUssSUFBSSxDQUFDO0FBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBRWxELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7QUFDckMsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxV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