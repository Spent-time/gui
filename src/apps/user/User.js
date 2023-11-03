//
//  CLOUD CODERS CONFIDENTIAL
//  _________________________
//
//
//   [2016] Cloud Coders Intl. BV
//   All Rights Reserved.
//
//  NOTICE:  All information contained herein is, and remains
//  the property of Cloud Coders Intl. BV and its suppliers,
//  if any.  The intellectual and technical concepts contained
//  herein are proprietary to Cloud Coders Intl. BV
//  and its suppliers and may be covered by Dutch and Foreign Patents,
//  patents in process, and are protected by trade secret or copyright law.
//
//  Dissemination of this information or reproduction of this material
//  is strictly forbidden unless prior written permission is obtained
//  from Cloud Coders Intl. BV.
//

/**
 * <p>
 *   The settings screen.
 * </p>
 *
 * @module apps/Settings
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // shared
        'apps/shared/runtime',

        // dojo
        'dojo/on',
        'dojo/query',
        'dojo/_base/declare',
        'dojo/i18n!../nls/i18n',

        // dijit
        'dijit/layout/ContentPane',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',

        // dojox
        'dojox/mvc/getStateful',
        'dojox/mvc/ModelRefController',
        'dojo/text!./templates/User.html'],
    function (runtime, on, query, declare, i18n, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, getStateful, ModelRefController, UserTemplate) {

        /**
         *
         */
        return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {

            /**
             *
             */
            templateString: UserTemplate,

            /**
             *
             */
            closable: false,

            /**
             * Localization
             */
            i18n: i18n,

            /**
             *
             */
            user: new ModelRefController({model: getStateful({})}),

            /**
             * @constructor Settings
             */
            constructor: function (args) {

            },
            postCreate: function () {

                this.user.set('model', getStateful(runtime.user));

                on(this.logout, 'click', function () {

                    runtime.signout();
                });
            }
        });
    }
);
