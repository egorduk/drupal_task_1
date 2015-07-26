<?php

require "facebook_api/src/Facebook/autoload.php";
use Facebook\Facebook;

define("APP_ID", "780138455438634");
define("APP_SECRET", "2a96e13bcdb4b04188a7e7f6a1f30083");
/*require "facebook_api/src/src/facebook.php";
$facebook = new Facebook(array(
    'appId'  => APP_ID,
    'secret' => APP_SECRET,
));*/
//require "facebook_api/src/Facebook/Facebook.php";
$fb = new Facebook([
    'app_id' => APP_ID,
    'app_secret' => APP_SECRET,
    'default_graph_version' => 'v2.4',
    'default_access_token' => '33c9bf84e507caa48311b523aaa34beb', // optional
]);
$helper = $fb->getRedirectLoginHelper();
try {
    $accessToken = $helper->getAccessToken();
    dpm($helper);
    $fb->setDefaultAccessToken($accessToken);
    $response = $fb->get('/me');
    $userNode = $response->getGraphUser();
} catch(Exception $e) {
    // When Graph returns an error
    echo 'Graph returned an error: ' . $e->getMessage();
    exit;
} catch(Exception $e) {
    // When validation fails or other local issues
    echo 'Facebook SDK returned an error: ' . $e->getMessage();
    exit;
}


if (isset($accessToken)) {
    // Logged in!
    $_SESSION['facebook_access_token'] = (string) $accessToken;

    // Now you can redirect to another page and use the
    // access token from $_SESSION['facebook_access_token']
}
//$user = $fb->get('/me', '33c9bf84e507caa48311b523aaa34beb');


function facebook_page_view() {

    //drupal_set_title(entity_label('product', $product));
    //return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}