app.ConfigApp = function(){
    var ConfigApp = {};
    ConfigApp.projectFolder = "/drupal_task_1/";
    ConfigApp.urlSessionToken = "?q=services/session/token";
    ConfigApp.urlGetSocials = ConfigApp.projectFolder + "notes/social/get_socials.json";
    ConfigApp.urlGetPosts = ConfigApp.projectFolder + "notes/post/get_posts/";
    ConfigApp.urlPost = ConfigApp.projectFolder + "notes/post";
    ConfigApp.urlSocial = ConfigApp.projectFolder + "notes/social";
    ConfigApp.urlUser = ConfigApp.projectFolder + "notes/auth";
    ConfigApp.socialArray = ['twitter', 'facebook', 'instagram'];
    ConfigApp.initLayout = 0;
    return ConfigApp;
}();
