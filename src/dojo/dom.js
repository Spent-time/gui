define(["./sniff", "./_base/window", "./_base/kernel"],
    function (has, win, kernel) {
        // module:
        //		dojo/dom

        // FIXME: need to add unit tests for all the semi-public methods

        if (has("ie") <= 7) {
            try {
                document.execCommand("BackgroundImageCache", false, true);
            } catch (e) {
                // sane browsers don't have cache "issues"
            }
        }

        // =============================
        // DOM Functions
        // =============================

        // the result object
        var dom = {
            // summary:
            //		This module defines the core dojo DOM API.
        };

        if (has("ie")) {
            dom.byId = function (id, doc) {
                if (typeof id != "string") {
                    return id;
                }
                var _d = doc || win.doc, te = id && _d.getElementById(id);
                // attributes.id.value is better than just id in case the
                // user has a name=id inside a form
                if (te && (te.attributes.id.value == id || te.id == id)) {
                    return te;
                } else {
                    var eles = _d.all[id];
                    if (!eles || eles.nodeName) {
                        eles = [eles];
                    }
                    // if more than 1, choose first with the correct id
                    var i = 0;
                    while ((te = eles[i++])) {
                        if ((te.attributes && te.attributes.id && te.attributes.id.value == id) || te.id == id) {
                            return te;
                        }
                    }
                }
            };
        } else {
            dom.byId = function (id, doc) {
                // inline'd type check.
                // be sure to return null per documentation, to match IE branch.
                return ((typeof id == "string") ? (doc || win.doc).getElementById(id) : id) || null; // DOMNode
            };
        }
        /*=====
         dom.byId = function(id, doc){
         // summary:
         //		Returns DOM node with matching `id` attribute or falsy value (ex: null or undefined)
         //		if not found.  If `id` is a DomNode, this function is a no-op.
         //
         // id: String|DOMNode
         //		A string to match an HTML id attribute or a reference to a DOM Node
         //
         // doc: Document?
         //		Document to work in. Defaults to the current value of
         //		dojo/_base/window.doc.  Can be used to retrieve
         //		node references from other documents.
         //
         // example:
         //		Look up a node by ID:
         //	|	require(["dojo/dom"], function(dom){
         //	|		var n = dom.byId("foo");
         //	|	});
         //
         // example:
         //		Check if a node exists, and use it.
         //	|	require(["dojo/dom"], function(dom){
         //	|		var n = dom.byId("bar");
         //	|		if(n){ doStuff() ... }
         //	|	});
         //
         // example:
         //		Allow string or DomNode references to be passed to a custom function:
         //	|	require(["dojo/dom"], function(dom){
         //	|		var foo = function(nodeOrId){
         //	|			nodeOrId = dom.byId(nodeOrId);
         //	|			// ... more stuff
         //	|		}
         //	|	});
         };
         =====*/

        // Test for DOMNode.contains() method, available everywhere except FF8-
        // and IE8-, where it's available in general, but not on document itself,
        // and also problems when either ancestor or node are text nodes.

        var doc = kernel.global["document"] || null;
        has.add("dom-contains", !!(doc && doc.contains));
        dom.isDescendant = has("dom-contains") ?
            // FF9+, IE9+, webkit, opera, iOS, Android, Edge, etc.
            function (/*DOMNode|String*/ node, /*DOMNode|String*/ ancestor) {

                // martijn: fix for TypeError: Value does not implement interface Node
                // only happens with tree nodes that i have seen
                if (node
                    && node.baseClass
                    && node.baseClass === 'dijitTreeNode') {

                    node = node.domNode;
                }

                return !!( (ancestor = dom.byId(ancestor)) && ancestor.contains(dom.byId(node)) );
            } :
            function (/*DOMNode|String*/ node, /*DOMNode|String*/ ancestor) {
                // summary:
                //		Returns true if node is a descendant of ancestor
                // node: DOMNode|String
                //		string id or node reference to test
                // ancestor: DOMNode|String
                //		string id or node reference of potential parent to test against
                //
                // example:
                //		Test is node id="bar" is a descendant of node id="foo"
                //	|	require(["dojo/dom"], function(dom){
                //	|		if(dom.isDescendant("bar", "foo")){ ... }
                //	|	});

                try {
                    node = dom.byId(node);
                    ancestor = dom.byId(ancestor);
                    while (node) {
                        if (node == ancestor) {
                            return true; // Boolean
                        }
                        node = node.parentNode;
                    }
                } catch (e) { /* squelch, return false */
                }
                return false; // Boolean
            };

        // TODO: do we need setSelectable in the base?

        // Add feature test for user-select CSS property
        // (currently known to work in all but IE < 10 and Opera)
        // TODO: The user-select CSS property as of May 2014 is no longer part of
        // any CSS specification. In IE, -ms-user-select does not do the same thing
        // as the unselectable attribute on elements; namely, dijit Editor buttons
        // do not properly prevent the content of the editable content frame from
        // unblurring. As a result, the -ms- prefixed version is omitted here.
        has.add("css-user-select", function (global, doc, element) {
            // Avoid exception when dom.js is loaded in non-browser environments
            if (!element) {
                return false;
            }

            var style = element.style;
            var prefixes = ["Khtml", "O", "Moz", "Webkit"],
                i = prefixes.length,
                name = "userSelect",
                prefix;

            // Iterate prefixes from most to least likely
            do {
                if (typeof style[name] !== "undefined") {
                    // Supported; return property name
                    return name;
                }
            } while (i-- && (name = prefixes[i] + "UserSelect"));

            // Not supported if we didn't return before now
            return false;
        });

        /*=====
         dom.setSelectable = function(node, selectable){
         // summary:
         //		Enable or disable selection on a node
         // node: DOMNode|String
         //		id or reference to node
         // selectable: Boolean
         //		state to put the node in. false indicates unselectable, true
         //		allows selection.
         // example:
         //		Make the node id="bar" unselectable
         //	|	require(["dojo/dom"], function(dom){
         //	|		dom.setSelectable("bar");
         //	|	});
         // example:
         //		Make the node id="bar" selectable
         //	|	require(["dojo/dom"], function(dom){
         //	|		dom.setSelectable("bar", true);
         //	|	});
         };
         =====*/

        var cssUserSelect = has("css-user-select");
        dom.setSelectable = cssUserSelect ? function (node, selectable) {
            // css-user-select returns a (possibly vendor-prefixed) CSS property name
            dom.byId(node).style[cssUserSelect] = selectable ? "" : "none";
        } : function (node, selectable) {
            node = dom.byId(node);

            // (IE < 10 / Opera) Fall back to setting/removing the
            // unselectable attribute on the element and all its children
            var nodes = node.getElementsByTagName("*"),
                i = nodes.length;

            if (selectable) {
                node.removeAttribute("unselectable");
                while (i--) {
                    nodes[i].removeAttribute("unselectable");
                }
            } else {
                node.setAttribute("unselectable", "on");
                while (i--) {
                    nodes[i].setAttribute("unselectable", "on");
                }
            }
        };

        return dom;
    });
