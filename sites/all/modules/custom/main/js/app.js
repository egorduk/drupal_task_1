/* create a new instance of the Marionette app */

var app = new Backbone.Marionette.Application();
/*var ModalRegion = Backbone.Marionette.Region.extend({
    el: "#modal",
    constructor: function(){
        //_.bindAll(this);
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on("show", this.showModal, this);
    },
    getEl: function(selector){
        var $el = $(selector);
        $el.on("hidden", this.close);
        return $el;
    },
    showModal: function(view){
        view.on("close", this.hideModal, this);
        //this.$el.modal('show');
    },
    hideModal: function(){
        this.$el.modal('hide');
    }
});*/

app.addRegions({
    menuRegion: '#menu',
    contentRegion: '#content1',
    modal: '#modal'
    //modal: ModalRegion
});
/*Backbone.sync = function(method, model) {
    alert(method + ": " + JSON.stringify(model));
    model.set('id', 1);
};*/
app.MenuView = Backbone.Marionette.View.extend({
    el: "#menu",
    events: {
        'click #menu .js-menu-main': 'showMainPage',
        'click #menu .js-menu-feeds': 'showFeedsPage',
        'click #menu .js-menu-exit': 'exit'
    },
    showMainPage: function(e) {
        e.preventDefault();
        app.LibraryApp.home();
    },
    showFeedsPage: function(e) {
        e.preventDefault();
        app.Closer.close();
    },
    exit: function(e) {
        window.location.href = "http://localhost/drupal_task_1/user/test";
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
        this.$el.addClass(this.type);
        this.$el.html(this.notice);
    },
    closeNotice: function() {
        this.$el.empty();
    },
    viewNotice: function(notice, type) {
        this.notice = notice;
        this.type = type;
        app.LibraryApp.layout.noticeContainer.show(this.render());
    }
});
app.vent.on("layout: rendered", function(){
    //console.log("Layout: rendered");
    //var menu = new app.MenuView();
    //app.menuRegion.attachView(menu);
});
app.vent.on("routing: started", function(){
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

