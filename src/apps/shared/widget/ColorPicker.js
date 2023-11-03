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
 *   The guided tour trough the app
 * </p>
 *
 * @module apps/Tour
 * @since 1.0
 *
 * @author martijn <martijn@spent-time.com>
 * @copyright Cloud Coders Intl BV
 */
define([

        // dojo
        'dojo/on',
        'dojo/dom',
        'dojo/query',
        'dojo/dom-class',
        'dojo/_base/declare',
        'dojo/text!./templates/ColorPicker.html',

        // dijit
        'dijit/_WidgetBase',
        'dijit/_TemplatedMixin',
        'dijit/_WidgetsInTemplateMixin'],
    function (on, dom, query, domClass, declare, ColorPickerTemplate, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin) {

        return declare('apps.shared.widget.ColorPicker', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: ColorPickerTemplate,
            constructor: function (args) {
                this.inherited(arguments);
            },
            postCreate: function () {
                this.inherited(arguments);

                // set events for color palette click
                var table = this.colorPalette;

                var cells = table.getElementsByTagName('td');

                for (var i = 0; i < cells.length; i++) {

                    cells[i].onclick = dojo.hitch(this, function (e) {

                        this.colorPickerDropDown.set('value', e.target.title);
                        this.colorPickerDropDown.onChange(e.target.title);
                        this.colorPickerDropDown.iconNode.className = 'dijitReset dijitInline dijitIcon dijitEditorIcon dijitEditorIconHiliteColor ' + e.target.title;
                    });
                }
            }
        });
    }
);
