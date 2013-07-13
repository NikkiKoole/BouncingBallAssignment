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
balls.HEIGHT = 480;

// entrypoint

balls.start = function () {
    "use strict";

    var director = new lime.Director(document.body, balls.WIDTH, balls.HEIGHT),
        gamescene = new lime.Scene(),
        title = new lime.Label().setSize(50,40).setFontSize(20).setText('Gravity').setPosition(50, 15),
        layer = (new lime.Layer()).setPosition(30, 30),
        dragger = (new lime.Sprite()).setSize(15, 30).setFill(0, 255, 255).setPosition(0, 10),
        draggerLine = (new lime.Sprite()).setSize(150, 4).setFill(255, 0, 255).setPosition(75, 10);
      
    layer.appendChild(draggerLine);
    layer.appendChild(title);
    layer.appendChild(dragger);

    gamescene.appendChild(layer);
    director.makeMobileWebAppCapable();
    director.replaceScene(gamescene);
    
    // the gravity dragger
    goog.events.listen(dragger, ['mousedown', 'touchstart'], function (e) {
        e.event.stopPropagation();
        var barWidth = 150;
        var drag = e.startDrag(false, new goog.math.Box(10, barWidth, 10, 0));

        goog.events.listen(drag, lime.events.Drag.Event.MOVE, function () {
            var pos = dragger.getPosition();
            var minimumGravity = 1;
            var maximumGravity = 1000;
            var range = maximumGravity - minimumGravity;
            var desiredGravity = ((pos.x / barWidth) * range) + minimumGravity;
            console.log(desiredGravity);
        });
    });


    

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('balls.start', balls.start);
