app.ConfigApp = function(){
    var ConfigApp = {};
    ConfigApp.facebookLink = "f";
    ConfigApp.instagramLink = "i";
    ConfigApp.twitterLink = "t";
    ConfigApp.getSocialAuthLink = function(socialName){
        var self = this;
        if (socialName == "facebook") {
            return self.facebookLink;
        } else if (socialName == "twitter") {
            return self.twitterLink;
        } else if (socialName == "instagram") {
            return self.instagramLink;
        } else {
            return "";
        }
    };
    return ConfigApp;
}();
