

// })(jQuery, window, document);

"use strict";


var db = [
    {
        "text": "Inbox",
        "id": "inbox",
        "class": "node",
        "icon": "fa fa-inbox fa-fw",
        "nodes": [],
        "data-is-node": true
    },
    {
        "icon": "fa fa-archive fa-fw",
        "text": "Drafts",
        "nodes": [
            {
                "icon": "fa fa-inbox fa-fw",
                "text": "Customers",
                "nodes": [
                    {
                        "text": "Calendar",
                        "icon": "fa fa-calendar fa-fw",
                    }

                ]
            },
            {
                "icon": "fa fa-inbox fa-fw",
                "text": "Co-Workers"
            }
        ]
    },
    {
        "icon": "fa fa-calendar fa-fw",
        "text": "Calendar"
    },
    {
        "icon": "fa fa-address-book fa-fw",
        "text": "Contacts"
    },
    {
        "icon": "fa fa-trash fa-fw",
        "text": "Deleted Items"
    },
    {
        "icon": "fa fa-globe fa-fw",
        "text": "Go to Google",
        "class": "text-info",
        "href": "https://google.com"
    }
]
/**
 * Default bstreeview  options.
 */
var pluginName = "bstreeview",
    defaults = {
        data: db,
        // expandIcon: 'fa fa-angle-down fa-fw',
        // collapseIcon: 'fa fa-angle-right fa-fw',
        expandIcon: 'fa fa-minus fa-fw',
        collapseIcon: 'fa fa-plus fa-fw',
        indent: 1.25,
        parentsMarginLeft: '1.25rem',
        openNodeLinkOnNewTab: true
    };
/**
 * bstreeview HTML templates.
 */
var templates = {
    treeview: '<div class="bstreeview"></div>',
    treeviewItem: '<div role="treeitem" class="list-group-item" data-toggle="collapse"></div>',
    treeviewGroupItem: '<div role="group" class="list-group collapse" id="itemid"></div>',
    treeviewItemStateIcon: '<i class="state-icon"></i>',
    treeviewItemIcon: '<i class="item-icon"></i>'
};
/**
 * BsTreeview Plugin constructor.
 * @param {*} element 
 * @param {*} options 
 */
