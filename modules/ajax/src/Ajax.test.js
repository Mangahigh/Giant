(function () {
    "use strict";

    module("Ajax");

    test("Dispatching request", function () {
        expect(7);

        var xhrProxy = {},
            properties = {},
            headers = {},
            statuses = [],
            events = [],
            readyState = 0;

        $ajax.Ajax.addMocks({
            _xhrCreateProxy: function () {
                return xhrProxy;
            },

            _xhrOpenProxy: function (xhr, method, url, async, user, password) {
                deepEqual(Array.prototype.slice.call(arguments), [
                    xhrProxy,
                    'GET',
                    'foo.com',
                    true,
                    'test@user.com',
                    'password'
                ], "should open request");
            },

            _xhrPropertySetterProxy: function (xhr, propertyName, propertyValue) {
                properties[propertyName] = propertyValue;
            },

            _xhrSetRequestHeaderProxy: function (xhr, header, value) {
                headers[header] = value;
            },

            _xhrSendProxy: function (xhr, data) {
                deepEqual(data, {
                    foo: 'bar'
                }, "should send the request with the specified data");
            },

            _xhrReadyStateGetterProxy: function () {
                return readyState;
            }
        });

        $event.eventSpace
            .subscribeTo($ajax.EVENT_AJAX_OPEN, 'ajax'.toPath(), function (event) {
                events.push([event.eventName, event.xhr, readyState]);
            })
            .subscribeTo($ajax.EVENT_AJAX_SEND, 'ajax'.toPath(), function (event) {
                events.push([event.eventName, event.xhr, readyState]);
            })
            .subscribeTo($ajax.EVENT_AJAX_PROGRESS, 'ajax'.toPath(), function (event) {
                events.push([event.eventName, event.xhr, readyState]);
            })
            .subscribeTo($ajax.EVENT_AJAX_DONE, 'ajax'.toPath(), function (event) {
                events.push([event.eventName, event.xhr, readyState]);
            });

        $ajax.Ajax.request('GET', 'foo.com', {
                key: 'value'
            }, {
                'Content-Type': 'text/json'
            }, {
                foo: 'bar'
            }, 'test@user.com', 'password')
            .then(function (xhr) {
                equal(readyState, 4, "should resolve promise when done");
            }, null, function (xhr) {
                statuses.push([xhr, readyState]);
            });

        equal(properties.key, 'value', "should set XHR properties");

        deepEqual(headers, {
            'Content-Type': 'text/json'
        }, "should set headers");

        var onreadystatechange = properties.onreadystatechange;

        readyState = 1;
        onreadystatechange();

        readyState = 2;
        onreadystatechange();

        readyState = 3;
        onreadystatechange();

        readyState = 4;
        onreadystatechange();

        deepEqual(statuses, [
            [xhrProxy, 1],
            [xhrProxy, 2],
            [xhrProxy, 3]
        ], "should notify promise with xhr object");

        deepEqual(events, [
            [$ajax.EVENT_AJAX_OPEN, xhrProxy, 1],
            [$ajax.EVENT_AJAX_SEND, xhrProxy, 2],
            [$ajax.EVENT_AJAX_PROGRESS, xhrProxy, 3],
            [$ajax.EVENT_AJAX_DONE, xhrProxy, 4]
        ], "should trigger events");

        $ajax.Ajax.removeMocks();
    });
}());
