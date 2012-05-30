/**
 * @class Utils.Filters
 *
 * This is a utility class for filtering on XSD data types.
 *
 */

Ext.define('Utils.Filters', {
    singleton: true,
    types: {
        'xsd:string': {
            validate: function(obj, expr) {
            },
            template: new Ext.XTemplate('FILTER regex({object}, "{expr}")')
        },
        'xsd:int': {
            validate: function(obj, expr) {
            },
            template: new Ext.XTemplate('FILTER ({expr})')
        },
        'xsd:float': {
            validate: function(obj, expr) {
            },
            template: new Ext.XTemplate('FILTER ({expr})')
        }
    },
    filter: function(values) {
        return values.expr && this.types[values.type];
    },
    render: function(values) {
        return this.types[values.type].template.apply(values);
    }
})
