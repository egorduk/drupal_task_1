<?php

class ProductController extends EntityAPIController {
    public function create(array $values = array()) {
        $product_data = $values['product_data'];
        $file = $values['file'];
        $values += array(
            'name' => $product_data['name'],
            'info' => $product_data['info'],
            'created_at' => REQUEST_TIME,
            'updated_at' => REQUEST_TIME,
            'image_id' => $file->fid,
            'type_id' => $product_data['type_id']
        );
        return parent::create($values);
    }

    public function buildContent($entity, $view_mode = 'full', $langcode = NULL, $content = array()) {
        $file = get_file_by_id($entity->image_id);
        $image = variable_get('file_public_path', conf_path() . '/files') . '/' . file_uri_target($file);
        $image = '<img style="height: 100px" src="../' . $image . '">';
        $content['name'] = array(
            '#theme' => 'field',
            '#weight' => 0,
            '#title' =>t('Name'),
            '#access' => TRUE,
            '#label_display' => 'above',
            '#view_mode' => 'full',
            '#language' => LANGUAGE_NONE,
            '#field_name' => 'field_fake_description',
            '#field_type' => 'text',
            '#entity_type' => 'product',
            '#bundle' => $entity->type_id,
            '#items' => array(array('value' => $entity->name)),
            '#formatter' => 'text_default',
            0 => array('#markup' => check_plain($entity->name))
        );
        $content['info'] = array(
            '#theme' => 'field',
            '#weight' => 0,
            '#title' =>t('Description'),
            '#access' => TRUE,
            '#label_display' => 'above',
            '#view_mode' => 'full',
            '#language' => LANGUAGE_NONE,
            '#field_name' => 'field_fake_description',
            '#field_type' => 'text',
            '#entity_type' => 'product',
            '#bundle' => $entity->type_id,
            '#items' => array(array('value' => $entity->info)),
            '#formatter' => 'text_default',
            0 => array('#markup' => check_plain($entity->info))
        );
        $content['created_at'] = array(
            '#theme' => 'field',
            '#weight' => 0,
            '#title' =>t('Created at'),
            '#access' => TRUE,
            '#label_display' => 'above',
            '#view_mode' => 'full',
            '#language' => LANGUAGE_NONE,
            '#field_name' => 'field_fake_description',
            '#field_type' => 'text',
            '#entity_type' => 'product',
            '#bundle' => $entity->type_id,
            '#items' => array(array('value' => format_date($entity->created_at, 'medium', 'd/m/Y H:i'))),
            '#formatter' => 'text_default',
            0 => array('#markup' => check_plain(format_date($entity->created_at, 'medium', 'd/m/Y H:i')))
        );
        $content['image'] = array(
            '#theme' => 'field',
            '#weight' => 0,
            '#title' =>t('Image'),
            '#access' => TRUE,
            '#label_display' => 'above',
            '#view_mode' => 'full',
            '#language' => LANGUAGE_NONE,
            '#field_name' => 'field_fake_description',
            '#field_type' => 'text',
            '#entity_type' => 'product',
            '#bundle' => $entity->type_id,
            '#items' => array(array('value' => $image)),
            '#formatter' => 'text_default',
            0 => array('#markup' => ($image))
        );
        $content['type'] = array(
            '#theme' => 'field',
            '#weight' => 0,
            '#title' =>t('Type name'),
            '#access' => TRUE,
            '#label_display' => 'above',
            '#view_mode' => 'full',
            '#language' => LANGUAGE_NONE,
            '#field_name' => 'field_fake_description',
            '#field_type' => 'text',
            '#entity_type' => 'product',
            '#bundle' => $entity->type_id,
            '#items' => array(array('value' => product_type_load($entity->type_id)->name)),
            '#formatter' => 'text_default',
            0 => array('#markup' => check_plain(product_type_load($entity->type_id)->name))
        );
        return parent::buildContent($entity, $view_mode, $langcode, $content);
    }
}

class ProductTypeController extends EntityAPIController {
    public function create(array $values = array()) {
        $product_type_data = $values['product_type_data'];
        $values += array(
            'name' => $product_type_data['name'],
        );
        return parent::create($values);
    }

    public function save($entity, DatabaseTransaction $transaction = NULL) {
        parent::save($entity, $transaction);
        variable_set('menu_rebuild_needed', TRUE);
    }

    public function buildContent($entity, $view_mode = 'full', $langcode = NULL, $content = array()) {
        $content['name'] = array(
            '#theme' => 'field',
            '#weight' => 0,
            '#title' =>t('Name'),
            '#access' => TRUE,
            '#label_display' => 'above',
            '#view_mode' => 'full',
            '#language' => LANGUAGE_NONE,
            '#field_name' => 'field_fake_description',
            '#field_type' => 'text',
            '#entity_type' => 'product_type',
            '#items' => array(array('value' => $entity->name)),
            '#formatter' => 'text_default',
            0 => array('#markup' => check_plain($entity->name))
        );
        return parent::buildContent($entity, $view_mode, $langcode, $content);
    }
}

class Product extends Entity {
    protected function defaultLabel() {
        return $this->name;
    }

    protected function defaultUri() {
        return array('path' => 'product/' . $this->identifier());
    }
}

class ProductType extends Entity {
    public $name;
    public $weight = 0;

    public function __construct($values = array()) {
        parent::__construct($values, 'product_type');
    }

    protected function defaultLabel() {
        return $this->name;
    }
}