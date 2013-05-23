(function($) {
    var Sorry = function() {
	var $body = $('body');
	var $header = $('body > header');
	var $footer = $('body > footer');
	var $window = $(window);
	var $loader = $body.find('#loader')
	var $container = $body.find('.container');
	var $intro = $container.find('#intro section');

	var floor = Math.floor;


	resize();	
	init();

	$window.resize(function() {
	    resize();
	});
	

	function resize() {
	    var wh = $window.height();
	    var ww = $window.width();
	    
	    var max = (wh < ww) ? wh : ww;

	    $body.css('font-size', (max * .2 + 10) + '%');	 // .04  + 52 

	    var hh = floor($header.height());
	    var fh = floor($footer.height());
    
	    var ch = wh - hh - fh;
	    $container.height( ch);
	}

	function init() {
	    $loader.remove();
	    $container.find('#tool').remove();
	    $container.find('#info').remove();
	    $intro.empty();
    
	    $header.css('visibility', 'visible');
	    $footer.css('visibility', 'visible');
	    $container.css('opacity', 1);

	    var $message = $('<div class="sorry"><h1>Vous ne pouvez pas voir ce site !</h1><p>Sorry sorry</p></div>');
	    $intro.append($message);


	}

    };

    window.Sorry = Sorry;

})(jQuery);