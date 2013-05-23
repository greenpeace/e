"use strict";

function CanvasWrapper($canvas, id, position) {
    var $ = jQuery;

    var canvas = $canvas[0];
    var M = Math;
    var cos = M.cos;
    var sin = M.sin;
    var atan = M.atan;
    var sqrt = M.sqrt;
    var abs = M.abs;
    var floor = M.floor;

    var PI = M.PI;
    var PI2 = PI * 2;
    var PIs2 = PI/2;
    var PIsep = PI * .3;
    var PI3s2 = PI2 -PIs2;
    var inside = false;

    var colors = {};

    var radius;
    var weight;

    var width, height, ratio;
    var centerX, centerY;

    var anticlockwise = false;
    if (position == 'bottom') {
	anticlockwise = true;
    }

    var direction = (anticlockwise) ? -1 : 1 ;

    var calculated_datas = [];

    var current_datas;

    var _evt = $({});

    var context = canvas.getContext('2d');


    resize();


    $(window).resize(function() {
	resize();
    });



    canvas.onclick = function(evt) {
	var c = getPosition(evt);
	if (!c.inside) return;
	
	var md = getMouseData(c.angle);

	trigger('clicked', {
	    coords: {distance: radius, angle: md.angle},
	    canvas : id,
	    id: md.theme,
	    position: position,
	    scenario: md.scenario
	});
    }


    canvas.onmousemove = function(evt) {
	var c = getPosition(evt);
	if (c.inside) {
	    var md = getMouseData(c.angle);
	    trigger('mouseover', {
		coords: {distance: radius, angle: md.angle},
		canvas : id,
		id: md.theme,
		position: position,
		scenario: md.scenario
	    });
	}
	else {
	    trigger('mouseout');
	}
    }

    canvas.onmouseout = function(evt) {
	trigger('mouseout');
    }


    function getMouseData(angle) {

	var current = 0;

	for (var i in calculated_datas) {
	    if (angle >= current && angle <= calculated_datas[i]) {
		var theme = i;
		var center = current + (calculated_datas[i] - current)/2; 
	    }
	    current = calculated_datas[i];
	}
		
	
	var s;
	switch(id) {
	case 'te':
	    s = 'greenpeace'
	    break;
	    
	case 'ref':
	    s = 'conventionnel';
	    break;
	}
	return {
	    angle: center, theme: theme, scenario: s
	}
    }


    function resize() {
	width = $canvas.width();
	height = $canvas.height();
	centerX = floor( width / 2 );
	centerY = anticlockwise * height;
	render(current_datas);
    }


    function getPosition(evt) {
	var ect = $(evt.currentTarget).offset();
	var x = evt.clientX - ect.left - centerX;
	var y = evt.clientY - ect.top;

	if (anticlockwise) {
	    y = abs(y - centerY);
	}

	var distance = sqrt(x*x + y*y);
	var angle = atan(y/x);

	if (x < 0) {
	    angle += PI;
	}

	if (distance <= radius && distance >= radius - weight) {
	    inside = true;
	}
	else {
	    inside = false;
	}

	return {distance:distance, angle:angle, inside:inside};
    }



/*
 *
 */
    function render(d) {

	if (!d) return;
	current_datas = d;

	canvas.width = canvas.width;
	var ctx = context;

	ctx.translate(centerX, centerY);
	
	var out = 0, res = 0;
	var separators = {};
	var h = height;
	if (width < 2 * height) {
	    h = width / 2; 
	}

	radius = d.total * h * ratio * .9;

	weight = (2*height < width) ? height / 4 : width / 9;

	var radius1 = radius + 1;


	for (var i in d.calculated) {
	    ctx.fillStyle = '#' + colors[i];

	    ctx.beginPath();
	    res = out + ( direction * d.calculated[i] );

	    calculated_datas[i] = direction * res;

	    ctx.arc(0, 0, radius, out, res, anticlockwise);
	    ctx.lineTo(0,0);
	    ctx.closePath();
	    ctx.fill();

	    separators[i] = [radius1 * cos(res), radius1 * sin(res), res];
	    out = res;

	}
	
	delete separators.nucleaire;

	ctx.closePath();
	var sep_data = [];

	var s;
	for (i in separators) {
	    s = separators[i];

	    if (i == 'eolien') {
		ctx.lineWidth = 3;
	    }
	    else {
		ctx.lineWidth = .5;
	    }
	    ctx.strokeStyle = 'rgb(255,255,255)';
	    ctx.beginPath();
	    ctx.moveTo(s[0], s[1]);
	    ctx.lineTo(0,0);
	    ctx.closePath();
	    ctx.stroke();
	}


	var radius2, radius3;	

	if (radius > weight) {
	    radius2 = radius - weight/2;
	    radius3 = radius - weight;
	}
	else {
	    radius = weight;
	    radius2 = radius / 2;
	    radius3 = 0;

	}

	ctx.strokeStyle = 'rgb(255,255,255)';
	var b;


	var rap = PIsep / radius; 
	var rap2 = rap*2, rap4 = rap*4;

	for (var a = - PIs2; a < PI3s2; a += rap4) {
	    b = a + rap2;
	    ctx.beginPath();
	    ctx.arc(0, 0, radius2, direction * a, direction * b, anticlockwise);
	    ctx.stroke();
	}



	// cache
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = '#000000';
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.arc(0, 0, radius3, 0, PI2, anticlockwise);
	ctx.fill();    

    }
    


    function on(a,b) {
	_evt.on(a,b);
    }

    function trigger(a,b) {
	_evt.trigger(a,b);
    }






/*  PUBLIC STUFF
 *
 */
    return  {

	trigger: trigger,

	on: on,

	render: render,
	
	setRadius: function(r) {
	    radius = r;	    
	},
	
	setColors:function(c) {
	    colors = c;
	},

	setRatio: function(r) {
	    ratio = r;
	},

	click: function(item) {
	    var current = calculated_datas[item];
	    var prev = 0;
	    for (var i in calculated_datas) {
		if (i == item) {
		    var angle = current + (prev - current)/2; 
		    break;
		}
		prev = calculated_datas[i];
	    }



	    var s;
	    switch(id) {
	    case 'te':
		s = 'greenpeace'
		break;

	    case 'ref':
		s = 'conventionnel';
		break;
	    }

	    trigger('clicked', {
		coords: {distance: radius, angle: angle},
		canvas : id,
		id: item,
		position:position,
		scenario: s
	    });
	}
    };

}
