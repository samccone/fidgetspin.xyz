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
const imgDimensions = { width: 210, height: 220 };
const touchInfo = { rateSamples: 0 };
canvas.height = imgDimensions.height * window.devicePixelRatio;
canvas.width = imgDimensions.width * window.devicePixelRatio;
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
    ctx.translate(window.devicePixelRatio * imgDimensions.width / 2, window.devicePixelRatio * imgDimensions.height / 2);
    ctx.rotate(velocity.r);
    ctx.translate(-120 * window.devicePixelRatio, -109 * window.devicePixelRatio);
    ctx.drawImage(img, 0, 0, imgDimensions.width * window.devicePixelRatio, imgDimensions.height * window.devicePixelRatio);
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
            velocity.rotationVelocity += touchSpeed;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDO0FBQ3RCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0FBQ3JFLE1BQU0sUUFBUSxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBQy9ELE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDO0FBRXhCLE1BQU0sYUFBYSxHQUFHLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUM7QUFDaEQsTUFBTSxTQUFTLEdBTVgsRUFBQyxXQUFXLEVBQUUsQ0FBQyxFQUFDLENBQUM7QUFFckIsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztBQUMvRCxNQUFNLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0FBQzdELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsYUFBYSxDQUFDLEtBQUssSUFBSSxDQUFDO0FBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDO0FBRWxELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFFLENBQUM7QUFFckM7O1FBQ0UsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRztZQUNyQixHQUFHLENBQUMsTUFBTSxHQUFHO2dCQUNYLEdBQUcsRUFBRSxDQUFDO1lBQ1IsQ0FBQyxDQUFBO1lBRUQsR0FBRyxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQUE7QUFFRDtJQUNFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNySCxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDeEgsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hCLENBQUM7QUFFRDtJQUNFLHFCQUFxQixDQUFDO1FBQ3BCLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDO1FBRXhDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsUUFBUSxDQUFDLGdCQUFnQixJQUFJLFFBQVEsQ0FBQztRQUN4QyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRSxRQUFRLENBQUMsZ0JBQWdCLElBQUksUUFBUSxDQUFDO1FBQ3hDLENBQUM7UUFFRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsc0JBQXNCLENBQWE7SUFDakMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUN4QyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzFDLENBQUM7QUFFRCxxQkFBcUIsQ0FBYTtJQUNoQyxTQUFTLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3ZDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDdkMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFFRDtJQUNFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNuRSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQU0sR0FBRyxTQUFTLENBQUMsTUFBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFFdEcsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3JELFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxVQUFVLENBQUM7UUFDMUMsQ0FBQztJQUNILENBQUM7SUFFRCxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUM1QixTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUM1QixTQUFTLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBR0QsQ0FBQztJQUNDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDYixJQUFJLEVBQUUsQ0FBQztJQUVQLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzNELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3JELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzFELENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FBQyJ9