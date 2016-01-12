app.LibraryApp = function(){
    var LibraryApp = {};
    var Layout = Backbone.Marionette.LayoutView.extend({
        template: "#layout-template",
        regions: {
            search: "#searchBar",
            mainContainer: "#mainContainer"
        }
    });
    var SocialModel = Backbone.Model.extend({
        defaults: {}
    });
    var SocialCollection = Backbone.Collection.extend({
        model: SocialModel,
        comparator: 'name',
        url: '/drupal_task_1/notes/social/get_socials.json',
        initialize: function() {
            console.log('SocialCollection initialize');
            var self = this;
            app.vent.on("search:test", function(){
                self.fetchSocials();
            });
        },
        fetchSocials: function() {
            this.fetch({}).fail(function(){}).done(function(a) {
                console.log(a);
                //callback(a);
                //return a;
            });
        }
    });
    var Book = Backbone.Model.extend();
    var Books = Backbone.Collection.extend({
        model: Book,
        initialize: function(){
            var self = this;
            _.bindAll(this, "search", "moreBooks");
            app.vent.on("search:term", function(term){ self.search(term); });
            app.vent.on("search:more", function(){ self.moreBooks(); });
            // the number of books we fetch each time
            this.maxResults = 40;
            // the results "page" we last fetched
            this.page = 0;
            // flags whether the collection is currently in the process of fetching
            // more results from the API (to avoid multiple simultaneous calls
            this.loading = false;
            // remember the previous search
            this.previousSearch = null;
            // the maximum number of results for the previous search
            this.totalItems = null;
        },
        search: function(searchTerm) {
            this.page = 0;
            var self = this;
            this.fetchBooks(searchTerm, function(books) {
                (books.length < 1) ? app.vent.trigger("search:noResults") : self.reset(books);
            });
            this.previousSearch = searchTerm;
        },
        moreBooks: function(){
            // if we've loaded all the books for this search, there are no more to load !
            if(this.length >= this.totalItems){
                return true;
            }
            var self = this;
            this.fetchBooks(this.previousSearch, function(books){ self.add(books); });
        },
        fetchBooks: function(searchTerm, callback) {
            if (this.loading) {
                return true;
            }
            this.loading = true;
            var self = this;
            app.vent.trigger("search:start");
            var query = encodeURIComponent(searchTerm)+'&maxResults='+this.maxResults+'&startIndex='+(this.page * this.maxResults)+'&fields=totalItems,items(id,volumeInfo/title,volumeInfo/subtitle,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/imageLinks)';
            $.ajax({
                url: 'https://www.googleapis.com/books/v1/volumes',
                dataType: 'json',
                data: 'q='+query,
                success: function(res) {
                    app.vent.trigger("search:stop");
                    if (res.totalItems == 0) {
                        callback([]);
                        return [];
                    }
                    if (res.items) {
                        self.page++;
                        self.totalItems = res.totalItems;
                        var searchResults = [];
                        _.each(res.items, function(item){
                            var thumbnail = null;
                            if(item.volumeInfo && item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail){
                                thumbnail = item.volumeInfo.imageLinks.thumbnail;
                            }
                            searchResults[searchResults.length] = new Book({
                                thumbnail: thumbnail,
                                title: item.volumeInfo.title,
                                subtitle: item.volumeInfo.subtitle,
                                description: item.volumeInfo.description,
                                googleId: item.id
                            });
                        });
                        callback(searchResults);
                        self.loading = false;
                        return searchResults;
                    } else if (res.error) {
                        app.vent.trigger("search:error");
                        self.loading = false;
                    }
                }
            });
        }
    });
    //LibraryApp.Books = new Books();
    LibraryApp.SocialCollection = new SocialCollection();
    LibraryApp.initializeLayout = function(){
        LibraryApp.layout = new Layout();
        LibraryApp.layout.on("show", function(){
            app.vent.trigger("layout:rendered");
        });
        app.contentRegion.show(app.LibraryApp.layout);
    };
    //LibraryApp.search = function(term){
    LibraryApp.search = function(){
        //alert("search");
        LibraryApp.initializeLayout();
        //app.LibraryApp.BookList.showBooks(LibraryApp.Books);
        app.SocialList.showBooks(LibraryApp.SocialCollection);
        //app.vent.trigger("search:term", term);
        app.vent.trigger("search:test");
        console.log(LibraryApp.SocialCollection);
    };
    LibraryApp.home = function(){
        //alert('main');
        //this.search(LibraryApp.Books.previousSearch || "Neuromarketing");
        this.search();
    };
    LibraryApp.viewSocial = function(socialName){
        console.log("view " + socialName);
    };
    LibraryApp.resetSocial = function(socialName){
        console.log("reset " + socialName);
    };
    LibraryApp.syncSocial = function(socialName){
        console.log("sync " + socialName);
        var authLink = app.ConfigApp.getSocialAuthLink(socialName);
        console.log(authLink);
    };
    return LibraryApp;
}();
