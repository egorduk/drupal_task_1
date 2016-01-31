<?php

require_once "SocialStrategyInterface.php";

class SocialStrategyFacebook implements SocialStrategyInterface {

    public function saveUserSocialData($arrayData) {
        return facebook_save_user_data($arrayData);
    }

    public function resetUserSocial($recordId){
        return facebook_reset($recordId);
    }

    public function getUserSocialPosts() {
        return facebook_get_posts();
    }

    public function publishUserPost($data) {
        return facebook_publish_post($data);
    }
} 