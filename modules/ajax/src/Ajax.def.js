$oop.postpone($ajax, 'Ajax', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $ajax.Ajax.create
     * @function
     * @returns {$ajax.Ajax}
     */

    /**
     * @class
     * @extends $oop.Base
     */
    $ajax.Ajax = self
        .addPrivateMethods(/** @lends $ajax.Ajax */{
            /**
             * @returns {XMLHttpRequest}
             * @private
             */
            _xhrCreateProxy: function () {
                return new XMLHttpRequest();
            },

            /**
             * @param {XMLHttpRequest} xhr
             * @param {string} method
             * @param {string} url
             * @param {boolean} [async]
             * @param {string} [user]
             * @param {string} [password]
             * @private
             */
            _xhrOpenProxy: function (xhr, method, url, async, user, password) {
                return xhr.open(method, url, async, user, password);
            },

            /**
             * @param {XMLHttpRequest} xhr
             * @param {string} propertyName
             * @param {*} propertyValue
             * @private
             */
            _xhrPropertySetterProxy: function (xhr, propertyName, propertyValue) {
                xhr[propertyName] = propertyValue;
            },

            /**
             * @param {XMLHttpRequest} xhr
             * @param {string} header
             * @param {string} value
             * @private
             */
            _xhrSetRequestHeaderProxy: function (xhr, header, value) {
                return xhr.setRequestHeader(header, value);
            },

            /**
             * @param {XMLHttpRequest} xhr
             * @param {*} [data]
             * @private
             */
            _xhrSendProxy: function (xhr, data) {
                return xhr.send(data);
            },

            /**
             * @param {XMLHttpRequest} xhr
             * @returns {number}
             * @private
             */
            _xhrReadyStateGetterProxy: function (xhr) {
                return xhr.readyState;
            }
        })
        .addMethods(/** @lends $ajax.Ajax */{
            /**
             * Dispatches AJAX request.
             * @param {string} method
             * @param {string} url
             * @param {object} xhrProperties
             * @param {object} headers
             * @param {*} data
             * @param {string} [user]
             * @param {string} [password]
             * @returns {$utils.Promise}
             */
            request: function (method, url, xhrProperties, headers, data, user, password) {
                var that = this,
                    deferred = $utils.Deferred.create(),
                    xhr = this._xhrCreateProxy();

                // opening connection
                this._xhrOpenProxy(xhr, method, url, true, user, password);

                // copying XHR properties
                $data.Collection.create(xhrProperties)
                    .forEachItem(function (propertyValue, propertyName) {
                        that._xhrPropertySetterProxy(xhr, propertyName, propertyValue);
                    });

                // setting headers
                $data.Collection.create(headers)
                    .forEachItem(function (value, header) {
                        that._xhrSetRequestHeaderProxy(xhr, header, value);
                    });

                this._xhrPropertySetterProxy(xhr, 'onreadystatechange', function () {
                    var readyState = that._xhrReadyStateGetterProxy(xhr),
                        eventPath = url.split('/').toPath().prependKey('ajax');

                    switch (readyState) {
                    case 1:
                        // OPENED
                        $event.eventSpace.spawnEvent($ajax.EVENT_AJAX_OPEN)
                            .setSender(url)
                            .setXhr(xhr)
                            .triggerSync(eventPath);

                        deferred.notify(xhr);

                        break;

                    case 2:
                        // HEADERS_RECEIVED
                        $event.eventSpace.spawnEvent($ajax.EVENT_AJAX_SEND)
                            .setSender(url)
                            .setXhr(xhr)
                            .triggerSync(eventPath);

                        deferred.notify(xhr);

                        break;

                    case 3:
                        // LOADING
                        $event.eventSpace.spawnEvent($ajax.EVENT_AJAX_PROGRESS)
                            .setSender(url)
                            .setXhr(xhr)
                            .triggerSync(eventPath);

                        deferred.notify(xhr);

                        break;

                    case 4:
                        // DONE
                        $event.eventSpace.spawnEvent($ajax.EVENT_AJAX_DONE)
                            .setSender(url)
                            .setXhr(xhr)
                            .triggerSync(eventPath);

                        deferred.resolve(xhr);

                        break;
                    }
                });

                // sending data
                this._xhrSendProxy(xhr, data);

                return deferred.promise;
            }
        });
});

(function () {
    "use strict";

    $oop.addGlobalConstants.call($ajax, /** @lends $ajax */{
        /** @constant */
        EVENT_AJAX_OPEN: 'ajax.open',

        /** @constant */
        EVENT_AJAX_SEND: 'ajax.send',

        /** @constant */
        EVENT_AJAX_PROGRESS: 'ajax.progress',

        /** @constant */
        EVENT_AJAX_DONE: 'ajax.done'
    });
}());
