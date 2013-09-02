var name = "Joueur" + Math.round(Math.random() * 10000);

function GetURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) {
			return sParameterName[1];
		}
	}
}


if (GetURLParameter('name'))
	name = GetURLParameter('name');

$("#name").val(name);



var camera, userlight, light, scene, renderer;
var geometry, material, mesh, floor, cube, levels = [];
var controls, time = Date.now();
var objects = [],
	caisses = [],
	bombes = {};
joueurs_object = [];
var joueurs = [],
	spawn_zone = [];
var fires = [];
var matrice_pos_caisse = [];
var matrice_caisse_index = [];

function in_matrice(xy) {
	for (var j = 0; j < matrice_pos_caisse.length; j++) {
		if (matrice_pos_caisse[j][0] == xy[0] && matrice_pos_caisse[j][1] == xy[1]) {
			return true;
		}
	}
	return false;
}

var isFalling = [];
var ray;
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if (havePointerLock) {
	var element = document.body;
	var pointerlockchange = function(event) {
		if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	}
	var pointerlockerror = function(event) {
		instructions.style.display = '';
	}

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange', pointerlockchange, false);
	document.addEventListener('mozpointerlockchange', pointerlockchange, false);
	document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

	document.addEventListener('pointerlockerror', pointerlockerror, false);
	document.addEventListener('mozpointerlockerror', pointerlockerror, false);
	document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

	instructions.addEventListener('click', function(event) {

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		if (/Firefox/i.test(navigator.userAgent)) {
			var fullscreenchange = function(event) {
				if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
					document.removeEventListener('fullscreenchange', fullscreenchange);
					document.removeEventListener('mozfullscreenchange', fullscreenchange);
					element.requestPointerLock();
				}
			}
			document.addEventListener('fullscreenchange', fullscreenchange, false);
			document.addEventListener('mozfullscreenchange', fullscreenchange, false);

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
			element.requestFullscreen();
		} else {
			element.requestPointerLock();
		}
	}, false);
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

function in_the_face(item, object) {
	var x = object.position.x;
	var y = object.position.y;
	var z = object.position.z;
	var impact = [];

	var xt = false;
	var yt = false;
	var zt = false;

	var width = item.geometry.width;
	var depth = item.geometry.depth;
	var height = item.geometry.height;

	if (!width) width = 20;
	if (!depth) depth = 20;
	if (!height) height = 20;

	var minx = Math.round(item.position.x - width / 2 - 2);
	var maxx = Math.round(item.position.x + width / 2 + 2);

	var minz = Math.round(item.position.z - depth / 2 - 2);
	var maxz = Math.round(item.position.z + depth / 2 + 2);

	var miny = Math.round(item.position.y - height / 2 - 5);
	var maxy = Math.round(item.position.y + height / 2 + 5);

	if (x > minx && x < maxx) {
		xt = true;
		impact.push("X");
	}

	if (z > minz && z < maxz) {
		zt = true;
		impact.push("Z");
	}

	if (y > miny && y < maxy - 5) {
		yt = true;
		impact.push("Y");
	}

	if (y > maxy - 5 && y < maxy) {
		yt = true;
		// controls.isOnObject(true);
	}

	if (xt && zt && yt) {
		// console.log("(" + (x-minx) + "|" + (maxx-x) + "," + (z-minz) + "|" + (maxz-z) + ")");

		if ((x - minx) < (maxx - x) && (x - minx) < (z - minz) && (x - minx) < (maxz - z)) {
			object.position.x = minx;
		}

		if ((maxx - x) < (x - minx) && (maxx - x) < (z - minz) && (maxx - x) < (maxz - z)) {
			object.position.x = maxx;
		}
		if ((z - minz) < (maxz - z) && (z - minz) < (x - minx) && (z - minz) < (maxx - x)) {
			object.position.z = minz;
		}
		if ((maxz - z) < (z - minz) && (maxz - z) < (x - minx) && (maxz - z) < (maxx - x)) {
			object.position.z = maxz;
		}
		return impact;
	}

	return impact;

}

