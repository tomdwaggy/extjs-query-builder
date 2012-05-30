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
        var self = this;
        Ext.apply(this, {
            layout: 'border',
            items: [
                    {
                        plain: true,
                        border: false,
                        region: "west",
                        layout: "border",
                        width: 500,
                        height: 800,
                        items: [
                            this.createOntologyPanel(),
                            this.createInstancePanel()
                        ]
                    },
                    {
                        region: "center",
                        plain: false,
                        padding: 5,
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
                    this.createMenu()
            ]
        });
        this.builderPanel.setQueryResultsPanel(this.queryResultsPanel);
        this.callParent(arguments);
    },
    
    /**
     * Create the ontology tree view
     * @private
     * @return {ExtQueryBuilder.OntologyPanel} ontologyPanel
     */
    createOntologyPanel: function() {
        return Ext.create('ExtQueryBuilder.OntologyPanel', {
            region: 'west',
            padding: '5 0 5 5',
            width: 250,
            split: true
        });
    },
    
    /**
     * Create the instance view
     * @private
     * @return {ExtQueryBuilder.InstancePanel} instancePanel
     */
    createInstancePanel: function() {
        this.instancePanel = Ext.create('ExtQueryBuilder.InstancePanel', {
            region: 'center',
            padding: 5,
            width: 250,
            split: true
        });
        return this.instancePanel;
    },
    
    /**
     * Create the query builder view
     * @private
     * @return {ExtQueryBuilder.QueryBuilderPanel} queryBuilderPanel
     */
    createBuilderPanel: function() {
        this.builderPanel = Ext.create('ExtQueryBuilder.BuilderPanel', {
        });
        return this.builderPanel;
    },

    /**
     * Create the query results view
     * @private
     * @return {ExtQueryBuilder.QueryResultsPanel} queryResultsPanel
     */
    createQueryResultsPanel: function() {
        this.queryResultsPanel = Ext.create('ExtQueryBuilder.QueryResultsPanel', {
        });
        return this.queryResultsPanel;
    },
    
});
