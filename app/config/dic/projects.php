<?php

return array(

    'fields' => function() {

        $pages = Page::all_by_id();
        $pages_list = [];
        if (isset($pages) && is_object($pages) && $pages->count()) {

            #$pages_list = $pages->lists('name', 'id');
            foreach ($pages as $page) {
                if ($page->type_id == 1)
                    $pages_list[$page->id] = $page->name;
            }
        }

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
            'mainpage' => array(
                'no_label' => true,
                'title' => 'Показывать на главной',
                'type' => 'checkbox',
                'label_class' => 'normal_checkbox',
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


    /**
     * HOOKS - набор функций-замыканий, которые вызываются в некоторых местах кода модуля словарей, для выполнения нужных действий.
     */
    'hooks' => array(

        /**
         * Вызывается после создания, обновления, удаления записи, изменения порядка сортировки
         */
        'after_store_update_destroy_order' => function ($dic = NULL, $dicval = NULL) {

            Cache::forget('dic_' . $dic->slug);
        },
    ),


    'second_line_modifier' => function($line, $dic, $dicval) {
        #Helper::ta($dicval);
        $page = Page::by_id($dicval->page_id);
        $page_title = is_object($page) ? $page->name : null;
        return $page_title;
    },

    'seo' => ['title', 'description', 'keywords'],
);