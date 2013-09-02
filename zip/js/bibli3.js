var camera, userlight, light, scene, renderer;
var geometry, material, mesh, floor;
var controls, time = Date.now();

var onObject;


var worldWidth = 256,
	worldDepth = 256,
	worldHalfWidth = worldWidth / 2,
	worldHalfDepth = worldDepth / 2;

var objects = [];

var isFalling = [];

var ray;

var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

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

function onMouseScroll(event) {
	var rolled = 0;
	if ('wheelDelta' in event) {
		rolled = event.wheelDelta;
		userlight.intensity += (rolled > 0) ? 0.01 : -0.01;
		userlight.distance += (rolled > 0) ? 1 : -1;

		if (userlight.intensity > 1) userlight.intensity = 1;
		if (userlight.intensity < 0) userlight.intensity = 0;

		if (userlight.distance > 1000) userlight.distance = 1000;
		if (userlight.distance < 0) userlight.distance = 0;

	} else { // Firefox
		rolled = -40 * event.detail;
	}

}

function onDblClick(event) {
	(light.intensity == 0) ? light.intensity = 1.5 : light.intensity = 0;

}

init();
animate();

function init() {
	document.addEventListener('mousewheel', onMouseScroll, true);
	document.addEventListener('dblclick', onDblClick, true);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x000000, 0, 750);

	light = new THREE.DirectionalLight(0xffffff, 0);
	light.position.set(1, 1, 1);
	scene.add(light);

	userlight = new THREE.PointLight(0xddddff, 0.75, 750);
	// light.position.set(-1, -0.5, -1);
	scene.add(userlight);

	controls = new THREE.PointerLockControls(camera);
	scene.add(controls.getObject());

	ray = new THREE.Raycaster();
	ray.precision = 0;
	ray.ray.direction.set(0, -1, 0);

	// floor
	/*data = generateHeight(worldWidth, worldDepth);
	geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
	for (var i = 0, l = geometry.vertices.length; i < l; i++) {

		geometry.vertices[i].z = data[i] * 10;

	}
	texture = new THREE.Texture(generateTexture(data, worldWidth, worldDepth), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
	texture.needsUpdate = true;

	mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
		map: texture
	}));*/


	geometry = new THREE.PlaneGeometry(7500, 7500, 255, 255);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	for (var i = 0, l = geometry.vertices.length; i < l; i++) {

		var vertex = geometry.vertices[i];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 20 - 20;
		vertex.z += Math.random() * 20 + 10;
		//vertex.position.z += Math.random() * 20 - 10;

	}

	for (var i = 0, l = geometry.faces.length; i < l; i++) {

		var face = geometry.faces[i];
		face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

	}

	material = new THREE.MeshPhongMaterial({
		specular: 0xffffff,
		shading: THREE.FlatShading,
		vertexColors: THREE.VertexColors
	});

	floor = new THREE.Mesh(geometry, material);
	scene.add(floor);

	// console.log(matrixPosition.getPositionFromMatrix(mesh.matrixWorld));


	// objects

	geometry = new THREE.CubeGeometry(20, 20, 20);
	for (var i = 0, l = geometry.faces.length; i < l; i++) {

		var face = geometry.faces[i];
		face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
		face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

	}

	for (var i = 0; i < 500; i++) {

		material = new THREE.MeshPhongMaterial({
			specular: 0xffffff,
			shading: THREE.FlatShading,
			vertexColors: THREE.VertexColors
			// wireframe:true
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.x = Math.floor(Math.random() * 20 - 10) * 100;
		mesh.position.y = Math.floor(Math.random() * 20 - 10) * 100 +10;
		mesh.position.z = Math.floor(Math.random() * 20 - 10) * 100;
		scene.add(mesh);

		material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

		objects.push(mesh);

	}



	//

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000)
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	//

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function colision(object) {
	var matrixPosition = new THREE.Vector3();
	matrixPosition.getPositionFromMatrix(object.matrixWorld);
	var distance = ray.ray.distanceToPoint(matrixPosition);

	if (distance - object.geometry.height / 2 <= 0) return true;

	// console.log(object.geometry.height);
	return false;
}

var last_display = 0;

function animate() {
	requestAnimationFrame(animate);
	controls.isOnObject(false);

	userlight.position.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);

	/**** Collision from top ****/
	ray.ray.direction.set(0, -1, 0);
	ray.ray.origin.copy(controls.getObject().position);
	ray.ray.origin.y -= 10;
	var intersections = ray.intersectObjects(objects);
	if (intersections.length > 0) {
		// console.log(intersections[0]);
		var distance = intersections[0].distance;
		var matrixPosition = new THREE.Vector3();
		matrixPosition.getPositionFromMatrix(camera.matrixWorld);
		// console.log(matrixPosition);
		if (distance > 0 && distance < 10) {
			controls.isOnObject(true);
			onObject = intersections[0].object;
		}
	}
	/**** Collision from under ****/
	ray.ray.direction.set(0, -1, 0);
	ray.ray.origin.copy(controls.getObject().position);
	ray.ray.origin.y += 30;
	var intersections = ray.intersectObjects(objects);
	if (intersections.length > 0) {
		var distance = intersections[0].distance;
		var matrixPosition = new THREE.Vector3();
		matrixPosition.getPositionFromMatrix(camera.matrixWorld);
		if (distance > 0 && distance < 10) {
			controls.setVelocity(0);
		}
	}


	for (var i = 0, l = isFalling.length; i < l; i++) {
		if (isFalling[i] && isFalling[i] != onObject) {

			ray.ray.direction.set(0, -1, 0);
			ray.ray.origin.copy(isFalling[i].position);
			var intersections = ray.intersectObjects(objects);
			if (intersections.length == 0)
				isFalling[i].position.y -= 1;


			if (isFalling[i].position.y < -30) {
				// console.log(isFalling[i]);
				var item_to_kill = isFalling[i];
				
				// objects.splice(objects.indexOf(item_to_kill), 1);

				isFalling[i].position.x = Math.floor(Math.random() * 20 - 10) * 200;
				isFalling[i].position.y = Math.floor(Math.random() * 20) * 20 + 10;
				isFalling[i].position.z = Math.floor(Math.random() * 20 - 10) * 200;
				// isFalling[i].material.shading =  THREE.FlatShading;
				isFalling.splice(i, 1);
			}
		}
	}

	if (time - last_display > 1000) {
		for (var i = 0, l = objects.length; i < l; i++) {
			if (Math.random() > 0.99) {
				// console.log("boom : " + isFalling.length);
				isFalling.push(objects[i]);
				// objects[i].material.shading = THREE.NoShading;
			}


		}

		// for (var i = 0, l = floor.geometry.vertices.length; i < l; i++) {
		// 	floor.geometry.vertices[i].y = (floor.geometry.vertices[i].y % 100) + Math.random();

		// 	if( time - last_display > 1000 ) {
		// 		console.log(floor.geometry.vertices[0].y);
		// 		last_display = time;
		// 	}
		// }
		last_display = time;
	}

	controls.update(Date.now() - time);

	renderer.render(scene, camera);

	time = Date.now();

}