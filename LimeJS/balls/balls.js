//set main namespace
goog.provide('balls');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime');
goog.require('lime.CoverNode');
goog.require('lime.fill.LinearGradient');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.JointDef');
goog.require('box2d.MouseJointDef');
goog.require('box2d.World');

balls.WIDTH = 600;
balls.HEIGHT = 400;

balls.start = function () {
    "use strict";

    var director = new lime.Director(document.body, balls.WIDTH, balls.HEIGHT),
        gamescene = new lime.Scene(),
        layer = (new lime.Layer()).setPosition(100, 0),
        ballArray = [],
    // box2d variables
        gravity = new box2d.Vec2(0, 300),
        bounds = new box2d.AABB(),
        world = new box2d.World(bounds, gravity, false);

    bounds.minVertex.Set(-balls.WIDTH, -balls.HEIGHT);
    bounds.maxVertex.Set(2 * balls.WIDTH, 2 * balls.HEIGHT);
    gamescene.appendChild(layer);
    director.makeMobileWebAppCapable();
    director.replaceScene(gamescene);

    // the gravity dragger

    function addDragger(label, x, y) {
        var lbl = new lime.Label().setSize(50, 40).setFontSize(20).setText(label).setPosition(x - 45, y - 15),
            thumb = (new lime.Sprite()).setSize(15, 30).setFill(0, 255, 255).setPosition(x, y),
            track = (new lime.Sprite()).setSize(150, 4).setFill(255, 0, 255).setPosition(x, y);

        goog.events.listen(thumb, ['mousedown', 'touchstart'], function (e) {
            e.event.stopPropagation();
            var barWidth = 150,
                drag = e.startDrag(false, new goog.math.Box(y, barWidth, y, 0));

            goog.events.listen(drag, lime.events.Drag.Event.MOVE, function () {
                var pos = thumb.getPosition(),
                    minimumGravity = 1,
                    maximumGravity = 600,
                    range = maximumGravity - minimumGravity,
                    desiredGravity = (((pos.x) / barWidth) * range) + minimumGravity;
                world.m_gravity = new box2d.Vec2(0, desiredGravity);
            });
        });

        layer.appendChild(track);
        layer.appendChild(lbl);
        layer.appendChild(thumb);
    }

    function getRndColor() {
        var colors = ['#9E176A', '#D63175', '#D9236D', '#6A0E47', '#82848C', '#666071'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function createBall(radius, x, y, layer) {
        var col1 = hexToRgb(getRndColor()),
            col2 = hexToRgb(getRndColor()),
            circle = (new lime.Circle()).setFill(new lime.fill.LinearGradient().addColorStop(0.5, col1.r, col1.g, col1.b).addColorStop(0.5,  col2.r, col2.g, col2.b)).setSize(radius * 2, radius * 2),
            bodyDef = new box2d.BodyDef(),
            shapeDef = new box2d.CircleDef(),
            body;
        layer.appendChild(circle);

        bodyDef.position.Set(x, y);
        bodyDef.angularDamping = 0.001;

        shapeDef.radius = circle.getSize().width / 2;
        shapeDef.density = 50 * radius;
        shapeDef.restitution = 0.6;
        shapeDef.friction = 1000;
        bodyDef.AddShape(shapeDef);

        body = world.CreateBody(bodyDef);

        circle.pBody = body;
        ballArray.push(circle);
        return circle;
    }

    function createBorder(x, y, width, height, layer) {
        var rect = (new lime.Sprite()).setFill(0, 100, 0).setSize(width, height),
            bodyDef = new box2d.BodyDef(),
            shapeDef = new box2d.BoxDef(),
            body;
        layer.appendChild(rect);

        bodyDef.position.Set(x, y);
        bodyDef.rotation = 0;//-rotation / 180 * Math.PI;

        shapeDef.restitution = 0.9;
        shapeDef.density = 0; // static
        shapeDef.friction = 1;
        shapeDef.extents.Set(width / 2, height / 2);

        bodyDef.AddShape(shapeDef);

        body = world.CreateBody(bodyDef);
        rect.pBody = body;
        return rect;
    }

    function allowUserForceDrag(shape) {
        goog.events.listen(shape, ['mousedown', 'touchstart'], function (e) {
            var pos = this.localToParent(e.position), //need parent coordinate system
                mouseJointDef = new box2d.MouseJointDef(),
                mouseJoint;
            mouseJointDef.body1 = world.GetGroundBody();
            mouseJointDef.body2 = shape.pBody;
            mouseJointDef.target.Set(pos.x, pos.y);
            mouseJointDef.maxForce = 2000 * shape.pBody.m_mass;

            mouseJoint = world.CreateJoint(mouseJointDef);

            // kill joint on mouse up
            e.swallow(['mouseup', 'touchend'], function () {
                world.DestroyJoint(mouseJoint);
            });
            // change joint position on drag
            e.swallow(['mousemove', 'touchmove'], function (e) {
                var pos = this.localToParent(e.position);
                mouseJoint.SetTarget(new box2d.Vec2(pos.x, pos.y));
            });
        });
    }

    function updateFromBody(shape) {
        var pos = shape.pBody.GetCenterPosition(),
            rot = shape.pBody.GetRotation();
        shape.setRotation(-rot / Math.PI * 180);
        shape.setPosition(pos);
    }

    function initBallColumns() {
        var i,
            column,
            ball;

        for (column = 1; column < 4; column += 1) {
            for (i = 0; i < 5; i += 1) {
                ball = createBall(Math.random() * 20 + 10, 100 * column, 100, layer);
                allowUserForceDrag(ball);
            }
        }
    }

    function initWallsAndScheduler() {
        var bottom = createBorder(200, 400, 400, 20, layer).setFill('#ccc'),
            left = createBorder(0, 200, 20, 400, layer).setFill('#ccc'),
            right = createBorder(400, 200, 20, 400, layer).setFill('#ccc'),
            top = createBorder(200, 0, 400, 20, layer).setFill('#ccc');

        lime.scheduleManager.schedule(function (dt) {
            var i;

            if (dt > 100) {
                dt = 100;
            }

            world.Step(dt / 1000, 3);

            for (i = 0; i < ballArray.length; i += 1) {
                updateFromBody(ballArray[i]);
            }

            updateFromBody(bottom);
            updateFromBody(left);
            updateFromBody(right);
            updateFromBody(top);

        }, this);
    }

    initBallColumns();
    initWallsAndScheduler();
    addDragger('Gravity', 75, 35);
}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('balls.start', balls.start);
