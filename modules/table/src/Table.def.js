$oop.postpone($table, 'Table', function () {
    "use strict";

    var base = $data.Collection,
        self = base.extend();

    /**
     * Instantiates class.
     * @name $table.Table.create
     * @function
     * @param {object[]} [json]
     * @returns {$table.Table}
     */

    /**
     * Indexed table. For quick table queries.
     * In technical terms, a table is a collection of rows, therefore it extends the Collection API.
     * TODO: Rename to IndexedTable.
     * @class $table.Table
     * @extends $data.Collection
     */
    $table.Table = self
        .addMethods(/** @lends $table.Table# */{
            /**
             * @param {object[]} [json]
             * @ignore
             */
            init: function (json) {
                $assertion.isArrayOptional(json, "Invalid table buffer");

                base.init.call(this, json || []);

                /**
                 * Indexes associated with table
                 * @type {$table.IndexCollection}
                 */
                this.indexCollection = $table.IndexCollection.create();
            },

            /**
             * Sets row at given row ID.
             * @param {string|number} rowId
             * @param {object} row
             * @returns {$table.Table}
             */
            setItem: function (rowId, row) {
                // updating indexes
                this.indexCollection
                    .removeRow(this.getItem(rowId), rowId)
                    .addRow(row, rowId);

                base.setItem.call(this, rowId, row);

                return this;
            },

            /**
             * Sets multiple rows at once.
             * @param {object} rowIdRowPairs
             * @returns {$table.Table}
             */
            setItems: function (rowIdRowPairs) {
                var that = this;
                $data.Collection.create(rowIdRowPairs)
                    .forEachItem(function (row, rowId) {
                        that.setItem(rowId, row);
                    });
                return this;
            },

            /**
             * Deletes a row from the given row ID.
             * @param {string|number} rowId
             * @returns {$table.Table}
             */
            deleteItem: function (rowId) {
                // updating indexes
                this.indexCollection
                    .removeRow(this.getItem(rowId), rowId);

                base.deleteItem.call(this, rowId);

                return this;
            },

            /**
             * Clones table.
             * @returns {$table.Table}
             */
            clone: function () {
                // cloning collection
                var result = /** @type $table.Table */base.clone.call(this);

                // adding table specific properties
                this.indexCollection.forEachItem(function (/**$table.Index*/ index) {
                    var rowSignature = index.rowSignature;
                    result.addIndex(rowSignature.fieldNames, rowSignature.signatureType);
                });

                return result;
            },

            /**
             * Adds an index to the table.
             * @param {string[]} fieldNames Names of fields included in the index
             * @param {string} [signatureType] Index type
             * @param {boolean} [isCaseInsensitive=false] Whether signature is case insensitive.
             * @param {string} [orderType='ascending'] Order type. Either 'ascending' or 'descending'.
             * @returns {$table.Table}
             */
            addIndex: function (fieldNames, signatureType, isCaseInsensitive, orderType) {
                var index = $table.Index.create(fieldNames, signatureType, isCaseInsensitive, orderType);

                // adding index to collection
                this.indexCollection.setItem(index);

                // initializing index with table rows
                this.forEachItem(index.addRow, index);

                return this;
            },

            /**
             * Re-indexes table by rebuilding all indexes associated with table.
             * @returns {$table.Table}
             */
            reIndex: function () {
                var indexCollection = this.indexCollection;

                // clearing index buffer
                indexCollection.clearBuffers();

                // re-building each index
                this.forEachItem(indexCollection.addRow, indexCollection);

                return this;
            },

            /**
             * Retrieves rows assigned to the specified row IDs, wrapped in a hash.
             * @param {string[]|number[]} rowIds
             * @returns {$data.Hash}
             */
            queryByRowIdsAsHash: function (rowIds) {
                return $data.StringDictionary.create(rowIds)
                    .combineWith(this.toDictionary());
            },

            /**
             * Retrieves rows assigned to the specified row IDs.
             * @param {string[]|number[]} rowIds
             * @returns {object[]}
             */
            queryByRowIds: function (rowIds) {
                return this.queryByRowIdsAsHash(rowIds).items;
            },

            /**
             * Fetches table rows that match specified row expression and wraps them in a hash.
             * @param {object} rowExpr Row expression.
             * @returns {$data.Hash}
             */
            queryByRowAsHash: function (rowExpr) {
                var index = this.indexCollection.getBestIndexForRow(rowExpr);

                $assertion.assert(!!index, "No index matches row");

                return index
                    // obtaining matching row IDs
                    .getRowIdsForKeysAsHash(index.rowSignature.getKeysForRow(rowExpr))
                    // joining actual rows that match
                    .toStringDictionary()
                    .combineWith(this.toDictionary());
            },

            /**
             * Fetches table rows that match specified row expression.
             * @param {object} rowExpr Table row or relevant field w/ value
             * @returns {Array}
             */
            queryByRow: function (rowExpr) {
                return this.queryByRowAsHash(rowExpr).items;
            },

            /**
             * Fetches table rows that match specified rows or row fractions and wraps them in a hash.
             * @param {object[]} rows Table rows or relevant fields w/ values
             * @returns {$data.Hash}
             */
            queryByRowsAsHash: function (rows) {
                $assertion.isArray(rows, "Invalid rows expression");

                var index = this.indexCollection.getBestIndexForRow(rows[0]);

                $assertion.assert(!!index, "No index matches row");

                return $data.Collection.create(rows)
                    // getting a collection of all keys fitting expression
                    .passEachItemTo(index.rowSignature.getKeysForRow, index.rowSignature)
                    // obtaining unique signatures matching rows
                    .toStringDictionary()
                    .getUniqueValuesAsHash()
                    // obtaining row IDs based on keys
                    .toCollection()
                    .passEachItemTo(index.getRowIdsForKeys, index)
                    // obtaining unique row IDs
                    .toStringDictionary()
                    .getUniqueValuesAsHash()
                    // joining matching rows to selected row IDs
                    .toStringDictionary()
                    .combineWith(this.toDictionary());
            },

            /**
             * Fetches table rows that match specified rows or row fractions.
             * @param {object[]} rows Table rows or relevant fields w/ values
             * @returns {Array}
             */
            queryByRows: function (rows) {
                return this.queryByRowsAsHash(rows).items;
            },

            /**
             * Fetches table rows at the specified offset on the specified field, and wraps it in a hash.
             * @param {string[]} fieldNames Names of fields in which the offset must be matched.
             * @param {number} offset Position of row inside the table, in the order of the specified field.
             * @returns {$data.Dictionary}
             */
            queryByOffsetAsHash: function (fieldNames, offset) {
                var index = this.indexCollection.getBestIndexForFields(fieldNames);

                return index
                    // obtaining row IDs matching offset
                    .getRowIdsBetweenAsHash(offset, offset + 1)
                    // joining actual rows that match
                    .toStringDictionary()
                    .combineWith(this.toDictionary());
            },

            /**
             * Fetches table rows at the specified offset on the specified field.
             * @param {string[]} fieldNames Name of field in which the offset must be matched.
             * @param {number} offset Position of row inside the table, in the order of the specified field.
             * @returns {object[]}
             */
            queryByOffset: function (fieldNames, offset) {
                return this.queryByOffsetAsHash(fieldNames, offset).items;
            },

            /**
             * Fetches table rows falling between the specified offsets by the specified field, and wraps it in a hash.
             * @param {string[]} fieldNames Names of fields in which the offset range must be matched.
             * @param {number} startOffset Start of offset range
             * @param {number} endOffset End of offset range
             * @returns {$data.Dictionary}
             */
            queryByOffsetRangeAsHash: function (fieldNames, startOffset, endOffset) {
                var index = this.indexCollection.getBestIndexForFields(fieldNames);

                return index
                    // obtaining row IDs matching offset
                    .getRowIdsBetweenAsHash(startOffset, endOffset)
                    // joining actual rows that match
                    .toStringDictionary()
                    .combineWith(this.toDictionary());
            },

            /**
             * Fetches table rows falling between the specified offsets by the specified field, and wraps it in a hash.
             * @param {string[]} fieldNames Names of fields in which the offset range must be matched.
             * @param {number} startOffset Start of offset range
             * @param {number} endOffset End of offset range
             * @returns {object[]}
             */
            queryByOffsetRange: function (fieldNames, startOffset, endOffset) {
                return this.queryByOffsetRangeAsHash(fieldNames, startOffset, endOffset).items;
            },

            /**
             * Fetches table rows matching value range on the specified field, and wraps it in a hash.
             * @param {string[]} fieldNames Names of fields in which the value range must be matched.
             * @param {string|number} startValue Start of value range
             * @param {string|number} endValue End of value range
             * @param {number} [offset=0] Number of items to skip at the start of the result set.
             * @param {number} [limit=Infinity] Maximum number of items in result set.
             * @returns {$data.Dictionary}
             */
            queryByRangeAsHash: function (fieldNames, startValue, endValue, offset, limit) {
                var index = this.indexCollection.getBestIndexForFields(fieldNames);

                return index
                    // obtaining row IDs matching interval
                    .getRowIdsForKeyRangeAsHash(startValue, endValue, offset, limit)
                    // joining actual rows that match
                    .toStringDictionary()
                    .combineWith(this.toDictionary());
            },

            /**
             * Fetches table rows matching value range on the specified field.
             * @param {string[]} fieldNames Names of fields in which the value range must be matched.
             * @param {string|number} startValue Start of value range
             * @param {string|number} endValue End of value range
             * @param {number} [offset=0] Number of items to skip at the start of the result set.
             * @param {number} [limit=Infinity] Maximum number of items in result set.
             * @returns {Object[]}
             */
            queryByRange: function (fieldNames, startValue, endValue, offset, limit) {
                return this.queryByRangeAsHash(fieldNames, startValue, endValue, offset, limit).items;
            },

            /**
             * Fetches table rows matching the specified prefix on the specified field, and wraps it in a hash.
             * @param {string[]} fieldNames Names of fields in which the prefix must be matched.
             * @param {string} prefix Prefix that must be matched.
             * @param {number} [offset=0] Number of items to skip at the start of the result set.
             * @param {number} [limit=Infinity] Maximum number of items in result set.
             * @returns {$data.Hash}
             */
            queryByPrefixAsHash: function (fieldNames, prefix, offset, limit) {
                var index = this.indexCollection.getBestIndexForFields(fieldNames);

                $assertion.assert(!!index, "No index matches row");

                return index
                    // obtaining row IDs matching prefix
                    .getRowIdsForPrefixAsHash(prefix, offset, limit)
                    // joining actual rows that match
                    .toStringDictionary()
                    .combineWith(this.toDictionary());
            },

            /**
             * Fetches table rows matching the specified prefix on the specified field.
             * @param {string[]} fieldNames Names of fields in which the prefix must be matched.
             * @param {string} prefix Prefix that must be matched.
             * @param {number} [offset=0] Number of items to skip at the start of the result set.
             * @param {number} [limit=Infinity] Maximum number of items in result set.
             * @returns {object[]}
             */
            queryByPrefix: function (fieldNames, prefix, offset, limit) {
                return this.queryByPrefixAsHash(fieldNames, prefix, offset, limit).items;
            },

            /**
             * Inserts single row into the table, updating all relevant indexes.
             * @param {object} row Table row
             * @returns {$table.Table}
             */
            insertRow: function (row) {
                // adding row to table
                var rowId = this.items.push(row);

                // adding row to indexes
                this.indexCollection
                    // selecting fitting indexes
                    .getIndexesForRow(row)
                    // adding row to fitting indexes
                    .addRow(row, rowId - 1 + '');

                return this;
            },

            /**
             * Inserts multiple rows into the table. Updates all relevant indexes.
             * @param {object[]} rows Array of table rows.
             * @returns {$table.Table}
             */
            insertRows: function (rows) {
                $data.Collection.create(rows)
                    .passEachItemTo(this.insertRow, this);
                return this;
            },

            /**
             * Updates rows that match the specified expression. The specified row will be assigned to
             * the matching row(s) by reference.
             * @param {object} rowExpr Row expression to be matched.
             * @param {object} row Row value after update.
             * @param {$table.Index} [index] Index to be used for identifying row IDs. (For ambiguous indexes)
             * @returns {$table.Table}
             */
            updateRowsByRow: function (rowExpr, row, index) {
                $assertion
                    .isObject(rowExpr, "Invalid row expression")
                    .isObject(row, "Invalid row")
                    .isIndexOptional(index, "Invalid index");

                var indexCollection = this.indexCollection;

                // getting an index for the row
                index = index || indexCollection.getBestIndexForRow(rowExpr);

                $assertion.assert(!!index, "No index matches row");

                var affectedRowIds = index
                    .getRowIdsForKeysAsHash(index.rowSignature.getKeysForRow(rowExpr))
                    .toCollection();

                // updating affected rows in indexes
                affectedRowIds.forEachItem(function (rowId) {
                    indexCollection
                        .removeRow(rowExpr, rowId)
                        .addRow(row, rowId);
                });

                // updating row in table
                affectedRowIds.passEachItemTo(base.setItem, this, 0, row);

                return this;
            },

            /**
             * Removes rows from the table that match the specified row.
             * @param {object} rowExpr Row expression to be matched.
             * @param {$table.Index} [index] Index to be used for identifying row IDs. (For ambiguous indexes)
             * @returns {$table.Table}
             */
            deleteRowsByRow: function (rowExpr, index) {
                $assertion
                    .isObject(rowExpr, "Invalid row expression")
                    .isIndexOptional(index, "Invalid index");

                var indexCollection = this.indexCollection;

                // getting an index for the row
                index = index || indexCollection.getBestIndexForRow(rowExpr);

                $assertion.assert(!!index, "No index matches row");

                var affectedRowIds = index
                    .getRowIdsForKeysAsHash(index.rowSignature.getKeysForRow(rowExpr))
                    .toCollection();

                // removing affected rows from affected indexes
                affectedRowIds.passEachItemTo(indexCollection.removeRow, indexCollection, 1, rowExpr);

                // removing row from table
                affectedRowIds.passEachItemTo(base.deleteItem, this);

                return this;
            },

            /**
             * Clears rows and associated indexes.
             * @returns {$table.Table}
             */
            clear: function () {
                base.clear.call(this);

                // clearing indexes
                this.indexCollection.clearBuffers();

                return this;
            }
        });

    // aliases
    $table.Table.addMethods(/** @lends $table.Table# */{
        /**
         * @function
         * @param {string|number} rowId
         * @param {object} row
         * @returns {$table.Table}
         * @see $table.Table#setItem
         */
        setRow: self.setItem,

        /**
         * @function
         * @param {object} rowIdRowPairs
         * @returns {$table.Table}
         * @see $table.Table#setItems
         */
        setRows: self.setItems,

        /**
         * @function
         * @param {string|number} rowId
         * @returns {$table.Table}
         * @see $table.Table#deleteItem
         */
        deleteRow: self.deleteItem
    });
});

$oop.amendPostponed($data, 'Hash', function () {
    "use strict";

    $data.Hash.addMethods(/** @lends $data.Hash */{
        /**
         * Reinterprets hash as table. Hash must contain array buffer.
         * @returns {$table.Table}
         */
        toTable: function () {
            return $table.Table.create(this.items);
        }
    });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $table */{
        /** @param {$table.Table} expr */
        isTable: function (expr) {
            return $table.Table.isBaseOf(expr);
        },

        /** @param {$table.Table} [expr] */
        isTableOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   $table.Table.isBaseOf(expr);
        }
    });
}());
