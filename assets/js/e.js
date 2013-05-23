"use strict";

(function($) {
//    $.support.cors = true;
    var E = function () {
	var items;

	var M = Math;
	var abs = M.abs;
	var cos = M.cos;
	var sin = M.sin;
	var floor = M.floor;
	var sqrt = M.sqrt;
	var ceil = M.ceil;
	var round = M.round;

	var PI = M.PI;


	var timer;
	var speed = 800;
	var ips = 30;
	var interval = speed / ips;
	var nb_step = ips * speed / 1000;

	var canvases = {};

	var state = {
	    step: 2012,
	    tooltip: {ref: false, te: false},
	    page: '',
	    ref: {},
	    te: {},
	    loaded: false,
	    factpopup: false
	};


	var percent = .77; // 77% de l'espace initial pour le premier element affiche

	var elements;

	var items = {
	    ref: {},
	    te: {}
	};

	var timeline = {
	    ref: [],
	    te: []
	};

	var cells = {
	    'autres renouvelables': 'autres',
	    'nucleaire': 'nucleaire',
	    'fossile': 'fossile',
	    'eolien': 'eolien',
	    'solaire': 'solaire',
	    'hydro': 'hydro'
	}

	var colors = {
	    autres: 'c8506b',
	    hydro: '4fbdca',
	    solaire: 'fbc51d',
	    eolien: '019934',
	    fossile: '826070',
	    nucleaire: '547483'
	};


	var URL = './proxy.php?gid=';
	var sheets = {
	    2012: 1,
	    2017: 2,
	    2022: 3,
	    2027: 4,
	    2032: 5
	};


	var info_cells = 16;


	var nrj_data = {
	    2012: {},
	    2017: {},
	    2022: {},
	    2027: {},
	    2032: {}
	};

	var completed = 0;
	for (var i in nrj_data) {
	    completed --;
	}

	var infos = {
	    ref: {},
	    te: {}
	};

	var cursor = 0;

	var contentWidth = 0;

	var $window = $(window);
	var $body = $('body');
	var $fs = $body.find('.fs');
	var $header = $fs.find('.h');
	var $footer = $('.fs > footer');

	var $share = $header.find('.share');

	var $container = $('.container');
	var $loader = $('#loader');
	var $loaderCanv = $loader.find('canvas');
	var $loaderLogo = $loader.find('.logo');

	var loaderCanv = $loaderCanv[0];
	var loaderCtx = loaderCanv.getContext('2d');

	var $timeline = $('#timeline');

	var $intro = $('#intro');
	var $info = $('#info');
	var $tool = $('#tool');
	var $plus = $tool.find('.plus');
	var $infoJ = $info.find('.j');
	var $sidebar = $info.find('.sidebar');
	var $legend = $tool.find('.legend');

	var $dref = $tool.find('#ref');
	var $dte = $tool.find('#te');

	var $content = $tool.find('.content');
	var $results = $tool.find('.results');
	var $canvas_ref = $dref.find('canvas');
	var $canvas_te = $dte.find('canvas');
	var $graphic_ref = $dref.find('.graphic');
	var $graphic_te = $dte.find('.graphic');

	var $stepper = $tool.find('#stepper');
	var $ca = $stepper.find('.ca');
	var $play = $('.play');
	var $facts = $dte.find('.facts');


	var $pages = {
	    intro: $intro,
	    tool: $tool,
	    info: $info,
	};
	




	var PI = Math.PI;
	var PI2 = PI * 2;
	var PI2s5 = PI2/6;
	var PIstep = PI/38;
	var PIstart = -PI/2;
	var PIend = PI + PI/2;
	var endAngle = -3 * PIstart;
	var lastAngle = PIstart;


	resize();	

	var loaderTimer = setInterval(loaderAnim, 60);


	loadData();

	$window.resize(function() {
	    resize();
	});
	

/*
 *
 */
	function loadData() {

	    for (var s in sheets) {
		(function(s) {
		    $.ajax(URL + sheets[s], {
			type: 'GET',
			dataType: 'json',
			cache: false,
			error: function(a, b, c) {
			},
			success:function(data, a, b, c) {
			    nrj_data[s] = data;
			    completed += 1;
			    if (completed == 0) {
				init();
			    }
			}
		    });
		})(s);
	    }
	}



/*
 *
 */
	function loaderAnim() {

	    var w = loaderCanv.width;

	    var c = w * .5;
	    var r = c * .8
	    var comp = completed + 6;
	    var angle;

	    angle = lastAngle + .1 ;

	    if (angle > PIend) {
		angle = PIstart;
	    }

	    loaderCanv.width = w;

	    loaderCtx.fillStyle = "#009ac5";


	    loaderCtx.save();
	    loaderCtx.translate(c,c);
	    var scale = w;

	    loaderCtx.beginPath();
	    loaderCtx.arc(0, 0, scale * .24, 0, PI2, false);
	    loaderCtx.fill();
	    loaderCtx.closePath();

	    scale = scale *.3 / 100;
	    loaderCtx.globalCompositeOperation = 'destination-out';

	    loaderCtx.save();
	    loaderCtx.translate(-w * .02, -w * .02);
	    loaderCtx.beginPath();

	    loaderCtx.moveTo( scale * -3.56, scale * 54.35 );
	    loaderCtx.lineTo( scale * -4.39, scale * 53.89 );
	    loaderCtx.lineTo( scale * 24.30, scale * -38.35 );
	    loaderCtx.lineTo( scale * 38.44, scale * -26.27);
	    loaderCtx.lineTo( scale * -3.56, scale * 54.35 );

	    loaderCtx.moveTo( scale * 21.54, scale * -36.9 );
	    loaderCtx.lineTo( scale * 13.6, scale * -12.83 );
	    loaderCtx.lineTo( scale * -4.56, scale * -9.20 );
	    loaderCtx.lineTo( scale * -13.52, scale * -27.65 );
	    loaderCtx.lineTo( scale * 19.24, scale * -36.10 );
	    
	    loaderCtx.moveTo( scale * 31.51, scale * -80.90 );
	    loaderCtx.lineTo( scale * 8.29, scale * -35.39 );
	    loaderCtx.lineTo( scale * -13.27, scale * -30.34 );
	    loaderCtx.lineTo( scale * 4.15, scale * -86.48);
	    loaderCtx.closePath();

	    loaderCtx.fill();
	    

	    loaderCtx.restore();
	    loaderCtx.restore();

	    loaderCtx.fillStyle = "#cecfd1";
	    var r2 = r * .02; 
	    for (var i = PIstart; i < angle; i+= PIstep) {
		loaderCtx.beginPath();
		loaderCtx.arc(c + r * cos(i), c + r * sin(i), r2, 0, PI2, false);
		loaderCtx.fill();
	    }

	    lastAngle = angle;
	}



/*
 *
 */
	function track(url) {
//	    console.info('track : ',url);
	    var _gaq = window._gaq || [];
	    _gaq.push(['_trackPageview', '/france/fr/projetE/'+url]);
	}

	function trackEvent(action, label, value) {


	    var _gaq = window._gaq || [];
	    var a = ['_trackEvent', 'ProjetE'];
	    a.push(action);
	    if (label) a.push(label);
	    if (value) a.push(value);
//	    console.info('event : ', a);
	    _gaq.push(a);

	}

/*
 *
 */
	function resize() {
	    var wh = $window.height();
	    var ww = $window.width();
	    
	    if (state.factpopup) hideFactPopup();

	    var st = state.tooltip;
	    if (st.ref || st.te) {
		hideTooltip();
	    }

	    if (!state.loaded) {
		var max = (wh < ww) ? wh : ww;
		var m2 = floor(max / 3);
		$loaderCanv.prop('width', m2);
		$loaderCanv.prop('height', m2);
		$loaderCanv.css('margin-top', (wh - m2) / 2);
	    }
	    
	    var fontSize = round( (sqrt(wh*wh + ww*ww)/10) );
	    if (fontSize > 110) fontSize = 110;
    	    $fs.css('font-size', fontSize + '%');	    

	    var hh = floor($header.height());
	    
	    var th = floor($timeline.height());
	    
	    var fh = floor($footer.height());

	    var lh = floor($legend.height()) * 1.3;

	    var tpb = parseInt($timeline.css('padding-bottom'), 10);

	    var ch = wh - hh - fh;
	    
	    $container.css('padding-top', hh);
	    $container.height( ch);
	    
	    var h2 = floor((ch - th - tpb - lh)/2);


	    $dref.height(h2);
	    $dte.height(h2);
	    var cw = 0;

	    $content.css('width', 'auto');
	    $content.each(function() {
		var w = $(this).width();

		if (w > cw) cw = w;
	    });

	    cw *= 1.4;
	    $content.width(cw);
	    contentWidth = cw;

	    var rw = 0;
	    $results.each(function() {
		var w = $(this).width();
		if (w > rw) rw = w;
	    });


	    var w = $dte.width() - cw - rw - 2 * parseInt($content.css('margin-left'), 10) - 3;


	    $plus.css('top', ch - h2 - lh - $plus.height()/2);
	    $plus.css('right', $results.find('.data').width() );

	    $graphic_te.width(w);
	    $graphic_ref.width(w);
	    $canvas_ref.prop('width', w);
	    $canvas_ref.prop('height', h2);
	    $canvas_te.prop('width', w);
	    $canvas_te.prop('height', h2);

	    $infoJ.css('padding-left', $sidebar.width() * 1.4);
	    
	}


/*
 *
 */
	function hideTooltip(d) {
	    var st = state.tooltip;

	    if (d) {
		st[d].remove();
		st[d] = false;
	    }
	    else {
		for (var i in st) {
		    if (st[i]) {
			st[i].remove();
			st[i] = false;
		    }	    
	    
		}
	    }
	}


/*
 *
 */
	function showTooltip(data) {

	    var conso = infos[data.canvas][state.step].figures[data.id];
	    var pc = infos[data.canvas][state.step].percent[data.id];

	    var tooltip = '<div class="t">'+data.id.toUpperCase()+'&nbsp;|&nbsp;'+pc+'&thinsp;%</div><div class="b">'+conso+' TWh</div>';

	    var c = data.coords;
	    var angle = c.angle;
	    var distance = c.distance + 8;

	    var $canvas = elements[data.canvas];
	    var $parent = $canvas.parent();

	    var $d = $('<div></div>');

	    $d.data('nrj', data.id);
	    $d.html(tooltip);
	    $d.addClass('tooltip '+data.id.toLowerCase());
	    $parent.prepend($d);

	    var w = $canvas.width() / 2;

	    var x = (distance * cos(angle));

	    if (x < 0) {
		x -= $d.width();
	    }

	    x += w;

	    var y = abs( distance * sin(angle) ) ;
	    if (data.position == 'bottom') {
		y = $parent.height() - $d.height() - y;
	    }

	    $d.css({
		marginTop: y,
		marginLeft: x
	    });

	    state.tooltip[data.canvas] = $d;

//	    track(state.step+'/tooltip/'+data.scenario+'/'+data.id);
	    trackEvent('tooltip', state.step+'-'+data.scenario+'-'+data.id);
	}


/*
 *
 */	
	function clickHandler(e, data) {
	    var st = state.tooltip;
	    var dc = data.canvas;
	    if (st[dc]) {
		hideTooltip(dc);
	    }
	    showTooltip(data);
	}
	

/*
 *
 */
	function updateContent(step) {
	    $results.fadeIn(400);
	    $facts.fadeIn(400);

	    var inf = nrj_data[ step ];
	    $facts.find('button').remove();
	    var i = info_cells;



	    var $rte = $results.filter('[data-scenario=te]')
	    var $rted = $rte.find('.detail');

	    var $rref = $results.filter('[data-scenario=ref]');
	    var $rrefd = $rref.find('.detail');

	    var irs = infos.ref[step];
	    var iref = irs.figures;
	    var ipc = irs.percent;

	    var tref = 0;
	    var tte = 0;
	    var totalref = parseInt(inf[9][1], 10);
	    var totalte = parseInt(inf[9][4], 10);


	    $rte.find('.prod.info .res').html(totalte + ' TWh');
	    $rref.find('.prod.info .res').html(totalref + ' TWh');


	    var coutref = parseInt(inf[9][2], 10);
	    var coutte = parseInt(inf[9][5], 10);

	    if (!isNaN(coutte) && !isNaN(coutref)) {

		$rte.find('.cout.info .res').html(coutte + ' Md€');
		$rref.find('.cout.info .res').html(coutref + ' Md€');
		$rte.find('.coutprod').css('visibility', 'visible');
		$rref.find('.coutprod').css('visibility', 'visible');
	    }
	    else {
		$rte.find('.coutprod').css('visibility', 'hidden');
		$rref.find('.coutprod').css('visibility', 'hidden');
	    }


	    $rrefd.empty();
	    for (var f in iref) {
		var r = parseInt(iref[f], 10);
		var pc = parseFloat(ipc[f]);
		var b = $('<li class="d"><span class="item">'+f + '</span> <span class="pc">' + pc +'&thinsp;%</span> <strong class="'+f+'">'+r+' TWh</strong></li>');
		$rrefd.append(b);
	    }


	    var its = infos.te[step];
	    var ite = its.figures;
	    var ipc = its.percent;
	    $rted.empty();
	    for (var f in ite) {
		var r = parseInt(ite[f], 10);
		var pc = parseFloat(ipc[f]);

		var b = $('<li class="d"><span class="item">'+f + '</span> <span class="pc">' + pc +'&thinsp;%</span> <strong class="'+f+'">'+r+' TWh</strong></li>');
		$rted.append(b);
	    }


// key elements
	    do {
		var line = inf[i];
		if (!line) {
		    break;
		}
		(function(l) {
		    var f = $('<button class="fact">'+l[0]+'</button>');

		    f.click(function() {
//			var $t = $(this);
			showFactPopup( l );
		    });

		    $facts.append(f);
		})(line);

		i++;
	    }
	    while (true);
	    
	    track(step);
	}



/*
 *
 */
	function addStep(scenario, step, figures, pcent, total) {
	    infos[scenario][step] = {
		figures: figures,
		percent: pcent
	    };

	    var data = {
		calculated: {},
		total: total
	    };

	    var dc = {};
	    for (i in figures) {
		dc[i] = PI / (total / figures[i]);
	    }
	    
	    data.calculated = dc;

	    var ts = timeline[scenario];
	    if (ts.length == 0) {
		items[scenario][step] = 0;
		data.step = 1*step;
		ts.push(data);
	    }
	    else {
		var last = ts[ ts.length - 1];
		var lc = last.calculated;
		var lt = last.total;
		var dt = data.total;

		for (var j = 1; j < nb_step; j++) {
		    var calc = {};
		    for (i in lc) {
			calc[ i ] = lc[ i ] + j * ((dc[ i ] - lc[ i ]) / nb_step);
		    }
		    
		    var tot = lt + j * ((dt - lt) / nb_step);

		    ts.push( {calculated: calc, total: tot, step: 1 * last.step} );
		}

		var calc = {};
		for (var i in lc) {
		    calc[ i ] = dc[i]; 
		}


		var l = ts.push({calculated: calc, total: dt, step: 1 * step});

		items[scenario][step] = l - 1;

	    }


	    return percent / total; // ratio
	    
	}


/*
 *
 */
	function showPage(page) {
	    var w = 0;
	    var i = 0;
	    for (var p in $pages) {
		if (p == page) break;
		w -= $pages[p].width();
		i++;
	    }

	    switch (p) {
	    case 'tool':
		resize();
		var s = state.step;
		updateContent(s);
		var canv = canvases;
		canv.ref.render(timeline.ref[items.ref[s]]);
		canv.te.render(timeline.te[items.te[s]]);
		break;

	    case 'info':
		track('comprendre');
		break;

	    case 'intro':
		track('');
		break;
	    }
	    $container.animate({marginLeft: (-i*100)+'%'}, 800 );

	    return false;
	}


/*
 *
 */
	function animate(end, $obj) {
	    end = 1 * end;

	    var start = state.step;

	    if (state.factpopup) hideFactPopup();

	    var st = state.tooltip;
	    if (st.ref || st.te) {
		hideTooltip();
	    }


	    clearInterval(timer);

	    var direction;
	    var keyframes = {};
	    if (start < end) {
		for (var i = start; i < end; i += 5) {
		    keyframes[ items.ref[i] ] = true;
		}
		direction = 1;
	    }
	    else {
		for (var i = start; i > end; i -= 5) {
		    keyframes[ items.ref[i] ] = true;
		}

		direction = -1;
	    }

	    var index = items.ref[end];
	    $results.fadeOut(400);
	    $facts.fadeOut(400);

	    timer = setInterval(function() {
		if (cursor == index) {
		    var ref = timeline.ref[cursor];
		    var te = timeline.te[cursor];
		    state.ref = ref; 
		    state.te = te;
		    
		    var canv = canvases;
		    canv.ref.render(ref);
		    canv.te.render(te);
		    cursor = cursor + direction ;

		    // fin
		    $ca.filter('[data-step="'+state.step+'"]').removeClass('active');
		    $ca.filter('[data-step="'+end+'"]').addClass('active');

		    state.step = end;
		    updateContent(end);
		    clearInterval(timer);
		}
		else {
		    var ref = timeline.ref[cursor];
		    var te = timeline.te[cursor];


		    if (keyframes[cursor] && state.step != ref.step) {
			var s = ref.step;
//			updateContent(s);

			$ca.filter('[data-step="'+state.step+'"]').removeClass('active');
			$ca.filter('[data-step="'+s+'"]').addClass('active');
			state.step = s;
		    }

		    state.ref = ref; 
		    state.te = te;
		    
		    var canv = canvases;
		    canv.ref.render(ref);
		    canv.te.render(te);
		    cursor = cursor + direction ;
		}
		
	    }, interval);


	}
	

/*
 *
 */
	function showFactPopup(d) {
	    if (state.factpopup) hideFactPopup();

	    var s = state.step;


	    var f = $('<div class="factpopup"></div>');
	    var d1 = ''+s, d2 = ''+(s+5);
	    var ad1 = d1.split('');
	    var ad2 = d2.split('');


	    f.append('<div class="g"><header><div class="date">'+ad1.join(' ')+'&nbsp; - '+ad2.join(' ')+'</div><div class="title">'+d[0]+'</div><div class="close"></div></header></div>');
	    f.find('.close').click(function() {
		hideFactPopup();
	    });

	    if (d[1] != '' || d[2] != '') {
		f.append('<em><strong>'+d[1].replace(/^\'/, "")+'</strong> <span>'+d[2]+'</span></em>');
	    }
	    f.append('<p>'+d[3]+'</p>');

	    f.width(contentWidth);
	    $facts.prepend( f );

	    state.factpopup = f;
	    track(s+'/element-cle/'+d[0]);
	}


/*
 *
 */
	function hideFactPopup() {
	    state.factpopup.remove();
	    state.factpopup = false;
	    
	}


/*
 *
 */
	function init() {
	    state.loaded = true;
	    clearInterval(loaderTimer);

	    $loader.fadeOut(500, function() {

		$loader.data('hidden', true);
		$header.css('visibility', 'visible');
		$footer.css('visibility', 'visible');
		$container.animate({opacity: 1}, 500)

	    });


	    elements = {
		ref: $canvas_ref,
		te: $canvas_te
	    }




	    var cw = new CanvasWrapper($canvas_ref, 'ref', 'top');
	    var cw2 = new CanvasWrapper($canvas_te, 'te', 'bottom');


	    cw.setColors(colors);
	    cw2.setColors(colors);
	    
	    cw.on('clicked', clickHandler);
	    cw2.on('clicked', clickHandler);

	    cw.on('mouseout', function() {
		$canvas_ref.removeClass('over');
		hideTooltip();
	    });

	    cw2.on('mouseout', function() {
		$canvas_te.removeClass('over');
		hideTooltip();
	    });

	    cw.on('mouseover', function(e, d) {
		$canvas_ref.addClass('over');
		cw.click(d.id);
		cw2.click(d.id);
	    });
	    cw2.on('mouseover', function(e, d) {
		$canvas_te.addClass('over');
		cw.click(d.id);
		cw2.click(d.id);
	    });

	    canvases = {ref: cw, te: cw2};

	    $play.click(function() {
		animate('2032', $('.ca').last());
		trackEvent('navigation', 'play', state.step);
	    });

	    $plus.click(function() {
		var d = $results.find('.detail');
		var v = d.data('visible');
		if (v) {
		    d.css('visibility', 'hidden');
		    d.data('visible', false);
		}
		else {
		    d.css('visibility', 'visible');
		    d.data('visible', true);
		    track(state.step+'/plus');
		}


	    });

	    $ca.click(function() {
		animate($(this).data('step'), $(this));
	    });

	    $container.find('.showPageTool').click(function() {
		showPage('tool');
	    });

	    $stepper.find('.last').click(function() {
		showPage('info');
	    });



	    $body.find('button').hover(function() {
		$(this).addClass('hover');
	    }, function() {
		$(this).removeClass('hover');
	    });

	    $body.find('a').click(function() {
		trackEvent('lien externe', $(this).prop('title'));
	    });

	    $header.find('h1').click(function() {
		showPage('intro');
		trackEvent('navigation', 'logo home');
	    });

	    $info.find('.sommaire button').click(function() {
		var $t = $(this);
		var s = $t.attr('rel');
		var d = $infoJ.find('section#' + s);


		var start = parseInt($infoJ.position().top, 10);
		var end = parseInt(d.position().top, 10);
		var es = end - start;

		var speed = floor( es * 6 );

		$infoJ.parent().animate({scrollTop: es}, 500);
		trackEvent('navigation', 'comprendre '+s);
	    });


	    $share.find('div').click(function() {
		var s = $(this).data('share');
		var url;
		switch (s) {
		case 'facebook':
		    url = 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(location.href)+'&t='+encodeURIComponent(document.title);
		    break;

		case 'twitter':
		    url = 'http://twitter.com/intent/tweet?text='+encodeURIComponent($(this).data('message'))+'&url='+location.href;
		    break;
		}

		window.open(url,'sharer','toolbar=0,status=0,width=626,height=436');
		trackEvent('share', s, state.step);
	    });

	    var ls = $legend.find('span');

	    var f = function() {
		var i = $(this).data('nrj');

		if (state.tooltip.ref && i == state.tooltip.ref.data('nrj')) {
		    hideTooltip();
		}
		else {
		    cw.click(i);
		    cw2.click(i);
		}

	    };

	    var f2 = function() {
		hideTooltip();
	    };

	    ls.click(f);

	    var j = 0, rr, rt;

	    for (var i in nrj_data) {
		var inf = nrj_data[i];
		if (state.step == 0) {
		    state.step = 1*i;
		}

		var fig = {
		    nucleaire: 0,
		    fossile: 0,
		    eolien: 0,
		    solaire: 0,
		    hydro: 0,
		    autres: 0
		};
		var pc = {
		    nucleaire: 0,
		    fossile: 0,
		    eolien: 0,
		    solaire: 0,
		    hydro: 0,
		    autres: 0
		};

		for (var k = 2; k <= 7; k++) {
		    fig[ cells[inf[k][0]] ] = 1*inf[k][1];
		    pc[ cells[inf[k][0]] ] = 1*inf[k][3];
		}

		rr = addStep('ref', i, fig, pc, 1*inf[9][1]);

		var fig = {
		    nucleaire: 0,
		    fossile: 0,
		    eolien: 0,
		    solaire: 0,
		    hydro: 0,
		    autres: 0
		};
		var pc = {
		    nucleaire: 0,
		    fossile: 0,
		    eolien: 0,
		    solaire: 0,
		    hydro: 0,
		    autres: 0
		};

		for (k = 2; k <= 7; k++) {
		    fig[ cells[inf[k][0]] ] = 1*inf[k][4];
		    pc[ cells[inf[k][0]] ] = 1*inf[k][6];
		}

		rt = addStep('te', i, fig, pc, 1*inf[9][4]);

		if (j == 0) {
		    state.ref = items.ref[i];
		    state.te = items.te[i];
		    cw.setRatio(rr);
	    	    cw2.setRatio(rt);
		}
		j ++;


	    }

	    _gaq = window._gaq || [];
	    _gaq.push(['_setAccount', 'UA-57175-1']);

	    track('');
	}

    }

    window.E = E;
})(jQuery);
