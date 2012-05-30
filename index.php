<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Ext Query Builder</title>
        <link rel="stylesheet" type="text/css" href="../deps/ext-4.0.2a/resources/css/ext-all.css" />
        <link rel="stylesheet" type="text/css" href="css/mainstyle.css" />
        <script type="text/javascript" src="../deps/ext-4.0.2a/bootstrap.js"></script>
        <script type="text/javascript" src="cgi/Ontology.php?javascript"></script>
        <script type="text/javascript">
            Ext.Loader.setPath('ExtQueryBuilder', 'app');
            Ext.Loader.setPath('Utils', 'utils');
            Ext.Loader.setConfig({enabled: true});
            Ext.require([
                'Utils.URI',
                'Utils.Filters',
                'ExtQueryBuilder.App',
                'ExtQueryBuilder.*'
            ]);
            Ext.onReady(function(){
                var app = new ExtQueryBuilder.App();
            });
    </script> 

    </head>
    <body>
    </body>
</html>
