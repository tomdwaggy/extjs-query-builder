/**
 * @class ExtQueryBuilder.BuilderPanel
 * @extends Ext.panel.panel
 *
 * Builder panel, a tree view that lets the
 * user edit the query graphically.
 *
 * @constructor
 * Create a new Builder Panel
 * @param {Object} config The config object
 */

Ext.define('ExtQueryBuilder.BuilderPanel', {
    extend: 'Ext.panel.Panel',
    
    initComponent: function() {
        this.selected = {};
        console.log(this.up('app'));
        Ext.ComponentManager.get('ontology').addListener('classselect', function(record) {
            this.selected.subject = record.data.text;
        }, this);

        Ext.ComponentManager.get('ontology').addListener('propertyselect', function(record) {
            this.selected.property = record.data.text;
            this.selected.range = "?";
            if(record.childNodes.length == 1) {
                this.selected.range = record.childNodes[0].data.text;
            }
        }, this);

        Ext.ComponentManager.get('instances').addListener('instanceselect', function(record) {
            this.selected.instance = record.data.id;
        }, this);
        
        Ext.apply(this, {
            layout: 'fit',
            border: false,
            items: this.createBuilderTreeGrid()
        });
        this.callParent(arguments);
    },

    isSetOperation: function(str) {
        return str == "UNION" || str == "INTERSECTION" || str == "MINUS";
    }, 
    
    /**
     * Create the TreeGrid to be used for the ontology builder.
     * @private
     * @return {Ext.tree.Panel}
     */    
    createBuilderTreeGrid: function() {

        var actions = {
            setclass: {
                handler: function() { this.record.set('expr', this.selected.subject); },
                scope: this
            },
            deletenode: {
                handler: function() { this.selected.node.destroy(); },
                scope: this
            },
            setinstance: {
                handler: function() { this.record.set('expr', this.selected.instance); },
                scope: this
            },
            addchild: {
                handler: this.addNode,
                scope: this
            },
            addunion: {
                handler: this.addUnion,
                scope: this
            },
            /*addintersection: {
                handler: this.addIntersection,
                scope: this
            },*/
            adddifference: {
                handler: this.addDifference,
                scope: this
            },
            addrdftype: {
                handler: this.addRDFType,
                scope: this
            }
        };

        Ext.define('Query', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'text', type:'string'},
                {name: 'expr', type:'string'},
                {name: 'vname', type:'string'},
                {name: 'range', type:'string'},
                {name: 'bound', type:'boolean'}
            ],
            proxy: {
                type: 'memory'
            }
        });
        
        this.data = {
            children: [{
            iconCls: 'property',
            text: 'rdf:type',
            bound: true,
            vname: 'q',
            range: 'rdfs:Class',
            expanded: true}]
        };
        
        this.store = Ext.create('Ext.data.TreeStore', {
            model: 'Query',
            root: this.data,
            proxy: {
                type: 'memory'
            },
            autoLoad: true
        });

        Ext.override(Ext.data.AbstractStore,{
            indexOf: Ext.emptyFn
        });
        
        var variable = function(val) {
            if (val != "") {
                return '<span><span style="color:blue;">?</span>' + val + '</span>';
            }
            return val;
        }

        this.tree = new Ext.tree.TreePanel({
            selType: 'rowmodel',
            layout: 'fit',
            border: false,
            autoExpand: true,
            sortableColumns: false,
            rootVisible: false,
            viewConfig: {
                plugins: {
                    ptype: 'treeviewdragdrop'
                }
            },
            columns: [{
                xtype: 'treecolumn',
                text: 'Query Node',
                width: 170,
                dataIndex: 'text'
            },{
                header: 'Bound',
                width: 50,
                dataIndex: 'bound',
                editor: {
                    xtype: 'checkbox'
                },
                renderer: function(val) {
                    if(val == true)
                        return "<div style=\"color:green;text-align:center;\">Y</div>";
                    else
                        return "<div style=\"color:red;text-align:center;\">N</div>";
                }
            },{
                header: 'Variable',
                renderer: variable,
                dataIndex: 'vname',
                width: 75,
                editor: {
                    xtype: 'textfield'
                }
            },{
                header: 'Range',
                dataIndex: 'range',
                width: 100,
                renderer: function(val, style, record) {
                    if(val == "?")
                        return "<img src=\"icons/question.png\" />";
                    else if(val)
                        return "<img src=\"icons/range.png\" />" + val;
                    else
                        return "";
                }
            },{
                header: 'Expression',
                dataIndex: 'expr',
                width: 200,
                editor: {
                    xtype:'textfield',
                }
            }],
            tbar: new Ext.toolbar.Toolbar({
                region: 'north',
                items: [
                    {text: "Execute Query", scope: this, handler: this.execute},
                    {
                        xtype: 'fieldcontainer',
                        defaultType: 'checkboxfield',
                        items: [
                            { boxLabel: 'Distinct', name: 'distinct',
                              inputValue: '1', checked: false,
                              id: 'distinctCheck' }
                        ]
                    }
                ]
            }),
            store: this.store,
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })],
            listeners: {
                itemclick: {
                    fn: function(view, record, item, index, event) {
                        this.selected = this.store.getNodeById(record.internalId);

                        this.record = record;
                    }
                },
                itemcontextmenu: function(view, rec, node, index, e) {
                    this.selected.node = this.store.getNodeById(rec.internalId);

                    var items = [];
                    var addAction = function(action, text) {
                        items.push(Ext.Object.merge(action, { text: text }));
                    }
                    
                    if(rec.data.text == "rdf:type") {
                        if(this.selected.subject)
                            addAction(actions.setclass, "Set class to " + this.selected.subject);
                    } else {
                        addAction(actions.addrdftype, "Add type requirement");
                        if(this.selected.instance)
                            addAction(actions.setinstance, "Set instance to " + this.selected.instance);
                    }

                    if(rec.getDepth() != 1) {
                        addAction(actions.deletenode, "Delete node");
                    }

                    this.record = rec;
                    e.stopEvent();
                     
                    if(this.selected.property)
                        addAction(actions.addchild, "Add child " + this.selected.property);

                    if(!this.isSetOperation(rec.parentNode.data.text) && !this.isSetOperation(rec.data.text)) {
                        addAction(actions.addunion, "Add union as parent");
                        // addAction(actions.addintersection, "Add intersection as parent");
                        addAction(actions.adddifference, "Add difference as parent");
                    }

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: items
                    });

                    contextMenu.showAt(e.getXY());
                    return false;
                },
                scope: this
            }
        });

        return this.tree;
    },
    
    /**
     * Add part of a filter to the where clause of a query
     * @private
     */
    addNode: function() {
        this.selected.node.data.leaf = false;
        var x = this.selected.node.appendChild({
            iconCls: 'property',
            text: this.selected.property,
            leaf: true,
            range: this.selected.range
        });
        this.selected.node.expand();
    },

    /**
     * Add a union operation to the parent of this node
     * @private
     */
    addUnion: function() {
        var tmp = this.selected.node.parentNode.appendChild({
            iconCls: 'class',
            text: 'UNION',
            leaf: false
        });
        tmp.appendChild(this.selected.node);
        tmp.expand();
    },

    /* addIntersection: function() {
        var tmp = this.selected.node.parentNode.appendChild({
            iconCls: 'class',
            text: 'INTERSECTION',
            leaf: false
        });
        tmp.appendChild(this.selected.node);
        tmp.expand();
    }, */

    addDifference: function() {
        var tmp = this.selected.node.parentNode.appendChild({
            iconCls: 'class',
            text: 'MINUS',
            leaf: false
        });
        tmp.appendChild(this.selected.node);
        tmp.expand();
    },

    addRDFType: function() {
        this.selected.node.data.leaf = false;
        var x = this.selected.node.appendChild({
            iconCls: 'property',
            text: 'rdf:type',
            leaf: true,
            range: 'rdfs:Class'
        });
        this.selected.node.expand();
    },

    /**
     * Generate the SPARQL query
     * @private
     */
    generate: function() {
        var node = this.store.getRootNode();
        var me = this;

        var sparqlQuery = {
            prefixes: [
                { prefix: 'rdf',  url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#' },
                { prefix: 'rdfs', url: 'http://www.w3.org/2000/01/rdf-schema#' },
                { prefix: 'xsd',  url: 'http://www.w3.org/2001/XMLSchema#' },
                { prefix: 'fn',   url: 'http://www.w3.org/2005/xpath-functions#' },
                { prefix: 'empl', url: 'http://www.acrid.tk/employee.owl#' },
                { prefix: 'foaf', url: 'http://xmlns.com/foaf/0.1/' }
            ],
            bound: [],
            graph: "", distinct: true
        };

        var removeDuplicates = function(arr) {
            var i, len = arr.length, out=[], obj={};
            for(i=0;i<len;i++){
                obj[arr[i]] = 0;
            }
            for(i in obj) {
                out.push(i);
            }
            return out;
        }

        var traverse = function(item, upperVar, indent) {
            var predicate = "";
            var subject = "";
            var filter = "";

            if(item) {
                var data = item.data;

                while(data.text == "Root") {
                    return traverse(item.childNodes[0], upperVar, indent);
                }

                if(data.text == "rdf:type") {
                    if(upperVar == 'NULL') {
                        upperVar = data.vname;
                    }
                    subject = "?" + upperVar;
                    predicate = data.expr; 
                } else {
                    subject = "?" + upperVar;
                    if(data.vname) {
                        predicate = "?" + data.vname;
                        upperVar = data.vname;
                        if(data.expr) {
                            filter = "FILTER " + data.expr + " ";
                        }
                    }
                    else {
                        predicate = data.expr;
                    }
                }

                if(data.bound)
                    sparqlQuery.bound.push(data.vname);
                if(me.isSetOperation(data.text)) {
                    var unions = [];
                    for (var i = 0; i < item.childNodes.length; i++) {
                        unions[i] = "{\n" + indent + traverse(item.childNodes[i], upperVar, indent + "  ") + "\n" + indent + '}';
                    }
                    return indent + unions.join(' ' + data.text + ' ');
                } else {
                    var nodes = [];

                    nodes.push(indent + subject + " " + data.text + " " + predicate + " . " + filter);

                    if(item.childNodes) {
                        for(var i=0;i<item.childNodes.length;i++) {
                            nodes.push(traverse(item.childNodes[i], upperVar, indent + "  "));
                        }
                    }

                    return nodes.join("\n");
                }
            }
        }

        var sparqlTemplate = new Ext.XTemplate(
            '<tpl for="prefixes">',
                'PREFIX {prefix}: <{url}>\n',
            '</tpl>',
            'SELECT<tpl if="distinct"> DISTINCT</tpl><tpl for="bound"> ?{.}</tpl>\n',
            'WHERE {\n',
            '{graph} \n',
            '}\n'
        );
        
        sparqlQuery.graph = traverse(node, 'NULL', "  ");
        sparqlQuery.bound = removeDuplicates(sparqlQuery.bound);
        sparqlQuery.query = sparqlTemplate.apply(sparqlQuery);
        sparqlQuery.success = true;
        
        console.log(sparqlQuery.query);

        return sparqlQuery;
    },

    /**
     * Execute the SPARQL query
     * @private
     */
    execute: function() {
        var view = this.up('viewport');
        if(view.queryResultsPanel) {	
            var sparql = this.generate();
            if(sparql.success) {
                view.queryResultsPanel.query(sparql);
            }
        }
    },
    
    // Inherit docs
    onDestroy: function() {
        this.callParent(arguments);
    }
})
