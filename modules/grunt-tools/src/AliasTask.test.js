(function () {
    "use strict";

    module("AliasTask", {
        setup: function () {
            $gruntTools.AliasTask.clearInstanceRegistry();
        },
        teardown: function () {
            $gruntTools.AliasTask.clearInstanceRegistry();
        }
    });

    test("Instantiation", function () {
        var task = $gruntTools.AliasTask.create('foo');

        ok(task.subTasks instanceof Array, "should initialize subTasks property as array");
        equal(task.subTasks.length, 0, "should set subTasks' length to zero");

        strictEqual($gruntTools.AliasTask.create('foo'), task, "should be memoized");
    });

    test("Conversion from string", function () {
        var task = 'foo'.toAliasTask('bar');

        ok(task.isA($gruntTools.AliasTask), "should return AliasTask instance");
        equal(task.taskName, 'foo', "should set task name");
        deepEqual(task.subTasks, ['bar'], "should set sub-task names");
    });

    test("Task registration", function () {
        expect(4);

        var task = $gruntTools.AliasTask.create('foo')
            .addSubTasks('hello', 'world');

        $gruntTools.GruntProxy.addMocks({
            registerTask: function (name, description, taskList) {
                equal(name, 'foo', "should specify task name");
                equal(description, 'bar', "should pass description");
                deepEqual(taskList, ['hello', 'world'], "should pass task names");
            }
        });

        strictEqual(task.applyTask('bar'), task, "should be chainable");

        $gruntTools.GruntProxy.removeMocks();
    });

    test("Sub-task addition", function () {
        var task = 'foo'.toAliasTask();

        strictEqual(task.addSubTask('foo'), task, "should be chainable");
        deepEqual(task.subTasks, [ 'foo' ], "should set task name in array");

        task.addSubTask('bar');
        deepEqual(task.subTasks, [ 'foo', 'bar' ], "should add task name at end of list");
    });

    test("Sub-task addition after specified sub-task", function () {
        var task = 'foo'.toAliasTask('foo', 'bar');

        strictEqual(task.addSubTaskAfter('baz', 'foo'), task, "should be chainable");
        deepEqual(task.subTasks, [ 'foo', 'baz', 'bar' ], "should add task name after specified sub-task");

        task.addSubTaskAfter('hello');
        deepEqual(task.subTasks, [ 'foo', 'baz', 'bar', 'hello' ],
            "should add task name at end of list when no after value is specified");
    });

    test("Sub-task addition before specified sub-task", function () {
        var task = 'foo'.toAliasTask('foo', 'bar');

        strictEqual(task.addSubTaskBefore('baz', 'bar'), task, "should be chainable");
        deepEqual(task.subTasks, [ 'foo', 'baz', 'bar' ], "should add task name before specified sub-task");

        task.addSubTaskBefore('hello');
        deepEqual(task.subTasks, [ 'hello', 'foo', 'baz', 'bar' ],
            "should add task name at beginning of list when no after value is specified");
    });

    test("Multiple sub-task addition", function () {
        var task = 'foo'.toAliasTask();

        strictEqual(task.addSubTasks('foo', 'bar', 'baz'), task, "should be chainable");
        deepEqual(task.subTasks, [ 'foo', 'bar', 'baz' ], "should set task names as collection item");
    });
}());
