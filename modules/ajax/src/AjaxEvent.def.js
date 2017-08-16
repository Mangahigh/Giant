$oop.postpone($ajax, 'AjaxEvent', function () {
    "use strict";

    var base = $event.Event,
        self = base.extend();

    /**
     * @name $ajax.AjaxEvent.create
     * @function
     * @returns {$ajax.AjaxEvent}
     */

    /**
     * @class
     * @extends $event.Event
     */
    $ajax.AjaxEvent = self
        .addMethods(/** @lends $ajax.AjaxEvent# */{
            /**
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * @type {XMLHttpRequest}
                 */
                this.xhr = undefined;
            },

            /**
             * @param {XMLHttpRequest} xhr
             * @returns {$ajax.AjaxEvent}
             */
            setXhr: function (xhr) {
                this.xhr = xhr;
                return this;
            },

            /**
             * @param {$data.Path} [currentPath]
             * @returns {$ajax.AjaxEvent}
             * @see $event.Event#clone
             */
            clone: function (currentPath) {
                var clone = /** @type {$ajax.AjaxEvent} */base.clone.call(this, currentPath);

                return clone
                    .setXhr(this.xhr);
            }
        });
});

$oop.amendPostponed($event, 'Event', function () {
    "use strict";

    $event.Event
        .addSurrogate($ajax, 'AjaxEvent', function (eventName) {
            var prefix = 'ajax';
            return eventName.substr(0, prefix.length) === prefix;
        });
});
