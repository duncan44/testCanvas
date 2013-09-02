

m3D = {};
m3D.getPosition = function(id){
	var res = window.getComputedStyle(document.getElementById(id)).webkitTransform;
	res = res.replace("matrix3d(","");
	res = res.replace("(","");
	res = res.split(",");
	var returne = {};
	returne.object = document.getElementById(id);
	returne.matrix3d = window.getComputedStyle(document.getElementById(id)).webkitTransform;
	returne.x = Math.round(res[12]);
	returne.y = Math.round(res[13]);
	returne.z = Math.round(res[14]);
	return returne;

}

m3D.startGame = function(){
	m3D.canvas.css({
		"-webkit-perspective": "1000",
		// "-webkit-perspective-origin": "center center",
		"-webkit-transform-style": "preserve-3d"
	});
}

m3D.init = function(canvas) {
	window.addEventListener("keydown", m3D.onKeyDown, false);
	window.addEventListener("keyup", m3D.onKeyUp, false);
	document.addEventListener("mousemove", m3D.onMouseMove, false);
	m3D.canvas = canvas;
	

	m3D.canvas.append("<div id='planR'></div>");

	// m3D.canvas.planT = $("#planT");
	// m3D.canvas.planT.append("<div id='planR'></div>");			
	m3D.canvas.planR = $("#planR");


	m3D.canvas.planR.css({
		// "-webkit-transform-style": "preserve-3d"
	});
	// m3D.canvas.planR = $("#planR");
	m3D.canvas.planR.append("<div id='planT'></div>");
	m3D.canvas.planT = $("#planT");
	m3D.canvas.planT.css({
		"-webkit-transform-style": "preserve-3d"
	});

	m3D.canvas.planT.append("<div id='repere'></div>");
	m3D.canvas.planT.css({
		// "-webkit-perspective": "1000",
	});
	/*$("#repere").css({
		"position": "absolute",
		"top": "950px",
		"left": "50%",
		"display": "block",
		"height": "10px",
		"width": "10px",
		"background": "#000"
	});

	m3D.canvas.planT.append("<div id='floor'></div>");
	$("#floor").css({
		"background": "url(http://www.comptoirducerame.com/906-thickbox/carrelage-terre-cuite-imitation-10x10-ocre-45x45-cm.jpg)",
		"display": "block",
		"position": "absolute",
		"top": 0,
		"left": 0,
		"height": "3000px",
		"width": "3000px",
		"-webkit-transform": "translateX(-500px) translateZ(0px) rotateX(90deg)"
	});

	m3D.canvas.planT.append("<div id='wall1'></div>");
	$("#wall1").css({
		"background": "url(http://t2.gstatic.com/images?q=tbn:ANd9GcT0xj0JKLTWJ5msH5RG_6GKIbscYGhwnREZEqTcypH0FdzbfU_1rk0ZzjnA)",
		"display": "block",
		"position": "absolute",
		"top": 0,
		"left": 0,
		"height": "1500px",
		"width": "3000px",
		"-webkit-transform": "translateX(1000px) translateZ(0px) rotateY(90deg)"
	});

	m3D.canvas.planT.append("<div id='wall2'></div>");
	$("#wall2").css({
		"background": "url(http://t2.gstatic.com/images?q=tbn:ANd9GcT0xj0JKLTWJ5msH5RG_6GKIbscYGhwnREZEqTcypH0FdzbfU_1rk0ZzjnA)",
		"display": "block",
		"position": "absolute",
		"top": 0,
		"left": 0,
		"height": "1500px",
		"width": "3000px",
		"-webkit-transform": "translateX(-2000px) translateZ(0px) rotateY(90deg)"
	});

	m3D.canvas.planT.append("<div id='wall3'></div>");
	$("#wall3").css({
		"background": "url(http://t2.gstatic.com/images?q=tbn:ANd9GcT0xj0JKLTWJ5msH5RG_6GKIbscYGhwnREZEqTcypH0FdzbfU_1rk0ZzjnA)",
		"display": "block",
		"position": "absolute",
		"top": 0,
		"left": 0,
		"height": "1500px",
		"width": "3000px",
		"-webkit-transform": "translateX(-500px) translateZ(-1500px) rotateZ(0deg)"
	});

	m3D.canvas.planT.append("<div id='wall4'></div>");
	$("#wall4").css({
		"background": "url(http://t2.gstatic.com/images?q=tbn:ANd9GcT0xj0JKLTWJ5msH5RG_6GKIbscYGhwnREZEqTcypH0FdzbfU_1rk0ZzjnA)",
		"display": "block",
		"position": "absolute",
		"top": 0,
		"left": 0,
		"height": "1500px",
		"width": "3000px",
		"-webkit-transform": "translateX(-500px) translateZ(1500px) rotateZ(0deg)"
	});*/


	m3D.canvas.planR.rotateX = 10;
	m3D.canvas.planR.rotateX = -65;
	m3D.canvas.planR.rotateY = 0;
	m3D.canvas.planR.rotateZ = 0;

	m3D.canvas.planT.translateX = -2500;
	m3D.canvas.planT.translateY = 1000;
	m3D.canvas.planT.translateZ = 1500;

	m3D.position = {};
	m3D.position.x = 0;
	m3D.position.y = 0;
	m3D.position.z = 0;
	m3D.map = {};
	m3D.map = $("#map");
	m3D.map.moi = $("#map #moi");
	m3D.map.width = 5000;
	m3D.map.height = 5000;
	m3D.map.resolution = 200;
	m3D.map.moi.x = 0;
	m3D.map.moi.y = 0;


	m3D.updateView();
}

