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
 *   The Feedback widget
 * </p>
 *
 * @module apps/Feedback
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([
        // nls
        'dojo/i18n!../nls/i18n',

        // shared
        // @todo refactor xhr to socket.io
        'apps/shared/xhr',
        'dojo/query',
        'apps/shared/runtime',
        'apps/shared/util/html2canvas',

        // dojo
        'dojo/on',
        'dojo/dom',
        'dojo/dom-class',
        'dojo/dnd/Moveable',
        'dojo/_base/declare',
        'dojo/text!./templates/Feedback.html',

        // dijit
        'dijit/layout/ContentPane',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin'],
    function (i18n, xhr, query, runtime, html2canvas, on, dom, domClass, Moveable, declare, FeedbackTemplate, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin) {

        return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: FeedbackTemplate,
            closable: false,
            i18n: i18n,
            screenshot: null,
            constructor: function (args) {


            },
            postCreate: function () {

                /**
                 *
                 */
                on(dom.byId('send-message'), 'click', dojo.hitch(this, function () {

                    this.send();
                }));

                /**
                 * Cancel sending of message
                 */
                on(dom.byId('trash-message'), 'click', dojo.hitch(this, function () {

                    // make dialog invisible
                    domClass.add('feedback-send', 'invisible');

                    // delete screenshot
                    this.screenshot = null;

                    // clear message text
                    dijit.byId('feedback-message').set('value', '');
                }));


                var uploader = dom.byId('upload_file');

                uploader.onchange = function (e) {

                    e.preventDefault();

                    var file = uploader.files[0];
                    var reader = new FileReader();

                    reader.onload = dojo.hitch(this, function (event) {

                        domClass.remove('feedback-image');
                        dom.byId('feedback-image').src = event.target.result;
                        query('.fileUpload').style('display', 'none');
                    });

                    reader.readAsDataURL(file);

                    return false;
                };

                /**
                 *
                 */
                on(dom.byId('draw-free'), 'click', function () {

                    domClass.add('screenshot', 'pencil');

                    var el = dom.byId('screenshot-canvas');
                    var ctx = el.getContext('2d');
                    var isDrawing;

                    el.onmousedown = function (e) {
                        isDrawing = true;
                        ctx.moveTo(e.clientX, e.clientY);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#d32f2f';
                        el.style.border = 'unset';
                    };

                    el.onmousemove = function (e) {
                        if (isDrawing) {
                            ctx.lineTo(e.clientX, e.clientY);
                            ctx.stroke();
                        }
                    };

                    el.onmouseup = function () {
                        isDrawing = false;
                    };
                });

                on(dom.byId('draw-trash'), 'click', function () {

                    var s = dom.byId('screenshot');
                    s.removeChild(s.firstChild);

                    domClass.remove('screenshot');
                    domClass.add('drawing-toolbar', 'invisible');
                });


                on(dom.byId('draw-ready'), 'click', dojo.hitch(this, function () {

                    /**
                     * Capture the created screenshot
                     */
                    var el = dom.byId('screenshot-canvas');
                    this.screenshot = el.toDataURL();

                    /**
                     * remove canvas
                     */
                    var s = dom.byId('screenshot');
                    s.removeChild(s.firstChild);
                    domClass.remove('screenshot');

                    /**
                     * hide screenshot toolbar
                     */
                    domClass.add('drawing-toolbar', 'invisible');

                    /**
                     *
                     * open up the comment dialog
                     * show screenshot preview
                     */
                    this.dialog({
                        attachment: true
                    });

                }));

                /**
                 * User wants to draw on screenshot
                 */
                on(dom.byId('feedback-draw'), 'click', function () {

                    document.body.style.cursor = 'progress';

                    /**
                     * create the screenshot
                     */
                    html2canvas(document.body, {


                        letterRendering: true,

                        /**
                         * When rendered add it to the canvas
                         * @param canvas
                         */
                        onrendered: dojo.hitch(this, function (canvas) {

                            canvas.id = 'screenshot-canvas';

                            /**
                             * set screenshot
                             */
                            dom.byId('screenshot').appendChild(canvas);

                            domClass.remove('screenshot');
                            domClass.add('screenshot', 'fullscreen');

                            /**
                             * Make sure the screenshot stays fullscreen
                             */
                            window.addEventListener('resize', function () {

                                canvas.width = window.innerWidth;
                                canvas.height = window.innerHeight;

                            }, false);


                            /**
                             * screenshot set fullscreen, now show the toolbar
                             */
                            domClass.remove('drawing-toolbar');

                            /**
                             * Make the toolbar moveable
                             */
                            new Moveable(dom.byId('drawing-toolbar'));


                            document.body.style.cursor = 'default';

                        })

                    });

                });

                on(dom.byId('feedback-comment'), 'click', dojo.hitch(this, function () {

                    this.dialog();

                }));

            },
            dialog: function (options) {

                // show send dialog
                domClass.remove('feedback-send');

                // set the screenshot as thumbnail if available
                if (options && options.attachment) {

                    domClass.remove('feedback-image');
                    dom.byId('feedback-image').src = this.screenshot;
                    query('.fileUpload').style('display', 'none');

                } else {

                    domClass.add('feedback-image', 'invisible');
                    query('.fileUpload').style('display', 'block');
                }

            },
            send: function () {

                var _navigator = {};
                for (var n in navigator) {

                    _navigator[n] = navigator[n];
                }

                delete _navigator.mimeTypes;
                delete _navigator.plugins;

                var _screen = {};
                for (var s in screen) {

                    _screen[s] = screen[s];
                }

                var offset = -(new Date().getTimezoneOffset() / 60);

                xhr.post({
                    url: '/_api/feedback',
                    data: {
                        image: dom.byId('feedback-image').src,
                        date: new Date(),
                        timezoneOffset: offset,
                        navigator: _navigator,
                        screen: _screen,
                        performance: performance.timing,
                        message: dijit.byId('feedback-message').get('value')
                    },
                    success: dojo.hitch(this, function (result) {

                        runtime.message('Thank you for your feedback. It\'s very much appreciated! We will contact you if we need to follow-up on your input');

                        // make dialog invisible
                        domClass.add('feedback-send', 'invisible');

                        // delete screenshot
                        this.screenshot = null;

                        // clear message text
                        dijit.byId('feedback-message').set('value', '');

                    }),
                    error: function (err) {

                        console.info(err);

                    }
                })
            }
        });
    }
);
