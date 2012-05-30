/**
 * @class ExtQueryBuilder.OntologyPanel
 * @extends Ext.panel.panel
 *
 * Shows a tree of the ontologies in the ontology list.
 *
 * @constructor
 * Create a new Ontology Panel
 * @param {Object} config The config object
 */

Ext.define('ExtQueryBuilder.OntologyPanel', {
    extend: 'Ext.panel.Panel',
    
    initComponent: function() {

        this.addOntologyWin = Ext.create('ExtQueryBuilder.AddOntologyWindow', {
            fn: function(values) {
                this.addOntology(values);
            },
            scope: this
        });
 
        Ext.apply(this, {
            layout: 'fit',
            title: 'Ontologies',
            items: this.createView()
        });

        this.addEvents(
            'propertyselect', 'classselect'
        );
        
        this.callParent(arguments);

    },

    addOntology: function(values) {
        var root = this.store.getRootNode();
        var file = Utils.URI.split(values.url);
        root.appendChild({
            id: file + new Date(),
            iconCls: 'namespace',
            text: file,
            url: values.url
        });
    },

    // template method
    afterRender: function() {
        this.callParent(arguments);
        var view = this.view;
    },

    /**
     * Create the DataView to be used for the ontology tree.
     * @private
     * @return {Ext.view.View}
     */    
    createView: function() {
        this.store = Ext.create('Ext.data.TreeStore', {
            fields: ["prefix", "namespace", "url", "text"],
            root: {
                expanded: true
            },
            proxy: {
                type: 'direct',
                directFn: Ext.php.Ontology.getTree,
                paramOrder: ['node', 'ontology']
            },
            root: {
                id: 'root',
                children: [{
                    id: 'empl',
                    iconCls: 'namespace',
                    text: 'empl',
                    prefix: 'empl',
                    namespace: 'http://www.acrid.tk/employee.owl#',
                    url: 'http://localhost/~mashup/ontology/empl.owl'
                },{
                    id: 'rdf',
                    iconCls: 'namespace',
                    text: 'rdf',
                    prefix: 'rdf',
                    namespace: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                    url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
                },{
                    id: 'rdfs',
                    iconCls: 'namespace',
                    text: 'rdfs',
                    prefix: 'rdfs',
                    namespace: 'http://www.w3.org/2000/01/rdf-schema#',
                    url: 'http://www.w3.org/2000/01/rdf-schema#'
                }]
            },
            listeners: {
                beforeload: function(store, op, opts) {
                    if(op.node.data.iconCls == 'namespace') {
                        op.params.ontology = {
                            prefix: op.node.data.prefix,
                            namespace: op.node.data.namespace,
                            url: op.node.data.url
                        };
                    }
                }
            }
        });

        return new Ext.tree.Panel({
            border: false,
            store: this.store,
            tbar: new Ext.toolbar.Toolbar({
                items: [
                    {text: "Add", handler: function() {
                        this.addOntologyWin.show(); 
                    }, scope: this },
                    {text: "Remove", handler: function() {
                        if(this.namespaceSelected) {
                            this.namespaceSelected.remove();
                            this.namespaceSelected = null;
                        }
                    }, scope: this }
                ]
            }),
            listeners: {
                itemclick: {
                    fn: function(view, record, item, index, event) {
                        this.namespaceSelected = null;
                        if(record.data.iconCls == "property") {
                            this.fireEvent('propertyselect', record);
                        } else if(record.data.iconCls == "class") {
                            this.fireEvent('classselect', record);
                        } else if(record.data.iconCls == "namespace") {
                            this.namespaceSelected = record;
                        }
                    }
                },
                scope: this
            },
            rootVisible: false
        });
    },
    
    // Inherit docs
    onDestroy: function() {
        this.callParent(arguments);
    }
})
