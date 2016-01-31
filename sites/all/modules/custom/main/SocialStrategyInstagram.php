<?php

require_once "SocialStrategyInterface.php";

class SocialStrategyInstagram implements SocialStrategyInterface {

    public function saveUserSocialData($arrayData) {
        return instagram_save_user_data($arrayData);
    }

    public function resetUserSocial($recordId){
        return instagram_reset($recordId);
    }

    public function getUserSocialPosts() {
        return instagram_get_posts();
    }

    public function publishUserPost($data) {
        return true;
    }
} 