<?php

return array(

    'seo' => ['title', 'description', 'keywords'],

    'versions' => 0,

    'disable_mainpage_route' => false, ## отключить маршрут главной страницы (mainpage)

    'disable_url_modification' => false, ## отключить модификаторы урлов. Установить в false!
    'disable_slug_to_template' => true, ## отключить автоматический поиск шаблона страницы по ее системному имени в случае, если страница не существует

    'preload_pages_limit' => 0, ## NULL - never; 0 - always; 100 - if less than 100 (+one more sql request)
    'preload_cache_lifetime' => 60*24, ## время жизни кеша страниц, в минутах

    /*
    'fields' => function() {

        return array(
            'image' => array(
                'title' => 'Картинка для шапки',
                'type' => 'image',
            ),
        );
    },
    #*/


    ## Типы страниц
    #/*
    'types' => [
        0 => 'Страница',
        1 => 'Проект',
    ],
    #*/


    #/*
    'block_templates' => function() {

        $block_tpls = [

            'project_solution' => [
                'title' => 'Проект - Решение',
                'fields' => [
                    'title' => [
                        'title' => 'Заголовок (Решение, Solution)',
                        'type' => 'text',
                    ],
                    'image_big' => [
                        'title' => 'Картинка большая',
                        'type' => 'image',
                    ],
                    'image_small' => [
                        'title' => 'Картинка маленькая',
                        'type' => 'image',
                    ],
                    'text' => [
                        'title' => 'Текст',
                        'type' => 'textarea_redactor',
                    ],
                ],
            ],
            'project_one_image' => [
                'title' => 'Проект - одна картинка',
                'fields' => [
                    'image_1' => [
                        'title' => 'Картинка',
                        'type' => 'image',
                    ],
                ],
            ],
            'project_two_images' => [
                'title' => 'Проект - две картинки',
                'fields' => [
                    'image_1' => [
                        'title' => 'Картинка 1',
                        'type' => 'image',
                    ],
                    'image_2' => [
                        'title' => 'Картинка 2',
                        'type' => 'image',
                    ],
                ],
            ],
            'project_image_text' => [
                'title' => 'Проект - текст + картинка',
                'fields' => [
                    'text' => [
                        'title' => 'Текст',
                        'type' => 'textarea_redactor',
                    ],
                    'image' => [
                        'title' => 'Картинка',
                        'type' => 'image',
                    ],
                ],
            ],
        ];

        return $block_tpls;
    }
    #*/
);