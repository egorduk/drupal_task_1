/* create a new instance of the Marionette app */

var app = new Backbone.Marionette.Application();
var ModalRegion = Backbone.Marionette.Region.extend({
    el: "#modal",
    constructor: function(){
        //_.bindAll(this);
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("show", this.showModal, this);
    },
    getEl: function(selector){
        var $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
    },
    showModal: function(view){
        view.on("close", this.hideModal, this);
        this.$el.modal('show');
    },
    hideModal: function(){
        this.$el.modal('hide');
    }
});

app.addRegions({
    menuRegion: '#menu',
    contentRegion: '#content1',
    //modal: ModalRegion
});
/*Backbone.sync = function(method, model) {
    alert(method + ": " + JSON.stringify(model));
    model.set('id', 1);
};*/
app.MenuView = Backbone.Marionette.View.extend({
    el: "#menu",
    events: {
        'click #menu .js-menu-main': 'showMainPage',
        'click #menu .js-menu-feeds': 'showFeedsPage',
        'click #menu .js-menu-exit': 'exit'
    },
    showMainPage: function(e) {
        e.preventDefault();
        //alert('main');
        app.LibraryApp.search();
    },
    showFeedsPage: function(e) {
        e.preventDefault();
        //alert('feeds');
        app.Closer.close();
    },
    exit: function(e) {
        window.location.href = "http://localhost/drupal_task_1/user/test";
    }
});
app.NoticeView = Marionette.ItemView.extend({
    template: "#notice-item",
    notice: '',
    type: '',
    events: {
        'click': 'closeNotice'
    },
    setNotice: function(notice, type) {
        this.notice = notice;
        this.type = type;
    },
    onRender: function() {
        this.$el.addClass(this.type);
        this.$el.html(this.notice);
    },
    closeNotice: function() {
        this.$el.empty();
    }
});
app.vent.on("layout:rendered", function(){
    console.log("layout:rendered");
    var menu = new app.MenuView();
    app.menuRegion.attachView(menu);
});
app.vent.on("routing:started", function(){
    console.log("routing:started");
    if (!Backbone.History.started) {
        Backbone.history.start();
    }
});

