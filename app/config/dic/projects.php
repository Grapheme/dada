<?php

return array(

    'fields' => function() {

        $pages = Page::all_by_id();
        $pages_list = [];
        if (isset($pages) && is_object($pages) && $pages->count())
            $pages_list = $pages->lists('name', 'id');

        /**
         * Предзагружаем нужные словари с данными, по системному имени словаря, для дальнейшего использования.
         * Делается это одним SQL-запросом, для снижения нагрузки на сервер БД.
         */
        $dics_slugs = array(
            'types',
        );
        $dics = Dic::whereIn('slug', $dics_slugs)->with('values')->get();
        $dics = Dic::modifyKeys($dics, 'slug');
        #Helper::tad($dics);
        $lists = Dic::makeLists($dics, 'values', 'name', 'id');
        #Helper::dd($lists);
        $lists_ids = Dic::makeLists($dics, null, 'id', 'slug');
        #Helper::dd($lists_ids);

        return array(
            'project_type_id' => array(
                'title' => 'Тип проекта',
                'type' => 'select',
                'values' => $lists['types'], ## Используется предзагруженный словарь
                'default' => Input::get('filter.fields.project_type_id') ?: null,
            ),
            'page_id' => array(
                'title' => 'Страница проекта',
                'type' => 'select',
                'values' => $pages_list, ## Используется предзагруженный словарь
                #'default' => Input::get('filter.fields.project_type_id') ?: null,
            ),
        );
    },


    'fields_i18n' => function() {

        return array(
            'project_name' => array(
                'title' => 'Название проекта',
                'type' => 'text',
            ),
            'image' => array(
                'title' => 'Фоновое изображение',
                'type' => 'image',
            ),
            'short' => array(
                'title' => 'Краткое описание (анонс)',
                'type' => 'textarea',
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
    */

    'second_line_modifier' => function($line, $dic, $dicval) {
        #Helper::ta($dicval);
        $page = Page::by_id($dicval->page_id);
        $page_title = is_object($page) ? $page->name : null;
        return $page_title;
    },

    'seo' => ['title', 'description', 'keywords'],
);