<?php

require_once "SocialStrategyInterface.php";

class SocialStrategyTwitter implements SocialStrategyInterface {

    public function saveUserSocialData($arrayData) {
        return twitter_save_user_data($arrayData);
    }

    public function resetUserSocial($recordId){
        return twitter_reset($recordId);
    }

    public function getUserSocialPosts() {
        return twitter_get_posts();
    }

    public function publishUserPost($data) {
        return twitter_publish_post($data);
    }
} 