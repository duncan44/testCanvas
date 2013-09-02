<!doctype html>
<html>
	<head>
		<title>HELLO YOU</title>
		<script>
			var perspective = 0;
			m3D = {};
			m3D.init = function(){
				window.addEventListener("keydown", m3D.onKeyDown, false);
				window.addEventListener("keyup", m3D.onKeyUp, false);
				document.addEventListener("mousemove", m3D.onMouseMove, false);
			}
			m3D.onMouseMove = function(e){
				var x = e.layerX;
				var y = e.layerY;
			}
			m3D.onKeyDown = function(e){
				var key = e.keyCode || e.which;	
				// console.log(key);
				if(key == 37){
					document.getElementById("left").style.color = '#F00';
					document.getElementById("canvas").setAttribute("style","-webkit-transform: translateZ("+(perspective *10)+"px) rotateY(-90deg);");
				}
				if(key == 39){	
					document.getElementById("right").style.color = '#F00';
					document.getElementById("canvas").setAttribute("style","-webkit-transform: translateZ("+(perspective *10)+"px) rotateY(90deg);");
				}
				if(key == 38){
					document.getElementById("top").style.color = '#F00';
					document.getElementById("canvas").setAttribute("style","-webkit-transform: translateZ("+(perspective++ *10)+"px);");
				}
				if(key == 40){ 
					document.getElementById("down").style.color = '#F00';
					document.getElementById("canvas").setAttribute("style","-webkit-transform: translateZ("+(perspective-- *10)+"px);");
				}

			}
			m3D.onKeyUp = function(e){
				var key = e.keyCode || e.which;	
				if(key == 37) document.getElementById("left").style.color = '#000';
				if(key == 39) document.getElementById("right").style.color = '#000';
				if(key == 38) document.getElementById("top").style.color = '#000';
				if(key == 40) document.getElementById("down").style.color = '#000';
			}
			var rota_deg = 0;
			var pos_z = 0;
			var avance = 1;
			function rotate(){				
				for(div in document.getElementsByTagName('div')){
					// document.getElementsByTagName('div').item(div).setAttribute("style","display:block;width:100px;height:100px;border:1px solid black;-webkit-transform:rotateX("+rota_deg+"deg);");
				}
				rota_deg++;

				for(div in document.getElementsByClassName('group1')){
					document.getElementsByClassName('group1').item(div).setAttribute("style","display:block;width:100px;height:100px;border:1px solid black;-webkit-transform:translateZ("+pos_z+"px);");
				}
				

				if(pos_z>100){avance = -1;}
				if (pos_z<0) {avance = 1};

				pos_z += avance;

				window.setTimeout(rotate,100);
			}

			Cacanvas = {};
			Cacanvas.init = function(){
				for(div=0; div < document.getElementsByClassName('group1').length;div++){
					document.getElementsByClassName('group1').item(div).setAttribute("style","position:absolute;top:0;display:block;width:200px;height:200px;-webkit-transform:translateZ("+(-100*parseInt(div))+"px) translateX(1000px) rotateY(0);");
				}
				for(div=0; div < document.getElementsByClassName('group0').length;div++){
					document.getElementsByClassName('group0').item(div).setAttribute("style","position:absolute;top:0;display:block;width:200px;height:200px;-webkit-transform:translateZ("+(-100*parseInt(div))+"px) rotateY(0);");
				}
			}
		</script>
		<style type="text/css">
			body{
				-webkit-perspective: 80;
				-webkit-transform-style: preserve-3d;
			}
			#canvas{
				/*-webkit-perspective: 1000;*/
				-webkit-transform-style: preserve-3d;
				width:1024px;
				height:500px;
				position:absolute;
				left:402px;
			}
			div{
				-webkit-backface-visibility:hidden;
			}
		</style>
	</head>
	<body>
		<span id='left' style='color:#000;'>LEFT</span>
		<span id='top'>TOP</span>
		<span id='right'>RIGHT</span>
		<span id='down'>DOWN</span><br/>
	<div id='canvas'>
		<?
		$i = 0;

		$tab_image = array();
		$as_sitesearch = 'fanpop.com';
		$keyword = 'suicide%20girls';
		$as_sitesearch = '';
		$keyword = 'chronopost';
		for($i=0; $i<10; $i++){
			$start = ($i*8);
			$json_images_result = json_decode(`curl 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=8&start=$start&as_sitesearch=$as_sitesearch&q=$keyword'`,true);
			foreach($json_images_result['responseData']['results'] as $id=> $image){
				// echo "<img src='".$image['url']."' width='100'/>";
				array_push($tab_image,"<img src='".$image['url']."' style='max-width:200px;max-height:200px;'/>");
			}
		}
		?>
		<?
			$i = 0;
			for($i =0; $i < count($tab_image); $i++){
				echo "<div class='group".($i%2)."' style=''>".$tab_image[$i]."</div>";
			}
		?>
	</div>
		<SCRIPT TYPE="text/javascript">
		m3D.init();
		Cacanvas.init();
		// rotate();
		</SCRIPT>
	</body>
</html>