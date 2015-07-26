<?php
function product_type_page_view($type) {
    drupal_set_title(entity_label('product_type', $type));
    return entity_view('product_type', array(entity_id('product_type', $type) => $type), 'full');
}

function product_types_page_view() {
    $header = array(
        array('data' => t('Id')),
        array('data' => t('Name')),
        array('data' => t('Actions')),
    );
    $row = array();
    $types = product_types();
    if ($types) {
        foreach ($types as $type) {
            $actions = array(
                l(t('view'), 'product_type/' . $type->id),
                l(t('edit'), 'admin/config/product_type/' . $type->id . '/edit'),
                l(t('delete'), 'admin/config/product_type/' . $type->id . '/delete')
            );
            $row [] = array(
                array('data' => $type->id),
                array('data' => $type->name),
                array('data' => implode(' | ', $actions))
            );
        }
    }
    return theme('table', array(
        'header' => $header,
        'rows'   => $row,
    ));
}