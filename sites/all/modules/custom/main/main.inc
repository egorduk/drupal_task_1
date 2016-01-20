<?php

function _main_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();
    if (!isset($data->subject)) {
        return services_error('Missing note attribute subject', 406);
    }
    if (!isset($data->note)) {
        return services_error('Missing note attribute note', 406);
    }
    main_write_note($data);
    return (object)array(
        'id' => $data->id,
        'uri' => services_resource_uri(array('note', $data->id)),
    );
}

function _main_update($id) {
    if (!isset($id)) {
        return services_error('Missing id', 406);
    }
    $typeSocial = _main_get_type_social_by_id($id);
    $recordId = _main_parse_social_id($id);
    return (object)array('result' => _main_reset_social($typeSocial, $recordId));
    //return true;
}

function _main_reset_social($typeSocial, $recordId) {
    if ($typeSocial == 'twitter') {
        return twitter_reset($recordId);
    } elseif ($typeSocial == 'facebook') {
        return facebook_reset($recordId);
    } elseif ($typeSocial == 'instagram') {
        return instagram_reset($recordId);
    } else {

    }
}

function _main_parse_social_id($id) {
    return str_replace($id[0], '', $id);
}

function _main_retrieve($id) {
    return main_get_note($id);
}

function _main_delete($id) {
    main_delete_note($id);
    return (object)array(
        'id' => $id,
    );
}

function _main_index($page, $parameters) {
    global $user;
    $notes = array();
    $res = db_query('SELECT * FROM {note} WHERE uid=:uid ORDER BY modified DESC',
        array(':uid' => $user->uid));
    foreach ($res as $note) {
        $notes[] = $note;
    }
    return $notes;
}

function _main_access($op, $args) {
    global $user;
    /*$access = FALSE;
    switch ($op) {
        case 'view':
            $note = main_get_note($args[0]);
            $access = user_access('note resource view any note');
            $access = $access || $note->uid == $user->uid && user_access('note resource view own notes');
            break;
        case 'update':
            $note = main_get_note($args[0]->id);
            $access = user_access('note resource edit any note');
            $access = $access || $note->uid == $user->uid && user_access('note resource edit own notes');
            break;
        case 'delete':
            $note = main_get_note($args[0]);
            $access = user_access('note resource delete any note');
            $access = $access || $note->uid == $user->uid && user_access('note resource delete own notes');
            break;
    }*/
    $access = TRUE;
    return $access;

}

function _main_get_socials($mode) {
    if ($mode == 'get_socials') {
        $arr = [];
        $twitterStatus = $twitterId = getTwitterAccount();
        $fbStatus = $fbId = getFacebookAccount();
        $instagramStatus = $instagramId = getInstagramAccount();
        $arr[] = array('name' => 'twitter', 'status' => (bool)$twitterStatus, 'sync_link' => twitter_get_auth_link(), 'id' => 't' . $twitterId);
        $arr[] = array('name' => 'facebook', 'status' => (bool)$fbStatus, 'sync_link' => facebook_get_auth_link(), 'id' => 'f' . $fbId);
        $arr[] = array('name' => 'instagram', 'status' => (bool)$instagramStatus, 'sync_link' => instagram_get_auth_link(), 'id' => 'i' . $instagramId);
        return ($arr);
    }
    return 'Error';
}

function _main_get_posts($mode, $typeSocial) {
    if ($mode == 'get_posts') {
        $posts = _main_get_social_posts($typeSocial);
        return $posts;
    }
    return 'Error';
}

function _main_get_social_posts($typeSocial) {
    $arr = [];
    if ($typeSocial == 'twitter') {
        return twitter_get_posts();
    } elseif ($typeSocial == 'facebook') {
        return facebook_get_posts();
    } elseif ($typeSocial == 'instagram') {
        return instagram_get_posts();
    } else {

    }
    return $arr;
}

function getTwitterAccount() {
    return twitter_load_by_user();
}

function getInstagramAccount() {
    return instagram_load_by_user();
}

function getFacebookAccount() {
    return facebook_load_by_user();
}

function _main_get_type_social_by_id($id) {
    $firstLetter = $id[0];
    $typeSocial = '';
    if ($firstLetter == 'i') {
        $typeSocial = 'instagram';
    } elseif ($firstLetter == 't') {
        $typeSocial = 'twitter';
    } elseif ($firstLetter == 'f') {
        $typeSocial = 'facebook';
    } else {
    }
    return $typeSocial;
}

function _main_public_post($data) {
    //var_dump($data);
    if (isset($data) &&  is_array($data)) {
        $data = (object)$data;
    }
    if (!isset($data->content) || !isset($data->date_post) || !isset($data->social_name)) {
        return services_error('Missing attribute', 406);
    }
    //$typeSocial = _main_get_type_social_by_id($data->id);
    $typeSocial = $data->social_name;
    if ($typeSocial == 'twitter') {
        return twitter_public_post($data);
    } elseif ($typeSocial == 'facebook') {
        return facebook_public_post($data);
    } elseif ($typeSocial == 'instagram') {
        //return instagram_get_posts();
    } else {

    }
    return true;
}

function _main_auth_user($mode, $data) {
    if (isset($data) &&  is_array($data)) {
        $data = (object)$data;
    }
    if (!isset($data->username) || !isset($data->password)) {
        return services_error('Missing attribute', 406);
    }
    $base_url = 'http://localhost/drupal_task_1/notes';
    $data = array(
        'username' => $data->username,
        'password' => $data->password,
    );
    //$data = drupal_json_encode($data);
    $data = http_build_query($data, '', '&');
    $options = array(
        $headers = array('Content-Type' => 'application/x-www-form-urlencoded'),
        //$headers = array('Content-Type' => 'application/json'),
        'method' => 'POST',
        'data' => $data
    );
    $response = drupal_http_request($base_url . '/user/login', $options);
    //$data = json_decode($response->data);

    return (json_decode($response->data));
// Check if login was successful
    if ($response->code == 200) {
        // Now recycle the login cookie we received in the first request
        $options['headers']['Cookie'] = $data->session_name . '=' . $data->sessid;
        // Get info about a user
        $data = array();
        $options['data'] = http_build_query($data, '', '&');
        $options['method'] = 'GET';
        $response = drupal_http_request($base_url . '/user/32', $options);
        return ($response);
    } else {
        return services_error('Missing attribute', 404);
    }
}