m3D.updateView = function(){
	// m3D.canvas.planR.css("-webkit-transform","translateZ(1000px) rotateX(" + m3D.canvas.planR.rotateX + "deg) translateZ(0px)");
	m3D.canvas.planT.translateX = Math.round(m3D.canvas.planT.translateX * 100 ) / 100;
	m3D.canvas.planT.translateY = Math.round(m3D.canvas.planT.translateY * 100 ) / 100;
	m3D.canvas.planT.translateZ = Math.round(m3D.canvas.planT.translateZ * 100 ) / 100;

	m3D.map.moi.y = m3D.canvas.planT.translateZ;
	m3D.map.moi.x = m3D.canvas.planT.translateX;


	console.log("("+m3D.map.moi.x+","+m3D.map.moi.y+")");

	console.log(m3D.canvas.planT.translateX);
	$("#content_map").css({
		"display":"block",
		"position":"absolute",		
		"-webkit-transform":"rotate("+(-m3D.canvas.planR.rotateY)+"deg) translate("+(-(m3D.canvas.planT.translateX +2500 ) /m3D.map.width *m3D.map.resolution)+"px,"+( (m3D.canvas.planT.translateZ -1500)/m3D.map.height * m3D.map.resolution)+"px) ",		
	});
	
	m3D.canvas.planT.css("-webkit-transform", "rotateX("+m3D.canvas.planR.rotateX+"deg) translateZ(1000px) rotateY(" + m3D.canvas.planR.rotateY + "deg) translate3d(" + m3D.canvas.planT.translateX + "px," + m3D.canvas.planT.translateY + "px," + m3D.canvas.planT.translateZ + "px)");
	// $("#position").html("("+(m3D.getPosition("planT").x )+","+(m3D.getPosition("planT").z )+")");
	// console.log(window.getComputedStyle(document.getElementById("planT")).webkitTransform);
	// console.log(m3D.getPosition("planT"));
}