function bstreeView(element, options) {
    this.element = element;
    this.itemIdPrefix = element.id + "-item-";
    this.settings = $.extend({}, defaults, options);
    this.init();
}
/**
 * Avoid plugin conflict.
*/
$.extend(bstreeView.prototype, {
    /**
      * bstreeview intialize.
      */
    init: function () {
        this.tree = [];
        this.nodes = [];


        // Retrieve bstreeview Json Data.
        if (this.settings.data) {
            if (this.settings.data.isPrototypeOf(String)) {
                this.settings.data = $.parseJSON(this.settings.data);
            }
            this.tree = $.extend(true, [], this.settings.data);
            delete this.settings.data;
        }
        // Set main bstreeview class to element.
        $(this.element).addClass('bstreeview');



        this.initData({ nodes: this.tree });

        var _this = this;
        this.build($(this.element), this.tree, 0);
        // Update angle icon on collapse
        $(this.element).on('click', '.list-group-item', function (e) {
            const tree = {
                nodes: {
                    "text": "Calendar",
                    "icon": "fa fa-calendar fa-fw",
                },
                nodeId: 3
            }

            const ariaLevel = parseInt(e.currentTarget.attributes["aria-level"].nodeValue)
            // _this.build($(_this.element), tree, ariaLevel, e)

            _this.BuildChild($(_this.element), tree, ariaLevel)
            

            // console.log($(_this.element));
            // _this.BuildChild()






            $('.state-icon', this)
                .toggleClass(_this.settings.expandIcon)
                .toggleClass(_this.settings.collapseIcon);
            // navigate to href if present
            if (e.target.hasAttribute('href')) {
                if (_this.settings.openNodeLinkOnNewTab) {
                    window.open(e.target.getAttribute('href'), '_blank');
                }
                else {
                    window.location = e.target.getAttribute('href');
                }
            }
        });
    },
    /**
     * Initialize treeview Data.
     * @param {*} node 
     */
    initData: function (node) {
        if (!node.nodes) return;
        var parent = node;
        var _this = this;
        $.each(node.nodes, function checkStates(index, node) {
            node.nodeId = _this.nodes.length;
            node.parentId = parent.nodeId;
            _this.nodes.push(node);

            if (node.nodes) {
                _this.initData(node);
            }
        });
    },
    /**
     * Build treeview.
     * @param {*} parentElement 
     * @param {*} nodes 
     * @param {*} depth 
     */
    build: function (parentElement, nodes, depth, element) {
        // console.log(parentElement);
        // console.log(nodes);
        // console.log(depth);
        // console.log(element);
        var _this = this;
        // Calculate item padding.
        var leftPadding = _this.settings.parentsMarginLeft;

        if (depth > 0) {
            leftPadding = (_this.settings.indent + depth * _this.settings.indent).toString() + "rem;";
        }
        depth += 1;
        // Add each node and sub-nodes.
        $.each(nodes, function addNodes(id, node) {
            // Main node element.
            var treeItem = $(templates.treeviewItem)
                .attr('data-target', "#" + _this.itemIdPrefix + node.nodeId)
                .attr('style', 'padding-left:' + leftPadding)
                .attr('aria-level', depth);
            // Set Expand and Collapse icones.
            if (node.nodes) {
                var treeItemStateIcon = $(templates.treeviewItemStateIcon)
                    .addClass(_this.settings.collapseIcon);
                treeItem.append(treeItemStateIcon);
            }
            // set node icon if exist.
            if (node.icon) {
                var treeItemIcon = $(templates.treeviewItemIcon)
                    .addClass(node.icon);
                treeItem.append(treeItemIcon);
            }
            // Set node Text.
            treeItem.append(node.text);
            // Reset node href if present
            if (node.href) {
                treeItem.attr('href', node.href);
            }
            // Add class to node if present
            if (node.class) {
                treeItem.addClass(node.class);
            }
            // Add custom id to node if present
            if (node.id) {
                treeItem.attr('id', node.id);
            }
            // Attach node to parent.
            parentElement.append(treeItem);
            // Build child nodes.
            if (node.nodes) {
                // _this.BuildChild(parentElement, node, depth)
            }

            // if (node.nodes) {
            //     // Node group item.
            //     var treeGroup = $(templates.treeviewGroupItem)
            //         .attr('id', _this.itemIdPrefix + node.nodeId);
            //     parentElement.append(treeGroup);
            //     _this.build(treeGroup, node.nodes, depth);
            // }
        });
    },
    BuildChild: function (parentElement, node, depth) {
        console.log(parentElement);
        console.log(node);
        console.log(depth);
        var treeGroup = $(templates.treeviewGroupItem)
            .attr('id', this.itemIdPrefix + node.nodeId);
        parentElement.append(treeGroup);
        this.build(treeGroup, node.nodes, depth);

    }

});
// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations
$.fn[pluginName] = function (options) {

    return this.each(function () {
        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" +
                pluginName, new bstreeView(this, options));
        }
    });
};

$("#tree").bstreeview()

// $(async function () {
//     var json;
//     await axios.get('db.json')
//         .then(res => res.data)
//         .then(data => {
//             // console.log(data.main);
//             json = data.main
//             $('#tree').bstreeview({
//                 data: json,
//                 expandIcon: 'fa fa-minus fa-fw',
//                 collapseIcon: 'fa fa-plus fa-fw',
//                 indent: 1.25,
//                 parentsMarginLeft: '1.25rem',
//                 openNodeLinkOnNewTab: true,
//             });
//         })
// });

