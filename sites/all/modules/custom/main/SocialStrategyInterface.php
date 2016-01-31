<?php

interface SocialStrategyInterface {
    public function saveUserSocialData($arrayData);
    public function resetUserSocial($recordId);
    public function getUserSocialPosts();
    public function publishUserPost($data);
}