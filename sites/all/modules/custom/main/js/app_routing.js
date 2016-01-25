app.AppRouting = function(){
    var AppRouting = {};
    AppRouting.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            "": "home",
            "view/:socialName" : "viewSocial"
        }
    });
    app.addInitializer(function(){
        AppRouting.router = new AppRouting.Router({
            controller: app.LibraryApp
        });
        app.vent.trigger("routing: started");
    });
    return AppRouting;
}();