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
const friction = -0.001;
const imgDimensions = { width: 200, height: 200 };
const touchInfo = { rateSamples: 0 };
const dPR = window.devicePixelRatio;
canvas.height = imgDimensions.height * dPR;
canvas.width = imgDimensions.width * dPR;
canvas.style.width = `${imgDimensions.width}px`;
canvas.style.height = `${imgDimensions.height}px`;
const ctx = canvas.getContext('2d');
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
    ctx.translate(-100 * dPR, -100 * dPR);
    ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
    ctx.restore();
}
function tick() {
    requestAnimationFrame(() => {
        velocity.r += velocity.rotationVelocity;
        if (velocity.rotationVelocity > friction && velocity.rotationVelocity > 0) {
            velocity.rotationVelocity += friction;
        }
        if (velocity.rotationVelocity < friction && velocity.rotationVelocity < 0) {
            velocity.rotationVelocity -= friction;
        }
        paint();
        tick();
    });
}
function onTouchStart(e) {
    touchInfo.startX = e.touches[0].clientX;
    touchInfo.startY = e.touches[0].clientX;
}
function onTouchMove(e) {
    touchInfo.lastX = e.touches[0].clientX;
    touchInfo.lastY = e.touches[0].clientY;
    touchInfo.rateSamples++;
}
function touchEnd() {
    if (touchInfo.lastX !== undefined && touchInfo.lastY !== undefined) {
        let touchSpeed = ((touchInfo.lastX - touchInfo.startX) / window.innerWidth) / touchInfo.rateSamples;
        if (velocity.rotationVelocity < velocity.maxVelocity) {
            velocity.rotationVelocity -= touchSpeed;
        }
    }
    touchInfo.lastX = undefined;
    touchInfo.lastY = undefined;
    touchInfo.rateSamples = 0;
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield boot();
    tick();
    document.body.addEventListener('touchstart', onTouchStart);
    document.body.addEventListener('touchmove', onTouchMove);
    document.body.addEventListener('touchend', touchEnd);
    document.body.addEventListener('touchcancel', touchEnd);
}))();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDO0FBQ3RCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0FBQ3JFLE1BQU0sUUFBUSxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBQy9ELE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDO0FBRXhCLE1BQU0sYUFBYSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUM7QUFDaEQsTUFBTSxTQUFTLEdBTVgsRUFBQyxXQUFXLEVBQUUsQ0FBQyxFQUFDLENBQUM7QUFFckIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBRXBDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDM0MsTUFBTSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztBQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLGFBQWEsQ0FBQyxLQUFLLElBQUksQ0FBQztBQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQyxNQUFNLElBQUksQ0FBQztBQUVsRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFDO0FBRXJDOztRQUNFLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUc7WUFDckIsR0FBRyxDQUFDLE1BQU0sR0FBRztnQkFDWCxHQUFHLEVBQUUsQ0FBQztZQUNSLENBQUMsQ0FBQTtZQUVE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