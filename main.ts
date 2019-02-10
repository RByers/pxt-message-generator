
/* function showChar() {
    if (idx < 0) {
        basic.showIcon(IconNames.Yes);
    } else {
        let ch = chars.charAt(idx);
        basic.showString(ch, 0);
    }
} */

const TILT_X_THRESHOLD = 100; // in micro-gs
const TILT_X_SPEED = 10;      // chars/second/g

function getMessage() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .!";
    let idx = 0;
    let message = "";
    let lastChange = 0;

    while (true) {
        let accX = input.acceleration(Dimension.X);
        if (Math.abs(accX) >= TILT_X_THRESHOLD) {

        }
        basic.pause(20);
    }
    return message;
}

let msg = getMessage();
basic.showString(msg);