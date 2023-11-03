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
 *   A util for runtime interaction with the apps, workspace and stores
 * </p>
 *
 * @module apps/shared/runtime
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // dojo
        'dojo/dom',
        'dojo/html',
        'dojo/string',
        'dojo/dom-class',
        'dojo/query',
        'dojo/cookie',
        'dojo/request/xhr'],
    function (dom, html, string, domClass, query, cookie, xhr) {

        /**
         *
         */
        return {

            /**
             * <h4></h4>
             *
             * @readonly
             * @enum {string} APPS
             */
            APPS: {
                /**
                 *
                 */
                TIME_TRACKER: {
                    id: 'time_tracker_app',
                    menu: 'time_tracker_menu'
                },
                ITEM_TRACKER: {
                    id: 'item_tracker_app',
                    menu: 'item_tracker_menu'
                },
                REPORTS: {
                    id: 'reports_app',
                    menu: 'reports_menu'
                },
                SETTINGS: {
                    id: 'settings_app',
                    menu: 'settings_menu'
                },
                USER: {
                    id: 'user_app',
                    menu: 'user_menu'
                }
            },

            /**
             * Authenticated user
             */
            user: {},

            /**
             * The store for the Time Tracker
             */
            events: null,

            /**
             * The Item tracker store
             */
            items: null,

            /**
             * Notify the user with a message
             */
            message: function (args) {

                var level = args.level;
                var message = args.message;
                var replace = args.replace;
                var details = args.details;


                if (replace) {
                    message = string.substitute(message, replace);

                    if (details) {
                        details = string.substitute(details, replace);
                    }
                }

                query('#application').style('pointer-events', 'none');
                html.set(dom.byId('message-title'), message);

                if (details) {
                    html.set(dom.byId('message-text'), details);
                }

                if (level === 'info') {

                    domClass.remove('level-info', 'invisible');
                    domClass.add('level-warn', 'invisible');
                    domClass.add('level-error', 'invisible');
                }

                if (level === 'warn') {

                    domClass.add('level-info', 'invisible');
                    domClass.remove('level-warn', 'invisible');
                    domClass.add('level-error', 'invisible');

                }

                if (level === 'error') {

                    domClass.add('level-info', 'invisible');
                    domClass.add('level-warn', 'invisible');
                    domClass.remove('level-error', 'invisible');

                }

                domClass.toggle('message', 'closed');
            },
            /**
             * Switch to opened App
             *
             * @param app
             * @param noVisual
             */
            focus: function (app, noVisual) {

                var f = dijit.byId(app.id);
                if (f) {
                    f.getParent().selectChild(f);
                }

                // switch menu selection to opened app
                if (!noVisual) {
                    for (var a in this.APPS) {

                        if (this.APPS.hasOwnProperty(a)) {

                            if (this.APPS[a].id === app.id) {

                                // opened app is selected
                                //noinspection JSCheckFunctionSignatures
                                domClass.add(dom.byId(this.APPS[a].menu), 'selected');

                            } else {

                                // all other apps are deselected
                                //noinspection JSCheckFunctionSignatures
                                domClass.remove(dom.byId(this.APPS[a].menu), 'selected');
                            }
                        }
                    }
                }
            },
            /**
             *
             */
            signout: function () {

                xhr('/_api/signout', {
                    method: 'GET'
                }).then(function () {

                    // reload
                    document.location.reload(true);
                });

            },
            /**
             *
             * @param id
             * @param url
             */
            loadStyleSheet: function (id, url) {

                if (dom.byId(id)) {
                    throw Error(
                        'Stylesheet with id ['
                        + id
                        + '] already loaded.');
                }

                var head = dojo.doc.getElementsByTagName('head')[0];
                var link = dojo.doc.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = url;
                head.appendChild(link);
            }
        }
    });
