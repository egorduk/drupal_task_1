app.LibraryApp = function(){
    var LibraryApp = {};
    var Layout = Backbone.Marionette.LayoutView.extend({
        template: "#layout-template",
        regions: {
            mainContainer: "#mainContainer",
            noticeContainer: "#noticeContainer",
            modalContainer: '#modalContainer'
        }
    });
    var token = '', flOnlyOneRequest = true;
    Backbone.AuthenticatedModel = Backbone.Model.extend({
        initialize: function(){
            if (flOnlyOneRequest) {
                flOnlyOneRequest = false;
                $.ajax({
                    url: app.ConfigApp.urlSessionToken,
                    type: "GET",
                    dataType: "text",
                    error: function (jqXHR, textStatus, errorThrown) {
                        //alert(errorThrown);
                        //NoticeView.setNotice(textStatus, 'error');
                        //self.showNotice();
                    },
                    success: function (response) {
                        token = response;
                    }
                });
            }
        },
        sync: function(method, collection, options){
            options = options || {};
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', token);
            };
            return Backbone.sync.call(this, method, collection, options);
        }
    });
    Backbone._AuthenticatedModel = Backbone.Model.extend({
        sync: function(method, collection, options){
            options = options || {};
            console.log(this);
            if (method == 'read') {
                options.url = this.urlRoot + '/user_login?username=' + this.get("username") + '&password=' + this.get("password");
            }
            return Backbone.sync.call(this, method, collection, options);
        }
    });
    LibraryApp.UserModel = Backbone._AuthenticatedModel.extend({
        urlRoot: app.ConfigApp.urlUser,
        defaults: {
            username: '',
            password: '',
            email: ''
        }
    });
    var PostModel = Backbone.AuthenticatedModel.extend({
        urlRoot: app.ConfigApp.urlPost,
        defaults: {
            content: '',
            date_post: '',
            social_name: ''
        }
    });
    var PostCollection = Backbone.Collection.extend({
        model: PostModel,
        socialName: '',
        url: function(){
            return app.ConfigApp.urlGetPosts + this.socialName + '.json';
        },
        initialize: function(models, options) {
            console.log('PostCollection: initialize');
            var self = this;
            this.socialName = options.socialName;
            app.vent.on("post:getPosts", function(){
                self.fetchPosts();
            });
        },
        fetchPosts: function() {
            this.fetch({}).fail(function(){}).done(function(a) {
                console.log(a);
            });
        }
    });
    var SocialModel = Backbone.AuthenticatedModel.extend({
        urlRoot: app.ConfigApp.urlSocial,
        defaults: {}
    });
    var SocialCollection = Backbone.Collection.extend({
        model: SocialModel,
        //comparator: 'name',
        url: app.ConfigApp.urlGetSocials,
        initialize: function() {
            console.log('SocialCollection: initialize');
            var self = this;
            app.vent.on("social:getSocials", function(){
                self.fetchSocials();
            });
        },
        fetchSocials: function() {
            this.fetch({}).fail(function(){}).done(function(data) {
                console.log(data);
                _(data).each(function(item) {
                    app.SessionHelper.setItem("status:" + item.name, item.status);
                });
            });
        }
    });
    var UserCollection = Backbone.Collection.extend({
        model: LibraryApp.UserModel,
        url: app.ConfigApp.urlGetSocials,
        /*initialize: function() {
            console.log('SocialCollection: initialize');
            var self = this;
            app.vent.on("social:getSocials", function(){
                self.fetchSocials();
            });
        },
        fetchSocials: function() {
            this.fetch({}).fail(function(){}).done(function(data) {
                console.log(data);
                _(data).each(function(item) {
                    app.SessionHelper.setItem("status:" + item.name, item.status);
                });
            });
        }*/
    });
    LibraryApp.SocialCollection = new SocialCollection();
    //LibraryApp.UserCollection = new UserCollection();
    LibraryApp.initializeLayout = function(){
        LibraryApp.layout = new Layout();
        LibraryApp.layout.on("show", function(){
            app.vent.trigger("Layout: rendered");
        });
        app.contentRegion.show(app.LibraryApp.layout);
    };
    LibraryApp.PostModel = PostModel;
    LibraryApp.home = function() {
        /*var parsedArrayUrl = LibraryApp.parseUrl();
        if (parsedArrayUrl['social'] == 'twitter') {
            app.vent.trigger("social:authSuccess:twitter");
            console.log('Vent: social:authSuccess:twitter');
        } else if (parsedArrayUrl['social'] == 'instagram') {
            app.vent.trigger("social:authSuccess:instagram");
        } else if (parsedArrayUrl['social'] == 'facebook') {
            app.vent.trigger("social:authSuccess:facebook");
        }*/
        LibraryApp.initializeLayout();
        app.SocialViewer.showAuth();
        //app.SocialViewer.showTableSocial(LibraryApp.SocialCollection);
        //app.vent.trigger("social:getSocials");
    };
    LibraryApp.viewSocial = function(socialName){
        //console.log("view " + socialName);
        //console.log("Current fragment: " + Backbone.history.getFragment());
        var sessionSocialStatus = app.SessionHelper.getItem("status:" + socialName);
        if (sessionSocialStatus === "false" || sessionSocialStatus == "null" || $.inArray(socialName, app.ConfigApp.socialArray) == -1) {
            Backbone.history.navigate("");
            return;
        }
        LibraryApp.initializeLayout();
        LibraryApp.PostCollection = new PostCollection(null, {socialName: socialName});
        app.SocialViewer.showSocialDetails(LibraryApp.PostCollection, socialName);
        app.vent.trigger("post:getPosts");
    };
    /*LibraryApp.resetSocial = function(socialName){
        console.log("reset " + socialName);
    };
    LibraryApp.syncSocial = function(socialName){
        console.log("sync " + socialName);
    };*/
    LibraryApp.parseUrl = function() {
        var params = [],
            queryString = window.location.href,
            pair,
            len,
            d = decodeURIComponent;
        queryString = queryString.substring(queryString.indexOf('?') + 1).split('&');
        len = queryString.length - 1;
        for (var i = len; i >= 0; i--) {
            pair = queryString[i].split('=');
            params[d(pair[0])] = d(pair[1]);
        }
        //console.log(params['social']);
        return params;
    };
    return LibraryApp;
}();
