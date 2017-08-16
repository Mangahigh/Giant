$oop.postpone($gruntTools, 'GruntTask', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * Creates a GruntTask instance.
     * GruntTask instances may also be created via conversion from String,
     * where the string is treated as the name of the task.
     * @name $gruntTools.GruntTask.create
     * @function
     * @param {string} taskName Name of the task.
     * @returns {$gruntTools.GruntTask}
     * @see String#toGruntTask
     */

    /**
     * The GruntTask implements a basic grunt task.
     * Basic tasks allow the user to implement tasks with a custom task handler.
     * @class
     * @extends $oop.Base
     * @see http://gruntjs.com/creating-tasks#basic-tasks
     * @see http://gruntjs.com/creating-tasks#custom-tasks
     */
    $gruntTools.GruntTask = self
        .addMethods(/** @lends $gruntTools.GruntTask# */{
            /**
             * @param {string} taskName
             * @ignore
             */
            init: function (taskName) {
                $assertion.isString(taskName, "Invalid task name");

                /**
                 * Name of the grunt task.
                 * @type {string}
                 */
                this.taskName = taskName;

                /**
                 * Function that implements the task.
                 * @type {function}
                 */
                this.taskHandler = undefined;
            },

            /**
             * Applies task by registering it via the grunt API.
             * @param {string} [description]
             * @returns {$gruntTools.GruntTask}
             */
            applyTask: function (description) {
                $gruntTools.GruntProxy.create()
                    .registerTask(this.taskName, description, this.taskHandler);
                return this;
            },

            /**
             * Sets task handler. Overwrites previously set handler.
             * @param {function} taskHandler Function that implements the task.
             * @returns {$gruntTools.GruntTask}
             */
            setTaskHandler: function (taskHandler) {
                $assertion.isFunction(taskHandler, "Invalid task handler");
                this.taskHandler = taskHandler;
                return this;
            },

            /**
             * Adds current task to a collection of tasks.
             * @param {$gruntTools.MultiTaskCollection} taskCollection Collection to add the task to.
             * @returns {$gruntTools.GruntTask}
             */
            addToCollection: function (taskCollection) {
                $assertion.isGruntTaskCollection(taskCollection, "Invalid grunt task collection");
                taskCollection.setItem(this.taskName, this);
                return this;
            }
        });
});

(function () {
    "use strict";

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to GruntTask, treating the string as task name.
         * @returns {$gruntTools.GruntTask}
         */
        toGruntTask: function () {
            return $gruntTools.GruntTask.create(this.valueOf());
        }
    });
}());
