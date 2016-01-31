app.SocialModeler = function(){
    var SocialModeler = {};

    Backbone.AuthenticatedModel = Backbone.Model.extend({
        sync: function(method, collection, options){
            options = options || {};
            options.beforeSend = function(xhr) {
                var token = $.cookie('social_session_token');
                xhr.setRequestHeader('X-CSRF-Token', token);
            };
            return Backbone.sync.call(this, method, collection, options);
        }
    });

    Backbone.AuthenticatedUserModel = Backbone.Model.extend({
        sync: function(method, collection, options){
            options = options || {};
            if (method == 'read') {
                options.url = this.urlRoot + '/user_login?username=' + this.get("username") + '&password=' + this.get("password");
            }
            return Backbone.sync.call(this, method, collection, options);
        }
    });

    SocialModeler.UserModel = Backbone.AuthenticatedUserModel.extend({
        urlRoot: app.ConfigApp.urlUser,
        defaults: {
            username: '',
            password: '',
            email: '',
            approve_password: ''
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
            var self = this;
            this.socialName = options.socialName;
            app.vent.on("post:getPosts", function(){
                app.spinnerShow();
                self.fetchPosts();
            });
        },
        fetchPosts: function() {
            this.fetch({}).fail().done(function() {
                app.spinnerHide();
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
            var self = this;
            app.vent.on("social:getSocials", function(){
                app.spinnerShow();
                self.fetchSocials();
            });
        },
        fetchSocials: function() {
            this.fetch({}).fail().done(function(data) {
                app.spinnerHide();
                console.log(data);
                _(data).each(function(item) {
                    app.SessionHelper.setItem("status:" + item.name, item.status);
                });
            });
        }
    });

    SocialModeler.SocialCollection = new SocialCollection();

    SocialModeler.PostModel = PostModel;

    SocialModeler.home = function() {
        if ($.cookie('social_session_id')) {
            app.SocialViewer.showTableSocial(SocialModeler.SocialCollection);
            app.vent.trigger("social:getSocials");
        } else {
            app.SocialViewer.showAuth();
        }
        var social = $.getUrlParam('social');
        if (social) {
            window.location.replace(app.ConfigApp.projectFolder + 'social');
        }
    };

    SocialModeler.viewSocial = function(socialName) {
        if ($.cookie('social_session_id')) {
            var sessionSocialStatus = app.SessionHelper.getItem("status:" + socialName);
            if (sessionSocialStatus === "false" || sessionSocialStatus == "null" || $.inArray(socialName, app.ConfigApp.socialArray) == -1) {
                Backbone.history.navigate("");
                return;
            }
        } else {
            Backbone.history.navigate("");
            return;
        }
        app.SocialViewer.initializeLayout();
        SocialModeler.PostCollection = new PostCollection(null, {socialName: socialName});
        app.SocialViewer.showSocialDetails(SocialModeler.PostCollection, socialName);
        app.vent.trigger("post:getPosts");
    };

    SocialModeler.parseUrl = function() {
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
        return params;
    };

    SocialModeler.logout = function() {
        var sessionId = $.cookie('social_session_id');
        $.removeCookie(sessionId);
        $.removeCookie('social_session_id');
        $.removeCookie('social_session_token');
        Backbone.history.navigate("");
    };

    return SocialModeler;
}();