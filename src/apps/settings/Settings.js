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
        'apps/shared/setting',


        // dojo
        'dojo/on',
        'dojo/query',
        'dojo/_base/declare',
        'dojo/i18n!../nls/i18n',

        // dijit
        'dijit/registry',
        'dijit/layout/ContentPane',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',

        // dojox
        'dojo/text!./templates/Settings.html'],
    function (runtime, setting, on, query, declare, i18n, registry, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, SettingsTemplate) {

        /**
         *
         */
        return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {

            /**
             *
             */
            templateString: SettingsTemplate,

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
            setting: setting,

            /**
             * Because of the inconsistent way the html element
             * attributes are applied to dijit widgets we have
             * to keep a list of id/key values to get all widgets
             * dealing with app settings
             */
            keys: [
                'general.locale.language',
                'timeTracker.duration.firstDayOfWeek',
                'timeTracker.duration.startTimeOfDay.hours',
                'timeTracker.duration.startTimeOfDay.minutes',
                'timeTracker.duration.minHours',
                'timeTracker.duration.maxHours',
                'timeTracker.duration.minDuration',
                'timeTracker.duration.minDurationUnit',
                'timeTracker.duration.minDurationSteps',
                'timeTracker.duration.minDurationStepsUnit',
                'timeTracker.grid.dateInterval',
                'timeTracker.grid.snapSteps',
                'timeTracker.grid.snapUnit',
                'timeTracker.grid.showTimeIndicator',
                'timeTracker.grid.timeIndicatorRefreshInterval',
                'timeTracker.grid.rowHeaderTimePattern',
                'timeTracker.grid.columnHeaderDatePattern'
            ],

            /**
             * @constructor Settings
             */
            constructor: function (args) {

            },
            postCreate: function () {

                for (var i = 0; i < this.keys.length; i++) {

                    var key = this.keys[i];
                    var widget = registry.byId(key);

                    if (widget) {

                        // special case
                        if (widget.declaredClass === 'apps.shared.widget.ColorPicker') {

                            var id = widget.colorPickerDropDown.id;
                            widget = registry.byId(id);

                            widget.key = key;
                            var value = this.setting.get(key);
                            widget.set('value', value, false);
                            widget.iconNode.className = 'dijitReset dijitInline dijitIcon dijitEditorIcon dijitEditorIconHiliteColor ' + value;

                            on(widget, 'change', function (value) {
                                setting.set(this.key, value);
                            });

                        } else {

                            widget.set('value', this.setting.get(key), false);

                            on(widget, 'change', function (value) {
                                setting.set(this.id, value);
                            });

                        }
                    }
                }
            }
        });
    }
);
