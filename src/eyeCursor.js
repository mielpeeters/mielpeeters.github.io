// keeps all elements that the eye should look at
var lookAtMe = document.querySelectorAll(".look");

// keeps the cursos element and co.
const cursorEl = document.querySelector("#cursor");
const cursorImageEl = document.querySelector('#cursor > svg');
const eyeBall = cursorImageEl.querySelector('#eyeBall');

var touch = false;
var rot;
var count = 0;
var look = true;

let ticking = false;

function updateLook() {
    lookAtMe = document.querySelectorAll(".look");
}

/**
 * Adds the location of element to locations.
 * 
 * @param {any[]} locations 
 * @param {Element} element 
 */
function addLocation(locations, element) {
    var rect = element.getBoundingClientRect();

    var centerX = (rect.left + rect.right) / 2;
    var centerY = (rect.top + rect.bottom) / 2;

    var location = { x: centerX, y: centerY };

    locations.push(location);
}

function addDistance(distances, location, currentCursorPos) {
    distances.push(Math.pow(location.x - currentCursorPos.x, 2) + Math.pow(location.y - currentCursorPos.y, 2));
}

// function that rotates the cursor to the given location
function rotateCursor(currentCursorPos) {
    count++;
    if (count % 5 != 0) return;

    rot = rot || 0;
    apparentRotation = rot % 360;

    var distances = [];
    var locations = [];

    lookAtMe.forEach(lookEl => addLocation(locations, lookEl));

    locations.forEach(location => addDistance(distances, location, currentCursorPos));

    var minIndex = 0;
    var minDist = distances[0];

    for (var i = 1; i < distances.length; i++) {
        if (distances[i] < minDist) {
            minIndex = i;
            minDist = distances[i];
        }
    }

    var closest = locations[minIndex];

    var radianTan = Math.atan((currentCursorPos.y - closest.y) / (currentCursorPos.x - closest.x))

    if (currentCursorPos.x < closest.x) {
        radianTan = radianTan + Math.PI;
    }

    var newRotation = (180 + 180 * radianTan / Math.PI);

    if (apparentRotation < 0) { apparentRotation += 360; }
    if (apparentRotation < 180 && (newRotation > (apparentRotation + 180))) { rot -= 360; }
    if (apparentRotation >= 180 && (newRotation <= (apparentRotation - 180))) { rot += 360; }

    rot += (newRotation - apparentRotation);

    cursorImageEl.style.transform = `rotate(${rot}deg)`;
}

// eventhandler to function that retrieves closest to pointer location and calls rotate function
function moveHandler(event) {
    if (touch) return;
    
    currentCursorPos = { x: event.clientX, y: event.clientY };

    if (!ticking) {

        window.requestAnimationFrame(() => {
            
            if (document.querySelector("body:hover")) {
                if (document.querySelector(".look:hover")) {
                    if (!look) {
                        look = true;
                        eyeBall.setAttribute("ry", "48");
                        eyeBall.setAttribute("rx", "48");
                        eyeBall.setAttribute("cx", "0");
                    }
                }
                else if (look) {
                    look = false;
                    eyeBall.setAttribute("ry", "40");
                    eyeBall.setAttribute("rx", "40");
                    eyeBall.setAttribute("cx", "30");
                }
                
                cursorEl.style.transform = `translate(${currentCursorPos.x}px, ${currentCursorPos.y}px)`;
                cursorImageEl.style.opacity = "1";
                cursorEl.style.display = "inline-block";
            }
            else {
                cursorEl.style.display = "none";
            }
    
            // cursorImageEl.style.transform = `rotate(-270deg)`
            
            rotateCursor(currentCursorPos);

        ticking = false;    
    })
    
    ticking = true;
    
    }   
}

function leaveHandler(event) {
    cursorEl.style.display = "none";
}

function touchHandler(event) {
    touch = true;
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseleave", leaveHandler);
    document.removeEventListener("mousedown", downHandler);
    document.removeEventListener("mouseup", upHandler);
}

function downHandler(event) {
    eyeBall.setAttribute("rx", "60");
    eyeBall.setAttribute("ry", "60");
}

function upHandler(event) {
    eyeBall.setAttribute("rx", "45");
    eyeBall.setAttribute("ry", "45");
}

document.addEventListener("touchstart", touchHandler, false);
document.addEventListener("mousemove", moveHandler, false);
document.addEventListener("mouseleave", leaveHandler, false);
document.addEventListener("mousedown", downHandler, false);
document.addEventListener("mouseup", upHandler, false);