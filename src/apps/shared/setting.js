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

        'apps/shared/client',
        'apps/shared/runtime',
        'dojo/text!./setting.json'

    ],
    function (client, runtime, defaults) {

        /**
         *
         */
        return {

            /**
             *
             */
            _settings: null,

            /**
             *
             */
            _fresh: false,

            /**
             *
             */
            _defaults: null,

            /**
             *
             */
            _updater: {

                'general.locale.language': function (value) {

                    if (value !== 'browser') {
                        document.cookie = 'lang=' + value + '; Fri, 31 Dec 9999 23:59:59 GMT; path=/';
                    } else {
                        document.cookie = 'lang=; Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                    }
                },

                'timeTracker.duration.minDuration': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.minDuration = value;
                    }
                },

                'timeTracker.duration.minDurationUnit': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.minDurationUnit = value;
                    }
                },

                'timeTracker.duration.minDurationSteps': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.minDurationSteps = value;
                    }
                },

                'timeTracker.duration.minDurationStepsUnit': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.minDurationStepsUnit = value;
                    }
                },

                'timeTracker.grid.snapSteps': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.snapSteps = value;
                    }
                },

                'timeTracker.grid.snapUnit': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.snapUnit = value;
                    }
                },

                'timeTracker.grid.showTimeIndicator': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.showTimeIndicator = value;
                    }
                },

                'timeTracker.grid.timeIndicatorRefreshInterval': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.timeIndicatorRefreshInterval = parseInt(value) * 60000;
                    }
                },

                'timeTracker.grid.rowHeaderTimePattern': function (value) {

                    if (runtime.calendar) {

                        if (value === 'browser') {
                            value = undefined;
                        }

                        runtime.calendar.columnView.rowHeaderTimePattern = value;
                    }
                },

                'timeTracker.grid.columnHeaderDatePattern': function (value) {

                    if (runtime.calendar) {

                        if (value === 'browser') {
                            value = undefined;
                        }

                        runtime.calendar.columnView.columnHeaderDatePattern = value;
                    }
                },

                'timeTracker.duration.minHours': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.minHours = value;
                    }
                },

                'timeTracker.duration.maxHours': function (value) {

                    if (runtime.calendar) {
                        runtime.calendar.columnView.maxHours = value;
                    }
                }
            },

            /**
             *
             * @param args
             */
            init: function (args) {

                // Set the defaults
                this._defaults = JSON.parse(defaults);

                client.query({
                    collection: 'setting',
                    filter: {},
                    callback: dojo.hitch(this, function (result) {

                        this.setData(result[0]);

                        if (args.loaded
                            && typeof args.loaded === 'function') {

                            args.loaded();
                        }
                    })
                });
            },

            /**
             *
             * @param data
             */
            setData: function (data) {

                this._settings = data;
            },

            /**
             *
             */
            get: function (key, defaultValue) {

                var value = key.split('.').reduce(function (obj, i) {

                    if (!obj) {
                        return;
                    }

                    return obj[i];

                }, this._settings);

                if (value == undefined || value == null) {

                    value = this.getDefault(key);

                    if (value == undefined
                        || value == null) {

                        if (defaultValue != undefined) {

                            value = defaultValue;

                        } else {

                            throw new Error('Key ' + key + ' does not exist and no default value provided for creation');
                        }
                    }

                    this.set(key, value);
                }

                return value;
            },

            getDefault: function (key) {

                return key.split('.').reduce(function (obj, i) {

                    if (!obj) {
                        return null;
                    }

                    return obj[i];

                }, this._defaults);
            },
            /**
             *
             */
            set: function (key, value) {

                var create = false;

                if (!this._settings) {

                    this._settings = {};
                    create = true;
                }

                // set the key/value
                var retval = this._set(this._settings, key, value);

                // execute any immediate updates
                if (this._updater[key]
                    && typeof this._updater[key] === 'function') {

                    this._updater[key](retval);
                }

                /**
                 * If it is a fresh set it means we do not
                 * have a settings object in Mongo yet.
                 * Here we create it.
                 */
                if (create) {

                    client.send({
                        topic: 'setting:post',
                        data: this._defaults,
                        callback: dojo.hitch(this, function (data) {

                            this.setData(data[0]);
                        })
                    })

                } else {

                    if (this._settings.id) {

                        client.send({
                            topic: 'setting:put',
                            data: this._settings
                        });
                    }
                }

                return retval;
            },
            _set: function (obj, is, value) {

                if (typeof is !== 'string') {

                    if (!obj[is[0]]) {

                        obj[is[0]] = {};
                    }
                }

                if (typeof is == 'string') {

                    return this._set(obj, is.split('.'), value);

                } else if (is.length == 1) {

                    return obj[is[0]] = value;

                } else if (is.length == 0) {

                    return obj;

                } else {

                    return this._set(obj[is[0]], is.slice(1), value);
                }
            }
        }
    });