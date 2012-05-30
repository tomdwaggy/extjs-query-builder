<?php
header("Content-Type:application/json");
include_once("arc2/ARC2.php");
include_once("arc2/Graphite.php");

$URL = $_GET['url'];
$CLASS = $_GET['class'];

$filename = getcwd() . "/cache/inst-" . urlencode($CLASS) . "-" . urlencode($URL) . ".json";

if(is_readable($filename)) {
    print file_get_contents($filename);
    return;
}

$graph = new Graphite();

$xml = simplexml_load_file($URL);
foreach($xml->getNamespaces(true) as $prefix => $uri) {
    $graph->ns($prefix, stripslashes($uri));
}

$graph->load($URL);

$properties = array();
if(array_key_exists('properties', $_REQUEST)) {
	$PROPS = $_GET['properties'];
	$properties = explode(",", $PROPS);
}

// Here, we grab a List of all of this type of class 
$resources = $graph->allOfType($CLASS);

$json = array();
foreach($resources as $instance) {
	$suri = $graph->shrinkURI(trim($instance));
	
	$add = array(
        "id" => $suri
	);
	
	foreach($properties as $prop) {
		$propname = trim($prop);
		$value = trim($instance->get($prop));
        $split = ARC2::splitUri($value);
        if($split[1]) {
		    $add[$propname] = $split[1];
        } else {
            $add[$propname] = $value;
        }
	}
	
	$json[] = $add;
}

file_put_contents($filename, json_encode(array("instances" => $json)));

print json_encode(array("instances" => $json));

?>
