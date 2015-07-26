<?php

class FacebookController extends EntityAPIController {
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

class Facebook1 extends Entity {
    protected function defaultLabel() {
        //return $this->name;
        return '';
    }

    protected function defaultUri() {
        return array('path' => 'twitter/' . $this->identifier());
    }
}