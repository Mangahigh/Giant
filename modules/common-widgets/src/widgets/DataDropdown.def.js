$oop.postpone($commonWidgets, 'DataDropdown', function (ns, className) {
    "use strict";

    var base = $commonWidgets.Dropdown,
        self = base.extend(className)
            .addTrait($commonWidgets.EntityWidget);

    /**
     * Creates a DataDropdown instance.
     * @name $commonWidgets.DataDropdown.create
     * @function
     * @param {$entity.FieldKey} fieldKey
     * @returns {$commonWidgets.DataDropdown}
     */

    /**
     * The DataDropdown extends the functionality of the Dropdown with a List that is bound to a field in the cache.
     * @class
     * @extends $commonWidgets.Dropdown
     * @extends $commonWidgets.EntityWidget
     */
    $commonWidgets.DataDropdown = self
        .addMethods(/** @lends $commonWidgets.DataDropdown# */{
            /**
             * @param {$entity.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                $commonWidgets.EntityWidget.init.call(this, fieldKey);
                base.init.call(this);
            },

            /**
             * Creates a DataList for the dropdown to use as its internal option list.
             * To specify a custom DataList, you don't necessarily have to override the DataDropdown class,
             * only delegate a surrogate definition to $commonWidgets.DataList that points to your implementation.
             * @example
             * $commonWidgets.DataList.addSurrogate(myNameSpace, 'MyDataList', function (fieldKey) {
             *     return myCondition === true;
             * })
             * @returns {$commonWidgets.DataList}
             * @see $commonWidgets.Dropdown#spawnListWidget
             */
            spawnListWidget: function () {
                return $commonWidgets.DataList.create(this.entityKey);
            }
        });
});
