const TILT_X_THRESHOLD = 200; // in micro-gs
const TILT_X_SPEED = 10;      // chars/second/g
const TILT_Y_THRESHOLD = 500; // in micro-gs
const TILT_Y_SPEED = 2;       // chars/second/g
const TILT_MIN_SPEED = 0.5;   // chars/second

let running = false;
let idxX = 0;
let idxY = 0;
let message = "";
const chars = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    " .,!-/'\":;_=+"];

input.onButtonPressed(Button.A, function () {
    if (running) {
        basic.showString(message);
    }
});

input.onButtonPressed(Button.B, function () {
    if (running) {
        message += chars[idxY].charAt(idxX);
    }
});

input.onButtonPressed(Button.AB, function () {
    if (running) {
        running = false;
    }
});

function _getDeltaForAcc(acc: number, threshold: number, speed: number, lastChange: number, now: number): number {
    if (Math.abs(acc) < threshold)
        return 0;

    if (!lastChange) {
        // Immediately advance one position when first exceeding
        // the threshold to allow for quick single-char moves.
        return acc < 0 ? -1 : 1;
    }

    let s = (Math.abs(acc) - threshold) * speed / 1000;
    if (s < TILT_MIN_SPEED)
        s = TILT_MIN_SPEED;
    let delta = Math.round(s * (now - lastChange) / 1000);
    if (acc < 0)
        delta *= -1;
    return delta;
}

function getMessage() {
    if (running)
        return "";  // Not re-entrant
    running = true;

    let lastChange = 0;

    while (running) {
        let now = input.runningTime();
        let accY = input.acceleration(Dimension.Y);
        if (Math.abs(accY) >= TILT_Y_THRESHOLD) {
            let deltaY = _getDeltaForAcc(accY, TILT_Y_THRESHOLD, TILT_Y_SPEED, lastChange, now);
            if (deltaY) {
                idxY = (idxY + deltaY) % chars.length;
                if (idxY < 0)
                    idxY += chars.length;
                if (idxX >= chars[idxY].length)
                    idxX = 0;
                basic.showString(chars[idxY].charAt(idxX), 0);
                lastChange = now;
            }
        } else {
            let deltaX = _getDeltaForAcc(
                input.acceleration(Dimension.X),
                TILT_X_THRESHOLD,
                TILT_X_SPEED,
                lastChange,
                now);
            if (deltaX) {
                idxX = (idxX + deltaX) % chars[idxY].length;
                if (idxX < 0)
                    idxX += chars[idxY].length;
                basic.showString(chars[idxY].charAt(idxX), 0);
                lastChange = now;
            } else if (lastChange && (now - lastChange) > (1000 / TILT_MIN_SPEED)) {
                // If there hasn't been an update sooner than the minimum speed
                // then permit an update as soon as the threshold is exceeded.  
                lastChange = 0;
            }
        }
        basic.pause(20);
    }
    return message;
}

let msg = getMessage();

while (true)
    basic.showString(msg);