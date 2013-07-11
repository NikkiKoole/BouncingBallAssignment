window.onload = function() {

    // this program simulates a bouncing ball.
    // it will work with these variables:
    // -Mass (the larger the mass, the less bouncing distance)
    // -Gravity (the larger the gravity, the higher the speed of movement)
    // -Friction (the larger the friction, the less bouncing distance (visually the same as Mass))


    var ball = document.getElementById('ball');
    var gravityInput = document.getElementById('gravity');
    var resetButton = document.getElementById('reset');
    var gravity = gravityInput.value;    

    var decay = 1.0;
    var decayRate = 0.7;
    var maxDistance = 400;
    var currentDistance = 0;
    
    resetButton.onclick = function() {
        decay = 1.0;        
        ball.className = "up";
        ball.style['-webkit-transition-duration'] = '0.01s';
        ball.style['-webkit-transform'] = 'translateY(0px)';    
    }

    gravityInput.onchange = function() {
        console.log("new Gravity: "+gravityInput.value);  
        gravity = gravityInput.value;       
    }


      if (ball) {
            ball.addEventListener("webkitTransitionEnd", updateTransition, true);
            if (ball.className === '') {
              ball.className = 'up';      
            }
            updateTransition();
      }

     function updateTransition(  ) { 
         if (ball.className === 'down'){
            // at this point the ball collides with the ground,
            // thus this is where friction takes it's percentage and the bounce distance and speed
            // will need to be calculated.
            decayRate = (gravity/20.0);
            decay *= decayRate;            
            currentDistance = maxDistance * decay;
            
            ball.className = 'up';
            ball.style['-webkit-transition-duration'] = (1 * decay)+'s';
            ball.style['-webkit-transition-timing-function'] = 'cubic-bezier(0,0,0.20,1)'
            ball.style['-webkit-transform'] = 'translateY('+(400-currentDistance)+'px)';
         }
         else if (ball.className === 'up'){
            // at this point the ball is at it's highest, 
            // perhaps it's a good idea to save the distance to the ground ?            
            ball.className = 'down';
            ball.style['-webkit-transition-duration'] = (1 * decay)+'s';
            ball.style['-webkit-transition-timing-function'] = 'cubic-bezier(0.80,0,1,1)';
            ball.style['-webkit-transform'] = 'translateY(400px)';
          }

     };

}
