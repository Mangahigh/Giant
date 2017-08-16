$oop.postpone($ajax, 'UriAuthorityComponent', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $ajax.UriAuthorityComponent.create
     * @function
     * @param {string} [authority]
     * @returns {$ajax.UriAuthorityComponent}
     */

    /**
     * @class
     * @extends $oop.Base
     * @extends $utils.Stringifiable
     * @extends $ajax.UriComponent
     */
    $ajax.UriAuthorityComponent = self
        .addConstants(/** @lends $ajax.UriAuthorityComponent */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_AUTHORITY_PARSER: /^(?:([^@:]+)@)?([^:]+)(?::(.+))?$/
        })
        .addMethods(/** @lends $ajax.UriAuthorityComponent# */{
            /**
             * @param {string} [authority]
             * @ignore
             */
            init: function (authority) {
                $assertion.isStringOptional(authority, "Invalid authority string");

                var parts = self.RE_AUTHORITY_PARSER.exec(authority || '') || [];

                /**
                 * User info part of the authority component.
                 * @type {string}
                 */
                this.userinfo = parts[1] && decodeURIComponent(parts[1]);

                /**
                 * Host.
                 * @type {string}
                 */
                this.host = parts[2] && decodeURIComponent(parts[2]);

                /**
                 *
                 * @type {string}
                 */
                this.port = parts[3] && decodeURIComponent(parts[3]);
            },

            /**
             * @returns {boolean}
             */
            isEmpty: function () {
                return !(this.userinfo || this.host || this.port);
            },

            /**
             * @param {string} userinfo
             * @returns {$ajax.UriAuthorityComponent}
             */
            setUserInfo: function (userinfo) {
                this.userinfo = userinfo;
                return this;
            },

            /**
             * @param {string} host
             * @returns {$ajax.UriAuthorityComponent}
             */
            setHost: function (host) {
                this.host = host;
                return this;
            },

            /**
             * @param {string} port
             * @returns {$ajax.UriAuthorityComponent}
             */
            setPort: function (port) {
                this.port = port;
                return this;
            },

            /** @returns {string} */
            toString: function () {
                var userinfo = this.userinfo,
                    host = this.host,
                    port = this.port;

                return [
                    userinfo && (encodeURIComponent(userinfo) + '@'),
                    host && encodeURIComponent(host),
                    port && (':' + encodeURIComponent(port))
                ].join('');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $assertion */{
        /** @param {$ajax.UriAuthorityComponent} expr */
        isUriAuthorityComponent: function (expr) {
            return $ajax.UriAuthorityComponent.isBaseOf(expr);
        },

        /** @param {$ajax.UriAuthorityComponent} [expr] */
        isUriAuthorityComponentOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $ajax.UriAuthorityComponent.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to a UriAuthorityComponent instance.
         * @returns {$ajax.UriAuthorityComponent}
         */
        toUriAuthorityComponent: function () {
            return $ajax.UriAuthorityComponent.create(this.valueOf());
        }
    });
}());
