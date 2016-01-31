<?php

require_once "SocialStrategyContext.php";

function _main_reset_social($id) {
    if (!isset($id)) {
        return services_error('Missing id', 406);
    }
    $typeSocial = _main_get_type_social_by_id($id);
    $recordId = _main_parse_social_id($id);
    $socialStrategyContext = new SocialStrategyContext($typeSocial);
    return ($socialStrategyContext->resetUserSocial($recordId)) ? (object)(array('responseText' => true)) : services_error('Not implemented', 501);
}

function _main_parse_social_id($id) {
    return str_replace($id[0], '', $id);
}

function _main_get_socials($mode) {
    if ($mode == 'get_socials') {
        $responseArray = [];
        $twitterStatus = $twitterId = _main_get_twitter_account_data();
        $fbStatus = $fbId = _main_get_facebook_account_data();
        $instagramStatus = $instagramId = _main_get_instagram_account_data();
        $responseArray[] = array('name' => 'twitter', 'status' => (bool)$twitterStatus, 'sync_link' => twitter_get_auth_link(), 'id' => 't' . $twitterId);
        $responseArray[] = array('name' => 'facebook', 'status' => (bool)$fbStatus, 'sync_link' => facebook_get_auth_link(), 'id' => 'f' . $fbId);
        $responseArray[] = array('name' => 'instagram', 'status' => (bool)$instagramStatus, 'sync_link' => instagram_get_auth_link(), 'id' => 'i' . $instagramId);
        return $responseArray;
    }
    return services_error('Not implemented', 501);
}

function _main_get_social_posts($mode, $typeSocial) {
    if ($mode === 'get_posts' && _main_is_correct_social_type($typeSocial)) {
        $socialStrategyContext = new SocialStrategyContext($typeSocial);
        $posts = $socialStrategyContext->getUserSocialPosts();
        return $posts;
    }
    return services_error('Not implemented', 501);
}

function _main_get_twitter_account_data() {
    return twitter_load_by_user();
}

function _main_get_instagram_account_data() {
    return instagram_load_by_user();
}

function _main_get_facebook_account_data() {
    return facebook_load_by_user();
}

function _main_get_type_social_by_id($id) {
    $firstLetter = $id[0];
    $typeSocial = '';
    if ($firstLetter === 'i') {
        $typeSocial = 'instagram';
    } elseif ($firstLetter === 't') {
        $typeSocial = 'twitter';
    } elseif ($firstLetter === 'f') {
        $typeSocial = 'facebook';
    } else {
        return services_error('Incorrect social type', 400);
    }
    return $typeSocial;
}

function _main_public_post($data) {
    if (isset($data) &&  is_array($data)) {
        $data = (object)$data;
    }
    if (!isset($data->content) || !isset($data->date_post) || !isset($data->social_name)) {
        return services_error('Missing attribute', 406);
    }
    if (!_main_is_correct_social_type($data->social_name)) {
        return services_error('Incorrect social type', 400);
    }
    $typeSocial = $data->social_name;
    $socialStrategyContext = new SocialStrategyContext($typeSocial);
    return ($socialStrategyContext->publishUserPost($data)) ? true : services_error('Publishing error', 501);
}

function _main_auth_user($mode, $data) {
    if ($mode === 'user_login') {
        if (isset($data) &&  is_array($data)) {
            $data = (object)$data;
        }
        if (!isset($data->username) || !isset($data->password) || $data->username == "" || $data->password == "") {
            return services_error('Missing attribute, check your data', 406);
        }
        $data = array(
            'username' => $data->username,
            'password' => $data->password,
        );
        $data = http_build_query($data, '', '&');
        $options = array(
            $headers = array('Content-Type' => 'application/x-www-form-urlencoded'),
            'method' => 'POST',
            'data' => $data
        );
        $response = drupal_http_request(variable_get_value('social_aggregator:BASE_URL_AUTH') . '/user/login', $options);
        return json_decode($response->data);
    } else {
        return services_error('Not implemented', 501);
    }
}

function _main_auth_create_user($data) {
    if (isset($data) && is_array($data)) {
        $data = (object)$data;
    }
    if (!isset($data->username) || $data->username == "" || !isset($data->email) || !isset($data->password) || !isset($data->approve_password)) {
        return services_error('Missing attribute, check your data', 406);
    }
    if (!valid_email_address($data->email)) {
        return services_error('Incorrect email', 406);
    }
    if ($data->password != $data->approve_password) {
        return services_error('Passwords are not equal', 406);
    }
    if (!user_load_by_name($data->username) && !user_load_by_mail($data->email)) {
        $newUser = array(
            'name' => $data->username,
            'pass' => $data->password,
            'mail' => $data->email,
            'init' => $data->email,
            'status' => 1,
            'access' => REQUEST_TIME,
            'created' => REQUEST_TIME
        );
        return (user_save(null, $newUser)) ? true : services_error('Not implemented', 501);
    } else {
        return services_error('There is user with such username or email', 501);
    }
}

function _main_is_correct_social_type($socialType) {
    return in_array($socialType, ['twitter', 'facebook', 'instagram']);
}

function _main_save_social_data($arrayData) {
    $typeSocial = $arrayData['social'];
    $socialStrategyContext = new SocialStrategyContext($typeSocial);
    return $socialStrategyContext->saveUserSocialData($arrayData);
}