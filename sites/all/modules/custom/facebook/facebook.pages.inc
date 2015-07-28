<?php

define("APP_ID", "1035129189845262");
define("APP_SECRET", "1e121667b64b99f97148211d7df38a60");
define("APP_ACCESS_TOKEN", "CAAOtccuoSQ4BAEiYpZAZAbYvRlK2ZCTX3klfdFarkkjcB9U6RSZAAeuFsNpvVEOHQhgL3wUQg04woPfbzcOyC6BwWqhH5QyQR6E58ZCq7xBqSQjSx4QDpn8Ube3o65z0JM9zC1xGvv8rLbUSXNFIZCeV0Surwoi4kOsDqhlSuVkXZCkagwkn2WwGrKeUZAu2dlhZBGzHywZB3yYIJRN9TOfN6Fzt0w75rjUHIZD");

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

require "facebook_api1/src/facebook.php";
$facebook = new Facebook(array(
    'appId'  => APP_ID,
    'secret' => APP_SECRET,
    'cookie' => true
));
$fbuser = $facebook->getUser();
//dpm($fbuser);
try{
    $facebook->setAccessToken(APP_ACCESS_TOKEN);
    $user_profile = $facebook->api('/me');
    dpm($user_profile);
    dpm($facebook->api('/me/feed?message=' . 'test&link='.'test'));
} catch(Exception $e){
    echo $e->getMessage();
}

//dpm($_GET['code']);
//$code = $_GET['code'];
//dpm($_GET['access_token']);
//$helper = $fb->getRedirectLoginHelper();
//$permissions = ['email']; // Optional permissions
//$loginUrl = $helper->getLoginUrl('http://localhost/drupal_task_1/admin/config/facebook', $permissions);
//dpm($loginUrl);
//$a = $fb->sendRequest('GET', 'https://graph.facebook.com/oauth/access_token?client_id='.APP_ID.'&redirect_uri=&client_secret='.APP_SECRET.'&code='.$code);



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

    //drupal_set_title(entity_label('product', $product));
    //return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}