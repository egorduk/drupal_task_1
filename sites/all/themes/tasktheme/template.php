<?php

function tasktheme_theme(&$existing, $type, $theme, $path) {
    static $base_themes = array();
    $base_themes[] = $theme;
    if ($type == 'theme') {
        foreach (array_keys($existing) as $hook) {
            if (function_exists($theme . '_preprocess')) {
                $existing[$hook]['preprocess functions'][] = $theme . '_preprocess';
            }
            if (function_exists($theme . '_preprocess_' . $hook)) {
                $existing[$hook]['preprocess functions'][] = $theme . '_preprocess_' . $hook;
            }
            foreach ($base_themes as $base_theme) {
                if (function_exists($base_theme . '_process')) {
                    $existing[$hook]['preprocess functions'][] = $base_theme . '_process';
                }
                if (function_exists($base_theme . '_process_' . $hook)) {
                    $existing[$hook]['preprocess functions'][] = $base_theme . '_process_' . $hook;
                }
            }
        }
    }
    if ($theme == 'tasktheme') {
        return array(
            'region' => array(
                'arguments' => array('elements' => NULL),
                'path' => drupal_get_path('theme', 'tasktheme') . '/templates',
                'template' => 'region',
                'preprocess functions' => array(
                    'template_preprocess',
                    'tasktheme_preprocess',
                    'tasktheme_preprocess_region',
                    'tasktheme_process',
                ),
            ),
            'header' => array(
                'arguments' => array('elements' => NULL),
                'path' => drupal_get_path('theme', 'tasktheme') . '/templates',
                'template' => 'header',
                'preprocess functions' => array(
                    'template_preprocess',
                    'tasktheme_preprocess',
                    'tasktheme_preprocess_header',
                    'tasktheme_process',
                ),
            ),
            'footer' => array(
                'arguments' => array('elements' => NULL),
                'path' => drupal_get_path('theme', 'tasktheme') . '/templates',
                'template' => 'footer',
                'preprocess functions' => array(
                    'template_preprocess',
                    'tasktheme_preprocess',
                    'tasktheme_preprocess_footer',
                    'tasktheme_process',
                ),
            ),
        );
    }
    return array();
}

function tasktheme_blocks($region) {
    if ($region) {
        $output = '';
        if ($list = block_list($region)) {
            foreach ($list as $key => $block) {
                $output .= theme('block', $block);
            }
        }
        $output .= drupal_get_region_content($region);
        $elements['#children'] = $output;
        $elements['#region'] = $region;
        return $output ? theme('region', $elements) : '';
    }
}


function tasktheme_preprocess(&$vars, $hook) {
    $key = ($hook == 'page' || $hook == 'maintenance_page') ? 'body_classes' : 'classes';
    if (array_key_exists($key, $vars)) {
        if (is_string($vars[$key])) {
            $vars['classes_array'] = explode(' ', $vars[$key]);
            unset($vars[$key]);
        }
    } else {
        $vars['classes_array'] = array($hook);
    }
    // Для каждого хука типа hook_preprocess_anything() мы ищем соответствующий файл в каталоге preprocess и вызываем его
    $name = 'preprocess/preprocess-'. str_replace('_', '-', $hook) .'.inc';
    if (is_file(drupal_get_path('theme', 'tasktheme') . '/' . $name)) {
        include($name);
    }
}

function tasktheme_process(&$vars, $hook) {
    if (array_key_exists('classes_array', $vars)) {
        // Сливаем в строку все стили для элемента
        $vars['classes'] = implode(' ', $vars['classes_array']);
    }
}

function _tasktheme_path() {
    static $path = FALSE;
    if (!$path) {
        $matches = drupal_system_listing('tasktheme\.info$', 'themes', 'name',  0);
        if (!empty($matches['tasktheme']->filename)) {
            $path = dirname($matches['tasktheme']->filename);
        }
    }
    return $path;
}


if (!function_exists('drupal_html_class')) {
    function drupal_html_class($class) {
        $class = strtr(drupal_strtolower($class), array(' ' => '-', '_' => '-', '/' => '-', '[' => '-', ']' => ''));
        $class = preg_replace('/[^\x{002D}\x{0030}-\x{0039}\x{0041}-\x{005A}\x{005F}\x{0061}-\x{007A}\x{00A1}-\x{FFFF}]/u', '', $class);
        return $class;
    }
}

if (!function_exists('drupal_html_id')) {
    function drupal_html_id($id) {
        $id = strtr(drupal_strtolower($id), array(' ' => '-', '_' => '-', '[' => '-', ']' => ''));
        $id = preg_replace('/[^A-Za-z0-9\-_]/', '', $id);
        return $id;
    }
}
