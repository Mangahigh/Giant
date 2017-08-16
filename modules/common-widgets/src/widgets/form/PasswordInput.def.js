$oop.postpone($commonWidgets, 'PasswordInput', function (ns, className) {
    "use strict";

    var base = $commonWidgets.TextInput,
        self = base.extend(className);

    /**
     * Creates a PasswordInput instance.
     * PasswordInput instance may also be created by instantiating `$commonWidgets.Input` with the type 'password'.
     * @name $commonWidgets.PasswordInput.create
     * @function
     * @returns {$commonWidgets.PasswordInput}
     */

    /**
     * The PasswordInput extends TextInput with the option that its input type will be set to 'password'.
     * Supports revealing and obscuring the entered password.
     * Also delegates surrogate to Input: instantiating an Input with 'type'='password' will yield a PasswordInput instance.
     * @class
     * @extends $commonWidgets.TextInput
     */
    $commonWidgets.PasswordInput = self
        .addMethods(/** @lends $commonWidgets.PasswordInput# */{
            /** @ignore */
            init: function () {
                base.init.call(this, 'password');
            },

            /**
             * Reveals password by changing the input type to 'text', and re-rendering the widget.
             * @returns {$commonWidgets.PasswordInput}
             */
            revealPassword: function () {
                if (this.htmlAttributes.getItem('type') === 'password') {
                    this.addAttribute('type', 'text');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /**
             * Obscures password by changing the input type to 'password', and re-rendering the widget.
             * @returns {$commonWidgets.PasswordInput}
             */
            obscurePassword: function () {
                if (this.htmlAttributes.getItem('type') !== 'password') {
                    this.addAttribute('type', 'password');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /**
             * Determines whether the password input is currently revealed.
             * @returns {boolean}
             */
            isPasswordRevealed: function () {
                return this.htmlAttributes.getItem('type') !== 'password';
            }
        });
});

$oop.amendPostponed($commonWidgets, 'Input', function () {
    "use strict";

    $commonWidgets.Input
        .addSurrogate($commonWidgets, 'PasswordInput', function (inputType) {
            return inputType === 'password';
        });
});
