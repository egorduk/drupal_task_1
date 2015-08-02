<?php

class FacebookHelper {

    public $client_id;
    public $client_secret;
    public $scope;
    public $responseType;
    public $redirect_uri;
    public $code;
    public $provider;
    public $accessToken;
    protected $requestUrl;
    protected $accessTokenUrl;
    protected $dialogUrl;
    protected $userProfileUrl;
    protected $header;

    public function init() {
        //$this->dialogUrl = 'https://www.facebook.com/dialog/oauth?client_id='.$this->client_id.'&redirect_uri='.$this->redirect_uri.'&scope='.$this->scope.'&state='.$this->state;
        $this->dialogUrl = 'https://www.facebook.com/dialog/oauth?client_id='.$this->client_id.'&redirect_uri='.$this->redirect_uri.'&scope='.$this->scope;
        $this->accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
        $this->responseType = "code";
        $this->userProfileUrl = "https://graph.connect.facebook.com/me/?";
        $this->header = " ";
    }

    public function authorize() {
        $dialog_url = $this->dialogUrl
            ."client_id=".$this->client_id
            ."&response_type=".$this->responseType
            ."&scope=".$this->scope
            ."&redirect_uri=".urlencode($this->redirect_uri);
        echo("<script> top.location.href='" . $dialog_url . "'</script>");
    }


    public function getAccessToken() {
        $postvals = "client_id=" . $this->client_id
            ."&client_secret=" . $this->client_secret
            ."&grant_type=authorization_code"
            ."&redirect_uri=" . urlencode($this->redirect_uri)
            ."&code=" . $this->code;
        return $this->curlRequest($this->accessTokenUrl, 'POST', $postvals);
    }

    public function getUserProfile() {
        $getAccessToken_value = $this->getAccessToken();
        $getatoken = json_decode(stripslashes($getAccessToken_value));
        if ($getatoken === NULL ) {
            $atoken=$getAccessToken_value;
        } else {
            $atoken = $getatoken->access_token;
        }
        if ($this->userProfileUrl) {
            $profile_url = $this->userProfileUrl."".$atoken;
            #$_SESSION['atoken']=$atoken;
            #print "profile :".$profile_url;
            #exit();
            return $this->curlRequest($profile_url, "GET", $atoken);
        } else {
            return $getAccessToken_value;
        }
    }

    public function APIcall($url) {
        return $this->curlRequest($url, "GET", $_SESSION['atoken']);
    }

    public function debugJson($data) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
    }

    public function curlRequest($url,$method,$postvals) {
        $ch = curl_init($url);
        if ($method == "POST") {
            $options = array(
                CURLOPT_POST => 1,
                CURLOPT_POSTFIELDS => $postvals,
                CURLOPT_RETURNTRANSFER => 1,
            );
        } else {
            $options = array(
                CURLOPT_RETURNTRANSFER => 1,
            );
        }
        curl_setopt_array($ch, $options);
        if ($this->header) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array($this->header . $postvals));
        }
        $response = curl_exec($ch);
        curl_close($ch);
#	print_r($response);
        return $response;
    }
}