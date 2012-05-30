<?php

include_once("arc2/ARC2.php");
include_once("arc2/Graphite.php");

require 'ExtDirect.php';

class PrefixCounter
{
    var $value = 0;
    var $prefix;

    public function __construct($prefix) {
        $this->prefix = $prefix;
    }

    public function step() {
        $this->value++;
    }

    public function value() {
        return $this->prefix . '-' . $this->value;
    }
}

class Ontology
{
    private static function getPropertyRange($graph, $property, $count) {
	    if($property->has('rdfs:range')) {
		    $sProp = $graph->shrinkUri($property);
		    $sRange = $graph->shrinkUri($property->get('rdfs:range'));
            $count->step();
		    return array(
			    "id" => $count->value(),
			    "text" => $sRange,
			    "iconCls" => "range",
			    "leaf" => true
		    );
	    }
	    return array();
    }

    private static function getChildren($graph, $parent, $count) {
        $json = array();
        $classes = $parent->all("-rdfs:subClassOf");
        foreach($classes as $child) {
            $uri = $graph->shrinkUri($child);
            $children = Ontology::getChildren($graph, $child, $count);
            $count->step();
            $json[] = array(
                "id" => $count->value(),
                "text" => $uri,
                "iconCls" => "class",
                "children" => $children,
                "leaf" => empty($children)
            );
        }
        $properties = $parent->all("-rdfs:domain");
        foreach($properties as $prop) {
            $uri = $graph->shrinkUri($prop);
            $children = Ontology::getPropertyRange($graph, $prop, $count);
            $count->step();
            $json[] = array(
                "id" => $count->value(),
                "text" => $uri,
                "iconCls" => "property",
                "children" => $children,
                "leaf" => empty($children)
            );
        }
        return $json;
    }

    public function getTree($node, $ontology)
    {

        $filename = getcwd() . "/cache/onto-" . urlencode($ontology->url) . ".json";

        if(is_readable($filename)) {
            return json_decode(file_get_contents($filename));
        }

        $count = new PrefixCounter($ontology->prefix);
        $graph = new Graphite();
        $xml = simplexml_load_file($ontology->url);
        foreach($xml->getNamespaces(true) as $prefix => $uri) {
            $graph->ns($prefix, stripslashes($uri));
        }

        $graph->load($ontology->url);

        $classes = $graph->allOfType("owl:Class");
	    $classes = $classes->append($graph->allOfType("rdfs:Class"));
        $toplevel= $classes->except($classes->all("-rdfs:subClassOf"));

        $json = array();
        foreach($toplevel as $class) {
	        $uri = $graph->shrinkUri($class);
	        $children = Ontology::getChildren($graph, $class, $count);
            $count->step();
	        $json[] = array(
		        "id" => $count->value(),
		        "text" => $uri,
		        "iconCls" => "class",
		        "children" => $children,
	        	"leaf" => empty($children)
	        );
        }

        file_put_contents($filename, json_encode($json));

        return $json;
    }

}

ExtDirect::provide( 'Ontology' );

?>
