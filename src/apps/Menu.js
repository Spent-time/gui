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
 *   The menu app
 * </p>
 *
 * @module apps/Menu
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // nls
        'dojo/i18n!./nls/i18n',

        // shared
        'apps/shared/runtime',
        'apps/shared/setting',

        // apps
        'apps/feedback/Feedback',

        // dojo
        'dojo/on',
        'dojo/_base/declare',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/dom-construct',

        // dijit
        'dijit/TitlePane'],
    function (i18n, runtime, setting, Feedback, on, declare, dom, domClass, construct, TitlePane) {

        /**
         *
         */
        return declare(null, {

            /**
             *
             * @constructor Menu
             */
            constructor: function () {

                on(dom.byId('feedback'), 'click', function () {

                    domClass.toggle(dom.byId('feedback-menu'), 'invisible');
                });

                /**
                 * Time Tracker
                 */
                var timeTracker = new TitlePane({
                    id: runtime.APPS.TIME_TRACKER.menu,
                    title: '<span class="fa fa-calendar-o"></span><span class="title"> ' + i18n.timeTracker.title + '</span>',
                    open: false,
                    toggleable: false,
                    onClick: function () {

                        runtime.focus(runtime.APPS.TIME_TRACKER);
                    }
                });

                // attach
                dom.byId('apps').appendChild(timeTracker.domNode);
                timeTracker.startup();

                /**
                 * Item Tracker
                 */
                var itemTracker = new TitlePane({
                    id: runtime.APPS.ITEM_TRACKER.menu,
                    title: '<span class="fa fa-thumb-tack"></span><span class="title">&nbsp;&nbsp;' + i18n.itemTracker.title + '</span>',
                    open: false,
                    toggleable: false,
                    onClick: function () {

                        runtime.focus(runtime.APPS.ITEM_TRACKER);
                    }
                });

                // attach
                dom.byId('apps').appendChild(itemTracker.domNode);
                itemTracker.startup();

                /**
                 * Reports
                 */
                var reports = new TitlePane({
                    id: runtime.APPS.REPORTS.menu,
                    title: '<span class="fa fa-file"></span><span class="title"> ' + i18n.reports.title + '</span>',
                    open: false,
                    toggleable: false,
                    onClick: function () {

                        runtime.focus(runtime.APPS.REPORTS);
                    }
                });

                // attach
                dom.byId('apps').appendChild(reports.domNode);
                reports.startup();

                /**
                 * Settings menu
                 */
                var settings = new TitlePane({
                    id: runtime.APPS.SETTINGS.menu,
                    title: '<span class="fa fa-wrench fa2x"></span><span class="title"> ' + i18n.settings.title + '</span>',
                    open: false,
                    toggleable: false,
                    onClick: function () {

                        runtime.focus(runtime.APPS.SETTINGS);
                    }
                });

                // attach
                dom.byId('more').appendChild(settings.domNode);
                settings.startup();

                /**
                 * User Account
                 */
                var user = new TitlePane({
                    id: runtime.APPS.USER.menu,
                    title: '<span class="fa fa-user fa2x"></span><span class="title"> ' + i18n.account.title + '</span>',
                    open: false,
                    toggleable: false,
                    onClick: function () {

                        runtime.focus(runtime.APPS.USER);
                    }
                });

                // attach
                dom.byId('more').appendChild(user.domNode);
                user.startup();

                // open the dashboard
                runtime.focus(runtime.APPS.TIME_TRACKER);

                // prepare the feedback widget
                new Feedback();
            }
        })
    });