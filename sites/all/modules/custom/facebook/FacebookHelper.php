<?php
//namespace SocialSharing;

require_once "Facebook/autoload.php";
use Facebook\Exceptions\FacebookResponseException;
use Facebook\Exceptions\FacebookSDKException;
use Facebook\Facebook;
//session_start();

if (!defined("APP_ID_FACEBOOK_SS")) define("APP_ID_FACEBOOK_SS", "1640010319548174");
if (!defined("APP_SECRET_FACEBOOK_SS")) define("APP_SECRET_FACEBOOK_SS", "7d64b5c69e9b6759bf781fb4a4868622");
if (!defined("APP_REDIRECT_URL_FACEBOOK_SS")) define("APP_REDIRECT_URL_FACEBOOK_SS", "http://drupaltask.esy.es/project/admin/config/facebook");

class FacebookHelper {
    private $_accessToken = '';
    private $_userId = 0;
    private $_fb;
    private $_permissions = ['publish_actions', 'user_posts'];
    private $_helper;

    public function __construct() {
        //$this->_userId = get_current_user_id();
        $this->_fb = new Facebook([
            'app_id' => FACEBOOK_APP_ID,
            'app_secret' => FACEBOOK_APP_SECRET,
            'default_graph_version' => 'v2.2',
        ]);
        $this->_helper = $this->_fb->getRedirectLoginHelper();
    }

    function getAuthLink() {
        return $this->_helper->getLoginUrl(FACEBOOK_APP_REDIRECT_URL, $this->_permissions);
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
        $tokenMetadata->validateAppId(FACEBOOK_APP_SECRET);
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
        //$this->saveAccessToken();
    }

    private function saveAccessToken() {
       // update_user_meta($this->_userId, 'access_token_facebook_ss', $this->_accessToken);
    }

    function postMessage($params) {
        if ($this->isValidAccessToken()) {
            try {
                $this->_fb->post('/me/feed', $params, $this->_accessToken);
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
        $this->_accessToken = $this->getExistsAccessToken();
        if (!$this->_accessToken) {
            //throw new FacebookSDKException('Access token does not exist.');
            return false;
        }
        $oAuth2Client = $this->_fb->getOAuth2Client();
        $tokenMetadata = $oAuth2Client->debugToken($this->_accessToken);
        $tokenMetadata->validateAppId(FACEBOOK_APP_SECRET);
        $expiration = $tokenMetadata->validateExpiration();
        if (!$expiration) {
            //delete_user_meta($this->_userId, 'access_token_facebook_ss');
            return false;
        }
        return true;
    }

    function getExistsAccessToken() {
        //return get_user_meta($this->_userId, 'access_token_facebook_ss', true);
    }

    function getError($message) {
        return 'Facebook error: ' . $message;
    }

    function resetToken() {
        //delete_user_meta($this->_userId, 'access_token_facebook_ss');
    }
}