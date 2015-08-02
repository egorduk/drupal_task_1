<?php

define("APP_ID", "1035129189845262");
define("APP_SECRET", "1e121667b64b99f97148211d7df38a60");
//define("APP_ACCESS_TOKEN", "CAAOtccuoSQ4BAAu8FYRzpgcIqt5rGEjKloWBQKZCis0wCScSZCMGgpC7ZA9bwySYB1DDFEfeaR3oZB3kmfmY1AfBJ0uGf3FB1sStngyPQ9aCU0NO6B9fZA2XEnOwZAHZAuJUY7R7FnHLbj07z4OU9LtFetLb1pM6ykL5C03swECyonvV6iXoqsnZCt3PGi3nRNvC7eINYw6jTYrCdwadVzX9");
define("APP_REDIRECT_URL", "http://localhost/drupal_task_1/admin/config/facebook");

function facebook_page_view() {
    $url = 'https://www.facebook.com/dialog/oauth';
    $redirect_uri = 'http://localhost/drupal_task_1/admin/config/facebook';
    $params = array(
        'client_id'     => APP_ID,
        'redirect_uri'  => $redirect_uri,
        'response_type' => 'code',
        'scope'         => 'publish_actions,user_posts'
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
            dpm($userInfo);
            $feed = json_decode(file_get_contents('https://graph.facebook.com/me/feed' . '?' . urldecode(http_build_query($params))), true);
            dpm($feed);
        }
    }
    //drupal_set_title(entity_label('product', $product));
    //return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}