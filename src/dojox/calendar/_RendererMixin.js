define([
        'apps/shared/runtime',
        'apps/shared/moment',
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/Stateful"],

    function (runtime, moment, declare, lang, domStyle, domClass, Stateful) {

        return declare("dojox.calendar._RendererMixin", Stateful, {

            // summary:
            //		This class is the base class of calendar renderers.

            // item: Object
            //		The layout item displayed by this renderer.
            item: null,

            // owner: dojox/calendar/_ViewBase
            //		The view that contains this renderer.
            owner: null,

            // edited: Boolean
            //		Indicates that the item displayed by this renderer is in editing mode.
            edited: false,

            // focused: Boolean
            //		Indicates that the item displayed by this renderer is focused.
            focused: false,

            // hovered: Boolean
            //		Indicates that the item displayed by this renderer is hovered.
            hovered: false,

            // selected: Boolean
            //		Indicates that the item displayed by this renderer is selected.
            selected: false,

            // storeState: Boolean
            //		Indicates that the item displayed by this renderer is not in the store, being saved to the store or in the store.
            storeState: false,

            // moveEnabled: Boolean
            //		Whether the event displayed by this renderer can be moved.
            moveEnabled: true,

            // resizeEnabled: Boolean
            //		Whether the event displayed by this renderer can be resized.
            resizeEnabled: true,

            _orientation: "vertical",
            _displayValue: "block",

            _displayValueMap: {},

            visibilityLimits: {
                resizeStartHandle: 50,
                resizeEndHandle: -1,
                summaryLabel: 15,
                startTimeLabel: 45,
                endTimeLabel: 50
            },

            _setSelectedAttr: function (value) {
                this._setState("selected", value, "Selected");
            },

            _setFocusedAttr: function (value) {
                this._setState("focused", value, "Focused");
            },

            _setEditedAttr: function (value) {
                this._setState("edited", value, "Edited");
            },

            _setHoveredAttr: function (value) {
                this._setState("hovered", value, "Hovered");
            },

            _setStoreStateAttr: function (value) {
                var cssClass = null;
                switch (value) {
                    case "storing":
                        cssClass = "Storing";
                        break;
                    case "unstored":
                        cssClass = "Unstored";
                        break;
                    default:
                        cssClass = null;
                }
                var tn = this.stateNode || this.domNode;
                domClass.remove(tn, "Storing");
                domClass.remove(tn, "Unstored");

                this._set("storeState", value);

                if (cssClass != null) {
                    domClass.add(tn, cssClass);
                }
            },

            _setState: function (prop, value, cssClass) {
                if (this[prop] != value) {
                    var tn = this.stateNode || this.domNode;
                    domClass[value ? "add" : "remove"](tn, cssClass);
                    this._set(prop, value);
                }
            },

            _setItemAttr: function (value) {
                if (value == null) {
                    if (this.item && this.item.cssClass) {
                        domClass.remove(this.domNode, this.item.cssClass);
                    }
                    this.item = null;
                } else {
                    if (this.item != null) {
                        if (this.item.cssClass != value.cssClass) {
                            if (this.item.cssClass) {
                                domClass.remove(this.domNode, this.item.cssClass);
                            }
                        }
                        this.item = lang.mixin(this.item, value);
                        if (value.cssClass) {
                            domClass.add(this.domNode, value.cssClass);
                        }
                    } else {
                        this.item = value;
                        if (value.cssClass) {
                            domClass.add(this.domNode, value.cssClass);
                        }
                    }
                }
            },

            _setText: function (node, text, allowHTML) {
                // summary:
                //		Set the text to the specified node.
                // node: Node
                //		The parent node.
                // text: String
                //		The text to display.
                // allowHTML: Boolean
                //		Whether text is containing HTML formatting.
                // tags:
                //		protected

                if (this.owner) {
                    this.owner._setText(node, text, allowHTML);
                }
            },

            _isElementVisible: function (elt, startHidden, endHidden, size) {
                // summary:
                //		Determine whether the item renderer sub element is visible or not.
                // elt: String
                //		The element node.
                // startHidden: Boolean
                //		Indicates that the start of time interval displayed by this item renderer is not the start of the displayed event.
                // endHidden: Boolean
                //		Indicates that the end of time interval displayed by this item renderer is not the end of the displayed event.
                // size: Integer
                //		The size of the item renderer on the time axis.
                // tags:
                //		protected
                var visible;
                var limit = this.visibilityLimits[elt];

                switch (elt) {
                    case "moveHandle":
                        visible = this.moveEnabled;
                        break;
                    case "resizeStartHandle":
                        if (this.mobile) {
                            visible = this.resizeEnabled && !startHidden && this.edited && (limit == -1 || size > limit);
                        } else {
                            visible = this.resizeEnabled && !startHidden && (limit == -1 || size > limit);
                        }
                        break;
                    case "resizeEndHandle":
                        if (this.mobile) {
                            visible = this.resizeEnabled && !endHidden && this.edited && (limit == -1 || size > limit);
                        } else {
                            visible = this.resizeEnabled && !endHidden && (limit == -1 || size > limit);
                        }
                        break;
                    case "startTimeLabel":
                        if (this.mobile) {
                            visible = !startHidden && (!this.edited || this.edited && (limit == -1 || size > limit));
                        } else {
                            visible = !startHidden && (limit == -1 || size > limit);
                        }
                        break;
                    case "endTimeLabel":

                        visible = this.edited && !endHidden && (limit == -1 || size > limit);

                        break;
                    case "summaryLabel":
                        if (this.mobile) {
                            visible = !this.edited || this.edited && (limit == -1 || size > limit);
                        } else {
                            visible = limit == -1 || size > limit;
                        }
                        break;
                }

                return visible;
            },

            _formatTime: function (rd, d) {
                // summary:
                //		Returns the time formatted string.
                // rd: Object
                //		The render data.
                // d: Date
                //		The time to format.
                // tags:
                //		protected
                if (this.owner) {
                    var f = this.owner.get("formatItemTimeFunc");
                    if (f != null && typeof f === "function") {
                        return f(d, rd, this.owner, this.item);
                    }
                }
                return rd.dateLocaleModule.format(d, {selector: 'time'});
            },

            getDisplayValue: function (part) {
                return this._displayValue;
            },

            updateRendering: function (w, h) {
                // summary:
                //		Updates the visual appearance of the renderer according the new values of the properties and the new size of the component.
                // w: Number?
                //		The width in pixels of the renderer.
                // h: Number?
                //		The height in pixels of the renderer.

                h = h || this.item.h;
                w = w || this.item.w;

                if (!h && !w) {
                    return;
                }

                this.item.h = h;
                this.item.w = w;

                var size = this._orientation == "vertical" ? h : w;

                var rd = this.owner.renderData;

                var startHidden = rd.dateModule.compare(this.item.range[0], this.item.startTime) != 0;
                var endHidden = rd.dateModule.compare(this.item.range[1], this.item.endTime) != 0;

                var visible;

                if (this.beforeIcon != null) {
                    visible = this._orientation != "horizontal" || this.isLeftToRight() ? startHidden : endHidden;
                    domStyle.set(this.beforeIcon, "display", visible ? this.getDisplayValue("beforeIcon") : "none");
                }

                if (this.afterIcon != null) {
                    visible = this._orientation != "horizontal" || this.isLeftToRight() ? endHidden : startHidden;
                    domStyle.set(this.afterIcon, "display", visible ? this.getDisplayValue("afterIcon") : "none");
                }

                if (this.moveHandle) {
                    visible = this._isElementVisible("moveHandle", startHidden, endHidden, size);
                    domStyle.set(this.moveHandle, "display", visible ? this.getDisplayValue("moveHandle") : "none");
                }

                if (this.resizeStartHandle) {
                    visible = this._isElementVisible("resizeStartHandle", startHidden, endHidden, size);
                    domStyle.set(this.resizeStartHandle, "display", visible ? this.getDisplayValue("resizeStartHandle") : "none");
                }

                if (this.resizeEndHandle) {
                    visible = this._isElementVisible("resizeEndHandle", startHidden, endHidden, size);
                    domStyle.set(this.resizeEndHandle, "display", visible ? this.getDisplayValue("resizeEndHandle") : "none");
                }

                if (this.startTimeLabel) {

                    domStyle.set(this.startTimeLabel, "display", visible ? this.getDisplayValue("startTimeLabel") : "none");
                    this._setText(this.startTimeLabel, this._formatTime(rd, this.item.startTime) + ' - ' + this._formatTime(rd, this.item.endTime));
                }

                // calculate duration
                var a = moment(this.item.startTime);
                var b = moment(this.item.endTime);

                var diff = b.diff(a) / 1000 / 60;
                var minutes = Math.floor(diff % 60);
                diff = diff / 60;
                var hours = Math.floor(diff % 24);

                if (this.endTimeLabel) {

                    var days = Math.floor(diff / 24);
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

                    this._setText(this.endTimeLabel, label);
                }

                if (this._orientation === 'vertical') {

                    if (this.summaryLabel) {

                        if (hours === 0) {

                            if (minutes <= 25) {

                                domStyle.set(this.summaryLabel, {
                                    position: "absolute",
                                    top: "2px",
                                    left: "2px"
                                });

                                domStyle.set(this.startTimeLabel, "display", "none");
                                domStyle.set(this.endTimeLabel, "display", "none");

                            } else if (minutes <= 35) {

                                domStyle.set(this.summaryLabel, {
                                    position: "absolute",
                                    top: "23px",
                                    paddingRight: "30px"
                                });

                                domStyle.set(this.endTimeLabel, "display", "none");

                            } else {

                                domStyle.set(this.summaryLabel, {
                                    position: "",
                                    top: "",
                                    paddingRight: "5px"
                                });

                                domStyle.set(this.endTimeLabel, "display", "block");
                            }

                        } else {

                            domStyle.set(this.summaryLabel, {
                                position: "",
                                top: "",
                                paddingRight: "5px"
                            });

                            domStyle.set(this.endTimeLabel, "display", "block");
                        }

                        var summary = 'select item';

                        if (this.item._item.tracker) {

                            var tracker = runtime.items.query({
                                id: this.item._item.tracker
                            })[0];

                            if (!tracker) {
                                summary = 'Deleted item?'
                            } else {
                                summary = tracker.label;
                            }
                        }

                        this.summaryLabel.id = this.item.id;

                        this._setText(this.summaryLabel, summary, true);
                    }

                    visible = this._isElementVisible("summaryLabel", startHidden, endHidden, size);
                    domStyle.set(this.summaryLabel, "display", visible ? this.getDisplayValue("summaryLabel") : "none");
                    if (visible) {
                        this._setText(this.summaryLabel, this.item.summary, true);
                    }
                }
            }
        });
    });
