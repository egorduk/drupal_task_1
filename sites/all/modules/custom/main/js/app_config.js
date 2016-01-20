app.ConfigApp = function(){
    var ConfigApp = {};
    this.projectFolder = "/drupal_task_1/";
    ConfigApp.urlSessionToken = "?q=services/session/token";
    ConfigApp.urlGetSocials = this.projectFolder + "notes/social/get_socials.json";
    ConfigApp.urlGetPosts = this.projectFolder + "notes/post/get_posts/";
    ConfigApp.urlPost = this.projectFolder + "notes/post";
    ConfigApp.urlSocial = this.projectFolder + "notes/social";
    ConfigApp.urlUser = this.projectFolder + "notes/auth";
    ConfigApp.socialArray = ['twitter', 'facebook', 'instagram'];
    return ConfigApp;
}();
