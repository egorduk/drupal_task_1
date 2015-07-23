<?php
// Создаем переменные $content и $region
$vars['content'] = $vars['elements']['#children'];
$vars['region'] = $vars['elements']['#region'];
// Задаем классы
$region = 'region-' . str_replace('_', '-', $vars['region']);
$vars['classes_array'] = array('region', $region);
// И шаблон
$vars['template_files'][] = $region;
