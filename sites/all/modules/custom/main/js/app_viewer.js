app.SocialViewer = function(){
    var SocialViewer = {},
        noticeView;

    var NoticeView = Backbone.Marionette.ItemView.extend({
        template: "#notice-item",
        notice: '',
        type: '',
        events: {
            'click': 'closeNotice'
        },
        onRender: function() {
            this.closeNotice();
            this.$el.addClass('notice-' + this.type);
            this.$el.html(this.notice);
        },
        closeNotice: function() {
            this.$el.empty();
            this.$el.removeClass();
        },
        viewNotice: function(notice, type) {
            this.notice = notice;
            this.type = type;
            app.SocialViewer.layout.noticeContainer.show(this.render());
        }
    });

    var SocialDetailItemView = Backbone.Marionette.ItemView.extend({
        template: "#social-item-template"
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
                postText = textareaEl.val();
            if (postText.length <= 3) {
                noticeView.viewNotice('Too little message (need more then 3 letters)', 'warning');
                return;
            }
            app.spinnerShow();
            var post = new app.SocialModeler.PostModel({
                content: postText,
                date_post: new Date().getCurrentFormattedDate(),
                social_name: app.SocialModeler.PostCollection.socialName
            });
            textareaEl.val("");
            post.save({}, {
                success: function (model) {
                    app.spinnerHide();
                    noticeView.viewNotice('Published', 'success');
                    app.SocialModeler.PostCollection.add(model, {at: 0});
                },
                error: function () {
                    noticeView.viewNotice('Something wrong', 'error');
                }
            });
        },
        hidePostPanel: function(socialName) {
            var panelNewPost = this.$el.find('.panel-new-post');
            (socialName === 'instagram') ? panelNewPost.hide() : panelNewPost.show();
        },
        onBeforeRender: function() {
            app.menu.showLogout('<a class="link-logout" href="' + app.ConfigApp.projectFolder + 'user/logout">Logout</a>');
        }
    });

    var SocialRowView = Backbone.Marionette.ItemView.extend({
        template: _.template($('#item-template').html()),
        tagName: "tr",
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
        },
        clickReset: function () {
            var self = this;
            self.model.save({'status': null}, {
                success: function(model, response) {
                    if (response.hasOwnProperty('responseText') && response.responseText) {
                        noticeView.viewNotice('Done!', 'success');
                        self.render();
                        app.SessionHelper.setItem("status:" + self.model.get("name"), self.model.get("status"));
                    } else {
                        noticeView.viewNotice('Something wrong', 'error');
                    }
                },
                error: function(model, response) {
                    if (response.hasOwnProperty('responseText') && response.responseText != "") {
                        noticeView.viewNotice($.parseJSON(response.responseText)[0], 'error');
                    } else {
                        noticeView.viewNotice('Something wrong', 'error');
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
            noticeView.closeNotice();
            app.menu.showLogout('<a class="link-logout" href="' + app.ConfigApp.projectFolder + 'user/logout">Logout</a>');
        }
    });

    var AuthView = Backbone.Marionette.ItemView.extend({
        template: "#auth-template",
        events: {
            'click #login-submit': 'loginSubmit',
            'click #reg-submit': 'regSubmit'
        },
        userModel: '',
        sessionId: '',
        initialize: function() {
            this.userModel = new app.SocialModeler.UserModel();
        },
        loginSubmit: function(e) {
            var self = this;
            e.preventDefault();
            var username = this.$el.find('#login-username').val(),
                password = this.$el.find('#login-password').val();
            if (username == "" || password == "") {
                noticeView.viewNotice('Missing attribute', 'warning');
                return;
            }
            this.userModel.set({ username: username, password: password });
            self.fetchUser();
        },
        regSubmit: function(e) {
            e.preventDefault();
            var username = this.$el.find('#reg-name').val(),
                email = this.$el.find('#reg-email').val(),
                password = this.$el.find('#reg-pass').val(),
                approvePassword = this.$el.find('#reg-approve-pass').val();
            if (username == "" || password == "" || email == "" || approvePassword == "") {
                noticeView.viewNotice('Missing attribute', 'warning');
                return;
            }
            app.spinnerShow();
            this.userModel = new app.SocialModeler.UserModel({
                username: username,
                password: password,
                email: email,
                approve_password: approvePassword
            });
            this.regUser();
        },
        fetchUser: function() {
            app.spinnerShow();
            var self = this;
            this.userModel.fetch({}).fail(function(response){
                if (response.hasOwnProperty('responseText') && response.responseText != "") {
                    noticeView.viewNotice($.parseJSON(response.responseText)[0], 'error');
                } else {
                    noticeView.viewNotice('Something wrong', 'error');
                }
            }).done(function(response) {
                app.spinnerHide();
                if (response.hasOwnProperty('session_name') && response.hasOwnProperty('sessid') && response.hasOwnProperty('token')) {
                    self.sessionId = response.session_name;
                    $.cookie(self.sessionId, response.sessid);
                    $.cookie('social_session_id', self.sessionId);
                    $.cookie('social_session_token', response.token);
                    self.hideAuthPanels();
                    app.SocialModeler.home();
                } else {
                    noticeView.viewNotice(response[0], 'error');
                }
            });
        },
        regUser: function() {
            var self = this;
            this.userModel.save({}, {
                success: function () {
                    app.spinnerHide();
                    noticeView.viewNotice('Created! Please log in using your new account', 'success');
                    self.clearFields();
                },
                error: function (model, response) {
                    if (response.hasOwnProperty('responseText') && response.responseText != "") {
                        noticeView.viewNotice($.parseJSON(response.responseText)[0], 'error');
                    } else {
                        noticeView.viewNotice('Something wrong', 'error');
                    }
                }
            });
        },
        hideAuthPanels: function() {
            this.$el.empty();
        },
        clearFields: function() {
            this.$el.find('input[type="text"]').val("");
            this.$el.find('input[type="password"]').val("");
        },
        onBeforeRender: function() {
            noticeView.closeNotice();
        }
    });

    var Layout = Backbone.Marionette.LayoutView.extend({
        template: "#layout-template",
        regions: {
            mainContainer: "#mainContainer",
            noticeContainer: "#noticeContainer"
        }
    });

    SocialViewer.showTableSocial = function(socials){
        var socialListView = new SocialListView({ collection: socials });
        SocialViewer.layout.mainContainer.show(socialListView);
    };

    SocialViewer.showSocialDetails = function(posts, socialName){
        var socialDetailView = new SocialDetailListView({ collection: posts });
        SocialViewer.layout.mainContainer.show(socialDetailView);
        socialDetailView.hidePostPanel(socialName);
    };

    SocialViewer.showAuth = function(){
        app.SocialViewer.authView = new AuthView();
        SocialViewer.layout.mainContainer.show(app.SocialViewer.authView);
    };

    SocialViewer.initializeLayout = function() {
        SocialViewer.layout = new Layout();
        SocialViewer.layout.on("show", function() {
            app.vent.trigger("layout:rendered");
        });
        app.contentRegion.show(SocialViewer.layout);
        noticeView = new NoticeView();
    };

    return SocialViewer;
}();

Date.prototype.getCurrentFormattedDate = function() {
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