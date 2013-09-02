<!doctype html>
<html>
	<head>
		<title>HELLO YOU</title>
		
	</head>
	<body>
		<?
		$i = 0;
		for($i=0; $i<0; $i++){
		$start = ($i*8);
		$json_images_result = json_decode(`curl -e http://www.my-ajax-site.com \
		'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=8&start=$start&as_sitesearch=fanpop.com&q=suicide%20girls'`,true);
		foreach($json_images_result['responseData']['results'] as $id=> $image){
		//echo "<img src='".$image['url']."'/>";
		}
		}
		?>
		<canvas width="640" height="480" id="c" style='border:1px solid black'><canvas>
		<script src='Demo.js'></script>
		<script>			
		
		var world = {
		vertices:[
		{x:100, y:100, z: 500},
		{x:-100, y:100, z: 500},
		{x:-100, y:-100, z: 500},
		{x:100, y:-100, z: 500},
		{x:100, y:100, z: 300},
		{x:-100, y:100, z: 300},
		{x:-100, y:-100, z: 300},
		{x:100, y:-100, z: 300},
		
		
		{x:100, y:100, z: 900},
		{x:-100, y:100, z: 900},
		{x:-100, y:-100, z: 900},
		{x:100, y:-100, z: 900},
		{x:100, y:100, z: 1000},
		{x:-100, y:100, z: 1000},
		{x:-100, y:-100, z: 1000},
		{x:100, y:-100, z: 1000},
		
		]
		};
		var camera = {
		x: 0,
		y: 0,
		z: 0,
		depth: 350,
		screen: Demo.ctx,
		width: Demo.canvas.width,
		height: Demo.canvas.height,
		offsetX: Demo.canvas.width/2,
		offsetY: Demo.canvas.height/2
		}

		Demo.event.onGameStart();
		</script>
	</body>
</html>