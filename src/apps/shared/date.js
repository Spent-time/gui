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
 *   date util
 * </p>
 *
 * @module apps/shared/date
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // base
        'apps/shared/moment'
    ],

    function (moment) {

        return {

            init: function () {

                // we always work in universal time
                moment.utc();

                // set the locale
                moment.locale(dojo.locale);
            },
            now: function () {

                return moment().toISOString();
            },
            moment: function (date) {

                if (date) {
                    return moment(date);
                }

                return moment();
            },
            startOf: function (date, unit) {

                return moment(date).startOf(unit);
            },
            startOfToday: function () {

                return moment().startOf('day').toISOString();
            },
            endOfToday: function () {

                return moment().endOf('day').toISOString();
            },
            startOfThisWeek: function () {

                return moment().startOf('week').toISOString();
            },
            startOfLastWeek: function () {

                return moment().subtract(1, 'week').startOf('week').toISOString();
            },
            endOfThisWeek: function () {

                return moment().endOf('week').toISOString();
            },
            endOfLastWeek: function () {

                return moment().subtract(1, 'week').endOf('week').toISOString();
            },
            startOfThisMonth: function () {

                return moment().startOf('month').toISOString();
            },
            startOfLastMonth: function () {

                return moment().subtract(1, 'month').startOf('month').toISOString();
            },
            endOfThisMonth: function () {

                return moment().endOf('month').toISOString();
            },
            endOfLastMonth: function () {

                return moment().subtract(1, 'month').endOf('month').toISOString();
            },
            startOfThisYear: function () {

                return moment().startOf('year').toISOString();
            },
            endOfThisYear: function () {

                return moment().endOf('Year').toISOString();
            },
            add: function (date, amount, unit) {

                return moment(date).add(amount, unit);
            },
            toISOString: function (date) {

                return moment(date).toISOString();
            },
            fromISOString: function (string) {

                return moment(string).toDate();
            },
            duration: function (item) {

                var a = moment(item.startTime);
                var b = moment(item.endTime);
                return (b.diff(a) / 1000 / 60);
            },
            diff: function (item) {

                var endTime = moment(item.endTime);
                var check = moment();

                return check.diff(endTime);
            }
        }

    });