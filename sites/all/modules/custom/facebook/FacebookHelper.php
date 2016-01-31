<?php

require_once "Facebook/autoload.php";

use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;

class FacebookHelper {
    private $_accessToken = '';
    private $_fb;
    private $_permissions = ['publish_actions', 'user_posts'];
    private $_helper;
    private $_appId;

    public function __construct() {
        $this->_appId = variable_get_value('social_aggregator:FACEBOOK_APP_ID');
        $this->_fb = new Facebook([
            'app_id' => $this->_appId,
            'app_secret' => variable_get_value('social_aggregator:FACEBOOK_APP_SECRET'),
            'default_graph_version' => 'v2.2',
        ]);
        $this->_helper = $this->_fb->getRedirectLoginHelper();
    }

    function getAuthLink() {
        return $this->_helper->getLoginUrl(variable_get_value('social_aggregator:FACEBOOK_APP_REDIRECT_URL'), $this->_permissions);
    }

    function getAccessToken() {
        try {
            $accessToken = $this->_helper->getAccessToken();
        } catch(FacebookResponseException $e) {
            return $this->getError($e->getMessage());
        } catch(FacebookSDKException $e) {
            return $this->getError($e->getMessage());
        }
        if (!isset($accessToken)) {
            if ($this->_helper->getError()) {
                return $this->getError($this->_helper->getError());
            } else {
                return $this->getError('Bad request. Please login.');
            }
        }
        $oAuth2Client = $this->_fb->getOAuth2Client();
        $tokenMetadata = $oAuth2Client->debugToken($accessToken);
        $tokenMetadata->validateAppId($this->_appId);
        $tokenMetadata->validateExpiration();
        if (!$accessToken->isLongLived()) {
            try {
                $accessToken = $oAuth2Client->getLongLivedAccessToken($accessToken);
            } catch (FacebookSDKException $e) {
                return $this->getError($this->_helper->getError());
            }
        }
        $this->_accessToken = $accessToken->getValue();
        return $this->_accessToken;
    }

    function postMessage($params) {
        if ($this->isValidAccessToken()) {
            try {
                return $this->_fb->post('/me/feed', $params, $this->_accessToken);
            } catch(FacebookResponseException $e) {
                return $this->getError($e->getMessage());
            } catch(FacebookSDKException $e) {
                return $this->getError($e->getMessage());
            }
        } else {
            return $this->getError('Bad request. Please login.');
        }
    }

    function isValidAccessToken() {
        $oAuth2Client = $this->_fb->getOAuth2Client();
        $tokenMetadata = $oAuth2Client->debugToken($this->_accessToken);
        $tokenMetadata->validateAppId($this->_appId);
        $expiration = $tokenMetadata->validateExpiration();
        if (!$expiration) {
            return false;
        }
        return true;
    }

    function getError($message) {
        return 'Facebook error: ' . $message;
    }

    function getFeeds() {
        return $this->_fb->get('/me/feed', $this->_accessToken);
    }

    function getPermissions() {
        return $this->_fb->get('/me/permissions', $this->_accessToken);
    }

    function setAccessToken($accessToken) {
        $this->_accessToken = $accessToken;
    }

    function getStatusCode() {
        return $this->_fb->getLastResponse()->getHttpStatusCode();
    }
}