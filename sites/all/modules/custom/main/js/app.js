/* create a new instance of the Marionette app */

var app = new Backbone.Marionette.Application();
/* add the initial region which will contain the app */
app.addRegions({
    /* reference to container element in the HTML file */
    menuRegion: '#menu',
    appRegion: '#content'
});
/* define a module to keep the code modular */
app.module('App', function(module, App, Backbone, Marionette, $, _){
    var socialCollection;
    /*Backbone.sync = function(method, model) {
        console.log(method + ": " + model.url);
    };*/
    /* definition for book model, with default example of data structure */
    module.SocialModel = Backbone.Model.extend({
        defaults: {
            title: '',
            authorFirst: '',
            authorLast: ''
        },
        url: '/drupal_task_1/notes/social/get_socials.json'
    });
    /* definition for book collection */
    module.socialCollection = Backbone.Collection.extend({
        /* set model type used for this collection */
        model: module.SocialModel,
        /* comparator determines how collection is sorted */
        //comparator: 'authorLast',
        url: '/drupal_task_1/notes/social/get_socials.json'
        /*parse: function (response) {
            console.log(response);
            return response;
        }*/
       /* toJSON: function () {
            return _.clone(this.attributes.response);
        }*/
    });
    module.SocialModel = Backbone.Model.extend({
        defaults: {}
    });
    module.SocialCollection = Backbone.Collection.extend({
        model: module.SocialModel
    });
    var socialItemView = module.socialItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: '#item-template',
        //initialize: function(){ console.log('socialItemView: initialize >>> ' + this.model.get('name')) },
        initialize: function(){ console.log('socialItemView: initialize') },
        onRender: function(){ console.log('socialItemView: onRender') },
        onShow: function(){ console.log('socialItemView: onShow') }
    });
    module.socialCollectionView = Marionette.CollectionView.extend({
        tagName: 'table',
        childView: socialItemView,
        //childViewContainer: "tbody",
        //template: '#layout-template',
        initialize: function(){ console.log('socialCollectionView: initialize') },
        onRender: function(){ console.log('socialCollectionView: onRender') },
        onShow: function(){ console.log('socialCollectionView: onShow') }
    });
    /* define a view; in this case a 'LayoutView' (formerly 'Layout') */
    module.AppLayoutView = Marionette.LayoutView.extend({
        /* the auto-generated element which contains this view */
        tagName: 'div',
        /* id attribute for the auto-generated container element */
        id: 'AppContainer',
        template: '#layout-template',
        ui: {
            'navHome' : '#nav-home',
            'navInfo' : '#nav-info'
        },
        /* define the regions within this layout, into which we will load additional views */
        regions: {
            'RegionOne' : '#regionOne'
        },
        initialize: function() {
            console.log('Main layout: initialize');
            //this.initRouter();
        },
        /* called when view renders in the DOM. This is a good place to
         add nested views, because the views need existing DOM elements
         into which to be rendered. */
        onRender: function() {
            console.log('Main layout: onRender');
            if (!Backbone.History.started) {
                Backbone.history.start();
            }
           // console.log('data = ' + socialCollection);
            //var socialCollectionView = new module.socialCollectionView({collection: socialCollection});
            //this.RegionOne.show(socialCollectionView);
        },
        /* called when the view displays in the UI */
        onShow: function() {
            console.log('Main layout: onShow');
        },
        initRouter: function() {
            var capturedThis = this;
            // assign route handlers to specific routes.
            // In this case, 'home' is triggered when the browser visits index.html#home. Likewise index.html#info.
            // the empty set is for an address with no hash.
            var appRouteHandler = {
                '' : 'onHomeRoute',
                'home' : 'onHomeRoute',
                'info' : 'onInfoRoute'
            };
            // controller which contains the methods which are used as route handlers. These are referenced in the appRoutes object above.
            var appRouterController = {
                onHomeRoute: function() {
                    capturedThis.onHomeNavigated();
                },
                onInfoRoute: function() {
                    capturedThis.onInfoNavigated();
                }
            };
            // define an AppRouter constructor
            var router = Marionette.AppRouter.extend({});
            // create a new instance of the AppRouter and assign the routes and controller
            var appRouter = new router({
                appRoutes: appRouteHandler,
                controller: appRouterController
            });
        },
        /* called when the router sees that we have met the criteria to trigger the 'onHomeRoute' handler */
        onHomeNavigated: function() {
            // define and display an instance of the HomeLayoutView
            var homeLayoutView = new module.HomeLayoutView();
            app.appRegion.show(homeLayoutView);
            // update the navigation
            this.$el.find('.navButton.active').removeClass('active');
            this.ui.navHome.addClass('active');
        },
        onInfoNavigated: function() {
            var infoLayoutView = new module.InfoLayoutView();
            app.appRegion.show(infoLayoutView);
            this.$el.find('.navButton.active').removeClass('active');
            this.ui.navInfo.addClass('active');
        }
    });

    var GridRow = Backbone.Marionette.ItemView.extend({
        template: "#item-template",
        tagName: "tr",
        className: 'grid-row',
        onRender: function(a){
            var statusCell = this.$el.find("td").eq(1);
            //console.log(status.text());
            if (statusCell.text() == '0') {
                statusCell.html('<span class="status-false"></span><a href="">Sync</a>');
            } else {
                statusCell.html('<span class="status-true"></span><a href="">Delete</a>');
            }
            console.log('GridRow: onRender')
        }
    });
    var GridView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#layout-template",
        childView: GridRow,
        childViewContainer: "tbody",
        className: 'grid-view',
        ui: {
            'navHome' : '#nav-home',
            'navInfo' : '#nav-info'
        },
        initialize: function(){
            this.initRouter();
            console.log('GridView: initialize')
        },
        onRender: function(){
            //console.log(this.$el);
            console.log('GridView: onRender');
            if (!Backbone.History.started) {
                Backbone.history.start();
            }
        },
        onShow: function(){ console.log('GridView: onShow') },
        /*appendHtml: function(collectionView, itemView){
            console.log(itemView);
            collectionView.$("tbody").append(itemView.el);
        }*/
        initRouter: function() {
            var capturedThis = this;
            // assign route handlers to specific routes.
            // In this case, 'home' is triggered when the browser visits index.html#home. Likewise index.html#info.
            // the empty set is for an address with no hash.
            var appRouteHandler = {
                '' : 'onHomeRoute',
                'home' : 'onHomeRoute',
                'info' : 'onInfoRoute'
            };
            // controller which contains the methods which are used as route handlers. These are referenced in the appRoutes object above.
            var appRouterController = {
                onHomeRoute: function() {
                    capturedThis.onHomeNavigated();
                },
                onInfoRoute: function() {
                    capturedThis.onInfoNavigated();
                }
            };
            // define an AppRouter constructor
            var router = Marionette.AppRouter.extend({});
            // create a new instance of the AppRouter and assign the routes and controller
            var appRouter = new router({
                appRoutes: appRouteHandler,
                controller: appRouterController
            });
        },
        /* called when the router sees that we have met the criteria to trigger the 'onHomeRoute' handler */
        onHomeNavigated: function() {
            // define and display an instance of the HomeLayoutView
            var homeLayoutView = new module.HomeLayoutView();
            app.appRegion.show(homeLayoutView);
            // update the navigation
            this.$el.find('.navButton.active').removeClass('active');
            this.ui.navHome.addClass('active');
        },
        onInfoNavigated: function() {
            var infoLayoutView = new module.InfoLayoutView();
            app.appRegion.show(infoLayoutView);
            this.$el.find('.navButton.active').removeClass('active');
            this.ui.navInfo.addClass('active');
        }
    });

    module.HomeLayoutView = Marionette.LayoutView.extend({
        tagName: 'div',
        id: 'HomeLayoutView',
        className: 'contentLayout',
        template: '#template-HomeLayoutView'
    });
    module.InfoLayoutView = Marionette.LayoutView.extend({
        tagName: 'div',
        id: 'InfoLayoutView',
        className: 'contentLayout',
        template: '#template-InfoLayoutView'
    });

    module.addInitializer(function(){
        socialCollection = new module.socialCollection();
        socialCollection.fetch({}).fail(function(){}).done(function(a) {
            //console.log(a);
            /* create a new instance of the layout from the module */
            var layout = new module.AppLayoutView();
            /* display the layout in the region defined at the top of this file */
            app.appRegion.show(layout);
            /*var gridView = new GridView({
                collection: socialCollection
            });*/
            //gridView.render();
            //$("#grid").html(gridView.el);
            //app.appRegion.show(gridView);
        });
    });
});

$(document).ready(function() {
    app.start();
});
