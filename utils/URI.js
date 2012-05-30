/**
 * @class ExtQueryBuilder.SplitURI
 *
 * URI Utils for making URIs more
 * readable, can be used as filters
 * in Ext Grids, etc.
 *
 * parse and options methods are
 * derived from ParseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 *
 */

Ext.define('Utils.URI', {
    singleton: true,
    split: function(str) {
        var uri = Utils.URI.parse(str);
        if(uri.anchor)
            return uri.anchor;
        else if(uri.file)
            return uri.file;
        else return str;
    },
    options: {
	    strictMode: true,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {
		    name:   "queryKey",
        	parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
		    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        	loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    },
    parse: function(str) {
    	var	o = Utils.URI.options,
    	m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

        while (i--) uri[o.key[i]] = m[i] || "";

        uri[o.q.name] = {};
        uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		    if ($1) uri[o.q.name][$1] = $2;
        });

        return uri;
    }
});
