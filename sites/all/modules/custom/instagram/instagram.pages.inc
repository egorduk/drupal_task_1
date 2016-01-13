<?php
use MetzWeb\Instagram\Instagram;

function instagram_page_view() {
    require_once 'Instagram/src/Instagram.php';
    $redirect_uri = 'http://localhost/drupal_task_1/admin/config/instagram';
    /*echo '<div><a href="https://api.instagram.com/oauth/authorize/?client_id='.$id.'&redirect_uri='.$redirect_uri.'&response_type=code">Link</a></div>';
    if (isset($_GET['code'])) {
        $params = array(
            'client_id'     => $id,
            'redirect_uri'  => $redirect_uri,
            'client_secret' => $secret,
            'code'          => $_GET['code'],
            'grant_type'    => 'authorization_code'
        );
        $a = json_decode(file_get_contents('https://api.instagram.com/oauth/access_token' . '?' . urldecode(http_build_query($params))),true);
        //dpm($a);
    }*/

    $instagram = new Instagram(array(
        'apiKey'      => INSTAGRAM_ID,
        'apiSecret'   => INSTAGRAM_SECRET,
        'apiCallback' => $redirect_uri
    ));
    echo "<a href='{$instagram->getLoginUrl()}'>Login with Instagram</a>";
    if (isset($_GET['code'])) {
        $code = $_GET['code'];
        $data = $instagram->getOAuthToken($code);
        $instagram->setAccessToken($data->access_token);
        //var_dump($data->access_token);die;
        //var_dump($data);
        //$instagram->setAccessToken('2069910142.1fb234f.cdde8365eb1c4e449e18a99cb654fe69 ');
        $data = $instagram->getUserFeed();
        var_dump($data);
    }
}