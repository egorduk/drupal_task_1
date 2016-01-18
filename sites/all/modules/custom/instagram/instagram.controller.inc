<?php

class InstagramController extends EntityAPIController {
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
}

class Instagram extends Entity {
    protected function defaultLabel() {
        //return $this->name;
        return '';
    }
    protected function defaultUri() {
        return array('path' => 'instagram/' . $this->identifier());
    }
}