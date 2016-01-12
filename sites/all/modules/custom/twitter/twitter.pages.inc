<?php

require "twitter_api/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

define("CONSUMER_KEY", "Jt4lGWjVOJqvUalFyv911Dbkr");
define("CONSUMER_SECRET", "LU32tiMn5NmCHzlfMTgFrmJjnPXsaaAfqQNTefdnoR1e3pcXqo");
define("OAUTH_CALLBACK", "http://localhost/drupal_task_1/admin/config/twitter");

//$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
if (isset($_REQUEST['oauth_verifier'])) {
    $request_token = [];
    $request_token['oauth_token'] = $_SESSION['oauth_token'];
    $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);
    $access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));
    //$_SESSION['access_token'] = $access_token;
    //var_dump($access_token);
    //$access_token = $_SESSION['access_token'];
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    $user = $connection->get("account/verify_credentials");
    $actualTwits = $connection->get("statuses/user_timeline");
    dpm($actualTwits);
    //dpm($user);
    //$a = $connection->post('statuses/update', array('status' => 'qqqq123'));
    //var_dump($user);
    //var_dump($a);
    //var_dump($connection);
} else {
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
    $request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
    //var_dump($request_token);
    $url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
    echo '<a href="'.$url.'">Link</a>';
    $_SESSION['oauth_token'] = $request_token['oauth_token'];
    $_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
}
/*$content = $connection->get("account/verify_credentials");
$statuses = $connection->get("statuses/user_timeline");
$connection->post('statuses/update', array('status' => 'Сообщение в Twitter.'));
if ($connection->getLastHttpCode() == 200) {
} else {
}
dpm($content);*/

function twitter_page_view() {
    //drupal_set_title(entity_label('product', $product));
    //return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}