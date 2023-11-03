///
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
 *   The reports screen.
 * </p>
 *
 * @module apps/Reports
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([
        // nls
        'dojo/i18n!../nls/i18n',

        'apps/reports/jsPDF',
        'apps/reports/csv',
        'apps/shared/client',
        'apps/shared/date',
        'apps/shared/setting',

        'dojo/on',
        'dojo/dom',

        'dstore/Memory',
        'dgrid/OnDemandGrid',
        'dgrid/extensions/Pagination',
        'dgrid/extensions/ColumnHider',
        'dgrid/extensions/ColumnResizer',

        'dojo/_base/declare',
        'dijit/layout/ContentPane',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dojo/text!./templates/Reports.html',
        'dojo/domReady!'],
    function (i18n, jsPDF, csv, client, date, setting, on, dom, Memory, OnDemandGrid, Pagination, ColumnHider, ColumnResizer, declare, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, ReportsTemplate) {

        return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: ReportsTemplate,
            closable: false,
            i18n: i18n,
            store: null,
            cols: null,
            hiddenCols: null,
            grid: null,
            start: null,
            end: null,
            constructor: function (args) {
                this.inherited(arguments);
            },
            postCreate: function () {

                // default columns
                this.cols = {
                    date: {
                        label: i18n.reports.grid.labels.date,
                        hidden: setting.get('reporting.columns.date.hidden', false)
                    },
                    week: {
                        label: i18n.reports.grid.labels.week,
                        hidden: setting.get('reporting.columns.week.hidden', false)
                    },
                    month: {
                        label: i18n.reports.grid.labels.month,
                        hidden: setting.get('reporting.columns.month.hidden', false)
                    },
                    minutes: {
                        label: i18n.reports.grid.labels.minutes,
                        hidden: setting.get('reporting.columns.minutes.hidden', false)
                    },
                    hours: {
                        label: i18n.reports.grid.labels.hours,
                        hidden: setting.get('reporting.columns.hours.hidden', false)
                    },
                    days: {
                        label: i18n.reports.grid.labels.days,
                        hidden: setting.get('reporting.columns.days.hidden', false)
                    },
                    duration: {
                        label: i18n.reports.grid.labels.duration,
                        hidden: setting.get('reporting.columns.duration.hidden', false)
                    },
                    label: {
                        label: i18n.reports.grid.labels.label,
                        hidden: setting.get('reporting.columns.label.hidden', false)
                    }
                };

                on(this.gridTab, 'show', dojo.hitch(this, function () {

                    this.grid.resize();
                }));

                on(this.quickSelect, 'change', dojo.hitch(this, function () {
                    this.loadGrid(true);
                }));

                on(this.refreshReport, 'click', dojo.hitch(this, function () {
                    this.loadGrid(false, true);
                }));

                on(this.runReport, 'click', dojo.hitch(this, function () {
                    this.loadGrid();
                }));

                on(this.outputPDF, 'click', dojo.hitch(this, function () {
                    this.renderPDF();
                }));

                on(this.outputCSV, 'click', dojo.hitch(this, function () {
                    this.renderCSV();
                }));

                on(this.selectData, 'click', function () {
                    var f = dijit.byId('dataTab');
                    if (f) {
                        f.getParent().selectChild(f);
                    }
                });

                /**
                 * @todo
                 *
                 * - filters for: week, month, year
                 *
                 * - format start & end date/time
                 * - calculate durations
                 * - make counts and sum & gran totals totals
                 *
                 * - flatten nested tags
                 * - Fixed fields, Item Label,
                 *   from mandatory tags: Project, Tracker, Billable, Client(?)
                 *
                 * - grouping on tags
                 * - text search (label, project)
                 * - tag selection
                 * - start end date selection
                 * -
                 *
                 */

                this.store = new (declare([Memory]))({
                    data: []
                });

                this.grid = new (declare([OnDemandGrid, Pagination, ColumnHider, ColumnResizer]))({
                    collection: this.store,
                    rowsPerPage: 25, // @todo setting
                    firstLastArrows: true, // @todo setting
                    pagingLinks: 5, // @todo setting
                    loadingMessage: i18n.reports.grid.loading,
                    noDataMessage: i18n.reports.grid.noData,
                    columns: {}
                }, this.gridNode);

                this.grid.startup();

                this.loadGrid(true);
            },
            loadGrid: function (quick, refresh) {

                if (!refresh) {

                    if (quick) {

                        var scope = this.quickSelect.get('value');

                        switch (scope) {

                            case 'today':
                                this.start = date.startOfToday();
                                this.end = date.endOfToday();
                                break;

                            case 'thisweek':
                                this.start = date.startOfThisWeek();
                                this.end = date.endOfThisWeek();
                                break;

                            case 'lastweek':
                                this.start = date.startOfLastWeek();
                                this.end = date.endOfLastWeek();
                                break;

                            case 'thismonth':
                                this.start = date.startOfThisMonth();
                                this.end = date.endOfThisMonth();
                                break;

                            case 'lastmonth':
                                this.start = date.startOfLastMonth();
                                this.end = date.endOfLastMonth();
                                break;

                            case 'thisyear':
                                this.start = date.startOfThisYear();
                                this.end = date.endOfThisYear();
                                break;
                        }

                    } else {

                        this.start = this.startDate.get('value');
                        this.end = this.endDate.get('value');
                    }
                }

                client.send({
                    topic: 'event:report',
                    data: {
                        "start": this.start,
                        "end": this.end
                    },
                    callback: dojo.hitch(this, function (data) {

                        for (var i = 0; i < data.length; i++) {

                            // convert start date
                            var startTime = date.moment(data[i].startTime);
                            var endTime = date.moment(data[i].endTime);

                            data[i].week = startTime.week();
                            data[i].month = startTime.month() + 1; // 0 based index
                            data[i].date = startTime.format('DD-MM-YYYY');

                            var diff = endTime.diff(startTime) / 1000 / 60;

                            var minutes = Math.floor(diff % 60);
                            data[i].minutes = minutes;

                            diff = diff / 60;

                            var hours = Math.floor(diff % 24);
                            data[i].hours = hours;

                            var days = Math.floor(diff / 24);
                            data[i].days = days;

                            var label = '';

                            if (days > 0) {
                                label += days + 'd ';
                            }

                            if (hours > 0) {
                                label += hours + 'h ';
                            }

                            if (minutes > 0) {
                                label += minutes + 'm';
                            }

                            data[i].duration = label;

                            // check for new tag columns
                            for (var tag in data[i].tags) {

                                if (data[i].tags.hasOwnProperty(tag)) {

                                    if (!this.cols['tag_' + tag]) {

                                        this.cols['tag_' + tag] = {
                                            label: tag,
                                            className: 'tag',
                                            hidden: setting.get('reporting.columns.tag_' + tag + '.hidden', false)
                                        }
                                    }

                                    data[i]['tag_' + tag] = data[i].tags[tag];
                                }
                            }
                        }

                        this.grid.set('columns', this.cols);
                        this.store.setData(data);
                        this.grid.refresh();
                        this.grid.resize();
                    })
                });
            },
            renderPDF: function () {

                // new doc
                var doc = new jsPDF('landscape');

                doc.setFontSize(10);

                // title
                doc.text(20, 20, 'Report Overview');

                // column headers
                var columns = this.grid.columns;
                var leftOffset = 20;
                var leftPadding = 20;

                for (var col in columns) {

                    if (columns.hasOwnProperty(col)) {

                        var column = columns[col];

                        if (!column.hidden
                            && column.hidden !== true) {

                            column.leftOffset = leftOffset;
                            doc.text(leftOffset, 30, column.label);
                            leftOffset += ((column.label.length * 2) + leftPadding);
                        }
                    }
                }

                // render data
                var data = this.grid.collection.data;

                // @todo sort on multiple columns
                // for now we only sort on 1 column at index 0
                var sort = this.grid.sort[0];
                if (sort) {

                    var property = sort.property;
                    var desc = sort.descending === true;

                    if (desc) {

                        data.sort(function (a, b) {

                            if (a[property] > b[property]) return -1;
                            if (a[property] < b[property]) return 1;

                            return 0;
                        });

                    } else {

                        data.sort(function (a, b) {

                            if (a[property] < b[property]) return -1;
                            if (a[property] > b[property]) return 1;

                            return 0;
                        });
                    }
                }

                var topOffset = 40;
                var topPadding = 5;

                for (var i = 0; i < data.length; i++) {

                    var row = data[i];

                    for (var field in row) {

                        if (row.hasOwnProperty(field)) {

                            if (columns[field]) {

                                if (!columns[field].hidden
                                    && columns[field].hidden !== true) {


                                    if (topOffset > 200) {
                                        doc.addPage();
                                        topOffset = 40;
                                    }

                                    doc.text(columns[field].leftOffset, topOffset, row[field] + '');
                                }
                            }
                        }
                    }

                    topOffset += topPadding;
                }


                var dataURI = doc.output('datauristring');

                this.pdfViewer.set('content',
                    dojo.create('iframe', {
                        src: '/pdfjs-dist/web/viewer.html',
                        name: dataURI,
                        style: 'border: 0; width: 100%; height: 100%'
                    })
                );

                var f = dijit.byId('outputTab');
                if (f) {
                    f.getParent().selectChild(f);
                }

            },
            renderCSV: function () {

                var data = this.grid.collection.data;

                // @todo sort on multiple columns
                // for now we only sort on 1 column at index 0
                var sort = this.grid.sort[0];
                if (sort) {

                    var property = sort.property;
                    var desc = sort.descending === true;

                    if (desc) {

                        data.sort(function (a, b) {

                            if (a[property] > b[property]) return -1;
                            if (a[property] < b[property]) return 1;

                            return 0;
                        });

                    } else {

                        data.sort(function (a, b) {

                            if (a[property] < b[property]) return -1;
                            if (a[property] > b[property]) return 1;

                            return 0;
                        });
                    }
                }

                var columns = this.grid.columns;
                var cols = [];

                for (var col in columns) {
                    if (columns.hasOwnProperty(col)) {
                        cols.push(col);
                    }
                }

                var c = csv.unparse({
                    fields: cols,
                    data: data
                }, {
                    header: true
                });

                var link = document.createElement("a");
                link.href = 'data:text/csv;charset=utf-8,' + escape(c);
                link.style = 'visibility:hidden';
                link.download = 'export.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            },
            renderXML: function () {

                var data = this.grid.collection.data;

                var x = this.json2xml(data);

                console.info(x);

            },
            json2xml: function (o, tab) {

                var toXml = function (v, name, ind) {

                    var xml = "";

                    if (v instanceof Array) {

                        for (var i = 0, n = v.length; i < n; i++) {
                            xml += ind + toXml(v[i], name, ind + "\t") + "\n";
                        }

                    } else if (typeof(v) == "object") {

                        var hasChild = false;

                        xml += ind + "<" + name;

                        for (var m in v) {

                            if (m.charAt(0) == "@") {

                                xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";

                            } else {

                                hasChild = true;
                            }
                        }

                        xml += hasChild ? ">" : "/>";

                        if (hasChild) {

                            for (var m in v) {

                                if (m == "#text") {

                                    xml += v[m];

                                } else if (m == "#cdata") {

                                    xml += "<![CDATA[" + v[m] + "]]>";

                                } else if (m.charAt(0) != "@") {

                                    xml += toXml(v[m], m, ind + "\t");
                                }
                            }

                            xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
                        }
                    } else {
                        xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
                    }

                    return xml;

                }, xml = "";
                for (var m in o)
                    xml += toXml(o[m], m, "");
                return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
            }
        });
    });
