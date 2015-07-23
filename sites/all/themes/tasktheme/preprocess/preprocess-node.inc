<?php
// Создаем переменную $build_mode в зависимости от типа отображения ноды
switch ($vars['node']->build_mode) {
    case NODE_BUILD_NORMAL:
        $vars['build_mode'] = $vars['teaser'] ? 'teaser' : 'full';
        break;
    case NODE_BUILD_PREVIEW:
        $vars['build_mode'] = 'preview';
        break;
    case NODE_BUILD_SEARCH_INDEX:
        $vars['build_mode'] = 'search_index';
        break;
    case NODE_BUILD_SEARCH_RESULT:
        $vars['build_mode'] = 'search_result';
        break;
    case NODE_BUILD_RSS:
        $vars['build_mode'] = 'rss';
        break;
    case NODE_BUILD_PRINT:
        $vars['build_mode'] = 'print';
        break;
}
// Создаем переменную $user_picture
$vars['user_picture'] = $vars['picture'];
// Специальные классы для материалов, зависящие от типа
// Например: "node-type-page", "node-type-story", "node-type-my-custom-type"
$vars['classes_array'][] = drupal_html_class('node-type-' . $vars['type']);
if ($vars['promote']) {
    $vars['classes_array'][] = 'node-promoted';
}
if ($vars['sticky']) {
    $vars['classes_array'][] = 'node-sticky';
}
if (!$vars['status']) {
    $vars['classes_array'][] = 'node-unpublished';
    $vars['unpublished'] = TRUE;
}
else {
    $vars['unpublished'] = FALSE;
}
if ($vars['uid'] && $vars['uid'] == $GLOBALS['user']->uid) {
    $vars['classes_array'][] = 'node-by-viewer'; // Нода текущего пользователя.
}
if ($vars['teaser']) {
    $vars['classes_array'][] = 'node-teaser'; // Тизер.
}
if (isset($vars['preview'])) {
    $vars['classes_array'][] = 'node-preview';
}