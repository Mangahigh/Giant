(function () {
    "use strict";

    module("Evented");

    var eventSpace = $event.EventSpace.create(),

        EventedStaticClass = $oop.Base.extend()
            .addTrait($event.Evented)
            .setEventSpace(eventSpace)
            .setEventPath('test>path'.toPath())
            .addMethods({
                init: function (path) {
                    $event.Evented.init.call(this);
                    this.setEventPath(path);
                }
            }),

        EventedClass = $oop.Base.extend()
            .addTrait($event.Evented)
            .addMethods({
                init: function (path) {
                    $event.Evented.init.call(this);
                    this
                        .setEventSpace($event.EventSpace.create())
                        .setEventPath(path);
                }
            });

    test("Event path setter", function () {
        var evented = EventedClass.create('test>path'.toPath()),
            eventPath = 'foo>bar>baz'.toPath();

        evented.setEventPath(eventPath);

        strictEqual(evented.eventPath, eventPath, "should set event path");
    });

    test("Relative event path setter", function () {
        throws(function () {
            EventedStaticClass.create('foo>bar'.toPath());
        }, "should raise exception on path not relative to static path");

        var evented = EventedStaticClass.create('test>path>foo'.toPath());

        equal(evented.eventPath.toString(), 'test>path>foo', "should set relative event path");
    });

    test("Re-subscription by altering event path", function () {
        var handler1 = function () {
            },
            handler2 = function () {
            },
            evented = EventedClass.create('hello>world'.toPath())
                .subscribeTo('foo', handler1)
                .subscribeTo('bar', handler2),
            unsubscribed = [],
            subscribed = [];

        evented.eventSpace.addMocks({
            unsubscribeFrom: function (eventName, path, handler) {
                unsubscribed.push([eventName, path.toString(), handler]);
                return this;
            },

            subscribeTo: function (eventName, path, handler) {
                subscribed.push([eventName, path.toString(), handler]);
                return this;
            }
        });

        evented.setEventPath('hi>all'.toPath());

        evented.eventSpace.removeMocks();

        deepEqual(unsubscribed, [
            ['foo', 'hello>world', handler1],
            ['bar', 'hello>world', handler2]
        ], "should unsubscribe all handlers from old path");

        deepEqual(subscribed, [
            ['foo', 'hi>all', handler1],
            ['bar', 'hi>all', handler2]
        ], "should subscribe all handlers to new path");
    });

    test("Static subscription", function () {
        expect(5);

        function eventHandler() {
        }

        $event.EventSpace.addMocks({
            subscribeTo: function (eventName, eventPath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace subscription with event name");
                equal(eventPath.toString(), 'test>path', "should pass event path to subscription method");
                strictEqual(handler, eventHandler, "should pass event handler function to subscription method");
            }
        });

        EventedStaticClass.subscriptionRegistry.addMocks({
            addItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should add event to registry");
                strictEqual(handler, eventHandler, "should pass handler to registry addition");
            }
        });

        EventedStaticClass.subscribeTo('myEvent', eventHandler);

        $event.EventSpace.removeMocks();
        EventedStaticClass.subscriptionRegistry.removeMocks();
    });

    test("Instance level subscription", function () {
        expect(5);

        var evented = EventedClass.create('test>path>foo>bar'.toPath());

        function eventHandler() {
        }

        $event.EventSpace.addMocks({
            subscribeTo: function (eventName, eventPath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace subscription with event name");
                ok(eventPath.toString(), 'test>path>foo>bar',
                    "should pass event path to subscription method");
                strictEqual(handler, eventHandler, "should pass event handler function to subscription method");
            }
        });

        evented.subscriptionRegistry.addMocks({
            addItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should add event to registry");
                strictEqual(handler, eventHandler, "should pass handler to registry addition");
            }
        });

        evented.subscribeTo('myEvent', eventHandler);

        $event.EventSpace.removeMocks();
    });

    test("Static unsubscription", function () {
        expect(5);

        function eventHandler() {
        }

        $event.EventSpace.addMocks({
            unsubscribeFrom: function (eventName, eventPath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace unsubscription with event name");
                equal(eventPath.toString(), 'test>path', "should pass event path to unsubscription method");
                strictEqual(handler, eventHandler, "should pass event handler function to unsubscription method");
            }
        });

        EventedStaticClass.subscriptionRegistry.addMocks({
            removeItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should remove event from registry");
                strictEqual(handler, eventHandler, "should pass handler to registry removal");
            }
        });

        EventedStaticClass.unsubscribeFrom('myEvent', eventHandler);

        $event.EventSpace.removeMocks();
        EventedStaticClass.subscriptionRegistry.removeMocks();
    });

    test("Instance level unsubscription", function () {
        expect(5);

        var evented = EventedClass.create('test>path>foo>bar'.toPath());

        function eventHandler() {
        }

        $event.EventSpace.addMocks({
            unsubscribeFrom: function (eventName, eventPath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace unsubscription with event name");
                equal(eventPath.toString(), 'test>path>foo>bar',
                    "should pass event path to unsubscription method");
                strictEqual(handler, eventHandler, "should pass event handler function to unsubscription method");
            }
        });

        evented.subscriptionRegistry.addMocks({
            removeItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should remove event from registry");
                strictEqual(handler, eventHandler, "should pass handler to registry removal");
            }
        });

        evented.unsubscribeFrom('myEvent', eventHandler);

        $event.EventSpace.removeMocks();
    });

    test("Static one time subscription", function () {
        expect(5);

        function eventHandler() {
        }

        function oneHandler() {
        }

        $event.EventSpace.addMocks({
            subscribeToUntilTriggered: function (eventName, eventPath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace subscription with event name");
                equal(eventPath.toString(), 'test>path',
                    "should pass event path to subscription method");
                strictEqual(handler, eventHandler, "should pass event handler function to subscription method");
                return oneHandler;
            }
        });

        EventedStaticClass.subscriptionRegistry.addMocks({
            addItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should add event to registry");
                strictEqual(handler, oneHandler, "should pass one time handler to registry addition");
            }
        });

        EventedStaticClass.subscribeToUntilTriggered('myEvent', eventHandler);

        $event.EventSpace.removeMocks();
        EventedStaticClass.subscriptionRegistry.removeMocks();
    });

    test("Instance level one time subscription", function () {
        expect(5);

        var evented = EventedClass.create('test>path>foo>bar'.toPath());

        function eventHandler() {
        }

        function oneHandler() {
        }

        $event.EventSpace.addMocks({
            subscribeToUntilTriggered: function (eventName, eventPath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace subscription with event name");
                equal(eventPath.toString(), 'test>path>foo>bar',
                    "should pass event path to subscription method");
                strictEqual(handler, eventHandler, "should pass event handler function to subscription method");
                return oneHandler;
            }
        });

        evented.subscriptionRegistry.addMocks({
            addItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should add event to registry");
                strictEqual(handler, oneHandler, "should pass one time handler to registry addition");
            }
        });

        evented.subscribeToUntilTriggered('myEvent', eventHandler);

        $event.EventSpace.removeMocks();
    });

    test("Static delegation", function () {
        expect(6);

        function eventHandler() {
        }

        function delegateHandler() {
        }

        $event.EventSpace.addMocks({
            delegateSubscriptionTo: function (eventName, capturePath, delegatePath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace delegation with event name");
                equal(capturePath.toString(), 'test>path',
                    "should pass capture path to delegation method");
                equal(delegatePath.toString(), 'test>path>foo',
                    "should pass delegate path to delegation method");
                strictEqual(handler, eventHandler, "should pass event handler function to subscription method");
                return delegateHandler;
            }
        });

        EventedStaticClass.subscriptionRegistry.addMocks({
            addItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should add event to registry");
                strictEqual(handler, delegateHandler, "should pass delegate handler to registry addition");
            }
        });

        EventedStaticClass.delegateSubscriptionTo('myEvent', 'test>path>foo'.toPath(), eventHandler);

        $event.EventSpace.removeMocks();
        EventedStaticClass.subscriptionRegistry.removeMocks();
    });

    test("Instance level delegation", function () {
        expect(6);

        var evented = EventedClass.create('test>path>foo>bar'.toPath());

        function eventHandler() {
        }

        function delegateHandler() {
        }

        $event.EventSpace.addMocks({
            delegateSubscriptionTo: function (eventName, capturePath, delegatePath, handler) {
                equal(eventName, 'myEvent', "should call EventSpace delegation with event name");
                equal(capturePath.toString(), 'test>path>foo>bar',
                    "should pass capture path to delegation method");
                equal(delegatePath.toString(), 'test>path>foo>bar>hello>world',
                    "should pass delegate path to delegation method");
                strictEqual(handler, eventHandler, "should pass event handler function to subscription method");
                return delegateHandler;
            }
        });

        evented.subscriptionRegistry.addMocks({
            addItem: function (eventName, handler) {
                equal(eventName, 'myEvent', "should add event to registry");
                strictEqual(handler, delegateHandler, "should pass delegate handler to registry addition");
            }
        });

        evented.delegateSubscriptionTo('myEvent', 'test>path>foo>bar>hello>world'.toPath(), eventHandler);

        $event.EventSpace.removeMocks();
    });

    test("Spawning event", function () {
        expect(4);

        var evented = EventedClass.create('test>path>foo>bar'.toPath()),
            event = eventSpace.spawnEvent('event-name');

        evented.eventSpace.addMocks({
            spawnEvent: function (eventName) {
                equal(eventName, 'event-name', "should have event space spawn an event");
                return event;
            }
        });

        event.addMocks({
            setSender: function (sender) {
                strictEqual(sender, evented, "should set sender property");
                return this;
            },

            setTargetPath: function (targetPath) {
                strictEqual(targetPath, evented.eventPath, "should set target path");
                return this;
            }
        });

        strictEqual(evented.spawnEvent('event-name'), event,
            "should return spawned event");
    });

    test("Triggering events", function () {
        var triggeredPaths = [],
            senders = [],
            evented = EventedStaticClass.create('test>path>foo'.toPath());

        // subscribing handlers
        function eventHandler(event) {
            triggeredPaths.push(event.currentPath.toString());
            senders.push(event.sender);
        }

        EventedStaticClass.subscribeTo('myEvent', eventHandler);
        evented.subscribeTo('myEvent', eventHandler);

        evented.triggerSync('myEvent');

        deepEqual(triggeredPaths, ['test>path>foo', 'test>path'],
            "should hit both instance and static subscriptions");

        deepEqual(senders, [evented, evented],
            "should pass evented instance as sender");

        EventedStaticClass.unsubscribeFrom('myEvent');
        evented.unsubscribeFrom('myEvent');
    });

    test("Broadcasting", function () {
        var triggeredPaths,
            senders,
            evented1 = EventedStaticClass.create('test>path>foo'.toPath()),
            evented2 = EventedStaticClass.create('test>path>bar'.toPath());

        // subscribing handlers
        function eventHandler(event) {
            triggeredPaths.push(event.currentPath.toString());
            senders.push(event.sender);
        }

        EventedStaticClass.subscribeTo('myEvent', eventHandler);
        evented1.subscribeTo('myEvent', eventHandler);
        evented2.subscribeTo('myEvent', eventHandler);

        // broadcasting on instance
        triggeredPaths = [];
        senders = [];
        evented1.broadcastSync('myEvent');
        deepEqual(
            triggeredPaths.sort(),
            ['test>path', 'test>path>foo'],
            "should hit all instance subscriptions when broadcasting on instance");
        deepEqual(
            senders,
            [evented1, evented1],
            "should hit all instance subscriptions when broadcasting on instance");

        // broadcasting on class
        triggeredPaths = [];
        senders = [];
        EventedStaticClass.broadcastSync('myEvent');
        deepEqual(
            triggeredPaths.sort(),
            ['test>path', 'test>path>bar', 'test>path>foo'],
            "should hit instance and static subscriptions when broadcasting on class");
        deepEqual(
            senders,
            [EventedStaticClass, EventedStaticClass, EventedStaticClass],
            "should carry class as sender when broadcasting on class");

        EventedStaticClass.unsubscribeFrom('myEvent');
        evented1.unsubscribeFrom('myEvent');
        evented2.unsubscribeFrom('myEvent');
    });
}());
