<?php
// Создаем переменную $created
$vars['created'] = $vars['date'];
// Убираем тему коммента если она откллючена
if (variable_get('comment_subject_field_' . $vars['node']->type, 1) ==  0) {
    $vars['title'] = '';
}
// Стили
if ($vars['comment']->new) {
    $vars['classes_array'][] = 'comment-new';
}
if ($vars['comment']->status == COMMENT_NOT_PUBLISHED) {
    $vars['unpublished'] = TRUE;
} else {
    $vars['unpublished'] = FALSE;
    $vars['classes_array'][] = $vars['status'];
}
// Зебра
if ($vars['id'] == 1) {
    $vars['classes_array'][] = 'first';
}
if ($vars['id'] == $vars['node']->comment_count) {
    $vars['classes_array'][] = 'last';
}
$vars['classes_array'][] = $vars['zebra'];
if ($vars['comment']->uid ==  0) {
    // Коммент анонимного пользователя
    $vars['classes_array'][] = 'comment-by-anonymous';
} else {
    if ($vars['comment']->uid == $vars['node']->uid) {
        // Коммент автора ноды
        $vars['classes_array'][] = 'comment-by-node-author';
    }
    if ($vars['comment']->uid == $GLOBALS['user']->uid) {
        // Коммент текущего пользователя
        $vars['classes_array'][] = 'comment-by-viewer';
    }
}
