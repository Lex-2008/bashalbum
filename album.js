function addCssToDocument() {
	var style = document.createElement("style");
	style.type="text/css";
	style.innerHTML=[
		'.viewer img { display: block; margin: auto; max-width:100%; max-height:100%; }',
		'.text, .thumbnails { text-align: center; }',
		'.thumbnails a{ display:inline-block; }',
		'.thumbnails.small { overflow-x: scroll; white-space: nowrap; }',
	].join('');
	document.getElementsByTagName("head")[0].appendChild(style);
}
addCssToDocument();



function outerHeight(elm) {
	if(elm.currentStyle) {
		return parseFloat(elm.currentStyle.height) +
				parseFloat(elm.currentStyle.paddingTop) +
				parseFloat(elm.currentStyle.paddingBottom) +
				parseFloat(elm.currentStyle.marginTop) +
				parseFloat(elm.currentStyle.marginBottom);
	}
	if(document.defaultView && document.defaultView.getComputedStyle) {
		var style = document.defaultView.getComputedStyle(elm, '');
		return parseFloat(style.getPropertyValue('height')) +
				parseFloat(style.getPropertyValue('padding-top')) +
				parseFloat(style.getPropertyValue('padding-bottom')) +
				parseFloat(style.getPropertyValue('margin-top')) +
				parseFloat(style.getPropertyValue('margin-bottom'));
	}
}

function openLayer() {
	var viewer = document.querySelector('.viewer');
	var thumbnails = document.querySelector('.thumbnails');
	var text = document.querySelector('.text');
	// start loading the image
	viewer.querySelector('img').src = this.href;
	// prepare the thumbnail box
	thumbnails.className='thumbnails small';
	if(document.querySelector('.selected'))
		document.querySelector('.selected').className = '';
	this.className = 'selected';
	if(this.offsetLeft < thumbnails.offsetLeft+thumbnails.scrollLeft
	|| this.offsetLeft > thumbnails.offsetLeft+thumbnails.scrollLeft+thumbnails.offsetWidth-this.offsetWidth)
		thumbnails.scrollLeft=this.offsetLeft+this.offsetWidth/2-thumbnails.offsetWidth/2-thumbnails.offsetLeft
	// prepare the text
	text.innerHTML=comments[this.getAttribute('href')];
	// prepare the viewer
	viewer.style.height=window.innerHeight - outerHeight(text) - outerHeight(thumbnails) + 'px';
	viewer.style.display = 'block';
	window.scrollTo(0,viewer.offsetTop);
	return false; //to cancel <a href navigation
}

function fixLinks(elem) {
	var elems = elem.querySelectorAll('.thumbnails a');
	for( var i=0; i<elems.length; i++) {
		elems[i].onclick=openLayer;
	}
}
fixLinks(document.querySelector('.thumbnails'));



function fixComments() {
	if(!window.comments)
		comments={};
	for(var i in names) {
		if(!comments[names[i]])
			comments[names[i]]="";
	}
}
fixComments();



// how hard can it be to create an event listener?
// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
function createWheelListener(window,document) {
    var prefix = "", _addEventListener, support;
    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }
    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
              "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );
        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };
    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );
            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };
            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }
            // it's time to fire the callback
            return callback( event );
        }, useCapture || false );
    }
}
createWheelListener(window,document);


function scroll(evt) {
	var scrollTarget = document.querySelector('.thumbnails');
	if(scrollTarget.scrollWidth > scrollTarget.offsetWidth) {
		var delta = Math.max(-1, Math.min(1, evt.deltaY));
		var scrollItems = document.querySelectorAll('.thumbnails a');
		var scrollStep = scrollItems[1].offsetLeft - scrollItems[0].offsetLeft;
		scrollTarget.scrollLeft += delta*scrollStep;
		evt.preventDefault();
	}
}
addWheelListener(document.querySelector('.thumbnails'), scroll, false);

