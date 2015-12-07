/* create a new instance of the Marionette app */

var app = new Backbone.Marionette.Application();
/* add the initial region which will contain the app */
app.addRegions({
    /* reference to container element in the HTML file */
    appRegion: '#content'
});
/* define a module to keep the code modular */
app.module('App', function(module, App, Backbone, Marionette, $, _){
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
    module.BookCollection = Backbone.Collection.extend({
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
    module.BookItemView = Marionette.ItemView.extend({
        tagName: 'li',
        template: '#item-template',
        /* used to show the order in which these method are called */
        initialize: function(){ console.log('BookItemView: initialize >>> ' + this.model.get('title')) },
        onRender: function(){ console.log('BookItemView: onRender >>> ' + this.model.get('title')) },
        onShow: function(){ console.log('BookItemView: onShow >>> ' + this.model.get('title')) }
    });
    module.BookCollectionView = Marionette.CollectionView.extend({
        tagName: 'ul',
        childView: module.BookItemView,
        initialize: function(){ console.log('BookCollectionView: initialize') },
        onRender: function(){ console.log('BookCollectionView: onRender') },
        onShow: function(){ console.log('BookCollectionView: onShow') }
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
            //console.log('main layout: initialize');
            //this.listenTo(this.collection, 'reset', this.renderAll);
            //console.log(this);
           // console.log(a.fetch());
          /*  this.collection.fetch({
                reset: true,
                collection: this.collection
            });*/
        /*    var bookCollection2 = new module.BookCollection();
            bookCollection2.fetch();
            this.coll = bookCollection2;*/
        },
        /* called when view renders in the DOM. This is a good place to
         add nested views, because the views need existing DOM elements
         into which to be rendered. */
        onRender: function() {
            //console.log('main layout: onRender');
            /* create an array of books using anonymouse objects;
             the objects have the same structure as in the 'defaults'
             attribute of the module.BookModel definition */
            var bookArray = [];
            var that = this;
            var region = this.RegionOne;
            bookArray.push({title: 'Wolf',authorLast: 'Harrison', authorFirst: 'Jim'});
            bookArray.push({title: 'The Theory and Practice of Rivers', authorLast: 'Snyder', authorFirst: 'Gary'});
            //console.log(bookArray);
            /* create a collection using the array of anonymous objects */
            //this.listenTo(this.collection, 'reset', this.renderAll);
            var bookCollection1 = new module.BookCollection();
            bookCollection1.fetch({
                //reset: true,
                //collection: bookCollection1
            })
                .fail(function() {})
                .done(function(a) {
                    console.log(a);
                    /* on successfully loading the data, create a new instance of the main layout view,
                     and feed the model into it. */
                    //var layout = new module.GardenLayoutView({model: baseModel});
                    /* show the layout in the region we created at the top of this file */
                    //app.appRegion.show(layout);
                    var b = [];
                    b.push({title: 'Wolf',authorLast: 'Harrison', authorFirst: 'Jim'});
                    b.push({title: 'Wolf1',authorLast: 'Harrison1', authorFirst: 'Jim1'});
                    that.coll = new module.BookCollection(b);
                    console.log(that.coll);
                    var bookCollectionView = new module.BookCollectionView({collection: that.coll});
                    region.show(bookCollectionView);
                });
            var bookCollection = new module.BookCollection(bookArray);
            console.log(bookCollection);
            console.log(bookCollection1);
/*            var accounts = new Backbone.Collection;
            accounts.url = '/drupal_task_1/notes/social/get_socials.json';
            accounts.fetch();
            console.log(accounts);*/
            //console.log(a);
        },
        /* called when the view displays in the UI */
        onShow: function() {
            //console.log('main layout: onShow');
        }
    });
    /* Tell the module what to do when it is done loading */
    module.addInitializer(function(){
        /* create a new instance of the layout from the module */
        var layout = new module.AppLayoutView();
        /* display the layout in the region defined at the top of this file */
        app.appRegion.show(layout);
    });
});
/*Backbone.Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
    var $template = Backbone.$(templateId);
    console.log($template);
    if (!$template.length) {
        throw new Marionette.Error({
            name : 'NoTemplateError',
            message : 'Could not find template: "' + templateId + '"'
        });
    }
    return $template.html();
};*/

$(document).ready(function() {
    /*var tplList = document.querySelectorAll('[type="text/template"]');
    var tplCounter = 0;
    _.each(tplList, function (el) {
        tplCounter++;
    });
    if (tplCounter == 2) {*/
        //app.start();
    //}
/*    var tplList = document.querySelectorAll('[type="text/template"]');
    var tplCounter = 0;
    _.each(tplList, function (el) {
        $.ajax({
            'url': el.src,
            success: function (res) {
                el.innerHTML = res;
                ++tplCounter;
                if(tplCounter == tplList.length){
                    app.start();
                }
            }
        });
    });*/
    app.start();
});
