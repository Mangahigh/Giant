/*jshint node:true */

/** @namespace */
var $commonWidgets = {};

/** @namespace */
var $assertion = $assertion || require('giant-assertion');

/** @namespace */
var $oop = $oop || require('giant-oop');

/** @namespace */
var $utils = $utils || require('giant-utils');

/** @namespace */
var $data = $data || require('giant-data');

/** @namespace */
var $event = $event || require('giant-event');

/** @namespace */
var $entity = $entity || require('giant-entity');

/** @namespace */
var $templating = $templating || require('giant-templating');

/** @namespace */
var $widget = $widget || require('giant-widget');

/**
 * Whether to poll input values at a regular interval.
 * Set to true when change/input events do not get fired on form autofill, etc.
 * @type {boolean}
 */
$commonWidgets.pollInputValues = false;

/**
 * @function
 * @see http://api.jquery.com
 */
var jQuery = jQuery || require('jquery');

if (typeof window === 'undefined') {
    /**
     * Built-in global window object.
     * @type {Window}
     */
    window = undefined;
}

if (typeof document === 'undefined') {
    /**
     * Built-in global document object.
     * @type {Document}
     */
    document = undefined;
}

/**
 * Native number class.
 * @name Number
 * @class
 */

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */

/**
 * @name $data.Hash
 * @class
 */