//app.module('App', function(module, App, Backbone, Marionette, $, _){
//    var socialCollection;
//    /*Backbone.sync = function(method, model) {
//        console.log(method + ": " + model.url);
//    };*/
//    /* definition for book model, with default example of data structure */
//    module.SocialModel = Backbone.Model.extend({
//        defaults: {
//            title: '',
//            authorFirst: '',
//            authorLast: ''
//        },
//        url: '/drupal_task_1/notes/social/get_socials.json'
//    });
//    /* definition for book collection */
//    module.socialCollection = Backbone.Collection.extend({
//        /* set model type used for this collection */
//        model: module.SocialModel,
//        /* comparator determines how collection is sorted */
//        //comparator: 'authorLast',
//        url: '/drupal_task_1/notes/social/get_socials.json'
//        /*parse: function (response) {
//            console.log(response);
//            return response;
//        }*/
//       /* toJSON: function () {
//            return _.clone(this.attributes.response);
//        }*/
//    });
//    module.SocialModel = Backbone.Model.extend({
//        defaults: {}
//    });
//    module.SocialCollection = Backbone.Collection.extend({
//        model: module.SocialModel
//    });
//    var socialItemView = module.socialItemView = Marionette.ItemView.extend({
//        tagName: 'tr',
//        template: '#item-template',
//        //initialize: function(){ console.log('socialItemView: initialize >>> ' + this.model.get('name')) },
//        initialize: function(){ console.log('socialItemView: initialize') },
//        onRender: function(){ console.log('socialItemView: onRender') },
//        onShow: function(){ console.log('socialItemView: onShow') }
//    });
//    module.socialCollectionView = Marionette.CollectionView.extend({
//        tagName: 'table',
//        childView: socialItemView,
//        //childViewContainer: "tbody",
//        //template: '#layout-template',
//        initialize: function(){ console.log('socialCollectionView: initialize') },
//        onRender: function(){ console.log('socialCollectionView: onRender') },
//        onShow: function(){ console.log('socialCollectionView: onShow') }
//    });
//    /* define a view; in this case a 'LayoutView' (formerly 'Layout') */
//    module.AppLayoutView = Marionette.LayoutView.extend({
//        /* the auto-generated element which contains this view */
//        tagName: 'div',
//        /* id attribute for the auto-generated container element */
//        id: 'AppContainer',
//        template: '#layout-template',
//        ui: {
//            'navHome' : '#nav-home',
//            'navInfo' : '#nav-info'
//        },
//        /* define the regions within this layout, into which we will load additional views */
//        /*regions: {
//            'RegionOne' : '#regionOne'
//        },*/
//        initialize: function() {
//            console.log('Main layout: initialize');
//            //this.initRouter();
//        },
//        /* called when view renders in the DOM. This is a good place to
//         add nested views, because the views need existing DOM elements
//         into which to be rendered. */
//        onRender: function() {
//            console.log('Main layout: onRender');
//            /*if (!Backbone.History.started) {
//                Backbone.history.start();
//            }*/
//           // console.log('data = ' + socialCollection);
//            //var socialCollectionView = new module.socialCollectionView({collection: socialCollection});
//            //this.RegionOne.show(socialCollectionView);
//        },
//        /* called when the view displays in the UI */
//        onShow: function() {
//            console.log('Main layout: onShow');
//        },
//    });
//
//    var GridRow = Backbone.Marionette.ItemView.extend({
//        template: "#item-template",
//        tagName: "tr",
//        className: 'grid-row',
//        onRender: function(a){
//            var statusCell = this.$el.find("td").eq(1);
//            //console.log(status.text());
//            if (statusCell.text() == '0') {
//                statusCell.html('<span class="status-false"></span><a href="">Sync</a>');
//            } else {
//                statusCell.html('<span class="status-true"></span><a href="">Delete</a>');
//            }
//            console.log('GridRow: onRender')
//        }
//    });
//    var GridView = Backbone.Marionette.CompositeView.extend({
//        tagName: "table",
//        template: "#layout-template",
//        childView: GridRow,
//        childViewContainer: "tbody",
//        className: 'grid-view',
//        ui: {
//            'navHome' : '#nav-home',
//            'navInfo' : '#nav-info'
//        },
//        initialize: function(){
//            this.initRouter();
//            console.log('GridView: initialize')
//        },
//        onRender: function(){
//            //console.log(this.$el);
//            console.log('GridView: onRender');
//            if (!Backbone.History.started) {
//                Backbone.history.start();
//            }
//        },
//        onShow: function(){ console.log('GridView: onShow') },
//        /*appendHtml: function(collectionView, itemView){
//            console.log(itemView);
//            collectionView.$("tbody").append(itemView.el);
//        }*/
//    });
//
//    module.HomeLayoutView = Marionette.LayoutView.extend({
//        tagName: 'div',
//        id: 'HomeLayoutView',
//        className: 'contentLayout',
//        template: '#template-HomeLayoutView'
//    });
//    module.InfoLayoutView = Marionette.LayoutView.extend({
//        tagName: 'div',
//        id: 'InfoLayoutView',
//        className: 'contentLayout',
//        template: '#template-InfoLayoutView'
//    });
//
//    module.addInitializer(function(){
//        socialCollection = new module.socialCollection();
//        socialCollection.fetch({}).fail(function(){}).done(function(a) {
//            //console.log(a);
//            /* create a new instance of the layout from the module */
//            var layout = new module.AppLayoutView();
//            /* display the layout in the region defined at the top of this file */
//            //app.appRegion.show(layout);
//            /*var gridView = new GridView({
//                collection: socialCollection
//            });*/
//            //gridView.render();
//            //$("#grid").html(gridView.el);
//            //app.appRegion.show(gridView);
//        });
//    });
//});