m3D.onMouseMove = function(e) {
	var x = e.layerX;
	var y = e.layerY;
	// $("#pos").remove();
	//m3D.canvas.before('<span id="pos">('+(Math.round(x/(document.width/2 )* 100)/100)+','+(Math.round(y/(document.height/2) * 100)/100)+')</span>');
	// m3D.canvas.planR.rotateY =x/(document.width) * 180 ;
	// m3D.canvas.planR.rotateX =y/(document.height/2) * 180+180;		

	// m3D.canvas.planR.css("-webkit-transform","translateZ(500px) rotateY("+m3D.canvas.planR.rotateY+"deg)");
}
m3D.onKeyDown = function(e) {
	var key = e.keyCode || e.which;
	// console.log(key);
	switch (key) {
		case 33:
			m3D.canvas.planR.rotateX++;
			break;
		case 34:
			m3D.canvas.planR.rotateX--;
			break;
		case 35:
			m3D.canvas.planR.rotateX = 0;
			break;
		case 37:
			m3D.canvas.planR.rotateY--;
			// m3D.canvas.planT.translateX += 10;
			break;
		case 38:
			/*if (-500 < m3D.canvas.planT.translateZ +10  && m3D.canvas.planT.translateZ +10 < 1600)*/
			m3D.canvas.planT.translateZ += 10 * (Math.cos(m3D.canvas.planR.rotateY * Math.PI / 180));
			/*if (-500 < m3D.canvas.planT.translateX -10 && m3D.canvas.planT.translateX -10 < 1600)*/
			m3D.canvas.planT.translateX -= 10 * Math.sin(m3D.canvas.planR.rotateY * Math.PI / 180);
			break;
		case 39:
			m3D.canvas.planR.rotateY++;
			// m3D.canvas.planT.translateX -= 10;
			break;
		case 40:
			/*if (-500 < m3D.canvas.planT.translateZ -10 && m3D.canvas.planT.translateZ -10 < 1600)*/
			m3D.canvas.planT.translateZ -= 10 * (Math.cos(m3D.canvas.planR.rotateY * Math.PI / 180));
			/*if (-500 < m3D.canvas.planT.translateX+10 && m3D.canvas.planT.translateX+10 < 1600)*/
			m3D.canvas.planT.translateX += 10 * Math.sin(m3D.canvas.planR.rotateY * Math.PI / 180);
			break;
	}
	// m3D.canvas.planR.css("-webkit-transform", "translateY(-750px) rotateY(" + m3D.canvas.planR.rotateY + "deg)");
	m3D.updateView();
	// m3D.canvas.planT.css("-webkit-transform", "rotateY(" + m3D.canvas.planR.rotateY + "deg) translateX(" + m3D.position.x + "px) translateY(" + (m3D.position.y * Math.sin(m3D.canvas.planR.rotateY  * Math.PI / 180)) + "px) translateZ(" + (m3D.position.Z * Math.cos(m3D.canvas.planR.rotateY * Math.PI / 180)) + "px)");
	// m3D.canvas.planT.css("-webkit-transform","translateX("+m3D.canvas.planT.translateX+"px)");
	// console.log("("+m3D.canvas.planT.translateX+","+m3D.canvas.planT.translateZ+")");
}
m3D.onKeyUp = function(e) {
	var key = e.keyCode || e.which;
}

m3D.addItem = function(id, h, w, x, y, z) {
	x = Math.round(x);
	y = Math.round(y);
	z = Math.round(z);
	m3D.canvas.planT.append("<div id='" + id + "'><span style='position:absolute;top:0;left:50%'></span>"+"<img src='Sapin.png' style='position:absolute;'/>"+"<img src='Sapin.png' style='position:absolute;-webkit-transform:rotateY(90deg)'/>"+"</div>");
	$("#" + id).css({
		"position": "absolute",
		"top": "0",
		"left": "0",
		"display": "block",
		"height": h + "px",
		"width": w + "px",
		"-webkit-transform-style": "preserve-3d",
		"-webkit-transform": "translate3d(" + ( x ) + "px," + ( y ) + "px," + ( z ) + "px) rotateY(0deg)",
		// "background": "#ff0",
		// "border":"1px solid black",
		// "-webkit-animation":"mymove 5s infinite"
	});
	// $("#"+id+" span").html(id+" => ("+(m3D.getPosition(id).x )+","+m3D.getPosition(id).z+")");
	// console.log(id+"("+x+","+z+") => "+window.getComputedStyle(document.getElementById(id)).webkitTransform);
	$("#map #content_map").append("<span id='map"+id+"' style='border-radius:5px;display:block;position:absolute;width:10px;height:10px;background:green;bottom:"+( ( - m3D.getPosition(id).z ) / m3D.map.height *m3D.map.resolution )+"px;right:"+( m3D.map.resolution - (m3D.getPosition(id).x / m3D.map.width *m3D.map.resolution) )+"px;'>"+"</span>");
}