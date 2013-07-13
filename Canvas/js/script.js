window.onload = function () {
    "use strict";
    var context,
        canvas = document.getElementsByTagName('canvas')[0],//jslint needed definition
        balls = [],
        massInput = document.getElementById('mass'),
        frictionInput = document.getElementById('friction'),
        gravityInput = document.getElementById('gravity');

    canvas.onselectstart = function () { return false; };

    function ballCollisionResolver(ball1, ball2) {
        var dx = ball1.nextX - ball2.nextX,
            dy = ball1.nextY - ball2.nextY,
            collisionAngle = Math.atan2(dy, dx),

            // Get velocities before collision
            speed1 = Math.sqrt(ball1.vx * ball1.vx + ball1.vy * ball1.vy),
            speed2 = Math.sqrt(ball2.vx * ball2.vx + ball2.vy * ball2.vy),

            // Get angles 
            direction1 = Math.atan2(ball1.vy, ball1.vx),
            direction2 = Math.atan2(ball2.vy, ball2.vx),

            // Rotate velocity vectors so we can plug into equation for conservation of momentum
            rotVelocityX1 = speed1 * Math.cos(direction1 - collisionAngle),
            rotVelocityY1 = speed1 * Math.sin(direction1 - collisionAngle),
            rotVelocityX2 = speed2 * Math.cos(direction2 - collisionAngle),
            rotVelocityY2 = speed2 * Math.sin(direction2 - collisionAngle),

            // Update actual velocities using conservation of momentum
            // Uses the following formulas:
            //     velocity1 = ((mass1 - mass2) * velocity1 + 2*mass2 * velocity2) / (mass1 + mass2)
            //     velocity2 = ((mass2 - mass1) * velocity2 + 2*mass1 * velocity1) / (mass1 + mass2)

            outVelocityX1 = ((ball1.mass - ball2.mass) * rotVelocityX1 + (ball2.mass + ball2.mass) * rotVelocityX2) / (ball1.mass + ball2.mass),
            outVelocityX2 = ((ball1.mass + ball1.mass) * rotVelocityX1 + (ball2.mass - ball1.mass) * rotVelocityX2) / (ball1.mass + ball2.mass),

            // Y velocities remain constant
            outVelocityY1 = rotVelocityY1,
            outVelocityY2 = rotVelocityY2;

        // Rotate angles back again so the collision angle is preserved
        ball1.vx = Math.cos(collisionAngle) * outVelocityX1 + Math.cos(collisionAngle + Math.PI / 2) * outVelocityY1;
        ball1.vy = Math.sin(collisionAngle) * outVelocityX1 + Math.sin(collisionAngle + Math.PI / 2) * outVelocityY1;
        ball2.vx = Math.cos(collisionAngle) * outVelocityX2 + Math.cos(collisionAngle + Math.PI / 2) * outVelocityY2;
        ball2.vy = Math.sin(collisionAngle) * outVelocityX2 + Math.sin(collisionAngle + Math.PI / 2) * outVelocityY2;

        // Update nextX and nextY for both balls so we can use them in render() or another collision
        ball1.nextX += ball1.vx;
        ball1.nextY += ball1.vy;
        ball2.nextX += ball2.vx;
        ball2.nextY += ball2.vy;
    }


    function testWallColliding() {
        var i,
            ball;
            

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            
            if (ball.nextX + ball.radius > canvas.width) { // right wall
                ball.vx = ball.vx * -(1 - ball.friction);
                ball.nextX = canvas.width - ball.radius;
            } else if (ball.nextX - ball.radius < 0) { // top wall
                ball.vx = ball.vx * -(1 - ball.friction);
                ball.nextX = ball.radius;
            } else if (ball.nextY + ball.radius > canvas.height) { // bottom wall
                ball.vy = ball.vy * -(1 - ball.friction);
                ball.vy *= (1.0 - (ball.mass / 900)); // more mass => less bounce
                ball.nextY = canvas.height - ball.radius;
            } else if (ball.nextY - ball.radius < 0) { // left wall
                ball.vy = ball.vy * -(1 - ball.friction);
                ball.nextY = ball.radius;
            }
        }
    }
    
    function destroyBall(ballIndex) {
        balls.splice(ballIndex, 1);
    }

    function updateBallPositions() {
        var i,
            ball;

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            if (!(ball.nextY + ball.radius > canvas.height)) {
                ball.vy += (1.0 / (20.0 / gravityInput.value)); //magic numbers
            }
            ball.nextX = (ball.x + ball.vx);
            ball.nextY = (ball.y + ball.vy);
            ball.angle += ((ball.vx + ball.vy) * 0.0174);  //toRadians
            
            if (ball.dying) {
  
                if (ball.animCounter <= 0) {
                    destroyBall(i);                    
                }
                ball.animCounter -= 10;            
            }
        }
    }

    function handleGroundFriction() {
        var i,
            ball,
            ballMovement;

        for (i = 0; i < balls.length; i += 1) {
            
            ball = balls[i];
            if (ball.nextY + ball.radius + 1 > canvas.height) {
                
                ball.vx *= (1.0 - ball.friction);
                ballMovement = (Math.abs(ball.vy) + Math.abs(ball.vx));
                //console.log("ballmovement "+ballMovement);
                if (ballMovement < 0.4) {
                    //
                    ball.dying = true;
                }
                
            }
        }
    }

    function ballsOverlap(ball1, ball2) {
        var dx = ball1.nextX - ball2.nextX,
            dy = ball1.nextY - ball2.nextY,
            distance = (dx * dx + dy * dy);

        if (distance <= (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)) {
            return true;
        }
        return false;
    }



    function ballBallCollisionTest() {
        var ball,
            other,
            i,
            j;

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            for (j = i + 1; j < balls.length; j += 1) {
                other = balls[j];
                if (ballsOverlap(ball, other)) {
                    ballCollisionResolver(ball, other);
                }
            }
        }
    }

    function update() {
        updateBallPositions();
        testWallColliding();
        handleGroundFriction();
        ballBallCollisionTest();
    }

    function draw() {
        var i,
            ball;
        context.globalAlpha = 1.0; 
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = "lightgrey";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for (i = 0; i < balls.length; i += 1) {
            
            ball = balls[i];
            
            context.beginPath();
            ball.x = ball.nextX;
            ball.y = ball.nextY;
            if (ball.dying) { 
                context.globalAlpha = (ball.animCounter/100);
            } else {
               context.globalAlpha = 1.0;             
            }
            
            context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
            context.fillStyle = ball.color1;
            context.fill();
            context.closePath();

            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, ball.angle, ball.angle +  Math.PI, false);
            context.fillStyle = ball.color2;
            context.fill();
            context.closePath();
        }
    }

    function mainLoop() {
        update();
        draw();
    }


    function Ball(x, y, vx, vy, color1, color2, radius, mass, friction) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.nextX = x;
        this.nextY = y;
        this.color1 = color1;
        this.color2 = color2;
        this.radius = radius;
        this.friction = friction;
        this.angle = Math.random() * (Math.PI * 2);
        this.mass = mass * radius;
        this.dying = false;
        this.animCounter = 100;
    }
    
    function getRndColor() {
        var colors = ['#9E176A', '#D63175', '#D9236D', '#6A0E47', '#82848C', '#666071'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function addBallAt(x, y) {
        // will need a way to *NOT* overlap balls by clicking at same spot repeatedly.
        var i,
            ball,
            overlapping = false,
            mass = massInput.value,
            testBall = new Ball(x, y, 0, 0, getRndColor(), getRndColor(), Math.random() * 20 + 10, mass, frictionInput.value);
 
        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];

            if (ballsOverlap(ball, testBall)) {
                overlapping = true;
            }
        }

        if (overlapping === false) {
            balls.push(testBall);
        }
    }

    function canvasOnClick(e) {
        var x,
            y;

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }

        addBallAt(x, y);

        e.preventDefault();
        return false;
    }


    function init() {
        var canvasElement = document.getElementById("canvas");
        context = canvasElement.getContext("2d");
        canvas.addEventListener('click', canvasOnClick, false);
        setInterval(mainLoop, 1000 / 30);
    }


    init();
    addBallAt(10, 10);
    addBallAt(110, 10);
    addBallAt(210, 10);
};

