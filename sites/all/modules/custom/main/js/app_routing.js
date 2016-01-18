app.AppRouting = function(){
    var AppRouting = {};
    AppRouting.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            "": "home",
            "view/:socialName" : "viewSocial"
        }
    });
    /*app.vent.on("search:term", function(searchTerm){
        Backbone.history.navigate("search/" + searchTerm);
    });*/
    app.addInitializer(function(){
        AppRouting.router = new AppRouting.Router({
            controller: app.LibraryApp
        });
        app.vent.trigger("Routing: started");
    });
    return AppRouting;
}();