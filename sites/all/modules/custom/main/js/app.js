/* create a new instance of the Marionette app */

var app = new Backbone.Marionette.Application();
/* add the initial region which will contain the app */
app.addRegions({
    /* reference to container element in the HTML file */
    appRegion: '#content'
});
/* define a module to keep the code modular */
app.module('App', function(module, App, Backbone, Marionette, $, _){
    var socialCollection;
    /*Backbone.sync = function(method, model) {
        console.log(method + ": " + model.url);
    };*/
    /* definition for book model, with default example of data structure */
    module.BookModel = Backbone.Model.extend({
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
        model: module.BookModel,
        /* comparator determines how collection is sorted */
        //comparator: 'authorLast',
        url: '/drupal_task_1/notes/social/get_socials.json'
        /*parse: function (response) {
            //console.log(response);
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
    module.socialItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: '#item-template',
        initialize: function(){ console.log('socialItemView: initialize >>> ' + this.model.get('title')) },
        onRender: function(){ console.log('socialItemView: onRender >>> ' + this.model.get('title')) },
        onShow: function(){ console.log('socialItemView: onShow >>> ' + this.model.get('title')) }
    });
    module.socialCollectionView = Marionette.CollectionView.extend({
        tagName: 'table',
        childView: module.socialItemView,
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
        /* reference to the template which will be rendered for this view */
        template: '#layout-template',
        /* define the regions within this layout, into which we will load additional views */
        regions: {
            'RegionOne' : '#regionOne'
        },
        /* called when the view initializes, before it displays */
        initialize: function() {
            console.log('main layout: initialize');
        },
        /* called when view renders in the DOM. This is a good place to
         add nested views, because the views need existing DOM elements
         into which to be rendered. */
        onRender: function() {
            console.log('main layout: onRender');
           // console.log('data = ' + socialCollection);
            var socialCollectionView = new module.socialCollectionView({collection: socialCollection});
            this.RegionOne.show(socialCollectionView);
        },
        /* called when the view displays in the UI */
        onShow: function() {
            console.log('main layout: onShow');
        }
    });
    /* Tell the module what to do when it is done loading */
    module.addInitializer(function(){
        socialCollection = new module.socialCollection();
        socialCollection.fetch({}).fail(function() {}).done(function(a) {
            console.log(a);
            /* create a new instance of the layout from the module */
            var layout = new module.AppLayoutView();
            /* display the layout in the region defined at the top of this file */
            app.appRegion.show(layout);
        });
    });
});

$(document).ready(function() {
    app.start();
});
