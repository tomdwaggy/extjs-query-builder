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

Ext.define('ExtQueryBuilder.InstancePanel', {
    extend: 'Ext.panel.Panel',
    
    initComponent: function() {
        this.selectedProperty = 'idref';

        Ext.apply(this, {
            layout: 'fit',
            title: 'Instances',
            items: this.createView()
        });

        this.addEvents(
            'instanceselect'
        );

        Ext.ComponentManager.get('ontology').addListener('classselect', this.onClassSelect, this);
        
        this.callParent(arguments);
    },

    /**
     * Create the panel.
     * @private
     * @return {Ext.view.View}
     */    
    createView: function() {
        this.selectedProperty = 'idref';
 
        this.panel = new Ext.grid.Panel({
            border: false,
            store: {
                fields: ['id'],
                data: [
                ]
            },
            viewConfig: {
                plugins: [{
                    ptype: 'gridviewdragdrop'
                }] 
            },
            columns: [
                new Ext.grid.RowNumberer(),
                { header: this.selectedProperty, dataIndex: this.selectedProperty, width: 195 }
            ],
            tbar: new Ext.toolbar.Toolbar({
                id: 'instancetbar',
                items: [
                    {
                        text: "View By",
                        id: 'viewby',
                        disabled: true
                    }
                ]
            }),
            listeners: {
                itemclick: {
                    fn: function(view, record, item, index, event) {
                        this.fireEvent('instanceselect', record);
                    }
                },
                scope: this
            }
        });
        return this.panel;
    },

    getNamespaceRoot: function(record) {
        while(record.data.iconCls != "namespace")
            if(record.parentNode)
                record = record.parentNode;

        if(record.data.iconCls == "namespace")
            return record;
        else
            return null;
    },
  
    /**
     * An ontology item has been selected
     * @private
     */
    onClassSelect: function(record) {
        this.selectedClass = record.data.text;
        this.selectedNamespaceRoot = this.getNamespaceRoot(record);
        this.selectedProperty = 'idref';

        this.buildStore();
        this.panel.reconfigure(this.store, this.columns);

        var tbar = this.panel.getDockedComponent('instancetbar');
        var items = [];
        tbar.removeAll();
        items.push({id: "idref", text: "ID Reference", checked: true, scope: this, handler: this.onViewBy});
        for(var i = 0; i < record.childNodes.length; i++) {
            if(record.childNodes[i].data.iconCls == "property") {
                var id = record.childNodes[i].data.text;
                items.push({id: id, text: id, scope: this, handler: this.onViewBy});
            }
        }
        tbar.add({
                   text: "View By",
                   id: 'viewby',
                   menu: {
                        defaults: {checked: false, group: 'viewbyChkGroup'},
                        items: items
                    },
        });
    },

    /**
     * This method builds the store and populates it
     */
    buildStore: function() {
        var params = {
            url: this.selectedNamespaceRoot.data.url,
            class: this.selectedClass,
        };

        var fields = ["id"];

        fields.push(this.selectedProperty);

        if(this.selectedProperty != "idref") {
            params.properties = this.selectedProperty;
        } else {
            fields.push({
                name: "idref",
                mapping: "id",
                convert: function(v, record) { return v.split(":")[1]; }
            });
        }

        this.store = new Ext.data.Store({
            fields: fields,

            proxy: {
                type: 'ajax',
                url : 'cgi/jsinstances.php',
                
                extraParams: params,
                
                reader: {
                    type: 'json',
                    root: 'instances'
                }
            },
            autoLoad: true
        });

        this.columns = [
                new Ext.grid.RowNumberer(),
                { header: this.selectedProperty, dataIndex: this.selectedProperty, width: 195 }
        ];

    },

    /**
     * A view has been selected in the View By entry
     * @private
     */
    onViewBy: function(sel) {
        this.selectedProperty = sel.id;
        this.buildStore();
        this.panel.reconfigure(this.store, this.columns);
    },
    
    // Inherit docs
    onDestroy: function() {
        this.callParent(arguments);
    }
})
