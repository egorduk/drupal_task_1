app.Closer = {};
app.Closer.DefaultView = Backbone.Marionette.ItemView.extend({
    template: "#close-template",
    className: "close"
});
app.Closer.Router = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
        "close": "close"
    }
});
app.Closer.close = function(){
    var closeView = new app.Closer.DefaultView();
    app.contentRegion.show(closeView);
    Backbone.history.navigate("feeds");
};
app.addInitializer(function(){
    app.Closer.router = new app.Closer.Router({
        controller: app.Closer
    });
    app.vent.trigger("routing:started");
});