<?php

class TwitterController extends EntityAPIController {
    public function create(array $values = array()) {
        //$product_data = $values['product_data'];
        //$file = $values['file'];
        $values += array(
            'user_id' => '',
            'user_login' => '',
            'user_pass' => '',
        );
        return parent::create($values);
    }

    /*public function buildContent($entity, $view_mode = 'full', $langcode = NULL, $content = array()) {
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
    }*/
}

class Twitter extends Entity {
    protected function defaultLabel() {
        //return $this->name;
        return '';
    }

    protected function defaultUri() {
        return array('path' => 'twitter/' . $this->identifier());
    }
}