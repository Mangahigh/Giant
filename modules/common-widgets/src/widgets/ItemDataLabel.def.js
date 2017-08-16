$oop.postpone($commonWidgets, 'ItemDataLabel', function (ns, className) {
    "use strict";

    var base = $commonWidgets.DataLabel;

    /**
     * Creates a ItemDataLabel instance.
     * @name $commonWidgets.ItemDataLabel.create
     * @function
     * @param {$entity.FieldKey} textFieldKey Identifies field to be displayed.
     * @param {$entity.ItemKey} itemKey Identifies item the widget is associated with.
     * @returns {$commonWidgets.ItemDataLabel}
     */

    /**
     * General DataLabel to be used as a list item.
     * @class
     * @extends $commonWidgets.DataLabel
     * @extends $commonWidgets.DataListItem
     */
    $commonWidgets.ItemDataLabel = base.extend(className)
        .addTraitAndExtend($commonWidgets.DataListItem);
});