function init() {

	window.addEventListener('dblclick', function(event) {
		console.log(bombe.ttl);
		if (bombe.ttl <= 0) bombe.pose();
	});
	spawn_zone = [
		[-120, -100],
		[-120, -80],
		[-100, -100],
		[-120, 100],
		[-120, 80],
		[-100, 100],
		[120, -100],
		[120, -80],
		[100, -100],
		[120, 100],
		[120, 80],
		[100, 100]
	];

	for (var X = -120; X <= 120; X += 20) {
		for (var Y = -100; Y <= 100; Y += 20) {
			matrice_pos_caisse.push([X, Y]);
		}
	}
	// console.log(matrice_pos_caisse.length);

	matrice_pos_caisse = $.unique(matrice_pos_caisse);

	// console.log(matrice_pos_caisse.length);
	for (var i = 0; i < spawn_zone.length; i++) {
		for (var j = 0; j < matrice_pos_caisse.length; j++) {
			if (matrice_pos_caisse[j][0] == spawn_zone[i][0] && matrice_pos_caisse[j][1] == spawn_zone[i][1]) {
				matrice_pos_caisse[j] = false;
				// console.log("boom");
			}
		}
	}
	// console.log(matrice_pos_caisse.length);


	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	scene = new THREE.Scene();
	scene.add(bombe.bombe);
	// scene.fog = new THREE.Fog(0x000000, 0, 750);

	light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(1, 1, 1);
	// scene.add(light);
	userlight = new THREE.PointLight(0xddddff, 1.5, 750);
	// light.position.set(-1, -0.5, -1);
	scene.add(userlight);

	controls = new THREE.PointerLockControls(camera);

	scene.add(controls.getObject());

	ray = new THREE.Raycaster();
	ray.precision = 0;
	ray.ray.direction.set(0, -1, 0);


	geometry = new THREE.PlaneGeometry(280, 280, 250, 250);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));


	var bitmap = generateTextureBase();

	for (var i = 0; i < 15; i++) {

		texture = new THREE.Texture(generateTextureLevel(bitmap));

		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(100, 100);

		material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true,
			depthWrite: false,
			color: 0x00ff00
		});
		floor = levels[i] = new THREE.Mesh(geometry, material);
		floor.position.y = i * 0.25;
		// floor.rotation.x = -Math.PI / 2;
		floor.material.map.needsUpdate = true;

		// scene.add(floor);
	}

	/*floor = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
		color: 0x005500
	}));*/

	// cube = new THREE.Mesh(geometry, material);
	// cube.position.x = Math.floor(Math.random() * 20 - 10) * 200;
	// cube.position.y = Math.floor(Math.random() * 20) + 10;
	// cube.position.z = Math.floor(Math.random() * 20 - 10) * 200;

	var x = -7;
	// var y = -6;
	var y = 0
	for (var i = 0; i < 1; i++) {
		geometry = new THREE.CubeGeometry(20, 20, 20 * 13);
		// var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
		var texture = THREE.ImageUtils.loadTexture('../examples/textures/metal.jpg');
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			// map: texture,
			color: 0xc2c2c2
			// ambient: 0xbbbbbb
		}));
		cube.typeElement = "mur";
		cube.position.x = x * 20;
		cube.position.y = 10;
		cube.position.z = (y++) * 20;
		scene.add(cube);
		objects.push(cube);
	}

	x = 7;
	// y = -6;
	y = 0;
	for (var i = 0; i < 1; i++) {
		geometry = new THREE.CubeGeometry(20, 20, 20 * 13);
		// var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
		var texture = THREE.ImageUtils.loadTexture('../examples/textures/metal.jpg');
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			// map: texture,
			color: 0xc2c2c2
			// ambient: 0xbbbbbb
		}));
		cube.typeElement = "mur";
		cube.position.x = x * 20;
		cube.position.y = 10;
		cube.position.z = (y++) * 20;
		scene.add(cube);
		objects.push(cube);
	}

	// x = -6;
	x = 0;
	y = 6;
	for (var i = 0; i < 1; i++) {
		geometry = new THREE.CubeGeometry(20 * 15, 20, 20);
		// var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
		var texture = THREE.ImageUtils.loadTexture('../examples/textures/metal.jpg');
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			// map: texture,
			color: 0xc2c2c2
			// ambient: 0xbbbbbb
		}));
		cube.typeElement = "mur";
		cube.position.x = (x++) * 20;
		cube.position.y = 10;
		cube.position.z = (y) * 20;
		scene.add(cube);
		objects.push(cube);
	}

	// x = -6;
	x = 0;
	y = -6;
	for (var i = 0; i < 1; i++) {
		geometry = new THREE.CubeGeometry(20 * 15, 20, 20);
		// var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
		var texture = THREE.ImageUtils.loadTexture('../examples/textures/metal.jpg');
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			// map: texture,
			color: 0xc2c2c2
			// ambient: 0xbbbbbb
		}));
		cube.typeElement = "mur";
		cube.position.x = (x++) * 20;
		cube.position.y = 10;
		cube.position.z = (y) * 20;
		scene.add(cube);
		objects.push(cube);
	}

	x = 3;
	y = 3;
	for (var i = 0; i < 30; i++) {
		geometry = new THREE.CubeGeometry(20, 20, 20);
		// var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
		var texture = THREE.ImageUtils.loadTexture('../examples/textures/metal.jpg');
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
			// map: texture,
			color: 0xc2c2c2
			// ambient: 0xbbbbbb
		}));


		matrice_pos_caisse.splice(matrice_pos_caisse.indexOf((x - 8) * 20, (y - 7) * 20), 1);

		for (var j = 0; j < matrice_pos_caisse.length; j++) {
			if (matrice_pos_caisse[j][0] == (x - 8) * 20 && matrice_pos_caisse[j][1] == (y - 7) * 20) {
				matrice_pos_caisse[j] = false;
				// console.log("boom");
			}
		}
		cube.typeElement = "poteaux";
		cube.position.x = (x - 8) * 20;
		cube.position.y = 10;
		cube.position.z = (y - 7) * 20;
		scene.add(cube);
		objects.push(cube);
		x += 2;
		if (x == 15) {
			x = 3;
			y += 2;
		}
	}


	var caisse_from_bd = $.get("../ajax.php?caisse=1", function(data) {
		var content = JSON.parse(data);
		if (content.length == 0) {
			for (var i = 0; i < 60; i++) {
				geometry = new THREE.CubeGeometry(20, 20, 20);
				var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
				texture.magFilter = THREE.NearestFilter;
				texture.minFilter = THREE.LinearMipMapLinearFilter;
				cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
					map: texture,
					color: 0xc2c2c2,
					ambient: 0xbbbbbb
				}));
				var index = -1;
				// while(matrice_caisse_index.indexOf(index) == -1 || index == -1)
				{
					index = Math.round(Math.random() * (matrice_pos_caisse.length - 1));
				}
				cube.typeElement = "caisse";
				cube.position.x = matrice_pos_caisse[index][0];
				cube.position.y = 10;
				cube.position.z = matrice_pos_caisse[index][1];
				var retour = $.get("../ajax.php?name=" + $("#name").val() + "&type=" + "caisse" + "&x=" + cube.position.x + "&y=" + cube.position.y + "&z=" + cube.position.z + "&param=" + index);
			}
		}
	});

	var caisse_from_bd = $.get("../ajax.php?caisse=1", function(data) {
		var content = JSON.parse(data);
		$.each(content, function(ind, val) {
			geometry = new THREE.CubeGeometry(20, 20, 20);
			var texture = THREE.ImageUtils.loadTexture('../examples/textures/crate.gif');
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.LinearMipMapLinearFilter;
			baga = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
				map: texture,
				color: 0xc2c2c2,
				ambient: 0xbbbbbb
			}));
			baga.typeElement = "caisse";
			baga.statusElement = "indem";
			var index = val.caisse;
			baga.position.x = matrice_pos_caisse[index][0];
			baga.position.y = 10;
			baga.position.z = matrice_pos_caisse[index][1];
			// console.log(matrice_pos_caisse[index]);
			// indexes += index + ",";
			// matrice_pos_caisse.splice(index, 1);
			scene.add(baga);
			caisses.push(baga);
		});
	});

	// console.log(matrice_pos_caisse.length);
	var i = Math.round(Math.random() * 3);
	// console.log("Start at : " + i);
	start_pos = spawn_zone[i];
	controls.getObject().position.x = start_pos[0];
	controls.getObject().position.z = start_pos[1];

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000)
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
}

