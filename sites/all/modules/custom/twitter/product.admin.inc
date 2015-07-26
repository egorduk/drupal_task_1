<?php

function product_form($form, &$form_state, $product = null) {
    $form_state['product'] = $product;
    $form['name'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Name'),
        '#default_value' => isset($product->name) ? $product->name : '',
    );
    $form['info'] = array(
        '#type' => 'textarea',
        '#required' => TRUE,
        '#title' => t('Info'),
        '#default_value' => isset($product->info) ? $product->info : '',
    );
    $form['img'] = array(
        '#title'         => t('Product image'),
        '#description'   => t(''),
        '#type'          => 'file',
        //'#default_value' => $product ? $product['img'] : '',
        '#required'      => false
    );
    $form['type_id'] = array(
        '#title'         => t('Type product'),
        '#type'          => 'select',
        '#description'   => t(''),
        '#default_value' => isset($product->type_id) ? $product->type_id : t('Select type product'),
        '#options'       => product_types_options(),
        '#required'      => true
    );
    $submit = array();
    if (!empty($form['#submit'])) {
        $submit += $form['#submit'];
    }
    $form['actions'] = array(
        '#weight' => 100,
    );
    $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => isset($product->id) ? t('Save product') : t('Create new product'),
        '#submit' => $submit + array('product_form_submit'),
    );
    $form['#validate'][] = 'product_form_validate';
    return $form;
}

function product_form_validate($form, &$form_state) {
    $file = file_save_upload('img', array(
        'file_validate_is_image' => array(),
        'file_validate_extensions' => array('png gif jpg jpeg')
    ), "public://");
    if ($file) {
        if ($file = file_move($file, 'public://')) {
            $form_state['storage']['file'] = $file;
        } else {
            form_set_error('img', t("Failed to write the uploaded file to the file folder!"));
        }
    } else {
        form_set_error('img', t('No file was uploaded!'));
    }
    dpm($form_state);
}

function product_create($data, $file) {
    $new_product = entity_create('product', array('product_data' => $data, 'file' => $file));
    return $new_product;
}

function product_form_submit($form, &$form_state) {
    $product = $form_state['product'];
    $product_data = $form_state['values'];
    $file = $form_state['storage']['file'];
    unset($form_state['storage']['file']);
    $file->status = FILE_STATUS_PERMANENT;
    file_save($file);
    if (!$product) {
        $product = product_create($product_data, $file);
        $message = 'Product %title created';
    } else {
        $product = product_load($product->id);
        $product->name = $product_data['name'];
        $product->info = $product_data['info'];
        $product->type_id = $product_data['type_id'];
        $product->image_id = $file->fid;
        $message = 'Product %title updated';
    }
    product_save($product);
    $product_uri = entity_uri('product', $product);
    $form_state['redirect'] = $product_uri['path'];
    drupal_set_message(t($message, array('%title' => entity_label('product', $product))));
}

function product_delete_form($form, &$form_state, $product) {
    $form_state['product'] = $product;
    $form['product_type_id'] = array('#type' => 'value', '#value' => entity_id('product', $product));
    $path = 'admin/config/products/view';
    return confirm_form($form,
        t('Are you sure you want to delete %title?', array('%title' => entity_label('product', $product))),
        $path,
        t('This action cannot be undone.'),
        t('Delete'),
        t('Cancel')
    );
}

function product_form_submit_delete($form, &$form_state) {
    $product = $form_state['product'];
    $product_url = entity_uri('product', $product);
    $form_state['redirect'] = $product_url['path'] . '/delete';
}

function product_delete_form_submit($form, &$form_state) {
    $product = $form_state['product'];
    product_delete($product);
    drupal_set_message(t('Product %title deleted', array('%title' => entity_label('product', $product))));
    //$form_state['redirect'] = '<front>';
    $form_state['redirect'] = 'admin/config/products/view';
}

function product_type_form($form, &$form_state, $product_type = null) {
    $form_state['product_type'] = $product_type;
    $form['name'] = array(
        '#type' => 'textfield',
        '#required' => TRUE,
        '#title' => t('Name'),
        '#default_value' => isset($product_type->name) ? $product_type->name : '',
    );
    $submit = array();
    if (!empty($form['#submit'])) {
        $submit += $form['#submit'];
    }
    $form['actions'] = array(
        '#weight' => 100,
    );
    $form['actions']['submit'] = array(
        '#type' => 'submit',
        '#value' => isset($product_type->id) ? t('Save product type') : t('Create new product type'),
        '#submit' => $submit + array('product_type_form_submit'),
    );
    $form['#validate'][] = 'product_type_form_validate';
    return $form;
}

function product_type_form_submit(&$form, &$form_state) {
    $product_type = $form_state['product_type'];
    $product_type_data = $form_state['values'];
    if (!$product_type) {
        $product_type = product_type_create($product_type_data);
        $message = 'Product type %title created';
    } else {
        $product_type = product_type_load($product_type->id);
        $product_type->name = $product_type_data['name'];
        $message = 'Product type %title updated';
    }
    product_type_save($product_type);
    $product_type_uri = entity_uri('product_type', $product_type);
    $form_state['redirect'] = $product_type_uri['path'];
    drupal_set_message(t($message, array('%title' => entity_label('product_type', $product_type))));
}

function product_type_form_submit_delete(&$form, &$form_state) {
    $product_type = $form_state['product_type'];
    $product_type_url = entity_uri('product_type', $product_type);
    $form_state['redirect'] = $product_type_url['path'] . '/delete';
}

function product_type_delete_form($form, &$form_state, $product_type) {
    $form_state['product_type'] = $product_type;
    $path = 'admin/config/product_types/view';
    return confirm_form($form,
        t('Are you sure you want to delete %title?', array('%title' => entity_label('product_type', $product_type))),
        $path,
        t('This action cannot be undone.'),
        t('Delete'),
        t('Cancel')
    );
}

function product_type_delete_form_submit($form, &$form_state) {
    $product_type = $form_state['product_type'];
    product_type_delete($product_type);
    drupal_set_message(t('Product type %title deleted', array('%title' => entity_label('product_type', $product_type))));
    $form_state['redirect'] = 'admin/config/product_types/view';
}

function product_type_form_validate($form, &$form_state) {
}

function product_type_create($data) {
    $new_product_type = entity_create('product_type', array('product_type_data' => $data));
    return $new_product_type;
}