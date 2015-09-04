<?
/**
 * TITLE: Главная страница
 * AVAILABLE_ONLY_IN_ADVANCED_MODE
 */
?>
@extends(Helper::layout())
<?php
#$temp = Dic::valueBySlugAndId('equipments', 1);
#Helper::ta($temp);
#Helper::tad($page);
?>


@section('style')
@stop


@section('body_class', 'index-body')


@section('content')

{{--    {{ Helper::ta($dic_types) }}--}}
{{--    {{ Helper::tad($dic_projects) }}--}}

    <main class="main">
        <div class="index-sample js-index-sample"></div>
        <div class="index js-main-slider">
            <div class="wrapper">
                <div class="index-wrap">
                    @foreach ($dic_projects as $project)
                        <?
                        #Helper::tad($project);

                        if (!$project->field('mainpage'))
                            continue;

                        $page_ = $project->page_id;
                        $page_ = Page::by_id($page_);
                        #Helper::tad($page);

                        if (!is_object($page_))
                            continue;

                        $image = $project->field('image');
                        #Helper::tad($image);

                        $type = isset($dic_types[$project->project_type_id]) ? $dic_types[$project->project_type_id]->field('type_name') : '';
                        ?>

                        <div style="background-image: url({{ is_object($image) ? $image->full() : '' }});" class="index__slide js-slide"><a href="{{ URL::route('app.project', $project->slug) }}" class="slide__link js-slide-link"></a>
                            <div class="slide__content">
                                <div class="project-title">{{ $project->field('project_name') }}</div>
                                <div class="project-desc">{{ $type }}</div>
                            </div>
                        </div>

                    @endforeach

                </div>
            </div>
        </div>
    </main>

@stop


@section('scripts')
@stop