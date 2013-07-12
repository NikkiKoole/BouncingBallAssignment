window.onload = function () {
    "use strict";
    var context,
        canvas = document.getElementsByTagName('canvas')[0],//jslint needed definition
        balls = [];

    function ballsCollide(ball1, ball2) {

        var xd = ball1.x - ball2.x;
        var yd = ball1.y - ball2.y;

        var sumRadii = ball1.radius + ball2.radius;
        var sqrRadii = sumRadii * sumRadii;
        
        var distSqr = (xd * xd) + (yd * yd);
        
        if (distSqr <= sqrRadii) {
            return true;        
        }
        
        return false;
    } 

    function update() {

        var i,
            j,
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
            
            ball.angle += (ball.vx * 0.0174 * 3); //visually atractive rotation of ball.
            

            ballMovement = Math.abs(ball.vy) + Math.abs(ball.vx);
            
            //ball kill (when on ground and *not* moving)
            if ( (ballMovement < 0.06) && (ball.y + 2 > canvas.height - ball.radius ))  {
                console.log(ball.y);
                balls.splice(i, 1);            
            }
            
            // now test this ball against all other balls to see if it is colliding;
            // if so mirror its vx and vy
            for (j = 0; j < balls.length; j += 1) {
                if (j != i) {
                    if (ballsCollide(balls[i], balls[j])) {
                        balls[i].vx *= -1;
                        balls[i].vy *= -1;                   
                    }                
                }            
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
            context.arc(ball.x, ball.y, ball.radius, 0, 2* Math.PI, false);
            context.fillStyle = ball.color;
            context.fill();
            context.closePath();

            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, ball.angle, ball.angle +  Math.PI, false);
            context.fillStyle = '#ff0000';
            context.fill();
            context.closePath();
        }
    }

    function mainLoop() {
        update();
        draw();
    }


    function Ball(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = Math.random() * 20 + 10;
        this.friction = 0.3;
        this.angle = Math.random() * (Math.PI * 2);
    }

    function addBalls() {
        balls.push(new Ball(100, 20, -2, -0.01, '#FF00FF'));
        balls.push(new Ball(200, 20, 2, -0.01, '#FF00FF'));
        balls.push(new Ball(300, 20, 0, -0.01, '#FF00FF'));
    }

    function addBallAt(x, y) {
        // will need a way to *NOT* overlap balls by clicking at same spot repeatedly.
        // it gives a nice line, but it is to much trouble when balls can collide with each other.
        balls.push(new Ball(x, y, 2, 2, '#FF00FF'));
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


