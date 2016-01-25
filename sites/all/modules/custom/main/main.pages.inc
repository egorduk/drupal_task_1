<?php

use MetzWeb\Instagram\Instagram;
$arrayData = [];

if (isset($_REQUEST['social']) && $_REQUEST['social'] == 'twitter' && isset($_REQUEST['oauth_verifier'])) {
    $request_token = [];
    $request_token['oauth_token'] = $_SESSION['oauth_token'];
    $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
    $connection = new \Abraham\TwitterOAuth\TwitterOAuth(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);
    $access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));
    $arrayData['oauth_token'] = $access_token['oauth_token'];
    $arrayData['oauth_token_secret'] = $access_token['oauth_token_secret'];
    $arrayData['social'] = 'twitter';
    main_save_social_data($arrayData);
    //$connection = new \Abraham\TwitterOAuth\TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    //$actualTwits = $connection->get("statuses/user_timeline");
} elseif (isset($_REQUEST['social']) && $_REQUEST['social'] == 'instagram' && isset($_REQUEST['code'])) {
    $module_path = drupal_get_path('module', 'instagram');
    require_once $module_path . '/Instagram/src/Instagram.php';
    $instagram = new Instagram(array(
        'apiKey'      => INSTAGRAM_ID,
        'apiSecret'   => INSTAGRAM_SECRET,
        'apiCallback' => INSTAGRAM_CALLBACK
    ));
    $data = $instagram->getOAuthToken($_REQUEST['code']);
    //$instagram->setAccessToken($data->access_token);
    //$data = $instagram->getUserFeed();
    $arrayData['access_token'] = $data->access_token;
    $arrayData['social'] = 'instagram';
    main_save_social_data($arrayData);
} elseif (isset($_REQUEST['social']) && $_REQUEST['social'] == 'facebook' && isset($_REQUEST['code'])) {
    /*$result = false;
    $params = array(
        'client_id'     => FACEBOOK_APP_ID,
        'redirect_uri'  => FACEBOOK_APP_REDIRECT_URL,
        'client_secret' => FACEBOOK_APP_SECRET,
        'code'          => $_REQUEST['code']
    );
    $url = 'https://graph.facebook.com/oauth/access_token';
    $tokenInfo = null;
    parse_str(file_get_contents($url . '?' . http_build_query($params)), $tokenInfo);
    if (count($tokenInfo) > 0 && isset($tokenInfo['access_token'])) {
        $params = array('access_token' => $tokenInfo['access_token']);
        $arrayData['access_token'] = $tokenInfo['access_token'];
        $arrayData['social'] = 'facebook';*/
       // $a->getAccessToken();
    $module_path = drupal_get_path('module', 'facebook');
    require_once $module_path . '/FacebookHelper.php';
    $a = new FacebookHelper();
    var_dump($a->getAccessToken());
        //main_save_social_data($arrayData);
        //var_dump($params);
        /*$userInfo = json_decode(file_get_contents('https://graph.facebook.com/me' . '?' . urldecode(http_build_query($params))), true);
        dpm($userInfo);
        $feed = json_decode(file_get_contents('https://graph.facebook.com/me/feed' . '?' . urldecode(http_build_query($params))), true);
        dpm($feed);
    }*/
} else {

}