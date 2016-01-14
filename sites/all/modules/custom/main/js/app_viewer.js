app.SocialViewer = function(){
    var SocialViewer = {};
    var BookDetailView = Backbone.Marionette.ItemView.extend({
        template: "#book-detail-template",
        className: "modal bookDetail"
    });
    var NoticeView = new app.NoticeView();
    var SocialRowView = Backbone.Marionette.ItemView.extend({
        template: "#item-template",
        tagName: "tr",
        initialize: function() {
            //console.log('SocialRowView: initialize');
            this.listenTo(this.model, 'change', this.change);
            this.listenTo(this.model, 'destroy', this.destroy);
        },
        events: {
            'click .reset': 'onClickReset',
            'click .view': 'onClickView'
        },
        /*showBookDetail: function(){
            var detailView = new BookDetailView({model: this.model});
            app.modal.show(detailView);
        },*/
        onRender: function() {
            var statusCell = this.$el.find("td").eq(1);
            var socialName = this.model.get("name");
            var socialStatus = this.model.get("status");
            var socialSyncLink = (this.model.get("sync_link")) ? this.model.get("sync_link") : '#sync/' + socialName;
            (socialStatus) ?
                statusCell.html('<span class="status-true"></span>' +
                    '<a class="view" href="#view/' + socialName + '">View</a> | ' +
                    //'<a class="reset" href="#reset/' + socialName + '">Reset</a>') :
                    '<a class="reset">Reset</a>') :
                statusCell.html('<span class="status-false"></span><a href="' + socialSyncLink + '">Sync</a>');
            console.log('SocialRowView: onRender');
        },
        change: function () {
            console.log('SocialRowView: change');
        },
        destroy: function() {
            console.log('SocialRowView: destroy');
        },
        onClickReset: function () {
            var self = this;
            $.ajax({
                url: "?q=services/session/token",
                type: "GET",
                dataType: "text",
                error: function (jqXHR, textStatus, errorThrown) {
                    //alert(errorThrown);
                    NoticeView.setNotice(textStatus, 'error');
                    self.showNotice();
                },
                success: function (token) {
                    self.model.save({'status': 13}, {
                        success: function (model, response) {
                            //NoticeView.setNotice(response.responseText, 'success');
                            //self.showNotice();
                            console.log(response);
                            alert('s');
                        },
                        error: function (model, response) {
                            //NoticeView.setNotice(response.responseText, 'error');
                            //self.showNotice();
                            console.log(response);
                            alert('e');
                        },
                        wait: true
                    });
                    //self.model.save();
                }
            });
        },
        showNotice: function() {
            app.LibraryApp.layout.noticeContainer.show(NoticeView.render());
        }
    });
    var SocialListView = Backbone.Marionette.CompositeView.extend({
        tagName: "table",
        template: "#list-template",
        //class: "bookList",
        childView: SocialRowView,
        //itemView: SocialViewRow,
        initialize: function(){
            //_.bindAll(this, "showMessage", "loadMoreBooks");
            /*var self = this;
            app.vent.on("search:error", function(){
                self.showMessage("Error, please retry later :s")
            });
            app.vent.on("search:noSearchTerm", function(){
                self.showMessage("Hummmm, can do better :)")
            });
            app.vent.on("search:noResults", function(){
                self.showMessage("No books found")
            });*/
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
    SocialViewer.showBooks = function(socials){
        var socialListView = new SocialListView({ collection: socials });
        app.LibraryApp.layout.mainContainer.show(socialListView);
    };
    app.vent.on("layout:rendered", function(){
        // render a view for the existing HTML in the template, and attach it to the layout (i.e. don't double render)
        var searchView = new SearchView();
        app.LibraryApp.layout.search.attachView(searchView);
    });
    return SocialViewer;
}();