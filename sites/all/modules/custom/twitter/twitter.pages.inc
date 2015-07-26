<?php

require "twitter_api/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

define("CONSUMER_KEY", "F6vXBeqV6aBuEZQNiHVXtW8r9");
define("CONSUMER_SECRET", "vtvgrlnrAcHAk3SBhSYH0TySzCiZdf10WyA1OC0BvfFGrCuXJk");
define("OAUTH_TOKEN", "1858316563-aXQY2x8uhSzwAlvAxkF1leWomJZbUUKW8LYxM3U");
define("OAUTH_SECRET", "dNwAvsCau984EXyBYumgQ26sUIPav1dG0xi5ykCjG58Ua");
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, OAUTH_TOKEN, OAUTH_SECRET);
$content = $connection->get("account/verify_credentials");
$statuses = $connection->get("statuses/user_timeline");
/*$connection->post('statuses/update', array('status' => 'Сообщение в Twitter.'));
if ($connection->getLastHttpCode() == 200) {
    // Tweet posted succesfully
} else {
    // Handle error case
}*/
dpm($statuses);

function twitter_page_view() {
    $header = array(
        array('data' => t('Name')),
        array('data' => t('Info')),
        array('data' => t('Image')),
        array('data' => t('Type product')),
        array('data' => t('Actions'))
    );
    $row = array();
    return theme('table', array(
        'header' => $header,
        'rows'   => $row,
    ));
    //drupal_set_title(entity_label('product', $product));
    //return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}