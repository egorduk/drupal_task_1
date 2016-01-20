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
            'click .add-new-post': 'onClickAdd'
        },
        onClickAdd: function() {
            var textareaEl = this.$el.find('textarea'),
                postText = textareaEl.val(),
                self = this;
            if (postText.length <= 3) {
                NoticeView.setNotice('Too little message (need more then 3 letters)', 'warning');
                self.showNotice();
                return;
            }
            var post = new app.LibraryApp.PostModel({
                content: postText,
                date_post: new Date().getCurrentFormatedDate(),
                author: '',
                social_name: app.LibraryApp.PostCollection.socialName
            });
            textareaEl.val("");
            //cm.navToDiv('cm-item-' + model.id);
            post.save({}, {
                success: function (model, response) {
                    console.log("Success", response);
                    app.LibraryApp.PostCollection.add(model, {at: 0});
                    //console.log(app.LibraryApp.PostCollection);
                    //cm.navToDiv('cm-item-' + model.id);
                },
                error: function (model, response) {
                    console.log("Error", response);
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
        },
        showNotice: function() {
            app.LibraryApp.layout.noticeContainer.show(NoticeView.render());
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
                    //NoticeView.setNotice(response.responseText, 'success');
                    //self.showNotice();
                    console.log('Success: ' + response.result);
                    if (response.result) {
                        self.render();
                        app.SessionHelper.setItem("status:" + self.model.get("name"), self.model.get("status"));
                    }
                },
                error: function (model, response) {
                    //NoticeView.setNotice(response.responseText, 'error');
                    //self.showNotice();
                    console.log('Error: ' + response.result);
                },
                wait: true
            });
        },
        onClickView: function() {
            //var posts = new app.LibraryApp.Post();
            //var socialView = new SocialView({ collection: posts});
            //app.modal.show(socialView);
        },
        showNotice: function() {
            app.LibraryApp.layout.noticeContainer.show(NoticeView.render());
        }
    });
    var SocialListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#list-template",
        //class: "",
        childView: SocialRowView,
        //itemView: SocialViewRow,
        initialize: function(){
        }
       /* appendHtml: function(collectionView, itemView){
            console.log(itemView.el);
            collectionView.$(".books").append(itemView.el);
        },
        showMessage: function(message){
            this.$('.books').html('<h1 class="notFound">' + message + '</h1>');
        },
        loadMoreBooks: function(){
            var totalHeight = this.$('> div').height(),
                scrollTop = this.$el.scrollTop() + this.$el.height(),
                margin = 200;
            // if we are closer than 'margin' to the end of the content, load more books
            if (scrollTop + margin >= totalHeight) {
                app.vent.trigger("search:more");
            }
        }*/
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
    var userModel = new app.LibraryApp.UserModel();
    var AuthView = Backbone.Marionette.ItemView.extend({
        template: "#auth-template",
        events: {
            'click #login-submit': 'loginSubmit'
        },
        loginSubmit: function() {
            var username = this.$el.find('#login-username').val(),
                password = this.$el.find('#login-password').val();
           /* var userModel = new app.LibraryApp.UserModel({
             login: login,
             email: password
             });*/
            userModel.set({ username: username, password: password });
            var self = this;
            self.fetchUser();
        },
        initialize: function() {
            console.log('AuthView: initialize');
        },
        onRender: function() {
            console.log('AuthView: onRender');
        },
        fetchUser: function() {
            var self = this;
            userModel.fetch({}).fail(function(a){
                console.log('E ' + a);
            }).done(function(response) {
                console.log(response);
                if (response.hasOwnProperty('session_name') && response.hasOwnProperty('sessid')) {
                    $.cookie(response.session_name, response.sessid);
                    self.hidePanel();
                } else {

                }
            });
        },
        hidePanel: function() {
            this.$el.empty();
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