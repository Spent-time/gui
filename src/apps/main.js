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
 *   The application startup file.
 * </p>
 *
 * @module apps/main
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // added this to make sure we do not break the loading in chrome & safari
        // it break on decimalFormat not available which is in number.js
        'dojo/cldr/nls/number',
        'dojo/cldr/nls/gregorian',

        // nls
        'dojo/i18n!./nls/i18n',

        // shared
        'apps/shared/runtime',
        'apps/shared/date',
        'apps/shared/setting',
        'apps/shared/client',
        'apps/shared/xhr',
        'apps/shared/data/ObjectStore',

        // dojo
        'dojo/ready',
        'dojo/html',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/query',
        'dojo/on',
        'dojo/io-query',
        'dojo/store/Observable',
        'dojo/window',

        // dijit
        'dijit/registry',

        // Menu rendering
        './Menu',

        // Apps
        'apps/tracker/TimeTracker',
        'apps/tracker/ItemTracker',
        'apps/reports/Reports',
        'apps/settings/Settings',
        'apps/user/User',

        // dijit
        'dijit/_editor/plugins/TextColor',
        'dijit/_editor/plugins/FontChoice',
        'dijit/_editor/plugins/LinkDialog',
        'dijit/_editor/plugins/Print',
        'dijit/_editor/plugins/ViewSource',
        'dijit/_editor/plugins/FullScreen',
        'dijit/ColorPalette',
        'dijit/Tooltip',
        'dijit/Toolbar',
        'dijit/form/Form',
        'dijit/form/Textarea',
        'dijit/form/DropDownButton',
        'dijit/TooltipDialog',
        'dijit/form/NumberSpinner',
        'dijit/form/TimeTextBox',
        'dijit/form/DateTextBox',
        'dijit/TitlePane',
        'dijit/form/Select',
        'dijit/form/TextBox',
        'dijit/form/CheckBox',
        'dijit/Editor',
        'dijit/layout/AccordionContainer',
        'dijit/layout/AccordionPane',
        'dijit/layout/TabContainer',
        'dijit/layout/BorderContainer',

        // dojox
        'dojox/widget/TitleGroup',
        'dojox/mvc/at',
        'dojox/gfx/svg',
        'dojox/mvc/Output',
        'dojox/form/CheckedMultiSelect',

        // home brew
        'apps/shared/widget/ColorPicker'],
    function (number, gregorian, i18n, runtime, date, setting, client, xhr, ObjectStore, ready, html, dom, domClass, query, on, ioQuery, Observable, viewport, registry, Menu, TimeTracker, ItemTracker, Reports, Settings, User) {

        /**
         * Dojo ready
         */
        ready(function () {

            /**
             * Hide intial application while rendering
             */
            query('#application').style('display', 'none');

            /**
             * localized menu headers
             */
            html.set(this['apps_menu'], i18n.menu.apps);
            html.set(this['more_menu'], i18n.menu.more);

            /**
             * Github sign in
             */
            on(dojo.byId('github-signin'), 'click', function () {
                window.location = '/auth/github';
            });

            /**
             * Bitbucket sign in
             */
            on(dojo.byId('bitbucket-signin'), 'click', function () {
                window.location = '/auth/bitbucket';
            });

            /**
             * Slack sign in
             */
            on(dojo.byId('slack-signin'), 'click', function () {
                window.location = '/auth/slack';
            });

            /**
             * Trello sign in
             */
            on(dojo.byId('trello-signin'), 'click', function () {
                window.location = '/auth/trello';
            });

            /**
             * Facebook sign in
             */
            on(dojo.byId('facebook-signin'), 'click', function () {
                window.location = '/auth/facebook';
            });

            /**
             * Google sign in
             */
            on(dojo.byId('google-signin'), 'click', function () {
                window.location = '/auth/google';
            });

            /**
             * Podio sign in
             */
            on(dojo.byId('podio-signin'), 'click', function () {
                window.location = '/auth/podio';
            });

            /**
             * Facebook sign in
             */
            on(dojo.byId('linkedin-signin'), 'click', function () {
                window.location = '/auth/linkedin';
            });

            /**
             * Check size constraints, below 1024 looks shitty.
             * That's what we will have the mobile version for.
             *
             * @todo When the mobile version is live we ask here if
             *       they want to be redirected to the mobile version
             */
            on(window, 'resize', function () {

                var w = viewport.getBox().w;

                if (w < 1024) {

                    query('#application').style('display', 'none');
                    query('#loaderProgressBar').style('display', 'block');
                    html.set(dojo.byId('loaderMessage2'), 'This version of Spent time does not support a resolution with a width below 1024. We are working on a mobile version.');

                } else {

                    query('#application').style('display', 'block');
                    query('#loaderProgressBar').style('display', 'none');
                    html.set(dojo.byId('loaderMessage2'), '<span class="fa fa-refresh fa-spin"></span>');
                }
            });

            on(dom.byId('closeMessage'), 'click', function () {

                query('#application').style('pointer-events', 'all');
                domClass.toggle('message', 'closed');
            });

            /**
             * Fetch user info
             */
            xhr.get({

                /**
                 *
                 */
                url: '/_api/user',

                /**
                 *
                 * @param user
                 */
                success: function (user) {

                    // set user
                    runtime.user = user;

                    window.userId = user.id;

                    // initialize the date util
                    date.init();

                    // subscribe to the connected topic
                    client.subscribe(client.connection.connected, function () {

                        // empty initial store for events
                        runtime.events = new Observable(
                            new ObjectStore({
                                collection: 'event'
                            })
                        );

                        runtime.items = new Observable(
                            new ObjectStore({
                                initialLoad: true,
                                collection: 'item',
                                filter: {},
                                callback: function (result) {

                                    // check if there are items, otherwise new install
                                    if (result.length === 0) {

                                        // by default we add the root and spent-time repository
                                        runtime.items.post({
                                            data: [{
                                                id: runtime.user.id,
                                                label: 'Trackers',
                                                type: 'root',
                                                view: 'root'
                                            }, {
                                                label: 'Spent time',
                                                type: 'tracker',
                                                view: 'tracker',
                                                parent: runtime.user.id,
                                                color: 'Calendar12',
                                                tags: {
                                                    tracker: 'spent-time'
                                                }
                                            }],
                                            callback: function () {

                                                // initialize settings
                                                setting.init({
                                                    loaded: function () {

                                                        // Load apps, render the menu & raise curtain
                                                        if (!runtime.menu) {

                                                            runtime.menu = new Menu();

                                                            // load apps
                                                            var apps = registry.byId('appContainer');

                                                            var timeTracker = new TimeTracker({id: runtime.APPS.TIME_TRACKER.id});
                                                            apps.addChild(timeTracker);

                                                            var itemTracker = new ItemTracker({id: runtime.APPS.ITEM_TRACKER.id});
                                                            apps.addChild(itemTracker);

                                                            var reports = new Reports({id: runtime.APPS.REPORTS.id});
                                                            apps.addChild(reports);

                                                            var settings = new Settings({id: runtime.APPS.SETTINGS.id});
                                                            apps.addChild(settings);

                                                            var user = new User({id: runtime.APPS.USER.id});
                                                            apps.addChild(user);

                                                            var w = viewport.getBox().w;

                                                            if (w < 1024) {

                                                                query('#application').style('display', 'none');
                                                                query('#loaderProgressBar').style('display', 'block');
                                                                html.set(dojo.byId('loaderMessage2'), 'This version of Spent time does not support a resolution with a width below 1024. We are working on a mobile version.');

                                                            } else {

                                                                query('#application').style('display', 'block');
                                                                query('#loaderProgressBar').style('display', 'none');
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        });

                                    } else {

                                        // initialize settings
                                        setting.init({
                                            loaded: function () {

                                                // Load apps, render the menu & raise curtain
                                                if (!runtime.menu) {

                                                    runtime.menu = new Menu();

                                                    // load apps
                                                    var apps = registry.byId('appContainer');

                                                    var timeTracker = new TimeTracker({id: runtime.APPS.TIME_TRACKER.id});
                                                    apps.addChild(timeTracker);

                                                    var itemTracker = new ItemTracker({id: runtime.APPS.ITEM_TRACKER.id});
                                                    apps.addChild(itemTracker);

                                                    var reports = new Reports({id: runtime.APPS.REPORTS.id});
                                                    apps.addChild(reports);

                                                    var settings = new Settings({id: runtime.APPS.SETTINGS.id});
                                                    apps.addChild(settings);

                                                    var user = new User({id: runtime.APPS.USER.id});
                                                    apps.addChild(user);


                                                    var w = viewport.getBox().w;

                                                    if (w < 1024) {

                                                        query('#application').style('display', 'none');
                                                        query('#loaderProgressBar').style('display', 'block');
                                                        html.set(dojo.byId('loaderMessage2'), 'This version of Spent time does not support a resolution with a width below 1024. We are working on a mobile version.');

                                                    } else {

                                                        query('#application').style('display', 'block');
                                                        query('#loaderProgressBar').style('display', 'none');
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }
                            })
                        );
                    });

                    // initialize messaging client
                    client.init();

                },
                /**
                 *
                 */
                error: function () {

                    // User not found, show sign in, hide progressbar
                    query('#loaderProgressBar').style('display', 'none');
                    query('#login').style('display', 'block');

                    // Check for possible message to display
                    var uri = window.location.href;
                    var q = uri.substring(uri.indexOf('?') + 1, uri.length);
                    var queryObject = ioQuery.queryToObject(q);

                    // Confirmation message
                    if (queryObject.m === 'c') {
                        html.set(dojo.byId('message'), i18n.message.confirmed);
                    }

                    // Something wrong
                    if (queryObject.m === 'x') {
                        html.set(dojo.byId('message'), i18n.message.confirmError);
                    }

                    // Token expired
                    if (queryObject.m === 'e') {
                        html.set(dojo.byId('message'), i18n.message.tokenExpired);
                    }
                }

            });
        })
    });
