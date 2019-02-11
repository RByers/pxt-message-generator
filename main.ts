const TILT_X_THRESHOLD = 100; // in micro-gs
const TILT_X_SPEED = 10;      // chars/second/g
const TILT_MIN_SPEED = 0.5;     // chars/second

let running = false;
let idx = 0;
let message = "";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .!";

input.onButtonPressed(Button.A, function () {
    if (running) {
        message += chars.charAt(idx);
    }
});

input.onButtonPressed(Button.AB, function () {
    if (running) {
        running = false;
    }
});

function getMessage() {
    if (running)
        return "";  // Not re-entrant
    running = true;

    let lastChange = 0;

    while (running) {
        let now = input.runningTime();
        let accX = input.acceleration(Dimension.X);
        if (Math.abs(accX) >= TILT_X_THRESHOLD) {
            let delta = 0;
            if (lastChange) {
                let speed = Math.abs(accX) * TILT_X_SPEED / 1000;
                if (speed < TILT_MIN_SPEED)
                    speed = TILT_MIN_SPEED;
                delta = Math.round(speed * (now - lastChange) / 1000);
                if (accX < 0)
                    delta *= -1;
            } else {
                // Immediately advance one position when first exceeding
                // the threshold to allow for quick single-char moves.
                delta = accX < 0 ? -1 : 1;
            }
            if (delta) {
                idx = (idx + delta) % chars.length;
                if (idx < 0)
                    idx += chars.length;
                basic.showString(chars.charAt(idx), 0);
                lastChange = now;
            }
        } else if (lastChange && now - lastChange > 1 / TILT_MIN_SPEED) {
            // If there hasn't been an update sooner than the minimum speed
            // then permit an update as soon as the threshold is exceeded.  
            lastChange = 0;
        }
        basic.pause(20);
    }
    return message;
}

let msg = getMessage();
basic.showString(msg);