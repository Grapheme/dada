<?php

return array(

    'fields_i18n' => function() {

        return array(
            'type_name' => array(
                'title' => 'Название типа проекта (digital, branding, etc.)',
                'type' => 'text',
            ),
        );
    },

    /*
    'hooks' => array(
        'before_index_view' => function ($dic, $dicvals) {
            $dicvals->load('textfields');
            $dicvals = DicLib::extracts($dicvals, null, true, true);
        },
    ),

    'second_line_modifier' => function($line, $dic, $dicval) {
        #Helper::ta($dicval);
        return (isset($dicval->answer) && $dicval->answer ? strip_tags($dicval->answer) : '');
    },
    */

    #'seo' => ['title', 'description', 'keywords'],
);