function generateTextureBase() {
	var canvas = document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 512;
	var context = canvas.getContext('2d');
	for (var i = 0; i < 20000; i++) {
		context.fillStyle = 'rgba(0,' + Math.floor(Math.random() * 64 + 32) + ',16,1)';
		context.beginPath();
		context.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 1 + 0.5, 0, Math.PI * 2, true);
		context.fill();
	}
	context.globalAlpha = 0.075;
	context.globalCompositeOperation = 'lighter';
	return canvas;
}

function generateTextureLevel(texture) {
	texture.getContext('2d').drawImage(texture, 0, 0);
	var canvas = document.createElement('canvas');
	canvas.width = texture.width;
	canvas.height = texture.height;
	canvas.getContext('2d').drawImage(texture, 0, 0);
	return canvas;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
var last_display = 0;
var last_display2 = 0;

function animate() {	

	userlight.position.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);


	var collision = false;

	for (var i = 0; i < objects.length; i++) {
		if (in_the_face(objects[i], controls.getObject()).length == 3) {
			collision = true;
			break;
		}
	}

	for (var i = 0; i < caisses.length; i++) {
		if (in_the_face(caisses[i], controls.getObject()).length == 3) {
			collision = true;
			break;
		}
	}

	if (collision) {
		// controls.bim(false);		
		controls.update(100);
	} else {
		controls.bim(true);
		// controls.isOnObject(false);
		controls.update(Date.now() - time);
	}

	if (time - last_display > 10) {
		var data = "";
		$.ajax({
			url: "../ajax.php?name=" + $("#name").val() + "&type=" + "player" + "&x=" + controls.getObject().position.x + "&y=" + controls.getObject().position.y + "&z=" + controls.getObject().position.z,
			async : true,
			success: function(content) {
				data = JSON.parse(content);
				// console.log(data.player);
				if (data) {
					$.each(data, function(index, val) {
						if ($.inArray(joueurs, val)) {

							if (val.joueur != $("#name").val()) {
								cube = joueurs_object[index];
								if (cube) {
									cube.position.x = val.position.x;
									cube.position.y = val.position.y - 2.5;
									cube.position.z = val.position.z;
								} else {
									geometry = new THREE.CubeGeometry(5, 15, 5);
									cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
										color: 0xFF0000
									}));									
									cube.position.x = val.position.x;
									cube.position.y = val.position.y - 2.5;
									cube.position.z = val.position.z;
									scene.add(cube);
									joueurs_object[index] = cube;
								}
							}
						} else {
							joueurs[index] = (val);
							geometry = new THREE.CubeGeometry(5, 15, 5);
							cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
								// map: texture,
								color: 0xFF0000
								// ambient: 0xbbbbbb
							}));
							cube.position.x = val.position.x;
							cube.position.y = val.position.y - 2.5;
							cube.position.z = val.position.z;
							scene.add(cube);
							joueurs_object[index] = (cube);
						}

					});
				}
			}
		});

		for(var i = 0; i < scene.children.length; i++){
			if(scene.children[i].statusElement){
				switch(scene.children[i].statusElement){
					case "casse":
					scene.children[i].position.y = -10;
					scene.remove(scene.children[i]);
					break;
					case "out":
					scene.children[i].position.y = +20;
					scene.remove(scene.children[i]);
					break;
				}				
			}
		}

		$.ajax({
			url: "../ajax.php?bombe=1&name=" + name ,
			async : true,
			success: function(content) {
				data = JSON.parse(content);
				$.each(data, function(index, val) {
					// console.log(val.last_update);
					if (!bombes[val.bombe] && val.last_update > "0") {

						geometry = new THREE.SphereGeometry(5, 50, 50);
						var b = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
							color: 0x000000
						}));
						b.typeElement = "bombe";
						b.position.x = parseFloat(val.position.x);
						b.position.y = parseFloat(val.position.y);
						b.position.z = parseFloat(val.position.z);
						
						scene.add(b);
						bombes[val.bombe] = b;
						// console.log("add bombe " + b);
					}
					if (bombes[val.bombe] && val.last_update == "3") {
						caisses.push(bombes[val.bombe]);
					}

					if (bombes[val.bombe] && val.last_update == "0" && !bombes[val.bombe].boom ) {
						// console.log(bombes[val.bombe]);
						bombes[val.bombe].boom = true;
						console.log("BOOM !!");
						explosion(bombes[val.bombe]);
						// console.log(bombes);				
						if(val.bombe == name ) bombe.ttl = -1;

					}

					if (bombes[val.bombe] && val.last_update == 0) {
						// console.log(bombe.ttl);

						// console.log(scene.children[bombes[val.bombe]]);

						while (fires[bombes[val.bombe]].length > 0) {
							var flame = fires[bombes[val.bombe]].pop();
							// flame.statusElement = "out";
							scene.children[scene.children.indexOf(flame)].statusElement = "out";
							// console.log(scene.children.indexOf(flame) + " + " + flame.statusElement);
						}

						// scene.remove(scene.children[bombes[val.bombe]]);
						bombes[val.bombe] = false;
						console.log(bombes[val.bombe]);
					}



				});
			}
		});
		last_display = time;
	}

	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	time = Date.now();
}



