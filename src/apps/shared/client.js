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
 *   The messaging working horse (pigeons?)
 * </p>
 *
 * Provides the socket client - server messaging.
 *
 * @module apps/shared/client
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        'dojo/query',

        'dojo/_base/declare',

        'apps/shared/runtime',

        './socket',

        'dojo/topic'
    ],

    function (query, declare, runtime, socket, topic) {

        var TOPIC = {
            connection: {
                connected: 'connect',
                error: 'connect_error',
                timeout: 'connect_timeout',
                reconnect: 'reconnect',
                attempt: 'reconnect_attempt',
                reconnecting: 'reconnecting',
                rerror: 'reconnect_error',
                failed: 'reconnect_failed'
            },
            item: {
                get: 'item:get',
                post: 'item:post',
                created: 'item:created',
                put: 'item:put',
                updated: 'item:updated',
                del: 'item:delete',
                deleted: 'item:deleted',
                changed: 'item:changed'
            },
            event: {
                get: 'event:get',
                between: 'event:between',
                report: 'event:report',
                post: 'event:post',
                created: 'event:created',
                put: 'event:put',
                updated: 'event:updated',
                del: 'event:delete',
                deleted: 'event:deleted',
                changed: 'event:changed'
            },
            setting: {
                get: 'setting:get',
                post: 'setting:post',
                created: 'setting:created',
                put: 'setting:put',
                updated: 'setting:updated',
                del: 'setting:delete',
                deleted: 'setting:deleted',
                changed: 'setting:changed'
            }
        };

        return {

            /**
             *
             */
            _socket: null,

            connection: TOPIC.connection,

            event: TOPIC.event,

            item: TOPIC.item,

            setting: TOPIC.setting,

            /**
             *
             */
            init: function () {

                var url = window.location.protocol + '//' + window.location.hostname;
                this._socket = socket(url);

                var _connection = TOPIC.connection;
                var _event = TOPIC.event;
                var _item = TOPIC.item;
                var _setting = TOPIC.setting;

                /** ===================================================
                 *  Connection
                 *  All socket connection related events
                 * ===================================================*/

                // publish connectino established
                this._socket.on(_connection.connected, function () {

                    console.info(_connection.connected);
                    topic.publish(_connection.connected);
                });

                this._socket.on(_connection.error, function () {

                    console.error(_connection.error);
                    topic.publish(_connection.error);
                });

                this._socket.on(_connection.timeout, function () {

                    console.info(_connection.timeout);
                    topic.publish(_connection.timeout);
                });

                this._socket.on(_connection.reconnect, function () {

                    console.info(_connection.reconnect);
                    topic.publish(_connection.reconnect);
                });

                this._socket.on(_connection.attempt, function () {

                    console.info(_connection.attempt);
                    topic.publish(_connection.attempt);
                });

                this._socket.on(_connection.reconnecting, function () {

                    console.info(_connection.reconnecting);
                    topic.publish(_connection.reconnecting);
                });

                this._socket.on(_connection.rerror, function () {

                    console.info(_connection.rerror);
                    topic.publish(_connection.rerror);
                });

                this._socket.on(_connection.failed, function () {

                    console.info(_connection.failed);
                    topic.publish(_connection.failed);
                });

                /** ===================================================
                 *  Event
                 *  All event related events
                 * ===================================================*/

                // updated an event
                this._socket.on(_event.updated, function (data) {

                    // publish event updated &  data
                    topic.publish(_event.updated, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_event.changed);
                });

                // created an event
                this._socket.on(_event.created, function (data) {

                    // publish event created &  data
                    topic.publish(_event.created, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_event.changed);
                });

                // deleted an event
                this._socket.on(_event.deleted, function (data) {

                    // publish event deleted &  data
                    topic.publish(_event.deleted, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_event.changed);
                });

                /** ===================================================
                 *  Item
                 *  All item related events
                 * ===================================================*/

                // updated an event
                this._socket.on(_item.updated, function (data) {

                    // publish event updated &  data
                    topic.publish(_item.updated, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_item.changed);
                });

                // created an event
                this._socket.on(_item.created, function (data) {

                    // publish event created &  data
                    topic.publish(_item.created, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_item.changed);
                });

                // deleted an event
                this._socket.on(_item.deleted, function (data) {

                    // publish event deleted &  data
                    topic.publish(_item.deleted, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_item.changed);
                });

                /** ===================================================
                 *  Setting
                 *  All setting related events
                 * ===================================================*/

                // Updated setting
                this._socket.on(_setting.updated, function (data) {

                    // publish event updated &  data
                    topic.publish(_setting.updated, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_setting.changed);
                });

                // Created setting
                this._socket.on(_setting.created, function (data) {

                    // publish event created &  data
                    topic.publish(_setting.created, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_setting.changed);
                });

                // Deleted setting
                this._socket.on(_setting.deleted, function (data) {

                    // publish event deleted &  data
                    topic.publish(_setting.deleted, data);

                    // also publish 'generic' event changed
                    // for those not interested in details
                    topic.publish(_setting.changed);
                });

            },

            /**
             *
             * @returns {string}
             */
            getToken: function () {

                return runtime.user.id + ':' + Math.random().toString(36).substr(2);
            },

            /**
             *
             * @param token
             * @param callback
             */
            on: function (token, callback) {

                this._socket.on(token, function (data) {

                    callback(data);
                });
            },

            /**
             *
             * @param id
             * @param callback
             */
            subscribe: function (id, callback) {

                topic.subscribe(id, callback);
            },

            /**
             *
             * @param id
             * @param data
             */
            publish: function (id, data) {

                topic.publish(id, data);
            },

            /**
             *
             * @param id
             * @param data
             * @param callback
             */
            emit: function (id, data, callback) {

                this._socket.emit(id, data, callback);
                query('#load').style('width', '50%');
            },

            send: function (args) {

                query('#load').style('width', '25%');

                // generate unique token
                var token = this.getToken();

                // listen for result
                this._socket.on(token, function (result) {

                    if (args.callback
                        && typeof args.callback === 'function') {

                        args.callback(result);
                    }

                    query('#load').style('width', '0%');

                });

                // send message
                this._socket.emit(args.topic, {
                    data: args.data,
                    token: token
                }, function () {

                    query('#load').style('width', '100%');
                });

            },

            /**
             *
             * @param args
             */
            query: function (args) {

                query('#load').style('width', '25%');

                // generate unique token
                var token = this.getToken();

                // listen for result
                this._socket.on(token, function (data) {

                    if (args.callback
                        && typeof args.callback === 'function') {

                        args.callback(data);
                    }

                    query('#load').style('width', '0%');
                });

                // send message
                this._socket.emit(TOPIC[args.collection].get, {
                    filter: args.filter,
                    token: token
                }, function () {

                    query('#load').style('width', '100%');
                });
            }
        }
    });