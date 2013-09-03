<?

$link = mysql_connect("localhost", "root", "2456")
    or die("Impossible de se connecter : " . mysql_error());
mysql_select_db("bomber",$link);

if(isset($_GET['boom'])){
	$cleanage = @mysql_query("DELETE FROM indexation WHERE name='".$_GET['name']."' AND type='bombe'");
	mysql_close($link);
	die();
}

if(isset($_GET['caisse'])){
	$query = @mysql_query("SELECT * FROM indexation WHERE type = 'caisse'");
	$joueurs = array();
	while($joueur = mysql_fetch_array($query,MYSQL_ASSOC)){
			array_push($joueurs,array(
							"caisse"=>$joueur['param'],
							"position"=>array(
									"x"=>$joueur['x'],
									"y"=>$joueur['y'],
									"z"=>$joueur['z']
									)
							));
	}
	echo(json_encode($joueurs));
	mysql_close($link);
	die();
}

if(isset($_GET['bombe'])){
	// $query = @mysql_query("UPDATE indexation SET param='".$_GET['param']."' WHERE type = 'bombe' AND name='".$_GET['name']."'");
	$query = @mysql_query("SELECT *, ((last_update + param) - UNIX_TIMESTAMP() ) as ttl2 FROM indexation WHERE type = 'bombe' and param >= '-10' ");
	$joueurs = array();
	while($joueur = mysql_fetch_array($query,MYSQL_ASSOC)){
			array_push($joueurs,array(
							"bombe"=>$joueur['name'],
							"ttl"=>$joueur['param'],
							"last_update"=>$joueur['ttl2'],							
							"position"=>array(
									"x"=>$joueur['x'],
									"y"=>$joueur['y'],
									"z"=>$joueur['z']
									)
							));
	}
	echo(json_encode($joueurs));
	mysql_close($link);
	die();
}

$cleanage = @mysql_query("DELETE FROM indexation WHERE (last_update + 60  ) < UNIX_TIMESTAMP() AND type='player'");

$query = @mysql_query("SELECT * FROM indexation WHERE name='".$_GET['name']."' AND type='".$_GET['type']."'");

if(mysql_num_rows ($query) == 0 ||$_GET['type'] == "caisse"){
	$query = @mysql_query("INSERT INTO indexation (type,name,x,y,z,param,last_update) VALUES('".$_GET['type']."','".$_GET['name']."',".$_GET['x'].",".$_GET['y'].",".$_GET['z'].",'".$_GET['param']."',UNIX_TIMESTAMP())");	
	if($_GET['type'] == "caisse"){echo $query;die();} 
	if($_GET['type'] == "bombe"){echo $query;die();} 
}
else{
	$query = mysql_query("UPDATE indexation SET x=".$_GET['x'].", y=".$_GET['y'].", z=".$_GET['z'].", param='".$_GET['param']."', last_update=UNIX_TIMESTAMP() WHERE name='".$_GET['name']."' AND type='".$_GET['type']."'");
	if($_GET['type'] == "bombe"){echo $query;die();}
}

$query = @mysql_query("SELECT * FROM indexation WHERE type='player'");

$joueurs = array();
while($joueur = mysql_fetch_array($query,MYSQL_ASSOC)){
	// foreach(mysql_fetch_row($query,MYSQL_ASSOC) as $joueur){
		array_push($joueurs,array(
						// $joueur['type']=>$joueur['name'],
						"joueur"=>$joueur['name'],
						"position"=>array(
								"x"=>$joueur['x'],
								"y"=>$joueur['y'],
								"z"=>$joueur['z']
								)
						));
	// }
}


echo(json_encode($joueurs));

mysql_close($link);



die();

if(file_get_contents("map.json") == ""){
$content = '{
				"joueurs":
					{
						"joueur":"'.$_GET['name'].'",
						"position":
						{
							"x":'.$_GET['x'].',
							"y":'.$_GET['y'].',
							"z":'.$_GET['z'].'
						}
					}
				}';
}else{	
	$content =file_get_contents("map.json");
}


$json = json_decode($content,true);

$exist = false;
foreach($json as $id => $joueur){
	if($joueur['joueur'] == $_GET['name']){
		$exist = true;
		$json[$id]['position']['x'] = $_GET['x'];
		$json[$id]['position']['y'] = $_GET['y'];
		$json[$id]['position']['z'] = $_GET['z'];

		print_r($json);
	}
}

if(!$exist){
	array_push ($json,
			array(
					"joueur"=>$_GET['name'],
					"position"=>array(
							"x"=>$_GET['x'],
							"y"=>$_GET['y'],
							"z"=>$_GET['z']
							)
					)
			);
}

$content = json_encode($json);

$file = fopen("map.json","w");
fwrite($file, $content);
fclose($file);
// echo $content;