var bombe = [];
geometry = new THREE.SphereGeometry(5, 50, 50);
bombe.bombe = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
	// map: texture,
	color: 0x000000
	// ambient: 0xbbbbbb
}));
// bombe.position = [];
// bombe.position.x = 0;
bombe.bombe.position.y = -20;
// bombe.position.z = 0;
bombe.ttl = 0;


function explosion(b) {
	fires[b] = [];

	var g= new THREE.SphereGeometry(5, 50, 50);
	g= new THREE.CubeGeometry(20, 20, 20);
	var x = -1;
	while (x > -3) {
		if (x != 0) {
			fire = new THREE.Mesh(g, new THREE.MeshPhongMaterial({
				color: 0xFF0000
			}));

			fire.position.x = (b.position.x + x * 20);
			fire.position.y = 10;
			fire.position.z = (b.position.z);
			fire.statusElement = "in";
			// scene.add(fire);
			for (var i = 0; i < objects.length; i++) {
				if (in_the_face(fire, objects[i]).length == 3) {
					// console.log("colision poteaux !!");
					x = -3;
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, caisses[i]).length == 3) {
					// console.log("colision caisse !!");
					x = -3;
					caisses[i].statusElement = "casse";
					// scene.remove(caisses[i]);
					caisses.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, controls.getObject()).length == 3) {
					x = -3;
					mort();
					break;
				}
			}
			scene.add(fire);
			fires[b].push(fire);
		}
		x--;
	}
	x = 1
	while (x < 3) {
		if (x != 0) {
			fire = new THREE.Mesh(g, new THREE.MeshPhongMaterial({
				color: 0xFF0000
			}));
			fire.position.x = (b.position.x + x * 20);
			fire.position.y = 10;
			fire.position.z = (b.position.z);
			fire.statusElement = "in";
			// scene.add(fire);
			for (var i = 0; i < objects.length; i++) {
				if (in_the_face(fire, objects[i]).length == 3) {
					// console.log("colision poteaux !!");
					x = 3;
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, caisses[i]).length == 3) {
					// console.log("colision caisse !!");
					x = 3;
					caisses[i].statusElement = "casse";
					// scene.remove(caisses[i]);
					caisses.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, controls.getObject()).length == 3) {
					x = 3;
					mort();
					break;
				}
			}
			scene.add(fire);
			fires[b].push(fire);
		}
		x++;
	}
	x = -1;
	while (x > -3) {
		if (x != 0) {
			fire = new THREE.Mesh(g, new THREE.MeshPhongMaterial({
				color: 0xFF0000
			}));
			fire.position.x = (b.position.x);
			fire.position.y = 10;
			fire.position.z = (b.position.z + x * 20);
			fire.statusElement = "in";
			for (var i = 0; i < objects.length; i++) {
				if (in_the_face(fire, objects[i]).length == 3) {
					// console.log("colision poteaux !!");
					x = -3;
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, caisses[i]).length == 3) {
					// console.log("colision caisse !!");
					x = -3;
					caisses[i].statusElement = "casse";
					// scene.remove(caisses[i]);
					caisses.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, controls.getObject()).length == 3) {
					x = -3;
					mort();
					break;
				}
			}
			scene.add(fire);
			fires[b].push(fire);
		}
		x--;
	}
	x = 1
	while (x < 3) {
		if (x != 0) {
			fire = new THREE.Mesh(g, new THREE.MeshPhongMaterial({
				color: 0xFF0000
			}));
			fire.position.x = (b.position.x);
			fire.position.y = 10;
			fire.position.z = (b.position.z + x * 20);

			fire.statusElement = "in";
			for (var i = 0; i < objects.length; i++) {
				if (in_the_face(fire, objects[i]).length == 3) {
					// console.log("colision poteaux !!");
					x = 3;
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, caisses[i]).length == 3) {
					// console.log("colision caisse !!");
					x = 3;
					caisses[i].statusElement = "casse";
					// scene.remove(caisses[i]);
					caisses.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < caisses.length; i++) {
				if (in_the_face(fire, controls.getObject()).length == 3) {
					x = 3;
					mort();
					break;
				}
			}
			scene.add(fire);
			fires[b].push(fire);
		}
		x++;
	}
	b.position.x = 0;
	b.position.y = -20;
	b.position.z = 0;
	caisses.splice(caisses.indexOf(b), 1);
	// while(fires[b].length>0){
	// 	scene.remove(fires[b].pop());
	// }
}

bombe.pose = function() {
	// scene.add(bombe.bombe);	
	// window.setTimeout(bombe.physique, 1000);
	
	var x = (controls.getObject().position.x - (controls.getObject().position.x % 10) + (controls.getObject().position.x - (controls.getObject().position.x % 10)) % 20);
	var z = (controls.getObject().position.z - (controls.getObject().position.z % 10) + (controls.getObject().position.z - (controls.getObject().position.z % 10)) % 20);
	// bombe.bombe.position.x = (controls.getObject().position.x - (controls.getObject().position.x % 20) - 0);
	var y = 10;
	// bombe.bombe.position.z = (controls.getObject().position.z - (controls.getObject().position.z % 20) - 0);
	console.log("bombe posee en " + x + "," + y + "," + z + "");
	bombe.ttl = 5;
	var retour = $.get("../ajax.php?name=" + $("#name").val() + "&type=" + "bombe" + "&x=" + x + "&y=" + y + "&z=" + z + "&param="+bombe.ttl,function(data){		
		console.log("Réponse : "+data);
	});
	
}

bombe.physique = function() {
	caisses.push(bombe.bombe);
}

function mort(){
	console.log("VOUS ETE MORT !!! ");

}
init();
animate();