window.onload = function () {
    "use strict";
    var context,
        canvas = document.getElementsByTagName('canvas')[0],//jslint needed definition
        balls = [];

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
                ball.nextY = canvas.height - ball.radius;
            } else if (ball.nextY - ball.radius < 0) { // left wall
                ball.vy = ball.vy * -(1 - ball.friction);
                ball.nextY = ball.radius;
            }
        }
    }

    function updateBallPositions() {
        var i,
            ball;

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            ball.vy += 0.2;
            ball.nextX = (ball.x + ball.vx);
            ball.nextY = (ball.y + ball.vy);
            ball.angle += ((ball.vx + ball.vy) * 0.0174);
        }
    }

    function handleGroundFriction() {
        var i,
            ball;

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            if (ball.nextY + ball.radius + 1 > canvas.height) {
                ball.vx *= (1 - ball.friction);
                if ((Math.abs(ball.vy) + Math.abs(ball.vx)) < 0.09) {
                    balls.splice(i, 1);
                }
            }
        }
    }

    function ballsCollide(ball1, ball2) {
        var dx = ball1.nextX - ball2.nextX,
            dy = ball1.nextY - ball2.nextY,
            distance = (dx * dx + dy * dy);

        if (distance <= (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)) {
            return true;
        }
        return false;
    }



    function ballIsColliding() {
        var ball,
            other,
            i,
            j;

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];
            for (j = i + 1; j < balls.length; j += 1) {
                other = balls[j];
                if (ballsCollide(ball, other)) {
                    ballCollisionResolver(ball, other);
                }
            }
        }
    }

    function update() {
        updateBallPositions();
        testWallColliding();
        handleGroundFriction();
        ballIsColliding();
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
            ball.x = ball.nextX;
            ball.y = ball.nextY;
            context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
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


    function Ball(x, y, vx, vy, color, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.nextX = x;
        this.nextY = y;
        this.color = color;
        this.radius = radius;
        this.friction = 0.3;
        this.angle = Math.random() * (Math.PI * 2);
        this.mass = this.radius;
    }

    function addBallAt(x, y) {
        // will need a way to *NOT* overlap balls by clicking at same spot repeatedly.
        var i,
            ball,
            overlapping = false,
            testBall = new Ball(x, y, 0, 0, '#FF00FF', Math.random() * 10 + 10);

        for (i = 0; i < balls.length; i += 1) {
            ball = balls[i];

            if (ballsCollide(ball, testBall)) {
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
    }


    function init() {
        var canvasElement = document.getElementById("canvas");
        context = canvasElement.getContext("2d");
        canvas.addEventListener('click', canvasOnClick, false);
        setInterval(mainLoop, 1000 / 30);
    }


    init();
    addBallAt(10, 10);
};


