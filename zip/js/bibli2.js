function Element3D(in_id) {
	var id;
	var x;
	var y;
	var z;
	var rx;
	var ry;
	var rz;

	this.id = in_id;

	this.place = function(x, y, z) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.z = Math.round(z);
	}
}

function map(in_id) {
	var id;
	this.id = in_id;
	var map;
	this.map = $("#" + this.id);
	this.draw_element = function(elements) {
		var map = this.map;
		var map_id = this.id;
		$.each(elements, function() {
			if ($("#" + map_id + " #" + this.id).length > 0) {

				if (this.id != "moi") {
					if (!m3D.viewable(this)) $("#" + this.id).remove();

					$("#" + map_id + " #" + this.id).css({
						"top": ((this.z - 1000) / 10000 * map.height() - (5 / 2)) + "px",
						"left": ((this.x - 1000) / 10000 * map.width() - (5 / 2)) + "px"
					});


				} else {
					$("#" + map_id + " #" + this.id).css({
						"top": ((this.z) / 10000 * map.height() - (5 / 2)) + "px",
						"left": ((this.x) / 10000 * map.width() - (5 / 2)) + "px"
					});
				}

			} else {


				$("#" + map_id + " #" + this.id).remove();
				if (this.id != "moi") {
					if (m3D.viewable(this)) map.append("<div id='" + this.id + "' style='display:block;width:5px;height:5px;position:absolute;top:" + ((this.z - 1000) / 10000 * map.height() - (5 / 2)) + "px;left:" + ((this.x - 1000) / 10000 * map.width() - (5 / 2)) + "px;background:red;'></div>");
				} else {
					map.append("<div id='" + this.id + "' style='display:block;width:5px;height:5px;position:absolute;top:" + ((this.z) / 10000 * map.height() - (5 / 2)) + "px;left:" + ((this.x) / 10000 * map.width() - (5 / 2)) + "px;background:black;'></div>");
				}


			}

			if (this.id != "moi") {

				if ($("#m" + this.id).length == 0) {
					if (m3D.viewable(this)) m3D.canvas.plan.append("<div id='m" + this.id + "'><img src='Sapin.compressed.png' style='position:absolute;top:-386px;left:-267px'/><img src='Sapin.compressed.png' style='position:absolute;top:-386px;left:-267px;-webkit-transform:rotateY(90deg)'/></div>");
				} else {
					if (!m3D.viewable(this)) $("#m" + this.id).remove();
				}

				$("#m" + this.id).css({
					"display": "block",
					"position": "absolute",
					// "top":"0",
					// "left":"0",
					"height": "1px",
					"width": "1px",
					// "background": "#ff0",
					"-webkit-transform": "translate3d(" + this.x + "px," + this.y + "px," + (this.z) + "px)"
				});
			}
		});
	}
}


m3D = {};
m3D.viewable = function(element3d) {
	// console.log(m3D.getPosition("plan"));
	// console.log(15000*Math.sin(m3D.position.ry * Math.PI / 180));
	if (element3d.x > 12500 ) return false;
	if (element3d.z > 12500 ) return false;
	if (element3d.x < -100) return false;
	if (element3d.z < -100) return false;

	return true;
}
m3D.getPosition = function(id) {
	var res = window.getComputedStyle(document.getElementById(id)).webkitTransform;
	res = res.replace("matrix3d(", "");
	res = res.replace("(", "");
	res = res.split(",");
	var returne = {};
	returne.object = document.getElementById(id);
	returne.matrix3d = window.getComputedStyle(document.getElementById(id)).webkitTransform;
	returne.x = Math.round(res[12]);
	returne.y = Math.round(res[13]);
	returne.z = Math.round(res[14]);
	return returne;

}
m3D.init = function(map, elements) {

	window.addEventListener("keydown", m3D.onKeyDown, false);
	window.addEventListener("keyup", m3D.onKeyUp, false);
	document.addEventListener("mousemove", m3D.onMouseMove, false);
	m3D.map = map;
	m3D.elements = elements;

	m3D.canvas = $("#canvas");
	m3D.canvas.append("<div id='plan'></div>");
	m3D.canvas.plan = $("#plan");

	m3D.position = {};
	m3D.position.x = 0;
	m3D.position.y = 0;
	m3D.position.z = 0;
	m3D.position.rx = 0;
	m3D.position.ry = 0;
	m3D.position.rz = 0;

}

m3D.onKeyDown = function(e) {
	var key = e.keyCode || e.which;
	switch (key) {
		case 37:
			m3D.position.ry++;
			/*$.each(m3D.elements, function() {
				this.x -= 10;
			});*/
			break;
		case 39:
			m3D.position.ry--;
			/*$.each(m3D.elements, function() {
				this.x += 10;
			});*/
			break;
		case 38:
			// console.log(Math.sin(m3D.position.ry * Math.PI / 180 ));
			$.each(m3D.elements, function() {
				this.z += (50 * Math.cos(m3D.position.ry * Math.PI / 180));
				this.x += (50 * Math.sin(m3D.position.ry * Math.PI / 180));
			});
			break;
		case 40:
			$.each(m3D.elements, function() {
				this.z -= (50 * Math.cos(m3D.position.ry * Math.PI / 180));
				this.x -= (50 * Math.sin(m3D.position.ry * Math.PI / 180));
			});
			break;
	}
	m3D.map.draw_element(m3D.elements);
	$("#boussole").css({
		"-webkit-transform": "rotate(" + (-m3D.position.ry) + "deg)"
	});
	m3D.canvas.plan.css({
		"-webkit-transform": "translateZ(1000px) rotateY(" + (-m3D.position.ry) + "deg) translate3d(-5000px,0,-6000px)"
	});

}

m3D.onKeyUp = function(e) {
	var key = e.keyCode || e.which;
}

m3D.onMouseMove = function(e) {
	var x = e.layerX;
	var y = e.layerY;
}