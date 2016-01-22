app.SocialViewer = function(){
    var SocialViewer = {};
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
        className: "modal socialDetail",
        childView: SocialDetailItemView,
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
                author: '',
                social_name: app.LibraryApp.PostCollection.socialName
            });
            textareaEl.val("");
            post.save({}, {
                success: function (model, response) {
                    //console.log("Success", response);
                    NoticeView.viewNotice('Done!', 'success');
                    app.LibraryApp.PostCollection.add(model, {at: 0});
                },
                error: function (model, response) {
                    NoticeView.viewNotice('Something wrong', 'error');
                    //console.log("Error", response);
                }
            });
        },
        initialize: function(){
            //console.log('SocialDetailListView: initialize');
        },
        onRender: function() {
            //console.log('SocialDetailListView: onRender');
        },
        hidePostPanel: function(socialName) {
            var panelNewPost = this.$el.find('.panel-new-post');
            (socialName === 'instagram') ? panelNewPost.hide() : panelNewPost.show();
        }
    });
    var NoticeView = new app.NoticeView();
    var SocialRowView = Backbone.Marionette.ItemView.extend({
        //template: "#item-template",
        template: _.template($('#item-template').html()),
        tagName: "tr",
        initialize: function() {
            //console.log('SocialRowView: initialize');
            this.listenTo(this.model, 'change', this.change);
            this.listenTo(this.model, 'destroy', this.destroy);
        },
        events: {
            'click .reset': 'onClickReset'
        },
        /*showBookDetail: function(){
            var detailView = new BookDetailView({model: this.model});
            app.modal.show(detailView);
        },*/
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
        change: function () {
            //console.log('SocialRowView: change');
            //this.render();
        },
        destroy: function() {
            //console.log('SocialRowView: destroy');
        },
        onClickReset: function () {
            var self = this;
            self.model.save({'status': null}, {
                success: function (model, response) {
                    //NoticeView.viewNotice(response.responseText, 'success');
                    console.log('Success: ' + response.result);
                    if (response.result) {
                        self.render();
                        app.SessionHelper.setItem("status:" + self.model.get("name"), self.model.get("status"));
                    }
                },
                error: function (model, response) {
                    //NoticeView.viewNotice(response.responseText, 'error');
                    console.log('Error: ' + response.result);
                },
                wait: true
            });
        },
        onClickView: function() {
            //var posts = new app.LibraryApp.Post();
            //var socialView = new SocialView({ collection: posts});
            //app.modal.show(socialView);
        }
    });
    var SocialListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#list-template",
        //class: "",
        childView: SocialRowView,
    });
    var SearchView = Backbone.View.extend({
        el: "#searchBar",
        initialize: function(){
            var self = this;
            var $spinner = self.$('#spinner');
            app.vent.on("search:start", function(){ $spinner.fadeIn(); });
            app.vent.on("search:stop", function(){ $spinner.fadeOut(); });
            app.vent.on("search:term", function(term){
                self.$('#searchTerm').val(term);
            });
        },
        events: {
            'change #searchTerm': 'search'
        },
        search: function() {
            var searchTerm = this.$('#searchTerm').val().trim();
            if(searchTerm.length > 0){
                app.vent.trigger("search:term", searchTerm);
            } else {
                app.vent.trigger("search:noSearchTerm");
            }
        }
    });
    var AuthView = Backbone.Marionette.ItemView.extend({
        template: "#auth-template",
        events: {
            'click #edit-submit': 'loginSubmit',
            'click #reg-submit': 'regSubmit',
            'click #link-logout': 'logout'
        },
        userModel: '',
        sessionId: '',
        initialize: function() {
            console.log('AuthView: initialize');
            this.userModel = new app.LibraryApp.UserModel();
        },
        onRender: function() {
            console.log('AuthView: onRender');
        },
        loginSubmit: function(e) {
            e.preventDefault();
            var username = this.$el.find('#edit-name').val(),
                password = this.$el.find('#edit-pass').val();
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
                console.log(response);
                NoticeView.viewNotice('Something wrong', 'error');
            }).done(function(response) {
                console.log(response);
                if (response.hasOwnProperty('session_name') && response.hasOwnProperty('sessid')) {
                    self.sessionId = response.session_name;
                    $.cookie(self.sessionId, response.sessid);
                    self.hideAuthPanels();
                    self.showLogoutLink();
                } else {
                    NoticeView.viewNotice('Something wrong', 'error');
                }
            });
        },
        regUser: function() {
            this.userModel.save({}, {
                success: function (model, response) {
                    NoticeView.viewNotice('Created! Please log in using your new account', 'success');
                },
                error: function (model, response) {
                    console.log("Error", response);
                }
            });
        },
        hideAuthPanels: function() {
            this.$el.empty();
        },
        showAuthPanels: function() {
            this.render();
        },
        showLogoutLink: function() {
            this.$el.html('<a id="link-logout" href="' + app.ConfigApp.projectFolder + 'user/logout">Logout</a>');
        },
        logout: function(e) {
            e.preventDefault();
            $.removeCookie(this.sessionId);
            this.showAuthPanels();
        }
    });

    SocialViewer.showTableSocial = function(socials){
        var socialListView = new SocialListView({ collection: socials });
        app.LibraryApp.layout.mainContainer.show(socialListView);
    };
    SocialViewer.showSocialDetails = function(posts, socialName){
        //console.log(posts);
        var socialDetailView = new SocialDetailListView({ collection: posts });
        //console.log(socialDetailView);
        //app.modal.show(socialDetailView);
        //socialDetailView.render();
        app.LibraryApp.layout.mainContainer.show(socialDetailView);
        socialDetailView.hidePostPanel(socialName);
    };
    SocialViewer.showAuth = function(){
        //console.log(posts);
        var a = new AuthView();
        //console.log(socialDetailView);
        //app.modal.show(socialDetailView);
        //socialDetailView.render();
        app.LibraryApp.layout.mainContainer.show(a);
    };
    //app.vent.on("layout:rendered", function(){
        // render a view for the existing HTML in the template, and attach it to the layout (i.e. don't double render)
        //var searchView = new SearchView();
        //app.LibraryApp.layout.search.attachView(searchView);
    //});
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
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    return dd + '/' + mm + '/' + yyyy;
};