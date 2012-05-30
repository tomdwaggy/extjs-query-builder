/**
 * @class ExtQueryBuilder.QueryResultsPanel
 * @extends Ext.panel.panel
 *
 * Shows the results obtained from a query
 *
 * @constructor
 * Create a new Query Results Panel
 * @param {Object} config The config object
 */

Ext.define('ExtQueryBuilder.QueryResultsPanel', {
    extend: 'Ext.panel.Panel',
    
    initComponent: function() {
        Ext.apply(this, {
            border: false,
            layout: 'fit',
            items: this.createView()
        });
        
        this.callParent(arguments);
    },

    /**
     * Create the DataView to be used for the results panel.
     * @private
     * @return {Ext.view.View}
     */    
    createView: function() {
        var store = new Ext.data.Store({
            fields: [],
            proxy: {
                type: 'ajax',
                url : 'cgi/sparql.php',
                reader: {
                    type: 'xml',
                    root: 'results',
                    record: 'result'
                }
            },
            autoLoad: true
        });
        
        this.view = new Ext.grid.Panel({
            border: false,
            store: store,
            columns: [],
        });
        
        return this.view;
    },

    /**
     * Send an AJAX request to the SPARQL server, and show the
     * results in the grid view.
     * @public
     */    
    query: function(sparql) {
        var newStore = new Ext.data.Store({
            fields: sparql.bound.map(function(item) {
                return {
                    name: item,
                    mapping: 'binding[name="' + item + '"] > * ',
                    convert: Utils.URI.split
                 }; 
            }),
            proxy: {
                type: 'ajax',
                url : 'cgi/sparql.php',
                extraParams: {
                    'query': sparql.query
                },
                reader: {
                    type: 'xml',
                    root: 'results',
                    record: 'result'
                }
            },
            autoLoad: true
        });
        var newColumns = sparql.bound.map(function(item) { return { header: item, dataIndex: item, width: 200 }; } );
        if(newColumns.length > 0) {
            this.view.reconfigure(newStore, newColumns);
        }
    },
    
    // Inherit docs
    onDestroy: function() {
        this.callParent(arguments);
    }
})
