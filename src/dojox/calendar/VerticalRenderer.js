define(['apps/shared/runtime', 'dojo/dom', "dojo/on", "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "./_RendererMixin", "dojo/text!./templates/VerticalRenderer.html"],

    function (runtime, dom, on, declare, _WidgetBase, _TemplatedMixin, _RendererMixin, template) {

        return declare("dojox.calendar.VerticalRenderer", [_WidgetBase, _TemplatedMixin, _RendererMixin], {

            // summary:
            //		The default item vertical renderer.

            templateString: template,

            postCreate: function () {
                this.inherited(arguments);
                this._applyAttributes();

                on(this.summaryLabel, 'click', function () {

                    runtime.pairing = true;
                    runtime.pairEvent = this.id;

                    // open the item tracker
                    dom.byId('item_tracker_menu').click();
                });
            },

            _isElementVisible: function (elt, startHidden, endHidden, size) {
                var d;

                switch (elt) {
                    case "startTimeLabel":
                        d = this.item.startTime;
                        if (this.item.allDay || this.owner.isStartOfDay(d)) {
                            return false;
                        }
                        break;
                    case "endTimeLabel":
                        d = this.item.endTime;
                        if (this.item.allDay || this.owner.isStartOfDay(d)) {
                            return false;
                        }
                        break;
                }
                return this.inherited(arguments);
            }

        });
    });
