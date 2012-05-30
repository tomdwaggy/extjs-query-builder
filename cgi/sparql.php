<?php
/* This script forwards query requests to the SPARQL endpoint. */

header("Content-Type:application/xml");
$url = 'http://localhost:8000/sparql/';
$ch = curl_init($url);

$query = "SELECT * WHERE { ?s ?p ?o } LIMIT 10";

if(array_key_exists('query', $_REQUEST)) {
	$query = $_REQUEST["query"];	
}

curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "query=" . urlencode($query));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

print $response;
?>
