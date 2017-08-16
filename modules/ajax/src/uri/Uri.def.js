$oop.postpone($ajax, 'Uri', function () {
    "use strict";

    var base = $oop.Base,
        self = base.extend();

    /**
     * @name $ajax.Uri.create
     * @function
     * @param {string} [uriString]
     * @returns {$ajax.Uri}
     */

    /**
     * Represents a Uniform Resource Identifier.
     * @link http://www.rfc-base.org/txt/rfc-3986.txt
     * @class
     * @extends $oop.Base
     * @extends $utils.Stringifiable
     */
    $ajax.Uri = self
        .addConstants(/** @lends $ajax.Uri */{
            /**
             * Regular expression for matching URIs.
             * TODO: Double forward slash in hier-part (bw. scheme & authority) should be optional.
             * @link http://labs.apache.org/webarch/uri/rfc/rfc3986.html#regexp
             * @type {RegExp}
             * @constant
             * -----------------( scheme  )----------( host  )-------( path )-------(query)------(fg)----
             */
            RE_URI_PARSER: /^(?:([^:\/?#]+):)?(?:\/\/([^/?#]*))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
        })
        .addMethods(/** @lends $ajax.Uri# */{
            /**
             * @param {string} [uriString]
             * @ignore
             */
            init: function (uriString) {
                $assertion.isStringOptional(uriString, "Invalid URI string");

                var uriComponents = (uriString && uriString.match(self.RE_URI_PARSER)) || [];

                /**
                 * URI scheme component (ftp, http, mailto, mshelp, ymsgr, etc)
                 * @type {string}
                 */
                this.scheme = uriComponents[1];

                /**
                 * URI authority component (host, user:pwd@host, etc)
                 * @type {string}
                 */
                this.authority = $ajax.UriAuthorityComponent.create(uriComponents[2]);

                /**
                 * URI path component
                 * @type {string}
                 */
                this.path = $ajax.UriPathComponent.create(uriComponents[3]);

                /**
                 * URI query component (http GET REST api, etc)
                 * @type {$ajax.UriQueryComponent}
                 */
                this.query = $ajax.UriQueryComponent.create(uriComponents[4]);

                /**
                 * URI fragment component (html anchor, etc)
                 * @type {string}
                 */
                this.fragment = uriComponents[5];
            },

            /**
             * @param {string} scheme
             * @returns {$ajax.Uri}
             */
            setScheme: function (scheme) {
                this.scheme = scheme;
                return this;
            },

            /**
             * @param {string} authority
             * @returns {$ajax.Uri}
             */
            setAuthority: function (authority) {
                this.authority = $ajax.UriAuthorityComponent.create(authority);
                return this;
            },

            /**
             * @param {string} path
             * @returns {$ajax.Uri}
             */
            setPath: function (path) {
                this.path = $ajax.UriPathComponent.create(path);
                return this;
            },

            /**
             * @param {string} query
             * @returns {$ajax.Uri}
             */
            setQuery: function (query) {
                this.query = $ajax.UriQueryComponent.create(query);
                return this;
            },

            /**
             * @param {string} fragment
             * @returns {$ajax.Uri}
             */
            setFragment: function (fragment) {
                this.fragment = fragment;
                return this;
            },

            /**
             * Clones the current Uri instance.
             * @returns {$ajax.Uri}
             */
            clone: function () {
                return this.toString().toUri();
            },

            /**
             * Stringifies the current Uri instance.
             * @returns {string}
             */
            toString: function () {
                var path = this.path,
                    query = this.query,
                    fragment = this.fragment;

                return [
                    this.scheme + '://',
                    this.authority,
                    path.isEmpty() ? '' : '/' + path,
                    query.isEmpty() ? '' : '?' + query,
                    fragment && ('#' + fragment)
                ].join('');
            }
        });
});

(function () {
    "use strict";

    $assertion.addTypes(/** @lends $assertion */{
        /** @param {$ajax.Uri} expr */
        isUri: function (expr) {
            return $ajax.Uri.isBaseOf(expr);
        },

        /** @param {$ajax.Uri} [expr] */
        isUriOptional: function (expr) {
            return typeof expr === 'undefined' ||
                $ajax.Uri.isBaseOf(expr);
        }
    });

    $oop.extendBuiltIn(String.prototype, /** @lends String# */{
        /**
         * Converts string to a Uri instance.
         * @returns {$ajax.Uri}
         */
        toUri: function () {
            return $ajax.Uri.create(this.valueOf());
        }
    });
}());
