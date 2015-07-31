<?php

define("APP_ID", "1035129189845262");
define("APP_SECRET", "1e121667b64b99f97148211d7df38a60");
define("APP_ACCESS_TOKEN", "CAAOtccuoSQ4BAAu8FYRzpgcIqt5rGEjKloWBQKZCis0wCScSZCMGgpC7ZA9bwySYB1DDFEfeaR3oZB3kmfmY1AfBJ0uGf3FB1sStngyPQ9aCU0NO6B9fZA2XEnOwZAHZAuJUY7R7FnHLbj07z4OU9LtFetLb1pM6ykL5C03swECyonvV6iXoqsnZCt3PGi3nRNvC7eINYw6jTYrCdwadVzX9");
define("APP_REDIRECT_URL", "http://localhost/drupal_task_1/admin/config/facebook");

include "php-oauth2/socialmedia_oauth_connect.php";
$oauth = new socialmedia_oauth_connect();
$oauth->provider="Facebook";
$oauth->client_id = APP_ID;
$oauth->client_secret = APP_SECRET;
$oauth->scope = "email";
$oauth->redirect_uri = APP_REDIRECT_URL;
$oauth->Initialize();
$code = ($_REQUEST["code"]) ?  ($_REQUEST["code"]) : "";
if(empty($code)) {
    $oauth->Authorize();
} else{
    $oauth->code = $code;
#	print $oauth->getAccessToken();
    $getData = json_decode($oauth->getUserProfile());
    //var_dump($oauth);die;
    $oauth->debugJson($getData);
    //dpm($getData);
}
//dpm($oauth);

/*require "facebook_api/src/Facebook/autoload.php";
$fb = new Facebook\Facebook([
    'app_id' => APP_ID,
    'app_secret' => APP_SECRET,
    'default_graph_version' => 'v2.2',
    //'default_access_token' => APP_ACCESS_TOKEN
]);
$linkData = [
    'link' => 'http://www.example.com',
    'message' => 'User provided message',
];
try {
    $response = $fb->post('/me/feed', $linkData, APP_ACCESS_TOKEN);
} catch(Facebook\Exceptions\FacebookResponseException $e) {
    echo 'Graph returned an error: ' . $e->getMessage();
    exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
    echo 'Facebook SDK returned an error: ' . $e->getMessage();
    exit;
}
$graphNode = $response->getGraphNode();
var_dump('Posted with id: ' . $graphNode['id']);die;*/
/*require "facebook_api1/src/facebook.php";
$facebook = new Facebook(array(
    'appId'  => APP_ID,
    'secret' => APP_SECRET,
    //'cookie' => true
));
$facebook->setAccessToken(APP_ACCESS_TOKEN);
dpm($facebook->api('/me/feed'));*/
/*$fbuser = $facebook->getUser();
dpm($fbuser);
try{
    $facebook->setAccessToken(APP_ACCESS_TOKEN);
    $user_profile = $facebook->api('/me');
    dpm($user_profile);
    //dpm($facebook->api('/me/feed?message=' . 'test&link='.'test'));
    dpm($facebook->api('/me/home'));
} catch(Exception $e){
    echo $e->getMessage();
}*/
//$code = $_GET['code'];
//$helper = $fb->getRedirectLoginHelper();
//$permissions = ['email']; // Optional permissions
//$loginUrl = $helper->getLoginUrl('http://localhost/drupal_task_1/admin/config/facebook', $permissions);
//$a = $fb->sendRequest('GET', 'https://graph.facebook.com/oauth/access_token?client_id='.APP_ID.'&redirect_uri=&client_secret='.APP_SECRET.'&code='.$code)
/*header('Location: https://graph.facebook.com/oauth/access_token?' . http_build_query(array(
        'client_id'     => APP_ID,
        //'type'          => 'client_cred',
        'client_secret' => APP_SECRET,
        'grant_type'    => 'client_credentials'
        'code'          => $code)));*/
//dpm($a);
//$fb->setDefaultAccessToken('1035129189845262|4Y1Mg_WY4AvhbfDCqr8Vxe5BqYY');
//dpm(file_get_content_headers('https://graph.facebook.com/me?access_token=1035129189845262|4Y1Mg_WY4AvhbfDCqr8Vxe5BqYY'));
/*header('Location: https://graph.facebook.com/me?' . http_build_query(array(
        'access_token'     => '1035129189845262|4Y1Mg_WY4AvhbfDCqr8Vxe5BqYY')));*/

/*try {
    $response = $fb->get('/me', '1035129189845262|4Y1Mg_WY4AvhbfDCqr8Vxe5BqYY');
    $userNode = $response->getGraphUser();
    dpm($response);
} catch(Facebook\Exceptions\FacebookResponseException $e) {
    // When Graph returns an error
    echo 'Graph returned an error: ' . $e->getMessage();
    exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
    // When validation fails or other local issues
    echo 'Facebook SDK returned an error: ' . $e->getMessage();
    exit;
}
dpm($userNode);*/

function facebook_page_view() {
    $url = 'https://www.facebook.com/dialog/oauth';
    $redirect_uri = 'http://localhost/drupal_task_1/admin/config/facebook';
    $params = array(
        'client_id'     => APP_ID,
        'redirect_uri'  => $redirect_uri,
        'response_type' => 'code',
        'scope'         => 'email,ads_management,manage_pages,publish_actions'
    );
    echo $link = '<p><a href="' . $url . '?' . urldecode(http_build_query($params)) . '">Аутентификация через Facebook</a></p>';
    if (isset($_GET['code'])) {
        $result = false;
        $params = array(
            'client_id'     => APP_ID,
            'redirect_uri'  => $redirect_uri,
            'client_secret' => APP_SECRET,
            'code'          => $_GET['code']
        );
        $url = 'https://graph.facebook.com/oauth/access_token';
        $tokenInfo = null;
        parse_str(file_get_contents($url . '?' . http_build_query($params)), $tokenInfo);
        if (count($tokenInfo) > 0 && isset($tokenInfo['access_token'])) {
            $params = array('access_token' => $tokenInfo['access_token']);
            dpm($params);
            $userInfo = json_decode(file_get_contents('https://graph.facebook.com/me' . '?' . urldecode(http_build_query($params))), true);
            if (isset($userInfo['id'])) {
                $userInfo = $userInfo;
                $result = true;
            }
            dpm($userInfo);
            $feed = json_decode(file_get_contents('https://graph.facebook.com/me/feed' . '?' . urldecode(http_build_query($params))), true);
            dpm($feed);
        }
    }
    //drupal_set_title(entity_label('product', $product));
    //return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}