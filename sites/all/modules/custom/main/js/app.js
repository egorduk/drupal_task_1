var app = new Backbone.Marionette.Application();

app.addRegions({
    menuRegion: '#menu',
    contentRegion: '#content-wrapper'
});

app.MenuView = Backbone.Marionette.View.extend({
    el: "#menu",
    events: {
        'click .link-logout': 'logoutClick'
    },
    showLogout: function(link) {
        this.$el.html(link);
    },
    logoutClick: function(e) {
        e.preventDefault();
        app.SocialModeler.logout();
        app.SocialViewer.showAuth();
        this.hideLogout();
    },
    hideLogout: function() {
        this.$el.empty();
    }
});

app.spinnerShow = function() {
    $("#spinner").show();
};

app.spinnerHide = function() {
    $("#spinner").hide();
};

app.vent.on("layout:rendered", function() {
    console.log("Layout: rendered");
    app.menu = new app.MenuView();
});

app.vent.on("routing:started", function() {
    app.SessionHelper = window.sessionStorage;
    app.SocialViewer.initializeLayout();
    console.log("Routing: started");
    if (!Backbone.History.started) {
        Backbone.history.start();
    }
    if (typeof(app.SessionHelper) === "undefined") {
        alert('No Web Storage support');
    }
});