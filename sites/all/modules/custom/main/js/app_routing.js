app.AppRouting = function() {
    var AppRouting = {};

    AppRouting.Router = Backbone.Marionette.AppRouter.extend({
        appRoutes: {
            "": "home",
            "_=_": "home",  // root for facebook redirect
            "view/:socialName" : "viewSocial"
        }
    });

    app.addInitializer(function() {
        AppRouting.router = new AppRouting.Router({
            controller: app.SocialModeler
        });
        app.vent.trigger("routing:started");
    });

    return AppRouting;
}();