window.onload = function() {
    // This program simulates a bouncing ball.
    // It will work with these variables:
    // -Mass (the larger the mass, the less bouncing distance)
    // -Gravity (the larger the gravity, the higher the speed of movement)
    // -Friction (the larger the friction, the less bouncing distance (visually the same as Mass))

    var ball = document.getElementById('ball');
    var massInput = document.getElementById('mass');
    var frictionInput = document.getElementById('friction');
    var gravityInput = document.getElementById('gravity');
    var resetButton = document.getElementById('reset');

    var maximumMass = 100; // At this Mass there will be no bounce. 
    var decay = 1.0; // The rate at which values get multplied, when 0 there will be no bounce and no duration.
    var startDistance = 400; // The initial height of the ball when dropped.
    var currentDistance = 0; //The next distance the ball will travel.

    resetButton.onclick = function() {
        decay = 1.0;        
        ball.className = "up";
        ball.style['-webkit-transition-duration'] = '0.01s';
        ball.style['-webkit-transform'] = 'translateY(0px)';    
    }

    if (ball) {
        ball.addEventListener("webkitTransitionEnd", updateTransition, true);
        if (ball.className === '') {
            ball.className = 'up';      
        }
        updateTransition();
    }

    function calculateDecay()
    {
        decay *= Math.max(0, (1.0 -(massInput.value / maximumMass) -(frictionInput.value / 100.0 )));
    } 

    function getBounceDistance(inDistance)
    {
        return decay*inDistance;
    }

    function getBounceDuration()
    {
        return (1.0 / (gravityInput.value/9.8));      
    }

    function updateTransition(  ) { 
        if (ball.className === 'down'){
            // at this point the ball collides with the ground,
            // this is where the output force is calculated.
            calculateDecay();
            currentDistance = getBounceDistance(startDistance);

            ball.className = 'up';
            ball.style['-webkit-transition-duration'] = (getBounceDuration() * decay)+'s';
            ball.style['-webkit-transition-timing-function'] = 'cubic-bezier(0,0,0.20,1)';
            ball.style['-webkit-transform'] = 'translateY('+(400-currentDistance)+'px)';
        }
        else if (ball.className === 'up'){
            ball.className = 'down';
            ball.style['-webkit-transition-duration'] = (getBounceDuration() * decay)+'s';
            ball.style['-webkit-transition-timing-function'] = 'cubic-bezier(0.80,0,1,1)';
            ball.style['-webkit-transform'] = 'translateY(400px)';
        }

    };
};
