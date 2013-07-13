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

balls.WIDTH = 600;
balls.HEIGHT = 480;

// entrypoint

balls.start = function () {
    "use strict";

    var director = new lime.Director(document.body, balls.WIDTH, balls.HEIGHT),
        gamescene = new lime.Scene(),
        layer = (new lime.Layer()).setPosition(30, 30),
        dragger = (new lime.Sprite()).setSize(15, 30).setFill(0, 255, 255).setPosition(0, 10),
        draggerLine = (new lime.Sprite()).setSize(150, 4).setFill(0, 255, 0).setPosition(75, 10);
    layer.appendChild(dragger);
    gamescene.appendChild(layer);

    director.makeMobileWebAppCapable();
    balls.inspect = new lime.Label().setPosition(200, 20).setText('');

    goog.events.listen(dragger, ['mousedown', 'touchstart'], function (e) {
        e.event.stopPropagation();
        var drag = e.startDrag(false, new goog.math.Box(10, 150, 10, 0));

        goog.events.listen(drag, lime.events.Drag.Event.MOVE, function () {
            var pos = dragger.getPosition();
            console.log(Math.round(pos.x) + ' ' + Math.round(pos.y));
        });

    });


    layer.appendChild(draggerLine);

    // set active scene
    director.replaceScene(gamescene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('balls.start', balls.start);
