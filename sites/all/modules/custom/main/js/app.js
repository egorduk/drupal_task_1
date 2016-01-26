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
    /*showMainPage: function(e) {
        e.preventDefault();
        app.LibraryApp.home();
    },
    showFeedsPage: function(e) {
        e.preventDefault();
        app.Closer.close();
    },*/
    showLogout: function(link) {
        this.$el.html(link);
    },
    showUsername: function(username) {
        this.$el.append('<br>' + 'Hello, ' + username);
    },
    logoutClick: function(e) {
        e.preventDefault();
        app.LibraryApp.logout();
        app.SocialViewer.showAuth();
        this.hideLogout();
    },
    hideLogout: function() {
        this.$el.empty();
    }
});

app.NoticeView = Backbone.Marionette.ItemView.extend({
    template: "#notice-item",
    notice: '',
    type: '',
    events: {
        'click': 'closeNotice'
    },
    onRender: function() {
        this.closeNotice();
        this.$el.addClass('notice-' + this.type);
        this.$el.html(this.notice);
    },
    closeNotice: function() {
        this.$el.empty();
        this.$el.removeClass();
    },
    viewNotice: function(notice, type) {
        this.notice = notice;
        this.type = type;
        app.LibraryApp.layout.noticeContainer.show(this.render());
    }
});
app.vent.on("layout: rendered", function() {
    console.log("Layout: rendered");
    app.menu = new app.MenuView();
    //app.menuRegion.attachView(app.menu);
});
app.vent.on("routing: started", function() {
    app.SessionHelper = window.sessionStorage;
    //console.log("Routing: started");
    if (!Backbone.History.started) {
        Backbone.history.start();
    }
    if (typeof(app.SessionHelper) === "undefined") {
        alert('No Web Storage support');
    }
});

//app.module('App', function(module, App, Backbone, Marionette, $, _){
//    module.SocialModel = Backbone.Model.extend({