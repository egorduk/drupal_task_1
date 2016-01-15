app.LibraryApp = function(){
    var LibraryApp = {};
    var Layout = Backbone.Marionette.LayoutView.extend({
        template: "#layout-template",
        regions: {
            search: "#searchBar",
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
                    url: app.ConfigApp.urlGetSessionToken,
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
                //token = 'R4hr3lccvEZNIfRHP2I21YqqG_lBBa8w627yLMGresE';
                xhr.setRequestHeader('X-CSRF-Token', token);
            };
            return Backbone.sync.call(this, method, collection, options);
        }
    });
    var PostModel = Backbone.Model.extend({
        urlRoot: '/drupal_task_1/notes/post',
        defaults: {
           /* author: '',
            content: '',
            date_post: ''*/
        }
    });
    var PostCollection = Backbone.Collection.extend({
        model: PostModel,
        //comparator: 'name',
        //url: '/drupal_task_1/notes/post/get_posts.json',
        url: '/drupal_task_1/notes/post/get_posts.json',
        initialize: function() {
            console.log('PostCollection: initialize');
            var self = this;
            app.vent.on("post:getPosts", function(){
                self.fetchPosts();
            });
        },
        fetchPosts: function() {
            this.fetch({}).fail(function(){}).done(function(a) {
                console.log(a);
                //callback(a);
                //return a;
            });
        }
    });
    var SocialModel = Backbone.AuthenticatedModel.extend({
        urlRoot: '/drupal_task_1/notes/social',
        defaults: {}
    });
    var SocialCollection = Backbone.Collection.extend({
        model: SocialModel,
        //comparator: 'name',
        url: '/drupal_task_1/notes/social/get_socials.json',
        initialize: function() {
            console.log('SocialCollection: initialize');
            var self = this;
            app.vent.on("social:getSocials", function(){
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
            // the maximum number of results for the previous search
            this.totalItems = null;
        },
        search: function(searchTerm) {
            this.page = 0;
            var self = this;
            this.fetchBooks(searchTerm, function(books) {
                (books.length < 1) ? app.vent.trigger("search:noResults") : self.reset(books);
            });
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
    LibraryApp.SocialCollection = new SocialCollection();
    LibraryApp.PostCollection = new PostCollection();
    LibraryApp.initializeLayout = function(){
        LibraryApp.layout = new Layout();
        LibraryApp.layout.on("show", function(){
            app.vent.trigger("layout: rendered");
        });
        app.contentRegion.show(app.LibraryApp.layout);
    };
    //LibraryApp.search = function(term){
    LibraryApp.search = function() {
        LibraryApp.initializeLayout();
        app.SocialViewer.showTableSocial(LibraryApp.SocialCollection);
        app.vent.trigger("social:getSocials");
        //console.log(LibraryApp.SocialCollection);
        //Backbone.history.navigate("main");
        //console.log("Current fragment: " + Backbone.history.getFragment());
    };
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
        this.search();
    };
    LibraryApp.viewSocial = function(socialName){
        console.log("view " + socialName);
        LibraryApp.initializeLayout();
        app.SocialViewer.showSocialDetails(LibraryApp.PostCollection);
        app.vent.trigger("post:getPosts");
        //console.log(LibraryApp.PostCollection);

    };
    /*LibraryApp.resetSocial = function(socialName){
        console.log("reset " + socialName);
    };*/
    LibraryApp.syncSocial = function(socialName){
        console.log("sync " + socialName);
    };
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
