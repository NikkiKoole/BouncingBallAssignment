window.onload = function () {
    "use strict";
    var context,
        balls = [];

    function update() {

        for(var n = 0; n < balls.length; n++) {
            var ball = balls[n];
            ball.y += ball.vy;
            ball.x += ball.vx;

            //bottom
            if(ball.y > (canvas.height - ball.radius)) {
                ball.y = canvas.height - ball.radius - 2;
                ball.vy *= -1;
            }
            //top
            if(ball.y < (ball.radius)) {
                ball.y = ball.radius + 2;
                ball.vy *= -1;
            }

            // right
            if(ball.x > (canvas.width - ball.radius)) {
                ball.x = canvas.width - ball.radius - 2;
                ball.vx *= -1;
            }

            // left
            if(ball.x < (ball.radius)) {
                ball.x = ball.radius + 2;
                ball.vx *= -1;
            } 

        }
    }




    function draw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = "grey";    
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for(var n = 0; n < balls.length; n++) {
            var ball = balls[n];
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

    function init() {
        var canvasElement = document.getElementById("canvas");
        context = canvasElement.getContext("2d");
        setInterval(mainLoop, 1000/30);
    }

    init();
    addBalls();




    function Ball(x, y, vx, vy, color, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
    }

    function addBalls() {
        balls.push(new Ball(100,100, 2, 2, '#FF00FF', 20));
        balls.push(new Ball(200,100, 1, -2, '#FF00FF', 20)); 
        balls.push(new Ball(100,0, -2, 2, '#FF00FF', 20));     
    }



}

