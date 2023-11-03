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
 *   The projects screen.
 * </p>
 *
 * @module apps/Projects
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([
        // nls
        'dojo/i18n!../nls/i18n',

        // runtime util
        'apps/shared/runtime',
        'apps/shared/client',

        'dojo/dom',
        'dojo/dom-style',
        'dojo/dom-construct',
        'dojo/dom-class',
        'dojo/on',
        'dojo/query',
        'dojo/store/Observable',
        'dojo/_base/declare',
        'dijit/registry',

        'dijit/Menu',
        'dijit/MenuItem',
        'dijit/layout/ContentPane',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin',
        'dojo/text!./templates/ItemTracker.html',
        'dojox/mvc/getStateful',
        'dojox/mvc/getPlainValue',
        'dojox/mvc/ModelRefController',
        'dijit/tree/ObjectStoreModel',
        'dijit/Tree',
        'dijit/form/ValidationTextBox',
        'dijit/form/NumberSpinner',
        'dojox/mobile/Switch',
        'dojo/dnd/Source',
        'dojo/dnd/Target'],
    function (i18n, runtime, client, dom, domStyle, domConstruct, domClass, on, query, Observable, declare, registry, Menu, MenuItem, ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin, ItemTrackerTemplate, getStateful, getPlainValue, ModelRefController, ObjectStoreModel, Tree, ValidationTextBox, NumberSpinner, Switch) {

        return declare([ContentPane, _TemplatedMixin, _WidgetsInTemplateMixin], {

            /**
             *
             */
            i18n: i18n,

            /**
             *
             */
            templateString: ItemTrackerTemplate,

            /**
             *
             */
            closable: false,

            /**
             *
             */
            item: new ModelRefController({model: getStateful({})}),

            /**
             *
             */
            tree: null,

            /**
             *
             */
            onShow: function () {

                if (runtime.pairing === true) {
                    // show menu
                    query('#itemSelectionMenu').style('display', 'block');
                }
            },

            /**
             *
             */
            onHide: function () {

                runtime.pairing = false;
                runtime.pairEvent = null;
                query('#itemSelectionMenu').style('display', 'none');
            },

            /**
             *
             */
            postCreate: function () {

                var _self = this;

                // set events for color palette click
                var table = this.colorPalette;

                var cells = table.getElementsByTagName('td');

                for (var i = 0; i < cells.length; i++) {

                    cells[i].onclick = dojo.hitch(this, function (e) {

                        this.item.set('color', e.target.id);
                        this.projectColor.iconNode.className = 'dijitReset dijitInline dijitIcon dijitEditorIcon dijitEditorIconHiliteColor ' + e.target.id;

                        if (runtime.calendar) {
                            runtime.calendar.store.notify();
                        }
                    });
                }

                on(this.addTag, 'click', function () {

                    domClass.toggle(dom.byId('tagPalette'), 'invisible');
                });

                on(this.tagContainer, 'Drop', dojo.hitch(this, function (source, nodes, copy) {

                    // get dropped item
                    var dropped = dojo.byId(this.tagContainer.anchor.id);

                    // remove the tag classes for dnd
                    domClass.remove(dropped, 'dojoDndItem dojoDndItemAnchor');

                    // create json for storage
                    var tagType = dropped.children[1].attributes[1].value;
                    var tagKey = dropped.children[1].textContent;

                    var tags = this.item.get('tags');

                    switch (tagType) {

                        case 'string':
                            tags[tagKey] = 'Text';
                            break;

                        case 'number':
                            tags[tagKey] = 0;
                            break;

                        case 'boolean':
                            tags[tagKey] = true;
                            break;
                    }

                    this.item.set('tags', tags);

                    this.renderTags(tags);
                }));

                on(this.itemSelectionRemove, 'click', dojo.hitch(this, function () {

                    var searchId = runtime.pairEvent;
                    var event = runtime.calendar.store.get(searchId);

                    event.tracker = null;

                    runtime.calendar.store.put(event);

                    runtime.pairing = false;
                    runtime.pairEvent = null;

                    query('#itemSelectionMenu').style('display', 'none');
                    dom.byId('time_tracker_menu').click();
                }));

                // event/item selection menu ok clicked
                on(this.itemSelectionOK, 'click', dojo.hitch(this, function () {

                    if (!this.item.get('id')) {

                        runtime.message(i18n.itemTracker.selectMissing);
                        return;
                    }

                    var searchId = runtime.pairEvent;

                    var event = runtime.calendar.store.get(searchId);

                    event.tracker = this.item.get('id');

                    runtime.calendar.store.put(event);

                    runtime.pairing = false;
                    runtime.pairEvent = null;
                    query('#itemSelectionMenu').style('display', 'none');
                    dom.byId('time_tracker_menu').click();
                }));

                // event/item selection cancelled
                on(this.itemSelectionCancel, 'click', function () {

                    runtime.pairing = false;
                    runtime.pairEvent = null;
                    query('#itemSelectionMenu').style('display', 'none');
                    dom.byId('time_tracker_menu').click();
                });


                // monitor the tracker item data for changes
                this.item.watch(dojo.hitch(this, function (name, oldValue, value) {

                    if (!runtime.tree.selectedItems
                        || runtime.tree.selectedItems.length === 0) {
                        return;
                    }

                    var item = runtime.tree.selectedItem;

                    if (JSON.stringify(item[name]) !== JSON.stringify(value)) {

                        item[name] = value;

                        // make sure we only keep owned properties on the tags object
                        var oldTags = item.tags;
                        var newTags = {};

                        for (var tag in oldTags) {

                            if (oldTags.hasOwnProperty(tag)) {
                                newTags[tag] = oldTags[tag];
                            }
                        }

                        item.tags = newTags;

                        // color needs propagation
                        if (name === 'color') {

                            var descendants = runtime.tree.model.store.getDescendants(item.id);

                            for (var i = 0; i < descendants.length; i++) {

                                descendants[i].color = value;

                                runtime.tree.model.store.put(descendants[i]);
                            }
                        }

                        // check if project tags need updating
                        var isProject = runtime.tree.model.store.get(item.parent).type === 'tracker';

                        if (name === 'label'
                            && isProject === true) {

                            // check tag on project item itself
                            if (item.tags['project']) {
                                item.tags['project'] = value;
                                this.renderTags(item.tags);
                            }

                            // run down the tree to find any updateables
                            var descendants = runtime.tree.model.store.getDescendants(item.id);

                            for (var i = 0; i < descendants.length; i++) {

                                if (descendants[i].tags['project']) {

                                    descendants[i].tags['project'] = value;
                                    runtime.tree.model.store.put(descendants[i]);
                                }
                            }
                        }

                        runtime.tree.model.store.put(item);
                    }
                }));

                // @todo maybe fuill the store here and get rid of runtime.items
                // store as we cannot use it directly anyway
                var model = new ObjectStoreModel({
                    store: runtime.items,
                    query: {id: runtime.user.id},
                    mayHaveChildren: function (item) {

                        return this.store.hasChildren(item.id);
                    }
                });

                // custom HTML tree labels
                var MyTreeNode = declare(Tree._TreeNode, {
                    _setLabelAttr: {node: "labelNode", type: "innerHTML"}
                });

                runtime.tree = new Tree({
                    model: model,
                    _createTreeNode: function (args) {
                        return new MyTreeNode(args);
                    },
                    persist: true,
                    showRoot: true,
                    openOnDblClick: true,
                    onClick: dojo.hitch(this, function (item) {

                        this.loadView(item);
                    }),
                    onMouseDown: dojo.hitch(this, function (e) {

                        var widget = dijit.getEnclosingWidget(e.target);
                        var item = widget.item;

                        this.loadView(item);

                        var path = runtime.tree.model.store.getParentPath(widget.item.id);

                        runtime.tree.set('path', path);
                        runtime.tree.set('selectedItem', item);
                    }),
                    getIconClass: function (item) {

                        if (item.type === 'tracker') {

                            return 'icon-spent-time-small';
                        }

                        return 'icon-angle-right';
                    },
                    getLabel: function (item) {

                        return item.label;
                    }
                });

                // place and start the tree
                runtime.tree.dndController.singular = true;
                runtime.tree.placeAt(this.itemTrackerTree);
                runtime.tree.startup();

                var projectContextMenu = new Menu({
                    style: 'display: none',
                    targetNodeIds: [this.itemTrackerTree],
                    selector: '.tracker'
                });

                projectContextMenu.addChild(new MenuItem({
                    label: 'Add Project',
                    iconClass: 'fa fa-plus',
                    onClick: dojo.hitch(this, function () {

                        var parent = runtime.tree.selectedItem;

                        // parse tags
                        var tags = {};

                        for (var tag in parent.tags) {

                            if (parent.tags.hasOwnProperty(tag)) {
                                tags[tag] = parent.tags[tag];
                            }
                        }

                        var label = '[New Project]';

                        tags['project'] = label;

                        var item = {
                            label: label,
                            parent: parent.id,
                            description: '',
                            type: 'item',
                            view: 'project',
                            color: 'Calendar0',
                            tags: tags
                        };

                        runtime.tree.model.store.post({
                            data: item,
                            callback: dojo.hitch(this, function (result) {
                                this.loadView(result[0]);
                            })
                        });
                    })
                }));

                var localMenu = new Menu({
                    style: 'display: none',
                    targetNodeIds: [this.itemTrackerTree],
                    selector: '.item'
                });

                localMenu.addChild(new MenuItem({
                    label: 'Add',
                    iconClass: 'fa fa-plus',
                    onClick: dojo.hitch(this, function () {

                        var parent = runtime.tree.selectedItem;

                        // parse tags
                        var tags = {};

                        for (var tag in parent.tags) {

                            if (parent.tags.hasOwnProperty(tag)) {

                                tags[tag] = parent.tags[tag];
                            }
                        }

                        var item = {
                            label: '[New Item]',
                            parent: parent.id,
                            description: '',
                            type: 'item',
                            view: 'item',
                            color: parent.color,
                            tags: tags
                        };

                        runtime.tree.model.store.post({
                            data: item,
                            callback: dojo.hitch(this, function (result) {
                                this.loadView(result[0]);
                            })
                        });
                    })
                }));

                localMenu.addChild(new MenuItem({
                    label: 'Delete',
                    iconClass: 'fa fa-trash',
                    onClick: dojo.hitch(this, function () {

                        var item = runtime.tree.selectedItem;

                        // set parent selected
                        var parent = runtime.tree.model.store.get(item.parent);
                        this.loadView(parent);

                        // get all descendant item id's
                        var ids = runtime.tree.model.store.getDescendantIds(item.id);
                        ids.push(item.id);

                        // check if any of these id's are used in an event
                        client.send({
                            topic: 'event:hasTracker',
                            data: ids,
                            callback: function (result) {

                                if (result.length > 0) {

                                    runtime.message({
                                        level: 'error',
                                        message: 'Unable to delete',
                                        details: i18n.itemTracker.itemInUse,
                                        replace: {
                                            d1: result[0].startTime
                                        }
                                    });

                                } else {

                                    for (i = 0; i < ids.length; i++) {
                                        runtime.tree.model.store.remove(ids[i]);
                                    }
                                }
                            }
                        });
                    })
                }));

            },
            loadView: function (item) {

                runtime.tree.set('selectedItem', item);

                if (item.type === 'item') {

                    this.item.set('model', getStateful(item));
                    this.projectColor.iconNode.className = 'dijitReset dijitInline dijitIcon dijitEditorIcon dijitEditorIconHiliteColor ' + item.color;
                    this.renderTags(item.tags);
                }

                if (item.view === 'project') {

                    this.projectColor.set('disabled', false);

                } else {

                    this.projectColor.set('disabled', true);
                }

                // select view (tab)
                runtime.focus({
                    id: item.type
                }, true);
            },
            renderTags: function (tags) {

                var _self = this;

                // render the tags
                this.tagContainer.node.innerHTML = '';

                var _currentItem = this.item;

                // create sorted array out of the tag keys

                var tagArray = [];
                for (var t in tags) {

                    if (tags.hasOwnProperty(t)) {
                        tagArray.push(t);
                    }
                }

                tagArray.sort(function (a, b) {

                    if (a < b) return -1;
                    if (a > b) return 1;

                    return 0;
                });

                for (var i = 0; i < tagArray.length; i++) {

                    var tag = tagArray[i];

                    if (tags.hasOwnProperty(tag)) {

                        var div = domConstruct.create('div', {
                            className: 'tag'
                        }, this.tagContainer.node);

                        var remove = domConstruct.create('div', {
                            className: 'tagRemove',
                            innerHTML: '<span class="fa fa-times">'
                        }, div);

                        on(remove, 'click', function () {

                            // parent to remove
                            var p = this.parentNode;

                            // editor
                            var id = p.children[1].children[0].id;
                            var widget = registry.byId(id.replace('widget_', ''));
                            var key = widget.get('value');
                            var ts = _currentItem.get('tags');

                            delete ts[key];

                            _currentItem.set('tags', ts);

                            p.remove();
                        });

                        var type = typeof tags[tag];

                        var key = domConstruct.create('div', {
                            className: 'tagKey',
                            type: type
                        }, div);

                        var keyEditor = new ValidationTextBox({
                            value: tag
                        });

                        /**
                         * changing a tag key
                         */
                        on(keyEditor, 'blur', function () {

                            var newKey = this.get('value');
                            var oldKey = this._resetValue;

                            if (newKey !== oldKey) {

                                // make sure we only keep owned properties on the tags object
                                var tags = _currentItem.get('tags');
                                var newTags = {};

                                for (var tag in tags) {

                                    if (tags.hasOwnProperty(tag)) {
                                        newTags[tag] = tags[tag];
                                    }
                                }

                                // safekeeping
                                var value = newTags[oldKey];

                                delete newTags[oldKey];

                                newTags[newKey] = value;

                                _currentItem.set('tags', newTags);

                                _self.renderTags(newTags);
                            }
                        });

                        key.appendChild(keyEditor.domNode);

                        var tagEditor = domConstruct.create('div', {
                            className: 'tagEditor'
                        }, div);

                        var editor;

                        if (type === 'string') {

                            editor = new ValidationTextBox({
                                value: tags[tag],
                                key: tag
                            });
                        }

                        if (type === 'number') {

                            editor = new NumberSpinner({
                                value: tags[tag],
                                key: tag
                            });
                        }

                        if (type === 'boolean') {

                            editor = new Switch({
                                leftLabel: 'Yes',
                                rightLabel: 'No',
                                value: tags[tag] === true ? 'on' : 'off',
                                key: tag
                            });
                        }

                        if (type === 'string' || type === 'number') {

                            on(editor, 'blur', function () {

                                var newValue = this.get('value');
                                var oldValue = this._resetValue;
                                var key = this.key;

                                if (newValue !== oldValue) {

                                    var tags = _currentItem.get('tags');

                                    tags[key] = newValue;

                                    _currentItem.set('tags', tags);
                                }
                            });

                        } else {

                            on(editor, 'stateChanged', function () {

                                var newValue = this.get('value');
                                var key = this.key;
                                var tags = _currentItem.get('tags');

                                tags[key] = (newValue === 'on');

                                _currentItem.set('tags', tags);
                            });
                        }

                        tagEditor.appendChild(editor.domNode);
                    }
                }
            },
            /**
             *
             * @param args
             */
            hide: function (args) {

                var nodes = args || [];

                for (var i = 0; i < nodes.length; i++) {

                    domStyle.set(nodes[i], 'display', 'none');
                }
            },
            show: function (args) {

                var nodes = args || [];

                for (var i = 0; i < nodes.length; i++) {

                    domStyle.set(nodes[i], 'display', 'block');
                }
            }
        })
    });
