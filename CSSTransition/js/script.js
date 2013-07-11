window.onload = function () {
    // This program simulates a bouncing ball.
    // It will work with these variables:
    // -Mass (the larger the mass, the less bouncing distance)
    // -Gravity (the larger the gravity, the higher the speed of movement)
    // -Friction (the larger the friction, the less bouncing distance (visually the same as Mass))

    "use strict";

    var ball = document.getElementById('ball'),
        massInput = document.getElementById('mass'),
        frictionInput = document.getElementById('friction'),
        gravityInput = document.getElementById('gravity'),
        resetButton = document.getElementById('reset'),

        maximumMass = 100, // At this Mass there will be no bounce. 
        decay = 1.0, // The rate at which values get multplied, when 0 there will be no bounce and no duration.
        startDistance = 400, // The initial height of the ball when dropped.
        currentDistance = 0; //The next distance the ball will travel.

    function calculateDecay() {
        decay *= Math.max(0, (1.0 - (massInput.value / maximumMass) - (frictionInput.value / 100.0)));
    }

    function getBounceDistance(inDistance) {
        return decay * inDistance;
    }

    function getBounceDuration() {
        return (1.0 / (gravityInput.value / 9.8));
    }

    function updateTransition() {
        if (ball.className === 'down') {
            // at this point the ball collides with the ground,
            // this is where the output force is calculated.
            calculateDecay();
            currentDistance = getBounceDistance(startDistance);

            ball.className = 'up';
            ball.style['-webkit-transition-duration'] = (getBounceDuration() * decay) + 's';
            ball.style['-webkit-transition-timing-function'] = 'cubic-bezier(0,0,0.20,1)';
            ball.style['-webkit-transform'] = 'translateY(' + (400 - currentDistance) + 'px)';
        } else if (ball.className === 'up') {
            ball.className = 'down';
            ball.style['-webkit-transition-duration'] = (getBounceDuration() * decay) + 's';
            ball.style['-webkit-transition-timing-function'] = 'cubic-bezier(0.80,0,1,1)';
            ball.style['-webkit-transform'] = 'translateY(400px)';
        }

    }


    resetButton.onclick = function () {
        decay = 1.0;
        ball.className = 'up';
        ball.style['-webkit-transition-duration'] = '0.01s';
        ball.style['-webkit-transform'] = 'translateY(0px)';
    };

    if (ball !== null) {
        ball.addEventListener("webkitTransitionEnd", updateTransition, true);
        if (ball.className === '') {
            ball.className = 'up';
        }
        updateTransition();
    }


};
