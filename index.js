System.register("range", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function generateRange(args) {
        return function (x) {
            const outputRange = args.outputCeil - args.outputFloor;
            const inputPct = (x - args.inputMin) / (args.inputMax - args.inputMin);
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
    var __moduleName = context_2 && context_2.id;
    async function boot() {
        return new Promise((res) => {
            img.onload = function () {
                res();
            };
            img.src = 'spinner.svg';
        });
    }
    function paint() {
        canvas.style.transform = `translateY(-50%) rotate(${velocity.r}rad)`;
        if (!drewImage) {
            ctx.drawImage(img, 0, 0, imgDimensions.width * dPR, imgDimensions.height * dPR);
            drewImage = true;
        }
    }
    function stats() {
        const vel = Math.abs(velocity.rotationVelocity * 100);
        maxVelocity = Math.max(vel, maxVelocity);
        const velocityText = vel.toLocaleString(undefined, { maximumFractionDigits: 1 });
        const turnsText = Math.abs(velocity.r / Math.PI).toLocaleString(undefined, { maximumFractionDigits: 0 });
        const maxVelText = maxVelocity.toLocaleString(undefined, { maximumFractionDigits: 1 });
        statsElems.turns.textContent = `${turnsText}`;
        statsElems.velocity.textContent = `${velocityText}`;
        statsElems.maxVelocity.textContent = `${maxVelText}`;
    }
    function tick() {
        requestAnimationFrame(() => {
            velocity.r += velocity.rotationVelocity;
            if (lastTouchEnd) {
                const timeSinceLastTouch = Date.now() - lastTouchEnd;
                const timeLeftPct = timeSinceLastTouch / timeRemaining;
                if (timeLeftPct < 1) {
                    const newVelocity = lastTouchVelocity - (easeOutQuad(timeLeftPct) * lastTouchVelocity);
                    velocity.rotationVelocity = newVelocity;
                    const soundMagnitude = Math.abs(newVelocity / velocity.maxVelocity * 200);
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
    var audio_1, maxVelocity, img, canvas, velocity, statsElems, imgDimensions, touchInfo, dPR, timeRemaining, lastTouchEnd, lastTouchVelocity, ctx, drewImage, easeOutQuad;
    return {
        setters: [
            function (audio_1_1) {
                audio_1 = audio_1_1;
            }
        ],
        execute: function () {
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
            canvas.style.width = `${imgDimensions.width}px`;
            canvas.style.height = `${imgDimensions.height}px`;
            ctx = canvas.getContext('2d');
            drewImage = false;
            exports_2("easeOutQuad", easeOutQuad = (t) => t * (2 - t));
            (async () => {
                await boot();
                tick();
                document.addEventListener('touchstart', onTouchStart);
                document.addEventListener('touchmove', onTouchMove);
                document.addEventListener('touchend', touchEnd);
                document.addEventListener('touchcancel', touchEnd);
            })();
        }
    };
});
System.register("audio", ["range", "index"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function spinSound(magnitude) {
        let time = ac.currentTime;
        const freqMagnitude = magnitude;
        magnitude = Math.min(1, magnitude / 10);
        let x = (index_1.easeOutQuad(magnitude) * 1.1) - (0.6 - (0.6 * index_1.easeOutQuad(magnitude)));
        if (time + x - index_1.easeOutQuad(magnitude) < endPlayTime) {
            return;
        }
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        magnitude = Math.min(1, Math.max(0, magnitude));
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ac.destination);
        let freq = freqRange400_2000(freqMagnitude);
        let dur = 0.1 * (1 - magnitude / 2);
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
        let time = ac.currentTime;
        const freqMagnitude = magnitude;
        magnitude = Math.min(1, magnitude / 10);
        let x = (index_1.easeOutQuad(magnitude) * 1.1) - (0.3 - (0.3 * index_1.easeOutQuad(magnitude)));
        if (time + x - index_1.easeOutQuad(magnitude) < endPlayTime2) {
            return;
        }
        const osc = ac.createOscillator();
        const gain = ac.createGain();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYW5nZS50cyIsImluZGV4LnRzIiwiYXVkaW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBT0EsdUJBQThCLElBQWU7UUFDNUMsTUFBTSxDQUFDLFVBQVUsQ0FBUztZQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDdkQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFBO0lBQ0gsQ0FBQzs7Ozs7WUFSQSxDQUFDO1FBOENGLENBQUM7Ozs7OztJQ0FELEtBQUs7UUFDSCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7Z0JBQ1gsR0FBRyxFQUFFLENBQUM7WUFDUixDQUFDLENBQUE7WUFFRCxHQUFHLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDtRQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLDJCQUEyQixRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFckUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2YsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ2hGLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFD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