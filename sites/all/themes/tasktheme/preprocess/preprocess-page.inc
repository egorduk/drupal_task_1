<?php
if ($index = array_search(preg_replace('![^abcdefghijklmnopqrstuvwxyz0-9-_]+!s', '', 'page-'. drupal_strtolower(arg( 0))), $vars['classes_array'])) {
    unset($vars['classes_array'][$index]);
}
// Определяем шаблон и переменные для шапки и подвала
$vars['header'] = theme('header', array(
    // Имя переменной => значение
    'front_page' => $vars['front_page'],
    'logo' => $vars['logo'],
    //'search_box' => $vars['search_box'],
    //'header_line' => $vars['header_line'],
));
$vars['footer'] = theme('footer', array(
    'front_page' => $vars['front_page'],
    //'footer_line' => $vars['footer_line'],
    //'page_bottom' => $vars['page_bottom'],
));
// Определяем дополнительные классы для не_главной страницы
if (!$vars['is_front']) {
    // Добавляем уникальные классы для разных страниц
    $path = drupal_get_path_alias($_GET['q']);
    $vars['classes_array'][] = drupal_html_class('page-' . $path);
    // И для разных разделов сайта
    list($section, ) = explode('/', $path, 2);
    if (arg(0) == 'node') {
        if (arg(1) == 'add') {
            $section = 'node-add';
        }
        elseif (is_numeric(arg(1)) && (arg(2) == 'edit' || arg(2) == 'delete')) {
            $section = 'node-' . arg(2);
        }
    }
    $vars['classes_array'][] = drupal_html_class('section-' . $section);
}
