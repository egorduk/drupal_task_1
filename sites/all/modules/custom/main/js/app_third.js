app.LibraryApp.SocialList = function(){
    var BookList = {};
    var BookDetailView = Backbone.Marionette.ItemView.extend({
        template: "#book-detail-template",
        className: "modal bookDetail"
    });
    var BookView = Backbone.Marionette.ItemView.extend({
        template: "#book-template",
        events: {
            'click': 'showBookDetail'
        },
        showBookDetail: function(){
            var detailView = new BookDetailView({model: this.model});
            app.modal.show(detailView);
        }
    });
    var BookListView = Backbone.Marionette.CompositeView.extend({
        template: "#book-list-template",
        id: "bookList",
        itemView: BookView,
        initialize: function(){
            _.bindAll(this, "showMessage", "loadMoreBooks");
            var self = this;
            app.vent.on("search:error", function(){
                self.showMessage("Error, please retry later :s")
            });
            app.vent.on("search:noSearchTerm", function(){
                self.showMessage("Hummmm, can do better :)")
            });
            app.vent.on("search:noResults", function(){
                self.showMessage("No books found")
            });
        },
        events: {
            'scroll': 'loadMoreBooks'
        },
        appendHtml: function(collectionView, itemView){
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
        }
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
    BookList.showBooks = function(books){
        var bookListView = new BookListView({ collection: books });
        app.LibraryApp.layout.books.show(bookListView);
    };
    app.vent.on("layout:rendered", function(){
        // render a view for the existing HTML in the template, and attach it to the layout (i.e. don't double render)
        var searchView = new SearchView();
        app.LibraryApp.layout.search.attachView(searchView);
    });
    return BookList;
}();