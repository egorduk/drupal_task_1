<?php

require_once "SocialStrategyFacebook.php";
require_once "SocialStrategyInstagram.php";
require_once "SocialStrategyTwitter.php";

class SocialStrategyContext {

    private $_strategy = NULL;

    public function __construct($socialType) {
        switch ($socialType) {
            case "twitter":
                $this->_strategy = new SocialStrategyTwitter();
                break;
            case "facebook":
                $this->_strategy = new SocialStrategyFacebook();
                break;
            case "instagram":
                $this->_strategy = new SocialStrategyInstagram();
                break;
            default:

                break;
        }
    }

    public function saveUserSocialData($arrayData) {
        return $this->_strategy->saveUserSocialData($arrayData);
    }

    public function resetUserSocial($recordId) {
        return $this->_strategy->resetUserSocial($recordId);
    }

    public function getUserSocialPosts() {
        return $this->_strategy->getUserSocialPosts();
    }

    public function publishUserPost($data) {
        return $this->_strategy->publishUserPost($data);
    }
}