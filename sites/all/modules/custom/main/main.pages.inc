<?php

use Instagram\Instagram;
use Twitter\TwitterOAuth;

$arrayData = [];

if (isset($_REQUEST['social']) && $_REQUEST['social'] == 'twitter' && isset($_REQUEST['oauth_verifier'])) {
    $request_token = [];
    $request_token['oauth_token'] = $_SESSION['oauth_token'];
    $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
    $consumerKey = variable_get_value('social_aggregator:TWITTER_CONSUMER_KEY');
    $consumerSecret = variable_get_value('social_aggregator:TWITTER_CONSUMER_SECRET');
    $connection = new TwitterOAuth($consumerKey, $consumerSecret, $request_token['oauth_token'], $request_token['oauth_token_secret']);
    $access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));
    $arrayData['oauth_token'] = $access_token['oauth_token'];
    $arrayData['oauth_token_secret'] = $access_token['oauth_token_secret'];
    $arrayData['social'] = 'twitter';
    main_save_social_data($arrayData);
} elseif (isset($_REQUEST['social']) && $_REQUEST['social'] == 'instagram' && isset($_REQUEST['code'])) {
    $module_path = drupal_get_path('module', 'instagram');
    $instagram = new Instagram(array(
        'apiKey'      => variable_get_value('social_aggregator:INSTAGRAM_ID'),
        'apiSecret'   => variable_get_value('social_aggregator:INSTAGRAM_SECRET'),
        'apiCallback' => variable_get_value('social_aggregator:INSTAGRAM_CALLBACK')
    ));
    $data = $instagram->getOAuthToken($_REQUEST['code']);
    $arrayData['access_token'] = $data->access_token;
    $arrayData['social'] = 'instagram';
    main_save_social_data($arrayData);
} elseif (isset($_REQUEST['social']) && $_REQUEST['social'] == 'facebook' && isset($_REQUEST['code'])) {
    $module_path = drupal_get_path('module', 'facebook');
    require_once $module_path . '/FacebookHelper.php';
    $fbHelper = new FacebookHelper();
    $accessToken = $fbHelper->getAccessToken();
    $arrayData['social'] = 'facebook';
    $arrayData['access_token'] = $accessToken;
    main_save_social_data($arrayData);
}