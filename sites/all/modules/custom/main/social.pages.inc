<?php

function social_add() {
    $header = array(
        array('data' => t('Social')),
        array('data' => t('Status')),
        array('data' => t('Action')),
    );
    $row = array();
    $socials = [];
    $socials = getSocials();
    if ($socials) {
        foreach ($socials as $index => $social) {
            $actions = array(
                //l(t('add'), 'social/' . $product->id),
                ($social) ? l(t('Reset'), 'user/social/reset/' . $index) : l(t('Add'), 'user/social/add/' . $index)
            );
            $row [] = array(
                array('data' => $index),
                array('data' => ($social) ? t('On') : t('Off')),
                array('data' => implode(' | ', $actions))
            );
        }
    }
/*    $row[] = array(
        array('data' => 'Twitter'),
        array('data' => 'off'),
        array('data' => 'Add')
    );*/
    return theme('table', array(
        'header' => $header,
        'rows'   => $row,
    ));
}