window.onload = function () {
    "use strict";
    var context,
        canvas = document.getElementsByTagName('canvas')[0],//jslint needed definition
        balls = [];

    function ballsCollide(ball1, ball2) {
        // this function will be called balls.length^2 per frame
        // i will test if balls are colliding, if so 
        // i will reposition balls so the are not colliding/overlapping
        // and bounce their v's.    
    } 

    function update() {

        var i,
            ball,
            ballMovement;

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            ball.y += ball.vy;
            ball.x += ball.vx;
            
           

            //bottom
            if (ball.y > (canvas.height - ball.radius)) {
                ball.y = canvas.height - ball.radius;
                ball.vy *= - (1 - ball.friction);
            }
            else if (ball.y < (canvas.height - ball.radius) )
            {
                ball.vy += 0.2;            
            }
            
            // horizontal friction when ball is on ground
            if ((ball.y + 1 > canvas.height - ball.radius ) && ball.vx != 0) {
                ball.vx *= (1 - ball.friction);            
            }

            //top wall bounce 
            if (ball.y < (ball.radius)) {
                ball.y = ball.radius + 2;
                ball.vy *= -1;
            }

            // right wall bounce
            if (ball.x > (canvas.width - ball.radius)) {
                ball.x = canvas.width - ball.radius - 2;
                ball.vx *= -(1 - ball.friction);
            }

            // left wall bounce
            if (ball.x < (ball.radius)) {
                ball.x = ball.radius + 2;
                ball.vx *= -(1 - ball.friction);
            }
            
            
            ballMovement = Math.abs(ball.vy) + Math.abs(ball.vx);
            
            //ball kill (when on ground and *not* moving)
            if ( (ballMovement < 0.02) && (ball.y + 1 > canvas.height - ball.radius ))  {
                console.log(ball.y);
                balls.splice(i, 1);            
            }
        }
    }

    function draw() {

        var i,
            ball;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = "grey";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
            context.fillStyle = ball.color;
            context.fill();
        }
    }

    function mainLoop() {
        update();
        draw();
    }


    function Ball(x, y, vx, vy, color, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.friction = 0.3;
    }

    function addBalls() {
        balls.push(new Ball(100, 20, -2, -0.01, '#FF00FF', 20));
        balls.push(new Ball(200, 20, 2, -0.01, '#FF00FF', 20));
        balls.push(new Ball(300, 20, 0, -0.01, '#FF00FF', 20));
    }

    function addBallAt(x, y) {
        // will need a way to *NOT* overlap balls by clicking at same spot repeatedly.
        // it gives a nice line, but it is to much trouble when balls can collide with each other.
        balls.push(new Ball(x, y, 2, 2, '#FF00FF', 20));
    }

    function init() {
        var canvasElement = document.getElementById("canvas");
        context = canvasElement.getContext("2d");
        canvas.addEventListener('click', canvasOnClick, false);
        setInterval(mainLoop, 1000 / 30);
    }
    
    function canvasOnClick(e) {
        var x;
        var y;
        if (e.pageX || e.pageY) { 
          x = e.pageX;
          y = e.pageY;
        }
        console.log("canvas is clicked homeboy! at x: " + x + ", y: "+ y);
        addBallAt(x, y);
    }

    init();
    addBalls();
};


