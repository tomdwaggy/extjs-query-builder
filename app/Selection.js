/**
 * @class ExtQueryBuilder.Selection
 *
 * This class models the selections available for the query builder,
 * for instance to determine the selected class or namespace.
 *
 */

Ext.define('ExtQueryBuilder.Selection', {
    values: [],
    monitor: function(object, evtname, selection) {
        Ext.ComponentManager.get(object).addListener(evtname,
        function(record) {
            console.log(record);
            console.log(this);
            this[selection] = record.data.text;
        }, this.values);
    }
})
