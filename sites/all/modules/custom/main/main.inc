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
    } elseif ($typeSocial = 'facebook') {

    } elseif ($typeSocial = 'instagram') {

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

function _main_get_posts($mode, $id) {
    if ($mode == 'get_posts') {
        //$arr = [];
        $posts = _main_get_social_posts($id);
        //$arr[] = array('author' => 'author1', 'content' => 'content1', 'date_post' => '11-11-2015', 'uid' => '1');
        //$arr[] = array('author' => 'author2', 'content' => 'content2', 'date_post' => '12-12-2012', 'uid' => '2');
        //$arr[] = array('author' => 'author3', 'content' => 'content3', 'date_post' => '01-01-2016', 'uid' => '3');
        return $posts;
    }
    return 'Error';
}

function _main_get_social_posts($id) {
    //global $user;
    $arr = [];
    $typeSocial = _main_get_type_social_by_id($id);
    //var_dump($typeSocial);die;
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