<?php
function product_page_view($product) {
    drupal_set_title(entity_label('product', $product));
    return entity_view('product', array(entity_id('product', $product) => $product), 'full');
}

function products_page_view() {
    $header = array(
        array('data' => t('Name')),
        array('data' => t('Info')),
        array('data' => t('Image')),
        array('data' => t('Type product')),
        array('data' => t('Actions'))
    );
    $row = array();
    $products = products();
    if ($products) {
        foreach ($products as $product) {
            $actions = array(
                l(t('view'), 'product/' . $product->id),
                l(t('edit'), 'admin/config/product/' . $product->id . '/edit'),
                l(t('delete'), 'admin/config/product/' . $product->id . '/delete')
            );
            $file = get_file_by_id($product->image_id);
            $image = variable_get('file_public_path', conf_path() . '/files') . '/' . file_uri_target($file);
            $image = '<img style="height: 100px" src="../../../' . $image . '">';
            $row [] = array(
                array('data' => $product->name),
                array('data' => $product->info),
                array('data' => $image),
                array('data' => product_type($product->type_id)->name),
                array('data' => implode(' | ', $actions))
            );
        }
    }
    return theme('table', array(
        'header' => $header,
        'rows'   => $row,
    ));
}

function products_page_view_public() {
    $header = array(
        array('data' => t('Name')),
        array('data' => t('Info')),
        array('data' => t('Image')),
        array('data' => t('Type product')),
        array('data' => t('View')),
    );
    $row = array();
    $products = products();
    if ($products) {
        foreach ($products as $product) {
            $actions = array(
                l(t('view'), 'product/' . $product->id),
            );
            $file = get_file_by_id($product->image_id);
            $image = variable_get('file_public_path', conf_path() . '/files') . '/' . file_uri_target($file);
            $image = '<img style="height: 100px" src="../' . $image . '">';
            $row [] = array(
                array('data' => $product->name),
                array('data' => $product->info),
                array('data' => $image),
                array('data' => product_type($product->type_id)->name),
                array('data' => implode(' | ', $actions))
            );
        }
    }
    return theme('table', array(
        'header' => $header,
        'rows'   => $row,
    ));
}