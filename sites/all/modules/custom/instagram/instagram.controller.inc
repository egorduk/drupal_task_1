<?php

class InstagramController extends EntityAPIController {
    public function create(array $values = array()) {
        $values += array();
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