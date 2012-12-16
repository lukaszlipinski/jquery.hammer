jquery.hammer
=============

jQuery plugin for Hammer.js. Allows to use Hammer.js events directly on jQuery elements.

###Supported events:
- hold
- tap
- doubletap
- transformstart
- transform
- transformend
- dragstart
- drag
- dragend
- swipe
- release

### Hints
Hammer object is saved in jQuery data, so it's possible to get access to it by:

    $("#element").data("hammer");

###Example
    $("#element").on('tap', function(e) {
        //do something
    });
     
