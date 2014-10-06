var stickies = { selectors: [],
		 init: function(selector) {
		     this.selectors.push(selector);
		 }
	       };

(function() {
    function Sticker(selector) {
	// If constructed without a selector, sticky effect is applied to
	// element with ID of stickything.
	if (!selector)
	    selector = "#stickything";
	var $sticky = $(selector);
	var position;
	// Div made to hold nav's place in document
	$sticky.before("<div class=\"placeholder\" style=\"display: inline\"></div>");

	// Refers to the placeholder div
	var $filler= $sticky.prev();
    	
	// Rerepresents whether or not nav is stuck
	var isStuck = false;

	// Returns true if previous element scrolled out of view
	function atTop() {
	    var docViewTop = $(window).scrollTop();
	    return (position <= docViewTop);
	}

	// Stick nav to top of viewport
	function stick() {
	    var left = $sticky.offset().left;
	    var style = getComputedStyle($sticky.get(0)).cssText;	    
	    if (!style) {
		style = getComputedStyleCssText($sticky.get(0));
	    }
	    $filler.attr("style", style);
	    $filler.css({"max-width": "100%"});
	    $sticky.css({"margin": 0, "position": "fixed", "top": 0, "left": left + "px"});
	    isStuck = true;
	}

	// Unstick the nav from top of viewport
	function unstick() {
	    $sticky.css({"margin": "", "position": "", "top": "", "left": ""});
	    $filler.attr("style", "display: inline;");
	    isStuck = false;
	}

	// Polyfill for getComputedStyle(element).cssText in Firefox
	function getComputedStyleCssText(element) {
	    var style = window.getComputedStyle(element);
	    var cssText;
	    	    
	    cssText = "";
	    for (var i = 0; i < style.length; i++) {
		cssText += style[i] + ": " + style.getPropertyValue(style[i]) + "; ";
	    }
	    
	    return cssText;
	}

	// Stick nav at top of previous element scrolled out of view
	this.check = function() {
	    if (atTop()) {
		if (!isStuck)
		    stick();
	    } else {
		if (isStuck)
		    unstick();
	    }
	};

	// Recalculate point at which nav should be stuck/unstuck.
	this.refreshPosition = function() {
	    var marginTop = parseInt($sticky.css('margin-top'), 10);
	    position = $filler.offset().top + marginTop;
	};
	
	this.refreshPosition();
    }
    
    $(document).ready(function() {
	// Initialize a StickyElement for each selector in
	// the stickies.selectors array
	var stickers = stickies.selectors.map(function(selector) {
	    return new Sticker(selector);
	});

	// Recalculate sticking point, then stick if necessary
	$(window).on("resize orientationChanged", function() {
	    stickers.forEach(function(element) {
		element.refreshPosition();
		element.check();
	    });
	});

	// Stick nav if necessary on scroll
	$(window).on("scroll", function() {
	    stickers.forEach(function(element) {
		element.check();
	    });
	});
    });    
})();

$(window).load(function() {
    var $circle = $(".circle");
    var diameter = $(".circle").innerWidth();
    $circle.css({"height": diameter + "px"});
    
    var $checker = $(".checkers");
    var width = $(".checkers").innerWidth();
    $checker.css({"height": width + "px"});

    var $header = $("header");
    var $headerContainer = $("header div.container");
    var headerPadding = Math.max(($header.innerHeight() - $headerContainer.innerHeight()) / 2, 0);
    $header.css({"padding-top": headerPadding + "px"});
    
    $(window).on("resize orientationChanged", function() {
	diameter = $(".circle").innerWidth();
	$circle.css({"height": diameter + "px"});
	
	width = $(".checkers").innerWidth();
	$checker.css({"height": width + "px"});

	headerPadding = Math.max(($header.innerHeight() - $headerContainer.innerHeight()) / 2, 0);
	$header.css({"padding-top": headerPadding + "px"});
    });
    
    var $nav = $("nav");
    $nav.children(".fa-bars").on("click", function() {
	$nav = $("nav");
	$nav.toggleClass("show");
    });
    $nav.find("a").on("click", function() {
	$nav.removeClass("show");
	var destination = $(event.currentTarget).attr("scroll");
	smoothScroll.animateScroll(null, destination, {"offset": 70, "updateURL": false});
    });
    $("html").on("click", function() {
    	$nav.removeClass("show");
    });
    $("body").on("click", "nav.show", function() {
    	event.stopPropagation();
    });
});
