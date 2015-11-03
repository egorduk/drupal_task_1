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

function _main_update($id, $data) {
    global $user;
    $note = main_get_note($id);
    unset($data->created);
    $data->id = $id;
    $data->uid = $note->uid;
    $data->modified = time();
    main_write_note($data);
    return (object)array(
        'id' => $id,
        'uri' => services_resource_uri(array('note', $id)),
    );
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
