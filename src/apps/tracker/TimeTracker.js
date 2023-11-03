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
 *   The calendar app
 * </p>
 *
 * @module apps/Calendar
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // nls
        'dojo/i18n!../nls/i18n',
        'dojo/on',

        // shared
        'apps/shared/client',
        'apps/shared/data/ObjectStore',
        'apps/shared/runtime',
        'apps/shared/setting',
        'apps/shared/date',

        // apps
        'dojox/calendar/Calendar',

        // dojo
        'dojo/text!./templates/TimeTracker.html',
        'dojo/store/Observable',
        'dojo/_base/lang',
        'dojo/date/stamp',
        'dojo/_base/declare',
        'dojo/_base/array',

        // dijit
        'dijit/layout/ContentPane',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin'],
    function (i18n, on, client, ObjectStore, runtime, setting, date, Calendar, TimeTrackerTemplate, Observable, lang, stamp, declare, arr, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin) {

        /**
         *
         */
        return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: TimeTrackerTemplate,
            closable: false,

            /**
             * Localization
             */
            i18n: i18n,

            /**
             * @constructor TimeTracker
             * @param args
             */
            constructor: function (args) {
            },
            onShow: function () {

                if (runtime.calendar) {
                    runtime.calendar.set('store', runtime.events);
                }
            },
            showPointer: function (id) {

                // if we need to show 3 we check if it's in view,
                // scroll into view if needed and position the balloon next to it
                if (id === 3) {

                    var el = dojo.byId('timeTrackButton');

                    if (el) {
                        var rect = el.getBoundingClientRect();

                        var inView = (
                            rect.top >= 0 &&
                            rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                        );

                        if (!inView) {

                            el.scrollIntoView(false);
                        }

                        var wh = window.innerHeight;
                        var ww = window.innerWidth;

                        var left = parseInt(rect.left);
                        var right = parseInt(ww - rect.right);

                        this['pointer3'].style.position = 'absolute';
                        this['pointer3'].style.top = ((wh / 2) - 125) + 'px';

                        if (left > right) {

                            this['pointer3'].style.left = ((left / 2) - 125) + 'px';

                        } else {

                            this['pointer3'].style.right = ((right) / 2 + 125) + 'px';
                        }

                    } else {

                        // it's number 3 but we cannot do anything so return
                        return;
                    }
                }

                if (this['pointer' + id]) {

                    // attach close event
                    on(this['ok' + id], 'click', dojo.hitch(this, function () {

                        this['pointer' + (id - 1)].style.display = 'none';
                        this.showPointer(id++);
                    }));

                    // show pointer
                    this['pointer' + id].style.display = 'block';

                    // set as shown
                    setting.set('timeTracker.pointer', id++);

                } else {

                    // no more pointers here
                    setting.set('timeTracker.pointer', -1);
                }
            },
            postCreate: function () {

                var pointer = setting.get('timeTracker.pointer');

                if (pointer === 1
                    || pointer === 2) {
                    this.showPointer(pointer);
                }

                runtime.calendar = new Calendar({

                    /**===================================================
                     *  Properties
                     *====================================================/

                     /**
                     * Set the store
                     */
                    store: runtime.events,

                    /**
                     * First day of the week 0 based index
                     * Sunday = 0, Mon = 1, Tue = 2 etc
                     *
                     * To use locale settings in browser set to -1
                     */
                    firstDayOfWeek: parseInt(setting.get('timeTracker.duration.firstDayOfWeek')),

                    /**
                     * The date interval used to compute along with the date and dateIntervalSteps the time interval
                     * to display.
                     *
                     * Valid values are "day", "week" (default value) and "month".
                     */
                    dateInterval: setting.get('timeTracker.grid.dateInterval'),

                    /**
                     * The number of date intervals used to compute along with the date and dateInterval the time
                     * interval to display. Default value is 1.
                     *
                     * @todo see how we can make this useful. It can show more than 1 week in a view.
                     */
                    dateIntervalSteps: 1,

                    /**
                     * Column View Properties
                     */
                    columnViewProps: {

                        /**
                         * A flag that indicates whether or not the user can edit items in the data provider.
                         * If true, the item renderers in the control are editable. The user can click on an
                         * item renderer, or use the keyboard or touch devices, to move or resize the associated event.
                         *
                         * @todo use this for the team suite
                         */
                        editable: true,

                        /**
                         * A flag that indicates whether the user can move items displayed. If true, the user can
                         * move the items.
                         *
                         * @todo use this for the team suite
                         */
                        moveEnabled: true,

                        /**
                         * A flag that indicates whether the items can be resized. If true, the control supports
                         * resizing of items.
                         *
                         * @todo use this for the team suite
                         */
                        resizeEnabled: true,

                        /**
                         * The time of day displayed is defined by the minHours (8 by default) and
                         * maxHours (18 by default) properties. For example to show the entire day
                         * set minHours to 0 and maxHours to 24.
                         *
                         * MinHours value must be in [0, 23] range and maxHours in the [1, 36] range.
                         * To display a night working time, set minHours to 20 (8pm) and maxHours to 32 (8am, next day).
                         *
                         * Note: The ColumnView can be replaced by the SimpleColumnView widget which is a columns
                         * view without the secondary sheet. See advanced configuration to see how to use this
                         * alternate view.
                         */

                        /**
                         * The minimum hour to be displayed. It must be in the [0,23] interval and must
                         * be lower than the maxHours.
                         */
                        minHours: setting.get('timeTracker.duration.minHours'),

                        /**
                         * The maximum hour to be displayed. It must be in the [1,36] interval and must
                         * be greater than the minHours.
                         */
                        maxHours: setting.get('timeTracker.duration.maxHours'),

                        /**
                         *
                         */
                        minDuration: setting.get('timeTracker.duration.minDuration'),

                        /**
                         *
                         */
                        minDurationUnit: setting.get('timeTracker.duration.minDurationUnit'),

                        /**
                         * The number of unit used to define the minimum duration of an event.
                         */
                        minDurationSteps: setting.get('timeTracker.duration.minDurationSteps'),

                        /**
                         * The unit used to define the minimum duration of an event.
                         */
                        minDurationStepsUnit: setting.get('timeTracker.duration.minDurationStepsUnit'),

                        /**
                         * The number of snapUnits used to compute the snapping of edited dates.
                         */
                        snapSteps: setting.get('timeTracker.grid.snapSteps'),

                        /**
                         * The unit used to compute the snapping of edited events.
                         */
                        snapUnit: setting.get('timeTracker.grid.snapUnit'),

                        /**
                         * Duration of the time slot in minutes. Must be a divisor of 60.
                         * This is a visual only, for snapping & duration steps look at the properties above
                         *
                         * note: making this too small gives a crowded calendar. 15 is minimum i guess.
                         *
                         * @protected
                         */
                        timeSlotDuration: 15,

                        /**
                         * Forces the event to stay in the view.
                         *
                         * @protected
                         */
                        stayInView: true,

                        /**
                         * Duration of the time slot in minutes in the row header. Must be a divisor of 60 ]
                         * and a multiple/divisor of timeSlotDuration.
                         *
                         * @protected
                         */
                        rowHeaderGridSlotDuration: 60,

                        /**
                         * Duration of the time slot in minutes in the row header labels. Must be a divisor
                         * of 60 and a multiple/divisor of timeSlotDuration.
                         *
                         * @protected
                         */
                        rowHeaderLabelSlotDuration: 60,

                        /**
                         * If false, only the edited renderer position/size is updated during the editing gestures.
                         * Otherwise all the renderers are updates during the editing gesture (more CPU intensive).
                         *
                         * @protected
                         */
                        liveLayout: false,

                        /**
                         * Whether show or not an indicator (the blue line) at the current time.
                         */
                        showTimeIndicator: setting.get('timeTracker.grid.showTimeIndicator'),

                        /**
                         * Interval between two refreshes of time indicator, in milliseconds.
                         */
                        timeIndicatorRefreshInterval: parseInt(setting.get('timeTracker.grid.timeIndicatorRefreshInterval')) * 60000,

                        /**
                         * First time (hour/minute) of day displayed, if reachable.
                         * An object containing "hours" and "minutes" properties.
                         */
                        startTimeOfDay: {
                            hours: setting.get('timeTracker.duration.startTimeOfDay.hours'),
                            minutes: setting.get('timeTracker.duration.startTimeOfDay.minutes')
                        },

                        /**
                         *
                         * Custom date/time pattern for the row header labels to override default one coming from
                         * he CLDR.
                         *
                         * See dojo/date/locale documentation for format string.
                         *
                         * "H'h'"
                         * "H'h'mm"
                         * "h:mma"
                         */
                        rowHeaderTimePattern: setting.get('timeTracker.grid.rowHeaderTimePattern') === 'browser' ? undefined : setting.get('timeTracker.grid.rowHeaderTimePattern'),

                        /**
                         * Custom date/time pattern for column header labels to override default one coming
                         * from the CLDR.
                         *
                         * See dojo/date/locale documentation for format string.
                         */
                        columnHeaderDatePattern: setting.get('timeTracker.grid.columnHeaderDatePattern') === 'browser' ? undefined : setting.get('timeTracker.grid.columnHeaderDatePattern'),

                        /**
                         * The percentage of the renderer width used to superimpose one item renderer on another
                         * when two events are overlapping.
                         *
                         * To specify the overlap, set the percentOverlap property. A 0 value means no overlap, 50
                         * means an overlapping of the half of item renderer size.
                         *
                         * @protected
                         */
                        percentOverlap: 90
                    },

                    /**
                     * The selectionMode property controls the selection, this property can take the following values:
                     * 'none' : No selection can be done.
                     * 'single' : Only one item can be selected at a time.
                     * 'multiple' : Several item can be selected using the control key modifier.
                     *
                     * Default value is 'single'.
                     */
                    selectionMode: 'single',

                    /**
                     * Function to format the time of day of the item renderers. The function takes the date,
                     * the render data object, the view and the data item as arguments and returns a String.
                     *
                     * @param d
                     * @param rd
                     * @param view
                     * @param item
                     * @returns {string}
                     */
                    formatItemTimeFunc: function (d, rd, view, item) {

                        return rd.dateLocaleModule.format(d, {

                            selector: 'time',

                            timePattern: d.getMinutes() == 0 ? "ha" : "h:mma"

                        }).toLowerCase();
                    },

                    /**
                     * This function will return the class name which
                     * will be set on the event and proper css class
                     * is applied.
                     *
                     * @param event
                     * @returns {*|string}
                     */
                    cssClassFunc: function (event) {

                        /**
                         * Get the item id from the event, query the item
                         * and if it exists return the color for the item
                         * otherise the defualt Calendar0 color
                         */
                        var c = runtime.items.query({
                            id: event.tracker
                        });

                        var color = c[0] ? c[0].color : 'Calendar0';

                        return event.tracked ? color + ' trackedEvent' : color;
                    },

                    /**
                     * Transform store date into Date objects
                     *
                     * @param s
                     */
                    decodeDate: function (s) {

                        return date.fromISOString(s);
                    },

                    /**
                     * Transform Date objects into store date.
                     *
                     * @param d
                     * @returns {String}
                     */
                    encodeDate: function (d) {

                        return date.toISOString(d);
                    }

                    /**
                     * The attachpoint on wich to render the calendar
                     */
                }, this.calendar);

                /**
                 * An item renderer event has been context-clicked
                 */
                runtime.calendar.on('itemContextMenu', dojo.hitch(this, function (e) {

                    dojo.stopEvent(e.triggerEvent);

                    if (!e.item.tracked) {

                        this.contextMenu.item = e.item;

                        this.contextMenu._openMyself({
                            target: e.renderer.domNode,
                            coords: {x: e.triggerEvent.pageX, y: e.triggerEvent.pageY}
                        });
                    }

                }));

                this.itemDelete.on('click', function () {

                    runtime.calendar.store.remove(this.getParent().item.id);
                });

                /**
                 * Date/time selection changes
                 */
                runtime.calendar.on("timeIntervalChange", function (e) {

                    var start = stamp.toISOString(e.startTime);
                    var end = stamp.toISOString(e.endTime);

                    client.send({
                        topic: 'event:between',
                        data: {
                            "start": start,
                            "end": end
                        },
                        callback: function (data) {

                            var store = new Observable(
                                new ObjectStore({
                                    collection: 'event'
                                })
                            );

                            store.setData(data);

                            runtime.events = store;

                            runtime.calendar.set('store', runtime.events);
                        }
                    });
                });

                /**
                 * The grid has been double-clicked
                 */
                runtime.calendar.on('gridDoubleClick', function (e) {

                    var start, end;
                    var colView = runtime.calendar.columnView;

                    if (e.source != colView) {
                        return;
                    }

                    if (e.source == colView) {

                        if (e.triggerEvent.trackingStart) {

                            start = date.now();
                            end = date.add(start, colView.minDuration, colView.minDurationUnit + 's');

                            start = date.moment(start);
                            end = date.moment(end);

                        } else {

                            // @todo replace with date.floor (moment-round plugin)
                            start = runtime.calendar.floorDate(e.date, colView.minDurationUnit, colView.minDuration);
                            end = date.add(start, colView.minDuration, colView.minDurationUnit + 's');
                        }
                    }

                    var newItem = {
                        startTime: start.toISOString(),
                        endTime: end.toISOString(),
                        tracked: !!e.triggerEvent.trackingStart,
                        tracker: null
                    };

                    runtime.calendar.store.post({
                        data: newItem
                    });

                    // @work-around remove the text selection after double click
                    // @todo find some better way to not have to remove it after already selected
                    if (document.selection && document.selection.empty) {
                        document.selection.empty();
                    } else if (window.getSelection) {
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                    }

                    if (e.triggerEvent.trackingStart) {

                        runtime.calendar.tracking = true;
                        runtime.calendar.trackedEvent = newItem;
                    }
                });
            }
        });
    }
);
