Ext.define('ExtQueryBuilder.AddOntologyWindow', {
    extend: 'Ext.window.Window',
    title: 'Add Ontology from URL',
    height: 75,
    width: 380,
    layout: 'fit',
    border: false,
    resizable: false,
    initComponent: function() {
        this.callParent(arguments);
    },
    items: Ext.create('Ext.form.Panel', {
        bodyPadding: '5 5 5 5',
        frame: true,
        plain: true,
        border: false,
        items: [{
            xtype: 'textfield',
            width: 350,
            name: 'url',
            fieldLabel: 'URL',
            value: 'http://'
        }],
        buttons: [
            {
                text: 'Add',
                handler: function() {
                    var me = this.up('window');
                    var form = this.up('form').getForm();
                    me.fn.call(me.scope, form.getValues());
                    me.hide();
                }
            },{
                text: 'Cancel',
                handler: function() {
                    this.up('window').hide();
                }
            }]
    })

});
