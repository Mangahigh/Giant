(function () {
    "use strict";

    var testEventSpace;

    function handler1() {
    }

    function handler2() {
    }

    function handler3() {
    }

    function handler4() {
    }

    module("EventSpace", {
        setup: function () {
            testEventSpace = $event.EventSpace.create()
                .subscribeTo('eventA', 'test>event>path'.toPath(), handler1)
                .subscribeTo('eventA', 'test>event>path'.toPath(), handler2)
                .subscribeTo('eventB', 'test>event>path'.toPath(), handler3)
                .subscribeTo('eventA', 'foo>bar>baz'.toPath(), handler4);
        }
    });

    test("Instantiation", function () {
        var eventSpace = $event.EventSpace.create();

        ok(eventSpace.eventRegistry.isA($data.Tree), "should set event registry as a Tree");
        deepEqual(eventSpace.eventRegistry.items, {}, "should initialize event registry Tree as empty");
    });

    test("Spawning event", function () {
        var eventSpace = $event.EventSpace.create(),
            link,
            spawnedEvent;

        link = $event.pushOriginalEvent($event.Event.create('foo', eventSpace));
        $event.setNextPayloadItem('eventA', 'foo', {});

        spawnedEvent = eventSpace.spawnEvent('eventA');

        ok(spawnedEvent.isA($event.Event), "should return Event instance");
        deepEqual(spawnedEvent.payload, $event.nextPayloadStore.getPayload('eventA'),
            "should prepare event payload based on next payload on event space");
        strictEqual(spawnedEvent.originalEvent, $event.originalEventStack.getLastEvent(),
            "should set original event");

        link.unlink();
        $event.deleteNextPayloadItem('eventA', 'foo');
    });

    test("First subscription", function () {
        var eventSpace = $event.EventSpace.create();

        function handler1() {
        }

        throws(function () {
            eventSpace.subscribeTo('eventA', 'test>event>path'.toPath(), 123);
        }, "should raise exception on invalid handler");

        strictEqual(eventSpace.subscribeTo('eventA', 'test>event>path'.toPath(), handler1), eventSpace,
            "should be chainable");

        deepEqual(
            eventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler1]
                }
            },
            "should add first event handler to registry"
        );
    });

    test("Subsequent subscription to same event / path", function () {
        var eventSpace = $event.EventSpace.create();

        function handler1() {
        }

        function handler2() {
        }

        eventSpace
            .subscribeTo('eventA', 'test>event>path'.toPath(), handler1)
            .subscribeTo('eventA', 'test>event>path'.toPath(), handler2);

        deepEqual(
            eventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler1, handler2]
                }
            },
            "should add event handler to registry"
        );
    });

    test("Subsequent subscription to different event / path", function () {
        var eventSpace = $event.EventSpace.create();

        function handler1() {
        }

        function handler2() {
        }

        eventSpace
            .subscribeTo('eventA', 'test>event>path'.toPath(), handler1)
            .subscribeTo('eventA', 'foo>bar>baz'.toPath(), handler2);

        deepEqual(
            eventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler1]
                },
                'foo>bar>baz'    : {
                    'eventA': [handler2]
                }
            },
            "should add event handler to registry"
        );
    });

    test("Unsubscribing from specific event/path/handler", function () {
        strictEqual(testEventSpace.unsubscribeFrom('eventA', 'test>event>path'.toPath(), handler1), testEventSpace,
            "should be chainable");

        deepEqual(
            testEventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler2],
                    'eventB': [handler3]
                },

                'foo>bar>baz': {
                    'eventA': [handler4]
                }
            },
            "should remove handler from handler registry"
        );
    });

    test("Unsubscribing from last handler for a given event/path", function () {
        strictEqual(testEventSpace.unsubscribeFrom('eventB', 'test>event>path'.toPath(), handler3), testEventSpace,
            "should be chainable");

        deepEqual(
            testEventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler1, handler2]
                },

                'foo>bar>baz': {
                    'eventA': [handler4]
                }
            },
            "should remove node for event/path"
        );
    });

    test("Unsubscribing from all handlers on event/path", function () {
        strictEqual(testEventSpace.unsubscribeFrom('eventA', 'test>event>path'.toPath()), testEventSpace,
            "should be chainable");

        deepEqual(
            testEventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventB': [handler3]
                },

                'foo>bar>baz': {
                    'eventA': [handler4]
                }
            },
            "should remove all handlers for event/path from handler registry"
        );
    });

    test("Unsubscribing from all handlers on a path", function () {
        strictEqual(testEventSpace.unsubscribeFrom(null, 'test>event>path'.toPath()), testEventSpace,
            "should be chainable");

        deepEqual(
            testEventSpace.eventRegistry.items,
            {
                'foo>bar>baz': {
                    'eventA': [handler4]
                }
            },
            "should remove all handlers for path from handler registry"
        );
    });

    test("Unsubscribing from all handlers in event space", function () {
        strictEqual(testEventSpace.unsubscribeFrom(), testEventSpace,
            "should be chainable");

        deepEqual(
            testEventSpace.eventRegistry.items,
            {},
            "should completely empty handler registry"
        );
    });

    test("Unsubscribing from invalid handler", function () {
        // attempting to unsubscribe non-existing handler
        testEventSpace.unsubscribeFrom('eventA', 'test>event>path'.toPath(), function () {
        });

        deepEqual(
            testEventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler1, handler2],
                    'eventB': [handler3]
                },

                'foo>bar>baz': {
                    'eventA': [handler4]
                }
            },
            "should leave handler registry intact"
        );
    });

    test("Unsubscribing from invalid path", function () {
        // attempting to unsubscribe non-existing handler
        testEventSpace.unsubscribeFrom('eventA', 'invalid>path'.toPath(), handler1);

        deepEqual(
            testEventSpace.eventRegistry.items,
            {
                'test>event>path': {
                    'eventA': [handler1, handler2],
                    'eventB': [handler3]
                },

                'foo>bar>baz': {
                    'eventA': [handler4]
                }
            },
            "should leave handler registry intact"
        );
    });

    test("One time subscription", function () {
        function handler() {
        }

        var eventSpace = $event.EventSpace.create(),
            result;

        result = eventSpace.subscribeToUntilTriggered('eventA', 'test>event>path'.toPath(), handler);

        equal(typeof result, 'function', "should return wrapped handler");
        equal(
            eventSpace.eventRegistry.items['test>event>path'].eventA.length,
            1,
            "should add handler to handler registry"
        );

        // unsubscribing event before triggering
        eventSpace.unsubscribeFrom('eventA', 'test>event>path'.toPath(), result);

        equal(
            typeof eventSpace.eventRegistry.getNode(['test>event>path', 'eventA'].toPath()),
            'undefined',
            "should be able to unsubscribe from the returned wrapper"
        );

        // re binding and triggering event
        eventSpace.subscribeToUntilTriggered('eventA', 'test>event>path'.toPath(), handler);
        eventSpace.spawnEvent('eventA').triggerSync('test>event>path'.toPath());

        equal(
            typeof eventSpace.eventRegistry.getNode(['test>event>path', 'eventA'].toPath()),
            'undefined',
            "should unsubscribe after being triggered"
        );
    });

    test("Path delegation", function () {
        expect(5);

        var eventSpace = $event.EventSpace.create(),
            result;

        function handler(/** $event.Event */ event) {
            equal(event.currentPath.toString(), 'test>event>path',
                "should call handler with currentPath set on event");
            equal(event.originalPath.toString(), 'test>event>path>foo',
                "should call handler with originalPath set on event");
        }

        throws(function () {
            eventSpace.delegateSubscriptionTo('eventA', 'test>event'.toPath(), 'unrelated>path'.toPath(), handler);
        }, "should raise exception on delegate path not relative to capture path");

        throws(function () {
            eventSpace.delegateSubscriptionTo('eventA', 'test>event'.toPath(), 'test>event>path'.toPath(), 'non-function');
        }, "should raise exception on invalid event handler");

        // delegating event to path 'test>event>path'
        result = eventSpace.delegateSubscriptionTo('eventA', 'test>event'.toPath(), 'test>event>path'.toPath(), handler);
        equal(typeof result, 'function', "should return wrapped handler");
        eventSpace.spawnEvent('eventA').triggerSync('test>event>path>foo'.toPath());
    });

    test("Query delegation", function () {
        expect(4);

        var eventSpace = $event.EventSpace.create(),
            result;

        function handler(/** $event.Event */ event) {
            equal(event.currentPath.toString(), 'test>event>|>foo',
                "should call handler with currentPath set on event to query");
            equal(event.originalPath.toString(), 'test>event>bar>foo>baz',
                "should call handler with originalPath set on event");
        }

        throws(function () {
            eventSpace.delegateSubscriptionTo('eventA', 'test>event'.toPath(), 'test>|>path'.toPath(), handler);
        }, "should raise exception on delegate query not relative to capture path");

        // delegating event to query 'test>event>|>path'
        result = eventSpace.delegateSubscriptionTo('eventA', 'test>event'.toPath(), 'test>event>|>foo'.toQuery(), handler);
        equal(typeof result, 'function', "should return wrapped handler");
        eventSpace.spawnEvent('eventA').triggerSync('test>event>bar>foo>baz'.toPath());
    });

    test("Unsubscribing from delegated event", function () {
        var eventSpace = $event.EventSpace.create(),
            delegateHandler;

        function handler() {
        }

        // delegating in a way that handler may be unsubscribed
        delegateHandler = eventSpace.delegateSubscriptionTo('eventA', 'test>event'.toPath(), 'test>event>path'.toPath(), handler);

        eventSpace.unsubscribeFrom('eventA', 'test>event'.toPath(), delegateHandler);

        equal(
            typeof eventSpace.eventRegistry.getNode(['test>event', 'eventA'].toPath()),
            'undefined',
            "should remove handler from handler registry"
        );
    });

    test("Calling handlers for event", function () {
        expect(6);

        var eventSpace = $event.EventSpace.create()
                .subscribeTo('eventA', 'test>event'.toPath(), function (event, data) {
                    equal(trace++, 1, "should call handler second");
                    strictEqual(event, eventA, "should pass spawned event to handler");
                    strictEqual(data, event.payload, "should call handler with payload set on event");
                }),
            eventA = eventSpace.spawnEvent('eventA'),
            result,
            link = $data.Link.create(),
            trace = 0;

        $event.originalEventStack.addMocks({
            pushEvent: function () {
                equal(trace++, 0, "should push event first");
                return link;
            }
        });

        link.addMocks({
            unlink: function () {
                equal(trace, 2, "should unlink event last");
            }
        });

        eventA.originalPath = 'test>event'.toPath();
        eventA.currentPath = eventA.originalPath.clone();

        result = eventSpace.callHandlers(eventA);

        $event.originalEventStack.removeMocks();

        strictEqual(result, 1, "should return number of handlers run");
    });

    test("Calling handler returning thenable", function () {
        expect(3);

        var eventSpace = $event.EventSpace.create()
                .subscribeTo('eventA', 'test>event'.toPath(), function () {
                    equal(trace++, 1, "should call handler second");
                    var deferred = $utils.Deferred.create();
                    deferred.resolve();
                    return deferred.promise;
                }),
            eventA = eventSpace.spawnEvent('eventA'),
            link = $data.Link.create(),
            trace = 0;

        $event.originalEventStack.addMocks({
            pushEvent: function () {
                equal(trace++, 0, "should push event first");
                return link;
            }
        });

        link.addMocks({
            unlink: function () {
                equal(trace, 2, "should unlink event last");
            }
        });

        eventA.originalPath = 'test>event'.toPath();
        eventA.currentPath = eventA.originalPath.clone();
        eventSpace.callHandlers(eventA);

        $event.originalEventStack.removeMocks();
    });

    test("Calling handlers for invalid event", function () {
        var eventSpace = $event.EventSpace.create(),
            eventA = eventSpace.spawnEvent('eventA'),
            result;

        eventA.originalPath = 'test>event'.toPath();
        eventA.currentPath = eventA.originalPath.clone();

        result = eventSpace.callHandlers(eventA);
        strictEqual(result, 0, "should return zero");
    });

    test("Calling handlers with stop-propagation", function () {
        expect(2);

        var eventSpace = $event.EventSpace.create()
                .subscribeTo('event', 'test>event'.toPath(), function () {
                    ok(true, "should call handler only once");
                    return false;
                }),
            event = eventSpace.spawnEvent('event');

        event.originalPath = 'test>event'.toPath();
        event.currentPath = event.originalPath.clone();

        equal(eventSpace.callHandlers(event), false, "should return false");
    });

    test("Relative path query", function () {
        var eventSpace = $event.EventSpace.create()
                .subscribeTo('eventA', 'test>event'.toPath(), handler1)
                .subscribeTo('eventA', 'test>event>foo'.toPath(), handler1)
                .subscribeTo('eventA', 'test>event>foo>bar'.toPath(), handler1)
                .subscribeTo('eventA', 'test>event>|>baz'.toQuery(), handler1)
                .subscribeTo('eventA', 'test>foo>bar'.toPath(), handler1)
                .subscribeTo('eventA', 'test>event>hello'.toPath(), handler1)
                .subscribeTo('otherEvent', 'test>event'.toPath(), handler1)
                .subscribeTo('otherEvent', 'test>event>foo'.toPath(), handler1),
            result;

        result = eventSpace.getPathsRelativeTo('eventA', 'test>event'.toPath());
        ok(result.isA($event.PathCollection), "should return PathCollection instance");

        deepEqual(
            result.callOnEachItem('toString').items,
            [
                'test>event>foo',
                'test>event>foo>bar',
                'test>event>hello',
                'test>event>|>baz'
            ],
            "should fetch paths and queries for specified event, relative to the specified path (pass 1)"
        );

        result = eventSpace.getPathsRelativeTo('eventA', 'test>foo'.toPath());
        deepEqual(
            result.callOnEachItem('toString').items,
            ['test>foo>bar'],
            "should fetch paths and queries for specified event, relative to the specified path (pass 2)"
        );

        result = eventSpace.getPathsRelativeTo('otherEvent', 'test>event'.toPath());
        deepEqual(
            result.callOnEachItem('toString').items,
            ['test>event>foo'],
            "should fetch paths and queries for specified event, relative to the specified path (pass 3)"
        );
    });

    test("Relative path query w/ no subscriptions", function () {
        var eventSpace = $event.EventSpace.create();

        deepEqual(
            eventSpace.getPathsRelativeTo('eventA', 'test>event'.toPath()).items,
            [],
            "should fetch empty path collection"
        );
    });

    // TODO: Why is this here and not in Event?
    test("Broadcasting with delegation", function () {
        var eventSpace = $event.EventSpace.create(),
            event = eventSpace.spawnEvent('eventA'),
            triggeredPaths;

        function handler(event) {
            triggeredPaths[event.currentPath.toString()] = true;
        }

        eventSpace
            .subscribeTo('eventA', 'a>b>|>e'.toQuery(), handler)
            .subscribeTo('eventA', 'a>b'.toPath(), handler)
            .subscribeTo('eventA', 'a>b>other path'.toPath(), handler);

        eventSpace.delegateSubscriptionTo('eventA', 'a>b'.toPath(), 'a>b>c>d'.toPath(), handler);
        eventSpace.delegateSubscriptionTo('eventA', 'a>b'.toPath(), 'a>b>c>|>f'.toQuery(), handler);

        triggeredPaths = {};
        event.broadcastSync('a'.toPath()); // triggers due to broadcast path < capture path

        deepEqual(
            triggeredPaths,
            {
                "a>b"             : true,
                "a>b>other%20path": true,
                "a>b>c>d"         : true,
                "a>b>c>|>f"       : true,
                "a>b>|>e"         : true
            },
            "should call handler for all paths relative to broadcast path"
        );

        triggeredPaths = {};
        event.broadcastSync('a>b>c'.toPath()); // triggers due to broadcast path < delegate path

        deepEqual(
            triggeredPaths,
            {
                "a>b"      : true, // hit b/c BC bubbles
                "a>b>c>d"  : true, // hit b/c BC bubbles & triggers delegates
                "a>b>c>|>f": true // hit b/c BC bubbles & triggers delegates
            },
            "should call handler for paths relative to broadcast path and then bubble"
        );

        triggeredPaths = {};
        event.broadcastSync('a>b>c>d>e'.toPath()); // triggers due to bubbling of main event

        deepEqual(
            triggeredPaths,
            {
                "a>b"    : true,
                "a>b>c>d": true
            },
            "should only bubble when there are no subscriptions / delegates relative to broadcast path"
        );
    });
}());
