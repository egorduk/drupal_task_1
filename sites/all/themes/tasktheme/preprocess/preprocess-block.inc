<?php
$block = $vars['block'];
// Задаем переменные $title и $content
$vars['content'] = $block->content;
$vars['title'] = $block->subject;
// Задаем классы
$vars['classes_array'][] = 'block-' . $block->module;
$vars['classes_array'][] = 'region-' . $vars['block_zebra'];
$vars['classes_array'][] = $vars['zebra'];
$vars['classes_array'][] = 'region-count-' . $vars['block_id'];
$vars['classes_array'][] = 'count-' . $vars['id'];
$vars['edit_links_array'] = array();
