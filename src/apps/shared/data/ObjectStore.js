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
 *  A data store containing JSON/BSON data from Mongo / The backend
 * </p>
 *
 * @module apps/shared/data/ItemStore
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([
        'apps/shared/client',
        'dojo/Deferred',
        'dojo/_base/declare',
        'dojo/store/util/QueryResults',
        'dojo/store/util/SimpleQueryEngine'],
    function (client, Deferred, declare, QueryResults, SimpleQueryEngine) {

        /**
         *
         */
        return declare(null, {

            /**
             *
             */
            collection: null,

            /**
             *
             */
            data: [],

            /**
             *
             */
            idProperty: 'id',

            /**
             *
             */
            index: {},

            /**
             *
             */
            queryEngine: SimpleQueryEngine,

            /**
             * @constructor ItemStore
             *
             * @param {type} options
             */
            constructor: function (options) {

                this.data = [];
                this.index = {};

                for (var i in options) {

                    if (options.hasOwnProperty(i)) {
                        this[i] = options[i];
                    }
                }

                if (options.initialLoad) {

                    client.query({
                        collection: options.collection,
                        filter: options.filter,
                        callback: dojo.hitch(this, function (data) {

                            // we make sure we set the data for this store
                            this.setData(data);

                            // execute any other requested callback
                            if (options.callback
                                && typeof options.callback === 'function') {

                                options.callback(data);
                            }

                        })
                    })
                }
            },
            /**
             *
             * @param {type} data
             * @returns {undefined}
             */
            setData: function (data) {

                if (data.items) {

                    // just for convenience with the data format IFRS expects
                    this.idProperty = data.identifier;
                    data = this.data = data.items;

                } else {

                    this.data = data;
                }

                for (var i = 0, l = data.length; i < l; i++) {

                    var id = data[i][this.idProperty];

                    this.index[String(id)] = i;
                }
            },
            /**
             *
             * @param {type} id
             */
            get: function (id) {

                return this.data[this.index[id]];
            },
            /**
             *
             * @param {type} object
             */
            getIdentity: function (object) {

                return object[this.idProperty];
            },
            /**
             *
             * @param {type} id
             * @returns {undefined}\
             */
            removeRecursive: function (id) {

                var item = this.get(id);

                var children = this.getChildren(item);

                for (var i = 0; i < children.length; i++) {
                    this.removeRecursive(children[i].id);
                }

                this.remove(id);
            },
            /**
             *
             * @param {type} id
             * @returns {Boolean}
             */
            remove: function (id) {

                if (!id) {
                    throw new Error('Unable to delete without id');
                }

                var index = this.index;
                var data = this.data;

                if (id in index) {

                    client.send({
                        topic: this.collection + ':delete',
                        data: id,
                        callback: dojo.hitch(this, function () {

                            data.splice(index[id], 1);
                            this.setData(data);
                        })
                    });
                }
            },
            /**
             *
             */
            post: function (args) {

                client.send({
                    topic: this.collection + ':post',
                    data: args.data,
                    callback: args.callback
                });
            },
            /**
             *
             * @param {type} object
             */
            put: function (object) {

                var data = this.data;
                var index = this.index;
                var id;

                if (Array.isArray(object)) {

                    for (var i = 0; i < object.length; i++) {

                        id = object[i].id;

                        if (id in index) {

                            // already in index, update
                            client.send({
                                topic: this.collection + ':put',
                                data: object[i],
                                callback: dojo.hitch(this, function () {

                                    data[index[id]] = object[i];
                                })
                            });

                        } else {

                            // newly created object, add to index
                            index[id] = data.push(object[i]) - 1;
                        }
                    }

                } else {

                    id = object.id;

                    if (id in index) {

                        // already in index, update
                        client.send({
                            topic: this.collection + ':put',
                            data: object,
                            callback: dojo.hitch(this, function () {

                                data[index[id]] = object;
                            })
                        });

                    } else {

                        // newly created object, add to index
                        index[id] = data.push(object) - 1;
                    }
                }
            },
            /**
             *
             * @param {type} id
             * @returns {Boolean}
             */
            hasChildren: function (id) {

                var item = this.get(id);

                var children = this.getChildren(item);

                return children.length > 0;
            },
            /**
             *
             * @param {item} item
             */
            getChildren: function (item) {

                return this.query({
                    parent: item.id
                }, {});
            },
            /**
             *
             * @param {type} id
             * @returns {Array}
             */
            getSiblings: function (id) {

                var item = this.get(id);

                var children = this.getChildren(item.parent);

                var result = [];

                for (var i = 0; i < children.length; i++) {

                    if (children[i].id !== id) {
                        result.push(children[i]);
                    }
                }

                return result;
            },
            /**
             *
             * @param id
             * @returns {Array}
             */
            getDescendantIds: function (id) {

                // get all descendants
                var items = this.getDescendants(id);

                // descendants found,
                // create array with id's
                var ids = [];

                //push all descendants
                for (var i = 0; i < items.length; i++) {

                    ids.push(items[i].id);
                }

                return ids;
            },
            /**
             *
             * @param {type} id
             * @param {type} array
             * @returns {Array}
             */
            getDescendants: function (id, array) {

                var result;

                if (array) {
                    result = array;
                } else {
                    result = [];
                }

                var item = this.get(id);

                var children = this.getChildren(item);

                for (var i = 0; i < children.length; i++) {

                    result.push(children[i]);

                    this.getDescendants(children[i].id, result);
                }

                return result;
            },
            getParent: function (id) {

                var item = this.get(id);

                return this.get(item.parent);

            },
            getParentPath: function (id, array) {

                var result;

                if (array) {
                    result = array;
                } else {
                    result = [];
                }

                var item = this.get(id);

                result.unshift(item.id);

                if (item.parent) {
                    this.getParentPath(item.parent, result);
                }

                return result;
            },
            /**
             *
             * @returns {Boolean}
             */
            isEmpty: function () {

                // check if the store is empty
                var items = this.query({
                    parent: 'root'
                }, {});

                return items.length === 0;
            },
            /**
             *
             * @param {{parent: String("root")}} query
             * @param {{}} options
             */
            query: function (query, options) {

                return QueryResults(this.queryEngine(query, options)(this.data));
            }
        });

    });
