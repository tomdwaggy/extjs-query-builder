/**
 * @class ExtQueryBuilder.ExtQueryBuilder
 * @extends Ext.container.Viewport
 *
 * The main Ext Query Builder application
 *
 * @constructor
 * Create a new Query Builder app
 * @param {Object} config The config object
 */

Ext.define('ExtQueryBuilder.App', {
    extend: 'Ext.container.Viewport',
 
    initComponent: function() {
        Ext.apply(this, {
            layout: 'border', 
            items: [
                    {
                        padding: '5 0 0 5',
                        split: true,
                        region: 'west',
                        border: false,
                        layout: 'border',
                        width: 500,
                        items: [this.createOntologyPanel(),
                            this.createInstancePanel()]
                    },
                    {
                        padding: '5 5 0 0',
                        split: true,
                        region: 'center',
                        xtype: 'tabpanel',
                        activeTab: 0,
                        items: [{
                            title: 'Query Builder',
                            id: 'tab1',
                            layout: 'fit',
                            bodyPadding: 0,
                            items: this.createBuilderPanel()
                        },{
                            title: 'Query Results',
                            id: 'tab2',
                            layout: 'fit',
                            bodyPadding: 0,
                            items: this.createQueryResultsPanel()
                        }]
                    },
                    {
                        title: 'Messages',
                        autoScroll: true,
                        split: true,
                        collapsible: true,
                        padding: '0 5 5 5',
                        region: 'south',
                        height: 225,
                        items: {
                            xtype: 'box',
                            autoEl: {
                                tag: 'div',
                                html: '<div id="messages"></div>'
                            },
                            border: false
                        },
                        tools: [{
                            type: 'refresh',
                            handler: function() {
                                document.getElementById('messages').innerHTML = "";
                            }
                        }]
                    }
            ]
        });
        this.callParent(arguments);
    },
    
    /**
     * Create the ontology tree view
     * @private
     * @return {ExtQueryBuilder.OntologyPanel} ontologyPanel
     */
    createOntologyPanel: function() {
        return Ext.create('ExtQueryBuilder.OntologyPanel', {
            id: 'ontology',
            region: 'west',
            width: 250,
            split: true,
        });
    },
    
    /**
     * Create the instance view
     * @private
     * @return {ExtQueryBuilder.InstancePanel} instancePanel
     */
    createInstancePanel: function() {
        this.instancePanel = Ext.create('ExtQueryBuilder.InstancePanel', {
            id: 'instances',
            region: 'center',
            width: 250,
            split: true,
        });
        return this.instancePanel;
    },
    
    /**
     * Create the query builder view
     * @private
     * @return {ExtQueryBuilder.QueryBuilderPanel} queryBuilderPanel
     */
    createBuilderPanel: function() {
        this.builderPanel = Ext.create('ExtQueryBuilder.BuilderPanel');
        return this.builderPanel;
    },

    /**
     * Create the query results view
     * @private
     * @return {ExtQueryBuilder.QueryResultsPanel} queryResultsPanel
     */
    createQueryResultsPanel: function() {
        this.queryResultsPanel = Ext.create('ExtQueryBuilder.QueryResultsPanel');
        return this.queryResultsPanel;
    }

});
