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
const velocity = { r: 0, rotationVelocity: 0.1 };
const imgDimensions = { width: 210, height: 220 };
canvas.height = imgDimensions.height;
canvas.width = imgDimensions.width;
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
    ctx.translate(imgDimensions.width / 2, imgDimensions.height / 2);
    ctx.rotate(velocity.r);
    ctx.translate(-120, -109);
    ctx.drawImage(img, 0, 0, imgDimensions.width, imgDimensions.height);
    ctx.restore();
}
function tick() {
    requestAnimationFrame(() => {
        velocity.r += velocity.rotationVelocity;
        paint();
        tick();
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield boot();
    tick();
}))();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDO0FBQ3RCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0FBQ3JFLE1BQU0sUUFBUSxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUMsQ0FBQztBQUMvQyxNQUFNLGFBQWEsR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBRWhELE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztBQUNyQyxNQUFNLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7QUFFbkMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUUsQ0FBQztBQUVyQzs7UUFDRSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7Z0JBQ1gsR0FBRyxFQUFFLENBQUM7WUFDUixDQUFDLENBQUE7WUFFRCxHQUFHLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FBQTtBQUdEO0lBQ0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNYLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEIsQ0FBQztBQUVEO0lBQ0UscUJBQXFCLENBQUM7UUFDcEIsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLEVBQUUsQ0FBQztJQUNULENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELENBQUM7SUFDQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ2IsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDLENBQUEsQ0FBQyxFQUFFLENBQUMifQ==