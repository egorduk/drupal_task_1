app.SocialViewer = function(){
    var SocialViewer = {};
    var username = '';
    var SocialDetailItemView = Backbone.Marionette.ItemView.extend({
        template: "#social-item-template",
        initialize: function(){
            //console.log('SocialDetailItemView: initialize');
        },
        onRender: function() {
            //console.log('SocialDetailItemView: onRender');
        }
    });
    var SocialDetailListView = Backbone.Marionette.CompositeView.extend({
        template: "#social-list-template",
        className: "social-detail",
        childView: SocialDetailItemView,
        childViewContainer: ".posts-wrapper",
        events: {
            'click .add-new-post': 'addNewPost'
        },
        addNewPost: function() {
            var textareaEl = this.$el.find('textarea'),
                postText = textareaEl.val(),
                self = this;
            if (postText.length <= 3) {
                NoticeView.viewNotice('Too little message (need more then 3 letters)', 'warning');
                return;
            }
            var post = new app.LibraryApp.PostModel({
                content: postText,
                date_post: new Date().getCurrentFormatedDate(),
                social_name: app.LibraryApp.PostCollection.socialName
            });
            textareaEl.val("");
            post.save({}, {
                success: function (model, response) {
                    NoticeView.viewNotice('Done!', 'success');
                    app.LibraryApp.PostCollection.add(model, {at: 0});
                },
                error: function (model, response) {
                    NoticeView.viewNotice('Something wrong', 'error');
                }
            });
        },
        initialize: function(){
            //console.log('SocialDetailListView: initialize');
        },
        onRender: function() {
            //console.log('SocialDetailListView: onRender');
        },
        /* onAfterRender: function() {
         var self = this;
         app.vent.on("test", function(){
         self.$el.find('.posts-wrapper').find('div:first').addClass('new');
         });
         },*/
        hidePostPanel: function(socialName) {
            var panelNewPost = this.$el.find('.panel-new-post');
            (socialName === 'instagram') ? panelNewPost.hide() : panelNewPost.show();
        }
        /*collectionEvents: {
         "add": "modelAdded"
         },
         modelAdded: function() {
         app.vent.trigger("test");
         }*/
    });
    var NoticeView = new app.NoticeView();
    var SocialRowView = Backbone.Marionette.ItemView.extend({
        template: _.template($('#item-template').html()),
        tagName: "tr",
        initialize: function() {
            //console.log('SocialRowView: initialize');
            //this.listenTo(this.model, 'change', this.change);
            //this.listenTo(this.model, 'destroy', this.destroy);
        },
        events: {
            'click .reset': 'clickReset'
        },
        onRender: function() {
            var statusCell = this.$el.find("td").eq(1),
                socialName = this.model.get("name"),
                socialStatus = this.model.get("status"),
                socialSyncLink = (this.model.get("sync_link")) ? this.model.get("sync_link") : '#sync/' + socialName;
            (socialStatus) ?
                statusCell.html('<span class="status-true"></span>' +
                    '<a class="view" href="#view/' + socialName + '">View</a> | ' +
                    '<a class="reset">Reset</a>') :
                statusCell.html('<span class="status-false"></span><a href="' + socialSyncLink + '">Sync</a>');
            console.log('SocialRowView: onRender');
        },
        //change: function () {
        //console.log('SocialRowView: change');
        //this.render();
        //},
        //destroy: function() {
        //console.log('SocialRowView: destroy');
        //},
        clickReset: function () {
            var self = this;
            self.model.save({'status': null}, {
                success: function(model, response) {
                    if (response.result) {
                        NoticeView.viewNotice('Done!', 'success');
                        self.render();
                        app.SessionHelper.setItem("status:" + self.model.get("name"), self.model.get("status"));
                    }
                },
                error: function(model, response) {
                    if (response.hasOwnProperty('responseText') && response.responseText != "") {
                        NoticeView.viewNotice($.parseJSON(response.responseText)[0], 'error');
                    } else {
                        NoticeView.viewNotice('Something wrong', 'error');
                    }
                },
                wait: true
            });
        }
    });
    var SocialListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#list-template",
        childView: SocialRowView,
        onBeforeRender: function() {
            app.menu.showLogout('<a class="link-logout" href="' + app.ConfigApp.projectFolder + 'user/logout">Logout</a>');
            app.menu.showUsername('<span class="username">' + username + '</span>');
        }
    });
    /*var searchview = Backbone.View.extend({
        el: "#searchBar",
        initialize: function(){
            var self = this;
            var $spinner = self.$('#spinner');
            app.vent.on("search:start", function(){ $spinner.fadeIn(); });
            app.vent.on("search:stop", function(){ $spinner.fadeOut(); });
        }
    });*/
    var AuthView = Backbone.Marionette.ItemView.extend({
        template: "#auth-template",
        events: {
            'click #login-submit': 'loginSubmit',
            'click #reg-submit': 'regSubmit'
        },
        userModel: '',
        sessionId: '',
        initialize: function() {
            //console.log('AuthView: initialize');
            this.userModel = new app.LibraryApp.UserModel();
        },
        onRender: function() {
            // console.log('AuthView: onRender');
        },
        loginSubmit: function(e) {
            e.preventDefault();
            var username = this.$el.find('#login-username').val(),
                password = this.$el.find('#login-password').val();
            if (username == "" || password == "") {
                NoticeView.viewNotice('Missing attribute', 'warning');
                return;
            }
            this.userModel.set({ username: username, password: password });
            var self = this;
            self.fetchUser();
        },
        regSubmit: function(e) {
            e.preventDefault();
            var username = this.$el.find('#reg-name').val(),
                email = this.$el.find('#reg-email').val(),
                password = this.$el.find('#reg-pass').val(),
                approvePassword = this.$el.find('#reg-approve-pass').val();
            if (username == "" || password == "" || email == "" || approvePassword == "") {
                NoticeView.viewNotice('Missing attribute', 'warning');
                return;
            }
            this.userModel = new app.LibraryApp.UserModel({
                username: username,
                password: password,
                email: email,
                approve_password: approvePassword
            });
            this.regUser();
        },
        fetchUser: function() {
            var self = this;
            this.userModel.fetch({}).fail(function(response){
                if (response.hasOwnProperty('responseText') && response.responseText != "") {
                    NoticeView.viewNotice($.parseJSON(response.responseText)[0], 'error');
                } else {
                    NoticeView.viewNotice('Something wrong', 'error');
                }
            }).done(function(response) {
                if (response.hasOwnProperty('session_name') && response.hasOwnProperty('sessid') && response.hasOwnProperty('token')) {
                    self.sessionId = response.session_name;
                    $.cookie(self.sessionId, response.sessid);
                    $.cookie('social_session_id', self.sessionId);
                    $.cookie('social_session_token', response.token);
                    if (response.hasOwnProperty('user')){
                        username = response.user.name;
                    }
                    self.hideAuthPanels();
                    app.LibraryApp.home();
                    //app.SocialViewer.showTableSocial(app.LibraryApp.SocialCollection);
                    //app.vent.trigger("social:getSocials");
                } else {
                    NoticeView.viewNotice(response[0], 'error');
                }
            });
        },
        regUser: function() {
            var self = this;
            this.userModel.save({}, {
                success: function () {
                    NoticeView.viewNotice('Created! Please log in using your new account', 'success');
                    self.clearFields();
                },
                error: function (model, response) {
                    if (response.hasOwnProperty('responseText') && response.responseText != "") {
                        NoticeView.viewNotice($.parseJSON(response.responseText)[0], 'error');
                    } else {
                        NoticeView.viewNotice('Something wrong', 'error');
                    }
                }
            });
        },
        hideAuthPanels: function() {
            this.$el.empty();
            NoticeView.closeNotice();
        },
        clearFields: function() {
            this.$el.find('input[type="text"]').val("");
            this.$el.find('input[type="password"]').val("");
        }
    });

    SocialViewer.showTableSocial = function(socials){
        var socialListView = new SocialListView({ collection: socials });
        app.LibraryApp.layout.mainContainer.show(socialListView);
    };
    SocialViewer.showSocialDetails = function(posts, socialName){
        var socialDetailView = new SocialDetailListView({ collection: posts });
        app.LibraryApp.layout.mainContainer.show(socialDetailView);
        socialDetailView.hidePostPanel(socialName);
    };
    //SocialViewer.authView = new AuthView();
    SocialViewer.showAuth = function(){
        app.SocialViewer.authView = new AuthView();
        //console.log(app.SocialViewer.authView);
        app.LibraryApp.layout.mainContainer.show(app.SocialViewer.authView);
    };
    return SocialViewer;
}();

Date.prototype.toMysqlFormat = function() {
    function twoDigits(d) {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
    }
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

Date.prototype.getCurrentFormatedDate = function() {
    var today = new Date(),
        dd = today.getDate(),
        mm = today.getMonth() + 1,
        yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return dd + '/' + mm + '/' + yyyy;
};

$.getUrlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
};